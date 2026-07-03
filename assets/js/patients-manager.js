/* ==========================================================================
   PATIENTS-MANAGER.JS
   Gestión completa de pacientes con CRUD, búsqueda, filtros y persistencia
   FASE 5: Visualización + CRUD + Persistencia con localStorage
   Usa storage.js como única fuente de verdad, compartida con el dashboard.
   ========================================================================== */

import { getPatients, savePatients } from './storage.js';
import {
  isValidEmail,
  isOnlyLetters,
  isBlank,
  restrictToLettersLive,
  getMontoPorEspecialidad,
  generarFechaAleatoria,
  getAdherencia,
  getNextId
} from './utils.js';

/* ==========================================================================
   VARIABLES GLOBALES
   ========================================================================== */

let pacientes = [];
let pacienteIdToDelete = null;
let chartInstance = null;

/* ==========================================================================
   CARGAR / GUARDAR DATOS
   Delegado a storage.js para mantener una única fuente de verdad
   compartida con el dashboard del paciente.
   ========================================================================== */

function cargarDatos() {
  pacientes = getPatients();
}

function guardarDatos() {
  savePatients(pacientes);
}

/* ==========================================================================
   RENDERIZAR CARDS
   Construye HTML de todas las cards y actualiza el DOM
   ========================================================================== */

function renderizarCards(lista) {
  const grid = document.getElementById('patients-grid');
  const noResults = document.getElementById('no-results');
  const filteredCount = document.getElementById('filtered-count');

  if (!grid) return;

  if (lista.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    filteredCount.textContent = 'Mostrando 0 pacientes';
    return;
  }

  noResults.style.display = 'none';
  filteredCount.textContent = `Mostrando ${lista.length} paciente${lista.length !== 1 ? 's' : ''}`;

  const cardsHTML = lista.map(paciente => {
    const adherencia = getAdherencia(paciente.id);
    return `
      <article class="patient-card">
        <div class="patient-header">
          <div>
            <h3 class="patient-name">${paciente.nombre}</h3>
            <p class="patient-email">${paciente.email}</p>
          </div>
          <div class="patient-status ${paciente.activo ? 'patient-status--active' : 'patient-status--inactive'}" 
               title="${paciente.activo ? 'Activo' : 'Inactivo'}"
               aria-label="${paciente.activo ? 'Paciente activo' : 'Paciente inactivo'}"></div>
        </div>
        <div class="patient-body">
          <div class="patient-info">
            <span class="patient-info-label">Ciudad:</span>
            <span class="patient-info-value">${paciente.ciudad}</span>
          </div>
          <div class="patient-info">
            <span class="patient-info-label">Especialidad:</span>
            <span class="patient-info-value">${paciente.especialidad}</span>
          </div>
          <div class="patient-info">
            <span class="patient-info-label">Edad:</span>
            <span class="patient-info-value">${paciente.edad} años</span>
          </div>
          <div class="patient-info">
            <span class="patient-info-label">Adherencia:</span>
            <div style="flex: 1; max-width: 100px; margin-left: var(--space-2);">
              <div style="background-color: var(--color-background); height: 6px; border-radius: 3px; overflow: hidden;">
                <div style="width: ${adherencia}%; background-color: var(--color-primary); height: 100%;"></div>
              </div>
            </div>
            <span class="patient-info-value">${adherencia}%</span>
          </div>
          <div class="patient-info">
            <span class="patient-info-label">EPS:</span>
            <span class="patient-eps-badge">${paciente.eps}</span>
          </div>
        </div>
        <div class="patient-footer">
          <button type="button" class="patient-btn patient-btn--edit" 
                  onclick="abrirModal(${paciente.id})"
                  aria-label="Editar ${paciente.nombre}">
            Editar
          </button>
          <button type="button" class="patient-btn patient-btn--delete"
                  onclick="confirmarEliminar(${paciente.id})"
                  aria-label="Eliminar ${paciente.nombre}">
            Eliminar
          </button>
        </div>
      </article>
    `;
  }).join('');

  grid.innerHTML = cardsHTML;
}

