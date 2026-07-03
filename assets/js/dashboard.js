/* ==========================================================================
   DASHBOARD.JS
   Lógica principal del dashboard del paciente.
   Maneja navegación, renderizado de datos e interacciones.
   ========================================================================== */

import {
  patientData,
  appointmentsData,
  medicalHistoryData,
  paymentsData,
  statsData,
  activityData
} from './mock-data.js';

/* ==========================================================================
   INITIALIZATION
   Función principal que se ejecuta cuando el DOM está listo
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

function initDashboard() {
  loadPatientInfo();
  loadStats();
  loadNextAppointment();
  loadActivityList();
  loadAppointments();
  loadMedicalHistory();
  loadPayments();
  loadProfileForm();
  initTabNavigation();
  initInternalLinks();
  initMobileMenu();
}

/* ==========================================================================
   PATIENT INFO
   Carga y muestra la información del paciente
   ========================================================================== */

function loadPatientInfo() {
  const userNameElement = document.getElementById('user-name');
  const userEmailElement = document.getElementById('user-email');
  const sidebarUserNameElement = document.getElementById('sidebar-user-name');
  const sidebarUserEmailElement = document.getElementById('sidebar-user-email');
  const sidebarAvatarInitialsElement = document.getElementById('sidebar-avatar-initials');

  if (userNameElement) {
    userNameElement.textContent = patientData.fullName;
  }

  if (userEmailElement) {
    userEmailElement.textContent = patientData.email;
  }

  if (sidebarUserNameElement) {
    sidebarUserNameElement.textContent = patientData.fullName;
  }

  if (sidebarUserEmailElement) {
    sidebarUserEmailElement.textContent = patientData.email;
  }

  if (sidebarAvatarInitialsElement) {
    sidebarAvatarInitialsElement.textContent = patientData.avatarInitials;
  }
}

/* ==========================================================================
   STATS
   Carga y muestra las estadísticas del paciente
   ========================================================================== */

function loadStats() {
  const statAppointments = document.getElementById('stat-appointments');
  const statCompleted = document.getElementById('stat-completed');
  const statSpent = document.getElementById('stat-spent');
  const statRating = document.getElementById('stat-rating');

  if (statAppointments) {
    statAppointments.textContent = statsData.upcomingAppointments;
  }

  if (statCompleted) {
    statCompleted.textContent = statsData.completedAppointments;
  }

  if (statSpent) {
    statSpent.textContent = formatCurrency(statsData.totalSpent);
  }

  if (statRating) {
    statRating.textContent = statsData.averageRating;
  }
}

/* ==========================================================================
   NEXT APPOINTMENT
   Muestra la próxima cita en el resumen
   ========================================================================== */

function loadNextAppointment() {
  const nextAppointmentElement = document.getElementById('next-appointment');

  if (!nextAppointmentElement || appointmentsData.length === 0) {
    return;
  }

  const nextAppointment = appointmentsData[0];
  const { date, time, doctorName, specialty } = nextAppointment;
  const formattedDate = formatDate(date);

  nextAppointmentElement.innerHTML = `
    <div class="appointment-card">
      <div class="appointment-date">
        <p class="appointment-day">${getDayOfMonth(date)}</p>
        <p class="appointment-month">${getMonthName(date)}</p>
      </div>
      <div class="appointment-info">
        <p class="appointment-doctor">${doctorName}</p>
        <p class="appointment-specialty">${specialty}</p>
        <p class="appointment-time">
          <span aria-hidden="true">🕐</span>
          ${time}
        </p>
      </div>
    </div>
  `;
}

/* ==========================================================================
   ACTIVITY LIST
   Muestra la actividad reciente del paciente
   ========================================================================== */

function loadActivityList() {
  const activityListElement = document.getElementById('activity-list');

  if (!activityListElement) {
    return;
  }

  activityListElement.innerHTML = activityData.map(activity => `
    <li class="activity-item">
      <div class="activity-icon">${activity.icon}</div>
      <div class="activity-content">
        <p class="activity-title">${activity.title}</p>
        <p class="activity-description">${activity.description}</p>
        <p class="activity-date">${formatDate(activity.date)}</p>
      </div>
    </li>
  `).join('');
}

/* ==========================================================================
   APPOINTMENTS
   Carga y muestra todas las citas del paciente
   ========================================================================== */

