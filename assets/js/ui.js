/* ==========================================================================
   UI.JS
   Funciones puras de interacción de interfaz. No conocen datos de negocio
   (pacientes, citas, etc.), solo comportamiento visual del DOM.
   ========================================================================== */

/**
 * Activa el menú de navegación móvil (hamburguesa).
 * Alterna la clase .is-open y el atributo aria-expanded para accesibilidad.
 */
export function initMobileMenu() {
  const toggleButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.navbar-menu');

  if (!toggleButton || !menu) return;

  toggleButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
    toggleButton.setAttribute(
      'aria-label',
      isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
    );
  });
}

/**
 * Cierra el menú móvil automáticamente al seleccionar un link del navbar.
 * Evita que el menú quede abierto tapando el contenido tras navegar.
 */
export function initSmoothScroll() {
  const menu = document.querySelector('.navbar-menu');
  const toggleButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.navbar-menu a');

  if (!menu || navLinks.length === 0) return;

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggleButton?.setAttribute('aria-expanded', 'false');
        toggleButton?.setAttribute('aria-label', 'Abrir menú de navegación');
      }
    });
  });
}

/**
 * Anima los números de la sección de estadísticas de 0 hasta su valor
 * final (data-target), solo cuando el usuario hace scroll hasta verlos.
 */
export function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length === 0) return;

  const animateCounter = (element) => {
    const target = Number(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const duration = 1500;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(progress * target);

      element.textContent = currentValue.toLocaleString('es-CO') + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => observer.observe(el));
}