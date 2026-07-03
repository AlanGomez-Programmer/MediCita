/* ==========================================================================
   LOGIN.JS
   Lógica de la página de inicio de sesión. Busca al paciente por correo
   (dataset generado con IA o pacientes registrados) y, si existe, inicia
   sesión y redirige a su dashboard correspondiente. Si no existe, informa
   al usuario y lo invita a registrarse desde la landing page.
   ========================================================================== */

import { login } from './auth.js';
import { isValidEmail, isBlank } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
});

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  const emailInput = document.getElementById('login-email');
  const emailError = document.getElementById('login-email-error');
  const feedback = document.getElementById('login-feedback');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    feedback.textContent = '';
    feedback.className = 'login-feedback';
    emailError.textContent = '';
    emailInput.classList.remove('is-invalid');

    const email = emailInput.value.trim();

    if (isBlank(email) || !isValidEmail(email)) {
      emailInput.classList.add('is-invalid');
      emailError.textContent = 'Ingresa un correo electrónico válido.';
      emailInput.focus();
      return;
    }

    const result = login(email);

    if (!result.success) {
      feedback.textContent = 'No encontramos una cuenta con ese correo. Verifica el dato o crea tu cuenta.';
      feedback.classList.add('login-feedback--error');
      return;
    }

    feedback.textContent = `¡Bienvenido(a), ${result.patient.nombre}! Redirigiendo a tu panel...`;
    feedback.classList.add('login-feedback--success');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 900);
  });
}