function loadAppointments() {
  const appointmentsListElement = document.getElementById('appointments-list');

  if (!appointmentsListElement) {
    return;
  }

  if (appointmentsData.length === 0) {
    appointmentsListElement.innerHTML = `
      <div class="empty-state">
        <p>No tienes citas agendadas.</p>
        <button type="button" class="btn btn-primary btn-small">Agendar cita</button>
      </div>
    `;
    return;
  }

  appointmentsListElement.innerHTML = appointmentsData.map(appointment => `
    <article class="appointment-card card">
      <div class="appointment-date">
        <p class="appointment-day">${getDayOfMonth(appointment.date)}</p>
        <p class="appointment-month">${getMonthName(appointment.date)}</p>
      </div>
      <div class="appointment-info">
        <p class="appointment-doctor">${appointment.doctorName}</p>
        <p class="appointment-specialty">${appointment.specialty}</p>
        <p class="appointment-time">
          <span aria-hidden="true">🕐</span>
          ${appointment.time}
        </p>
      </div>
      <div class="appointment-actions">
        <button type="button" class="btn btn-primary btn-small">Unirse a llamada</button>
        <button type="button" class="btn btn-ghost btn-small">Reprogramar</button>
      </div>
    </article>
  `).join('');
}

/* ==========================================================================
   MEDICAL HISTORY
   Carga y muestra el historial médico del paciente
   ========================================================================== */

