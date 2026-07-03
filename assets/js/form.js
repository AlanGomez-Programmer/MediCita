/* ==========================================================================
   FORM.JS
   Validación del formulario de registro de la landing page. Responsabilidad
   única: verificar reglas de campo (vacíos, tipo de caracter, formato),
   mostrar retroalimentación accesible y, al ser válido, delegar a auth.js
   el registro/inicio de sesión y la redirección al dashboard del paciente.
   ========================================================================== */

import { registerOrLogin } from './auth.js';
import {
  PATTERNS,
  isBlank,
  restrictToLettersLive,
  restrictToDigitsLive
} from './utils.js';

/* Mapea las opciones del select (inglés) a las especialidades válidas
   del dataset (español). Las especialidades sin equivalente directo
   caen en "Medicina general" para mantener la coherencia del monto. */
const SPECIALTY_MAP = {
  general: 'Medicina general',
  cardiology: 'Cardiología',
  neurology: 'Medicina general',
  dermatology: 'Dermatología',
  orthopedics: 'Fisioterapia',
  pediatrics: 'Pediatría',
  gynecology: 'Ginecología',
  nutrition: 'Nutrición',
  psychology: 'Psicología',
  pulmonology: 'Medicina general'
};

const MESSAGES = {
  required: 'Este campo es obligatorio.',
  onlyLetters: 'Solo se permiten letras y espacios.',
  email: 'Ingresa un correo electrónico válido.',
  phone: 'El celular debe tener 10 dígitos numéricos.',
  select: 'Selecciona una especialidad.',
  terms: 'Debes aceptar los términos para continuar.',
};

/**
 * Muestra u oculta el mensaje de error de un campo específico.
 */
function setFieldError(input, errorElement, message) {
  if (message) {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    errorElement.textContent = message;
  } else {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    errorElement.textContent = '';
  }
}

/**
 * Valida un campo de texto contra: vacío + patrón opcional.
 * Devuelve true si el campo es válido.
 */
function validateField(input, errorElement, { pattern, patternMessage } = {}) {
  const value = input.value.trim();

  if (isBlank(value)) {
    setFieldError(input, errorElement, MESSAGES.required);
    return false;
  }

  if (pattern && !pattern.test(value)) {
    setFieldError(input, errorElement, patternMessage);
    return false;
  }

  setFieldError(input, errorElement, '');
  return true;
}

function validateSelect(select, errorElement) {
  if (select.value === '') {
    setFieldError(select, errorElement, MESSAGES.select);
    return false;
  }
  setFieldError(select, errorElement, '');
  return true;
}

function validateCheckbox(checkbox, errorElement) {
  if (!checkbox.checked) {
    errorElement.textContent = MESSAGES.terms;
    return false;
  }
  errorElement.textContent = '';
  return true;
}

/**
 * Inicializa la validación completa del formulario de registro:
 * restricción de caracteres en vivo + validación al enviar.
 */
export function initRegisterFormValidation() {
  const form = document.getElementById('register-form');
  if (!form) return;

  const fullNameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const specialtySelect = document.getElementById('specialty-interest');
  const termsCheckbox = document.getElementById('terms');
  const successMessage = document.getElementById('form-success');

  const fullNameError = document.getElementById('full-name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const specialtyError = document.getElementById('specialty-interest-error');
  const termsError = document.getElementById('terms-error');

  // Restricción de caracteres en tiempo real: solo letras / solo dígitos
  restrictToLettersLive(fullNameInput);
  restrictToDigitsLive(phoneInput);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    successMessage.textContent = '';

    const isFullNameValid = validateField(fullNameInput, fullNameError, {
      pattern: PATTERNS.onlyLetters,
      patternMessage: MESSAGES.onlyLetters,
    });

    const isEmailValid = validateField(emailInput, emailError, {
      pattern: PATTERNS.email,
      patternMessage: MESSAGES.email,
    });

    const isPhoneValid = validateField(phoneInput, phoneError, {
      pattern: PATTERNS.phone,
      patternMessage: MESSAGES.phone,
    });

    const isSpecialtyValid = validateSelect(specialtySelect, specialtyError);
    const isTermsValid = validateCheckbox(termsCheckbox, termsError);

    const isFormValid =
      isFullNameValid && isEmailValid && isPhoneValid && isSpecialtyValid && isTermsValid;

    if (!isFormValid) {
      // Lleva el foco al primer campo inválido para accesibilidad y UX
      form.querySelector('.is-invalid, select:invalid')?.focus();
      return;
    }

    const especialidad = SPECIALTY_MAP[specialtySelect.value] || 'Medicina general';

    const { isNewPatient } = registerOrLogin({
      nombre: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      telefono: phoneInput.value.trim(),
      especialidad
    });

    successMessage.textContent = isNewPatient
      ? '¡Cuenta creada correctamente! Redirigiendo a tu panel...'
      : '¡Bienvenido(a) de nuevo! Redirigiendo a tu panel...';

    form.reset();

    setTimeout(() => {
      window.location.href = 'pages/dashboard.html';
    }, 1200);
  });
}