/* ==========================================================================
   FILTRAR
   Aplica búsqueda + filtros sobre el array original y re-renderizar
   ========================================================================== */

function filtrar() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const cityFilter = document.getElementById('city-filter').value;
  const specialtyFilter = document.getElementById('specialty-filter').value;

  let pacientesFiltrados = pacientes.filter(paciente => {
    // Búsqueda por nombre o email
    const matchSearch = paciente.nombre.toLowerCase().includes(searchTerm) ||
                       paciente.email.toLowerCase().includes(searchTerm);
    
    // Filtro por ciudad
    const matchCity = !cityFilter || paciente.ciudad === cityFilter;
    
    // Filtro por especialidad
    const matchSpecialty = !specialtyFilter || paciente.especialidad === specialtyFilter;
    
    return matchSearch && matchCity && matchSpecialty;
  });

  renderizarCards(pacientesFiltrados);
}

/* ==========================================================================
   ABRIR MODAL
   Abre el modal de formulario; si id existe, precarga datos para editar
   ========================================================================== */

function abrirModal(id = null) {
  const modal = document.getElementById('patient-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('patient-form');
  const patientIdInput = document.getElementById('patient-id');

  if (!modal) return;

  // Limpiar errores previos
  limpiarErrores();

  if (id) {
    // Modo edición
    const paciente = pacientes.find(p => p.id === id);
    if (!paciente) return;

    modalTitle.textContent = 'Editar Paciente';
    patientIdInput.value = paciente.id;
    document.getElementById('patient-name').value = paciente.nombre;
    document.getElementById('patient-email').value = paciente.email;
    document.getElementById('patient-city').value = paciente.ciudad;
    document.getElementById('patient-specialty').value = paciente.especialidad;
    document.getElementById('patient-age').value = paciente.edad;
    document.getElementById('patient-eps').value = paciente.eps;
    document.getElementById('patient-active').checked = paciente.activo;
  } else {
    // Modo agregar
    modalTitle.textContent = 'Agregar Paciente';
    patientIdInput.value = '';
    form.reset();
    document.getElementById('patient-active').checked = true;
  }

  modal.classList.add('modal--visible');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

/* ==========================================================================
   CERRAR MODAL
   Cierra el modal de formulario
   ========================================================================== */

function cerrarModal() {
  const modal = document.getElementById('patient-modal');
  if (!modal) return;

  modal.classList.remove('modal--visible');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  limpiarErrores();
}

/* ==========================================================================
   GUARDAR PACIENTE
   Valida formulario, agrega o actualiza en el array y guarda
   ========================================================================== */

function guardarPaciente(event) {
  event.preventDefault();
  
  limpiarErrores();

  const idInput = document.getElementById('patient-id').value;
  const nombre = document.getElementById('patient-name').value.trim();
  const email = document.getElementById('patient-email').value.trim();
  const ciudad = document.getElementById('patient-city').value;
  const especialidad = document.getElementById('patient-specialty').value;
  const edad = parseInt(document.getElementById('patient-age').value);
  const eps = document.getElementById('patient-eps').value;
  const activo = document.getElementById('patient-active').checked;

  // Validaciones
  let errores = false;

  if (isBlank(nombre) || nombre.length < 2 || nombre.length > 60) {
    mostrarError('patient-name-error', 'El nombre debe tener entre 2 y 60 caracteres');
    errores = true;
  } else if (!isOnlyLetters(nombre)) {
    mostrarError('patient-name-error', 'El nombre solo puede contener letras y espacios');
    errores = true;
  }

  if (isBlank(email) || !isValidEmail(email)) {
    mostrarError('patient-email-error', 'El email debe tener un formato válido');
    errores = true;
  } else {
    // Verificar email único
    const emailExistente = pacientes.find(p => 
      p.email.toLowerCase() === email.toLowerCase() && 
      (idInput ? p.id !== parseInt(idInput) : true)
    );
    if (emailExistente) {
      mostrarError('patient-email-error', 'Este email ya está registrado');
      errores = true;
    }
  }

  if (!ciudad) {
    mostrarError('patient-city-error', 'Debe seleccionar una ciudad');
    errores = true;
  }

  if (!especialidad) {
    mostrarError('patient-specialty-error', 'Debe seleccionar una especialidad');
    errores = true;
  }

  if (!edad || edad < 18 || edad > 90) {
    mostrarError('patient-age-error', 'La edad debe estar entre 18 y 90 años');
    errores = true;
  }

  if (!eps) {
    mostrarError('patient-eps-error', 'Debe seleccionar una EPS');
    errores = true;
  }

  if (errores) return;

  // Calcular monto USD según especialidad
  const montoUSD = getMontoPorEspecialidad(especialidad);

  // Generar fecha aleatoria dentro del rango válido
  const fechaUltimaCita = generarFechaAleatoria();

  if (idInput) {
    // Actualizar paciente existente
    // Nota: montoUSD se recalcula por si la especialidad cambió, pero
    // fechaUltimaCita se conserva (no se debe regenerar en una edición).
    const id = parseInt(idInput);
    const index = pacientes.findIndex(p => p.id === id);
    if (index !== -1) {
      pacientes[index] = {
        ...pacientes[index],
        nombre,
        email,
        ciudad,
        especialidad,
        edad,
        eps,
        montoUSD,
        activo
      };
    }
  } else {
    // Agregar nuevo paciente
    const nuevoId = getNextId(pacientes);
    pacientes.push({
      id: nuevoId,
      nombre,
      email,
      ciudad,
      especialidad,
      edad,
      fechaUltimaCita,
      eps,
      montoUSD,
      activo
    });
  }

  guardarDatos();
  filtrar();
  actualizarEstadisticas();
  actualizarGrafico();
  cerrarModal();
}

/* ==========================================================================
   CONFIRMAR ELIMINAR
   Muestra modal de confirmación para eliminar paciente
   ========================================================================== */

function confirmarEliminar(id) {
  pacienteIdToDelete = id;
  const modal = document.getElementById('confirm-modal');
  if (modal) {
    modal.classList.add('modal--visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

/* ==========================================================================
   CERRAR CONFIRM MODAL
   Cierra el modal de confirmación
   ========================================================================== */

function cerrarConfirmModal() {
  const modal = document.getElementById('confirm-modal');
  if (modal) {
    modal.classList.remove('modal--visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  pacienteIdToDelete = null;
}

/* ==========================================================================
   ELIMINAR PACIENTE
   Elimina del array, guarda y re-renderizar
   ========================================================================== */

function eliminarPaciente() {
  if (pacienteIdToDelete === null) return;

  pacientes = pacientes.filter(p => p.id !== pacienteIdToDelete);
  guardarDatos();
  filtrar();
  actualizarEstadisticas();
  actualizarGrafico();
  cerrarConfirmModal();
}

/* ==========================================================================
   ACTUALIZAR ESTADÍSTICAS
   Actualiza los contadores de estadísticas
   ========================================================================== */

function actualizarEstadisticas() {
  const totalElement = document.getElementById('total-patients');
  const activeElement = document.getElementById('active-patients');
  const inactiveElement = document.getElementById('inactive-patients');

  if (totalElement) totalElement.textContent = pacientes.length;
  if (activeElement) activeElement.textContent = pacientes.filter(p => p.activo).length;
  if (inactiveElement) inactiveElement.textContent = pacientes.filter(p => !p.activo).length;
}

/* ==========================================================================
   ACTUALIZAR GRÁFICO
   Recalcular conteo por especialidad y actualizar Chart.js
   ========================================================================== */

function actualizarGrafico() {
  const canvas = document.getElementById('specialty-chart');
  if (!canvas) return;

  // Calcular conteo por especialidad
  const conteoPorEspecialidad = {};
  pacientes.forEach(paciente => {
    conteoPorEspecialidad[paciente.especialidad] = (conteoPorEspecialidad[paciente.especialidad] || 0) + 1;
  });

  const especialidades = Object.keys(conteoPorEspecialidad);
  const conteos = Object.values(conteoPorEspecialidad);

  // Destruir gráfico anterior si existe
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Crear nuevo gráfico
  chartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: especialidades,
      datasets: [{
        label: 'Pacientes',
        data: conteos,
        backgroundColor: 'rgba(63, 167, 150, 0.8)',
        borderColor: 'rgba(63, 167, 150, 1)',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

/* ==========================================================================
   UTILIDADES LOCALES
   Funciones específicas de la UI del modal (no compartidas)
   ========================================================================== */

function mostrarError(elementId, mensaje) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = mensaje;
  }
}

function limpiarErrores() {
  const errorElements = document.querySelectorAll('.form-error');
  errorElements.forEach(element => {
    element.textContent = '';
  });
}

/* ==========================================================================
   INICIALIZACIÓN
   Configura event listeners y carga inicial de datos
   ========================================================================== */

function init() {
  // Cargar datos
  cargarDatos();

  // Renderizar cards iniciales
  filtrar();

  // Actualizar estadísticas
  actualizarEstadisticas();

  // Actualizar gráfico
  actualizarGrafico();

  // Event listeners para filtros
  const searchInput = document.getElementById('search-input');
  const cityFilter = document.getElementById('city-filter');
  const specialtyFilter = document.getElementById('specialty-filter');

  if (searchInput) {
    searchInput.addEventListener('input', filtrar);
  }

  if (cityFilter) {
    cityFilter.addEventListener('change', filtrar);
  }

  if (specialtyFilter) {
    specialtyFilter.addEventListener('change', filtrar);
  }

  // Event listeners para modal de paciente
  const addPatientBtn = document.getElementById('add-patient-btn');
  const modalClose = document.getElementById('modal-close');
  const modalCancel = document.getElementById('modal-cancel');
  const modalOverlay = document.getElementById('modal-overlay');
  const patientForm = document.getElementById('patient-form');
  const patientNameInput = document.getElementById('patient-name');

  // Restricción de caracteres en tiempo real: bloquea dígitos en el nombre
  if (patientNameInput) {
    restrictToLettersLive(patientNameInput);
  }

  if (addPatientBtn) {
    addPatientBtn.addEventListener('click', () => abrirModal());
  }

  if (modalClose) {
    modalClose.addEventListener('click', cerrarModal);
  }

  if (modalCancel) {
    modalCancel.addEventListener('click', cerrarModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', cerrarModal);
  }

  if (patientForm) {
    patientForm.addEventListener('submit', guardarPaciente);
  }

  // Event listeners para modal de confirmación
  const confirmClose = document.getElementById('confirm-close');
  const confirmCancel = document.getElementById('confirm-cancel');
  const confirmDelete = document.getElementById('confirm-delete');
  const confirmOverlay = document.getElementById('confirm-overlay');

  if (confirmClose) {
    confirmClose.addEventListener('click', cerrarConfirmModal);
  }

  if (confirmCancel) {
    confirmCancel.addEventListener('click', cerrarConfirmModal);
  }

  if (confirmDelete) {
    confirmDelete.addEventListener('click', eliminarPaciente);
  }

  if (confirmOverlay) {
    confirmOverlay.addEventListener('click', cerrarConfirmModal);
  }

  // Cerrar modales con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cerrarModal();
      cerrarConfirmModal();
    }
  });

  // Exponer funciones globales para onclick en HTML
  window.abrirModal = abrirModal;
  window.confirmarEliminar = confirmarEliminar;
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
