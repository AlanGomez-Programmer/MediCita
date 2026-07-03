/* ==========================================================================
   FORM.JS
   Validación del formulario de registro de la landing page. Responsabilidad
   única: verificar reglas de campo (vacíos, tipo de caracter, formato) y
   mostrar retroalimentación accesible. No persiste datos (eso es Fase 5).
   ========================================================================== */

/* Patrones de validación reutilizables */
const PATTERNS = {
  // Solo letras (incluye tildes y ñ) y espacios simples entre palabras
  onlyLetters: /^[A-Za-zÁÉÍÓÚÑáéíóúñ]+(?:\s[A-Za-zÁÉÍÓÚÑáéíóúñ]+)*$/,
  // Formato de correo estándar
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Celular colombiano: exactamente 10 dígitos
  phone: /^\d{10}$/,
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
 * Filtra caracteres no permitidos mientras el usuario escribe.
 * Esto evita el error antes de que ocurra, en vez de solo detectarlo
 * después en el envío del formulario.
 */
function restrictLiveInput(input, pattern) {
  input.addEventListener('input', () => {
    const cleanValue = [...input.value].filter((char) => pattern.test(char)).join('');
    input.value = cleanValue;
  });
}

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

  if (value === '') {
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
  restrictLiveInput(fullNameInput, /[A-Za-zÁÉÍÓÚÑáéíóúñ\s]/);
  restrictLiveInput(phoneInput, /[0-9]/);

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

    // En esta fase no hay backend ni localStorage todavía (eso es Fase 5).
    // Por ahora solo confirmamos que la validación pasó correctamente.
    successMessage.textContent = '¡Registro validado correctamente! Pronto conectaremos esto a tu cuenta real.';
    form.reset();
  });
}