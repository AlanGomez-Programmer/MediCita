/* ==========================================================================
   DASHBOARD.JS
   Lógica principal del dashboard del paciente.
   Maneja navegación, renderizado de datos e interacciones.
   Los datos provienen del paciente actualmente autenticado (auth.js),
   no de un objeto estático: cada usuario ve únicamente su información.
   ========================================================================== */

import { getCurrentPatient, logout } from './auth.js';
import { getClinicalData } from './clinical-data.js';
import { updatePatient, saveClinicalDataFor } from './storage.js';
import {
  isValidEmail,
  isValidPhone,
  isOnlyLetters,
  isBlank,
  restrictToLettersLive,
  restrictToDigitsLive,
  formatCurrency,
  formatDate,
  getDayOfMonth,
  getMonthName,
  getInitials,
  getMontoPorEspecialidad
} from './utils.js';

/* ==========================================================================
   ESTADO DEL DASHBOARD
   patientData y los datos clínicos se resuelven una sola vez al iniciar,
   a partir del paciente autenticado (Single Source of Truth).
   ========================================================================== */

let patientData = null;
let appointmentsData = [];
let medicalHistoryData = [];
let paymentsData = [];
let statsData = { upcomingAppointments: 0, completedAppointments: 0, totalSpent: 0, averageRating: 0 };
let activityData = [];

/* ==========================================================================
   INITIALIZATION
   Función principal que se ejecuta cuando el DOM está listo
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

function initDashboard() {
  const currentPatient = getCurrentPatient();

  // Adaptar el registro del paciente (campos en español) al modelo que
  // consume el dashboard (mantiene los mismos nombres usados en el HTML).
  patientData = {
    id: currentPatient.id,
    fullName: currentPatient.nombre,
    email: currentPatient.email,
    phone: currentPatient.telefono || '',
    birthdate: currentPatient.fechaNacimiento || '',
    address: currentPatient.direccion || '',
    city: currentPatient.ciudad,
    occupation: currentPatient.ocupacion || '',
    avatarInitials: getInitials(currentPatient.nombre),
    foto: currentPatient.foto || null
  };

  const clinicalData = getClinicalData(currentPatient);
  appointmentsData = clinicalData.appointments;
  medicalHistoryData = clinicalData.history;
  paymentsData = clinicalData.payments;
  statsData = clinicalData.stats;
  activityData = clinicalData.activity;

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
  initLogout();
  initButtonActions();
}

/**
 * Guarda los datos clínicos actuales (citas, historial, pagos, stats,
 * actividad) en localStorage para el paciente autenticado. El paciente
 * de demostración no persiste cambios: siempre conserva su contenido
 * original de ejemplo.
 */
function persistClinicalData() {
  saveClinicalDataFor(patientData.id, {
    appointments: appointmentsData,
    history: medicalHistoryData,
    payments: paymentsData,
    stats: statsData,
    activity: activityData
  });
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

  applyAvatarPhoto();
}

/**
 * Si el paciente tiene una foto guardada (subida desde "Cambiar foto"),
 * la muestra como fondo del avatar grande del perfil. Si no tiene foto,
 * conserva las iniciales que ya definía el diseño original.
 */
