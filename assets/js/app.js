/* ==========================================================================
   APP.JS
   Punto de entrada de la landing page. Única responsabilidad: importar
   y ejecutar los módulos necesarios cuando el DOM está listo.
   ========================================================================== */

import { initMobileMenu, initSmoothScroll, initStatsCounter } from './ui.js';
import { initRegisterFormValidation } from './form.js';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initStatsCounter();
  initRegisterFormValidation();
});