function loadMedicalHistory() {
  const historyTableBody = document.getElementById('history-table-body');

  if (!historyTableBody) {
    return;
  }

  if (medicalHistoryData.length === 0) {
    historyTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: var(--space-8);">
          <p>No hay historial médico disponible.</p>
        </td>
      </tr>
    `;
    return;
  }

  historyTableBody.innerHTML = medicalHistoryData.map(history => `
    <tr>
      <td>${formatDate(history.date)}</td>
      <td>${history.specialty}</td>
      <td>${history.doctorName}</td>
      <td>${history.diagnosis}</td>
      <td>
        <button type="button" class="btn btn-ghost btn-small" aria-label="Ver detalles de consulta del ${formatDate(history.date)}">
          Ver detalles
        </button>
      </td>
    </tr>
  `).join('');
}

/* ==========================================================================
   PAYMENTS
   Carga y muestra el historial de pagos del paciente
   ========================================================================== */

function loadPayments() {
  const paymentsListElement = document.getElementById('payments-list');

  if (!paymentsListElement) {
    return;
  }

  if (paymentsData.length === 0) {
    paymentsListElement.innerHTML = `
      <div class="empty-state">
        <p>No hay pagos registrados.</p>
      </div>
    `;
    return;
  }

  paymentsListElement.innerHTML = paymentsData.map(payment => `
    <article class="payment-card card">
      <div class="payment-info">
        <div class="payment-icon">💳</div>
        <div class="payment-details">
          <p class="payment-description">${payment.description}</p>
          <p class="payment-date">${formatDate(payment.date)}</p>
        </div>
      </div>
      <div style="text-align: right;">
        <p class="payment-amount">${formatCurrency(payment.amount)}</p>
        <p class="payment-status payment-status--${payment.status}">
          ${payment.status === 'completed' ? 'Completado' : 'Pendiente'}
        </p>
      </div>
    </article>
  `).join('');
}

/* ==========================================================================
   PROFILE FORM
   Carga los datos del paciente en el formulario de perfil
   ========================================================================== */

function loadProfileForm() {
  const fullNameInput = document.getElementById('profile-full-name');
  const emailInput = document.getElementById('profile-email');
  const phoneInput = document.getElementById('profile-phone');
  const birthdateInput = document.getElementById('profile-birthdate');
  const addressInput = document.getElementById('profile-address');
  const cityInput = document.getElementById('profile-city');
  const occupationInput = document.getElementById('profile-occupation');
  const profileForm = document.getElementById('profile-form');

  if (fullNameInput) fullNameInput.value = patientData.fullName;
  if (emailInput) emailInput.value = patientData.email;
  if (phoneInput) phoneInput.value = patientData.phone;
  if (birthdateInput) birthdateInput.value = patientData.birthdate;
  if (addressInput) addressInput.value = patientData.address || '';
  if (cityInput) cityInput.value = patientData.city;
  if (occupationInput) occupationInput.value = patientData.occupation || '';

  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileFormSubmit);
  }
}

/* ==========================================================================
   TAB NAVIGATION
   Maneja la navegación entre secciones del dashboard
   ========================================================================== */

function initTabNavigation() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const tabId = link.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  // Update sidebar links
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  sidebarLinks.forEach(link => {
    const isActive = link.getAttribute('data-tab') === tabId;
    link.classList.toggle('sidebar-link--active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  });

  // Update tab content
  const tabs = document.querySelectorAll('.dashboard-tab');
  tabs.forEach(tab => {
    const isActive = tab.id === `tab-${tabId}`;
    tab.classList.toggle('dashboard-tab--active', isActive);
  });

  // Update header title
  const dashboardTitle = document.getElementById('dashboard-title');
  const dashboardSubtitle = document.getElementById('dashboard-subtitle');

  const titles = {
    overview: { title: 'Resumen', subtitle: 'Bienvenido a tu panel de control' },
    appointments: { title: 'Próximas citas', subtitle: 'Gestiona tus consultas agendadas' },
    history: { title: 'Historial médico', subtitle: 'Consulta tus diagnósticos y tratamientos' },
    payments: { title: 'Pagos', subtitle: 'Historial de transacciones' },
    profile: { title: 'Mi perfil', subtitle: 'Actualiza tu información personal' }
  };

  if (dashboardTitle && titles[tabId]) {
    dashboardTitle.textContent = titles[tabId].title;
  }

  if (dashboardSubtitle && titles[tabId]) {
    dashboardSubtitle.textContent = titles[tabId].subtitle;
  }
}

/* ==========================================================================
   INTERNAL LINKS
   Maneja los links internos que navegan entre secciones
   ========================================================================== */

function initInternalLinks() {
  const internalLinks = document.querySelectorAll('[data-tab]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
}

/* ==========================================================================
   PROFILE FORM HANDLER
   Maneja el envío del formulario de perfil
   ========================================================================== */

function handleProfileFormSubmit(e) {
  e.preventDefault();

  const formData = {
    fullName: document.getElementById('profile-full-name').value,
    email: document.getElementById('profile-email').value,
    phone: document.getElementById('profile-phone').value,
    birthdate: document.getElementById('profile-birthdate').value,
    address: document.getElementById('profile-address').value,
    city: document.getElementById('profile-city').value,
    occupation: document.getElementById('profile-occupation').value
  };

  // Validate form
  if (!validateProfileForm(formData)) {
    return;
  }

  // Update patient data (in a real app, this would be sent to a server)
  Object.assign(patientData, formData);

  // Update UI
  loadPatientInfo();

  // Show success message
  alert('Perfil actualizado correctamente');
}

function validateProfileForm(data) {
  const errors = {};

  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.fullName = 'El nombre completo es obligatorio';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'El correo electrónico no es válido';
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.phone = 'El número de celular no es válido';
  }

  // Birthdate is readonly, so we don't validate it on form submit
  // It's already validated when the account is created

  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'La ciudad es obligatoria';
  }

  // Display errors
  displayFormErrors(errors);

  return Object.keys(errors).length === 0;
}

function displayFormErrors(errors) {
  // Clear all errors
  document.querySelectorAll('.form-error').forEach(el => {
    el.textContent = '';
  });

  // Display new errors
  Object.keys(errors).forEach(field => {
    const errorElement = document.getElementById(`profile-${field}-error`);
    if (errorElement) {
      errorElement.textContent = errors[field];
    }
  });
}

/* ==========================================================================
   UTILITY FUNCTIONS
   Funciones de utilidad para formateo y validación
   ========================================================================== */

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function getDayOfMonth(dateString) {
  const date = new Date(dateString);
  return date.getDate();
}

function getMonthName(dateString) {
  const date = new Date(dateString);
  const monthNames = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  return monthNames[date.getMonth()];
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
}

/* ==========================================================================
   MOBILE MENU
   Maneja el menú hamburguesa para dispositivos móviles
   ========================================================================== */

function initMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('dashboard-sidebar');
  const sidebarClose = document.getElementById('sidebar-close');
  const mobileOverlay = document.getElementById('mobile-overlay');

  if (!mobileMenuToggle || !sidebar || !sidebarClose || !mobileOverlay) {
    return;
  }

  // Open sidebar
  mobileMenuToggle.addEventListener('click', () => {
    toggleMobileMenu(true);
  });

  // Close sidebar with X button
  sidebarClose.addEventListener('click', () => {
    toggleMobileMenu(false);
  });

  // Close sidebar when clicking overlay
  mobileOverlay.addEventListener('click', () => {
    toggleMobileMenu(false);
  });

  // Close sidebar when clicking on a sidebar link
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // Close sidebar on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('dashboard-sidebar--open')) {
      toggleMobileMenu(false);
    }
  });
}

function toggleMobileMenu(isOpen) {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('dashboard-sidebar');
  const mobileOverlay = document.getElementById('mobile-overlay');

  if (!mobileMenuToggle || !sidebar || !mobileOverlay) {
    return;
  }

  if (isOpen) {
    sidebar.classList.add('dashboard-sidebar--open');
    mobileOverlay.classList.add('mobile-overlay--visible');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  } else {
    sidebar.classList.remove('dashboard-sidebar--open');
    mobileOverlay.classList.remove('mobile-overlay--visible');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}