function applyAvatarPhoto() {
  const profileAvatar = document.querySelector('.profile-avatar-large');
  const initialsSpan = document.getElementById('profile-avatar-initials');

  if (!profileAvatar) return;

  if (patientData.foto) {
    profileAvatar.style.backgroundImage = `url(${patientData.foto})`;
    profileAvatar.style.backgroundSize = 'cover';
    profileAvatar.style.backgroundPosition = 'center';
    if (initialsSpan) initialsSpan.style.visibility = 'hidden';
  } else {
    profileAvatar.style.backgroundImage = '';
    if (initialsSpan) initialsSpan.style.visibility = 'visible';
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
   Carga y muestra todas las citas del paciente en la tabla del dashboard
   ========================================================================== */

const APPOINTMENT_STATUS_LABELS = {
  confirmed: { label: 'Confirmada', badgeClass: 'appointment-badge--confirmed' },
  pending: { label: 'Pendiente', badgeClass: 'appointment-badge--cancelled' },
  completed: { label: 'Completada', badgeClass: 'appointment-badge--completed' },
  cancelled: { label: 'Cancelada', badgeClass: 'appointment-badge--cancelled' }
};

function loadAppointments() {
  const appointmentsTableBody = document.getElementById('appointments-table-body');

  if (!appointmentsTableBody) {
    return;
  }

  if (appointmentsData.length === 0) {
    appointmentsTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: var(--space-8);">
          No tienes citas agendadas todavía.
        </td>
      </tr>
    `;
    return;
  }

  appointmentsTableBody.innerHTML = appointmentsData.map(appointment => {
    const status = APPOINTMENT_STATUS_LABELS[appointment.status] || APPOINTMENT_STATUS_LABELS.confirmed;
    const precio = getMontoPorEspecialidad(appointment.specialty) * 4000;

    return `
      <tr>
        <td>${appointment.specialty}</td>
        <td class="hide-mobile">${appointment.doctorName}</td>
        <td>Videoconsulta</td>
        <td class="hide-mobile">${formatDate(appointment.date)}</td>
        <td>${formatCurrency(precio)}</td>
        <td><span class="appointment-badge ${status.badgeClass}">${status.label}</span></td>
      </tr>
    `;
  }).join('');
}

/* ==========================================================================
   NUEVA CITA
   Agenda una cita nueva a partir del botón "Agendar nueva cita"
   ========================================================================== */

function handleNewAppointment() {
  const fecha = window.prompt('Ingresa la fecha de la cita (AAAA-MM-DD):', new Date().toISOString().split('T')[0]);
  if (!fecha) return;

  const especialidad = window.prompt('Especialidad de la cita:', 'Medicina general');
  if (!especialidad) return;

  const nuevaCita = {
    id: `A-${patientData.id}-${Date.now()}`,
    patientId: String(patientData.id),
    doctorName: `Especialista en ${especialidad}`,
    specialty: especialidad,
    date: fecha,
    time: '10:00 AM',
    status: 'confirmed'
  };

  appointmentsData.push(nuevaCita);
  statsData.upcomingAppointments = appointmentsData.length;
  persistClinicalData();

  loadAppointments();
  loadNextAppointment();
  loadStats();

  alert('Cita agendada correctamente.');
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
        <button type="button" class="btn btn-ghost btn-small history-details-btn" data-history-id="${history.id}" aria-label="Ver detalles de consulta del ${formatDate(history.date)}">
          Ver detalles
        </button>
      </td>
    </tr>
  `).join('');
}

function showHistoryDetails(historyId) {
  const entry = medicalHistoryData.find(h => String(h.id) === String(historyId));
  if (!entry) return;

  alert(
    `Consulta del ${formatDate(entry.date)}\n` +
    `Especialidad: ${entry.specialty}\n` +
    `Médico: ${entry.doctorName}\n\n` +
    `Diagnóstico: ${entry.diagnosis}\n\n` +
    `Recomendaciones: ${entry.recommendations}\n\n` +
    `Prescripción: ${entry.prescription}`
  );
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

function fillProfileForm() {
  const fullNameInput = document.getElementById('profile-full-name');
  const emailInput = document.getElementById('profile-email');
  const phoneInput = document.getElementById('profile-phone');
  const birthdateInput = document.getElementById('profile-birthdate');
  const addressInput = document.getElementById('profile-address');
  const cityInput = document.getElementById('profile-city');
  const occupationInput = document.getElementById('profile-occupation');

  if (fullNameInput) fullNameInput.value = patientData.fullName;
  if (emailInput) emailInput.value = patientData.email;
  if (phoneInput) phoneInput.value = patientData.phone;
  if (birthdateInput) birthdateInput.value = patientData.birthdate;
  if (addressInput) addressInput.value = patientData.address || '';
  if (cityInput) cityInput.value = patientData.city;
  if (occupationInput) occupationInput.value = patientData.occupation || '';

  // Limpia mensajes de error visibles al restaurar los valores originales
  document.querySelectorAll('#profile-form .form-error').forEach(el => {
    el.textContent = '';
  });
}

function loadProfileForm() {
  const fullNameInput = document.getElementById('profile-full-name');
  const phoneInput = document.getElementById('profile-phone');
  const cityInput = document.getElementById('profile-city');
  const profileForm = document.getElementById('profile-form');

  fillProfileForm();

  // Restricción de caracteres en tiempo real: bloquea dígitos en campos de
  // texto (nombre, ciudad) y letras en el campo de teléfono.
  if (fullNameInput) restrictToLettersLive(fullNameInput);
  if (cityInput) restrictToLettersLive(cityInput);
  if (phoneInput) restrictToDigitsLive(phoneInput);

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
    fullName: document.getElementById('profile-full-name').value.trim(),
    email: document.getElementById('profile-email').value.trim(),
    phone: document.getElementById('profile-phone').value.trim(),
    birthdate: document.getElementById('profile-birthdate').value,
    address: document.getElementById('profile-address').value.trim(),
    city: document.getElementById('profile-city').value.trim(),
    occupation: document.getElementById('profile-occupation').value.trim()
  };

  // Validate form
  if (!validateProfileForm(formData)) {
    return;
  }

  // Update in-memory patient data used by the rest of the dashboard
  Object.assign(patientData, formData);

  // Persist the change in localStorage (Single Source of Truth)
  updatePatient(patientData.id, {
    nombre: formData.fullName,
    email: formData.email,
    telefono: formData.phone,
    direccion: formData.address,
    ciudad: formData.city,
    ocupacion: formData.occupation
  });

  // Update UI
  loadPatientInfo();

  // Show success message
  alert('Perfil actualizado correctamente');
}

function validateProfileForm(data) {
  const errors = {};

  if (isBlank(data.fullName) || data.fullName.trim().length < 3) {
    errors.fullName = 'El nombre completo es obligatorio';
  } else if (!isOnlyLetters(data.fullName)) {
    errors.fullName = 'El nombre solo puede contener letras y espacios';
  }

  if (isBlank(data.email) || !isValidEmail(data.email)) {
    errors.email = 'El correo electrónico no es válido';
  }

  if (isBlank(data.phone) || !isValidPhone(data.phone)) {
    errors.phone = 'El número de celular debe tener 10 dígitos numéricos';
  }

  // Birthdate is readonly, so we don't validate it on form submit
  // It's already validated when the account is created

  if (isBlank(data.city) || data.city.trim().length < 2) {
    errors.city = 'La ciudad es obligatoria';
  } else if (!isOnlyLetters(data.city)) {
    errors.city = 'La ciudad solo puede contener letras y espacios';
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

/* ==========================================================================
   LOGOUT
   Cierra la sesión del paciente actual antes de volver a la landing page
   ========================================================================== */

function initLogout() {
  const logoutLink = document.querySelector('a.sidebar-logout[href="../index.html"]');

  if (!logoutLink) return;

  logoutLink.addEventListener('click', () => {
    logout();
  });
}

/* ==========================================================================
   BUTTON ACTIONS
   Conecta los botones estáticos del dashboard que aún no tenían
   funcionalidad: agendar cita, exportar historial, cambiar foto,
   cancelar edición de perfil y ver detalles de una consulta.
   ========================================================================== */

function initButtonActions() {
  // Agendar nueva cita
  const newAppointmentBtn = document.getElementById('btn-new-appointment');
  if (newAppointmentBtn) {
    newAppointmentBtn.addEventListener('click', handleNewAppointment);
  }

  // Exportar historial médico a un archivo CSV descargable
  const exportHistoryBtn = document.getElementById('btn-export-history');
  if (exportHistoryBtn) {
    exportHistoryBtn.addEventListener('click', handleExportHistory);
  }

  // Cambiar foto de perfil
  const changePhotoBtn = document.getElementById('btn-change-photo');
  const photoInput = document.getElementById('photo-upload-input');
  if (changePhotoBtn && photoInput) {
    changePhotoBtn.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', handlePhotoChange);
  }

  // Cancelar edición de perfil: restaura los valores guardados
  const cancelProfileBtn = document.getElementById('btn-cancel-profile');
  if (cancelProfileBtn) {
    cancelProfileBtn.addEventListener('click', fillProfileForm);
  }

  // Ver detalles de una consulta (delegación de eventos sobre la tabla,
  // ya que las filas se regeneran dinámicamente)
  const historyTableBody = document.getElementById('history-table-body');
  if (historyTableBody) {
    historyTableBody.addEventListener('click', (event) => {
      const button = event.target.closest('.history-details-btn');
      if (button) {
        showHistoryDetails(button.dataset.historyId);
      }
    });
  }
}

function handleExportHistory() {
  if (medicalHistoryData.length === 0) {
    alert('No hay historial médico para exportar.');
    return;
  }

  const headers = ['Fecha', 'Especialidad', 'Médico', 'Diagnóstico', 'Recomendaciones', 'Prescripción'];
  const rows = medicalHistoryData.map(h => [
    formatDate(h.date),
    h.specialty,
    h.doctorName,
    h.diagnosis,
    h.recommendations,
    h.prescription
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `historial-medico-${patientData.fullName.replace(/\s+/g, '-').toLowerCase()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function handlePhotoChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Por favor selecciona un archivo de imagen válido.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    patientData.foto = reader.result;
    updatePatient(patientData.id, { foto: reader.result });
    applyAvatarPhoto();
  };
  reader.readAsDataURL(file);
}
