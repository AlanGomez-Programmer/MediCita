/* ==========================================================================
   AUTH.JS
   Módulo de autenticación y sesión. Responsabilidad única: registrar,
   iniciar sesión, cerrar sesión y obtener el paciente actualmente
   autenticado. Toda la app debe consultar este módulo para saber
   "quién es el usuario actual" (Single Source of Truth de identidad).
   ========================================================================== */

import {
  getPatientByEmail,
  addPatient,
  setSession,
  clearSession,
  getSession,
  getPatientById,
  DEMO_PATIENT_ID
} from './storage.js';
import { getMontoPorEspecialidad } from './utils.js';

/* ==========================================================================
   REGISTRO / INICIO DE SESIÓN
   Un mismo formulario cumple ambos flujos: si el correo ya existe en el
   dataset, se inicia sesión con ese registro (login). Si no existe, se
   crea un paciente nuevo (registro) y se inicia sesión automáticamente.
   ========================================================================== */

export function registerOrLogin(formData) {
  const email = formData.email.trim().toLowerCase();
  const existingPatient = getPatientByEmail(email);

  if (existingPatient) {
    setSession(existingPatient.id);
    return { patient: existingPatient, isNewPatient: false };
  }

  const especialidad = formData.especialidad || 'Medicina general';

  const newPatient = addPatient({
    nombre: formData.nombre.trim(),
    email,
    ciudad: formData.ciudad || 'Bogotá',
    especialidad,
    edad: formData.edad || 30,
    fechaUltimaCita: null,
    eps: formData.eps || 'Particular',
    montoUSD: getMontoPorEspecialidad(especialidad),
    activo: true,
    telefono: formData.telefono || '',
    fechaNacimiento: formData.fechaNacimiento || null,
    direccion: formData.direccion || '',
    ocupacion: formData.ocupacion || ''
  });

  setSession(newPatient.id);
  return { patient: newPatient, isNewPatient: true };
}

/* ==========================================================================
   INICIO DE SESIÓN (solo pacientes existentes)
   Usado por la página dedicada de login (pages/login.html). A diferencia
   de registerOrLogin, esta función NO crea pacientes nuevos: solo permite
   entrar a quienes ya existen en el dataset/localStorage.
   ========================================================================== */

export function login(email) {
  const normalized = (email || '').trim().toLowerCase();
  const patient = getPatientByEmail(normalized);

  if (!patient) {
    return { success: false, patient: null };
  }

  setSession(patient.id);
  return { success: true, patient };
}

/* ==========================================================================
   CERRAR SESIÓN
   ========================================================================== */

export function logout() {
  clearSession();
}

/* ==========================================================================
   OBTENER PACIENTE ACTUAL
   Si no hay sesión activa (por ejemplo, se abrió el dashboard directamente
   sin pasar por el registro), se usa el paciente de demostración para que
   la vista nunca quede rota o vacía.
   ========================================================================== */

export function getCurrentPatient() {
  const session = getSession();

  if (session && session.patientId) {
    const patient = getPatientById(session.patientId);
    if (patient) return patient;
  }

  // Fallback: paciente de demostración (acceso directo sin registro/login)
  const demoPatient = getPatientById(DEMO_PATIENT_ID);
  if (demoPatient) {
    setSession(demoPatient.id);
  }
  return demoPatient;
}

export function isAuthenticated() {
  const session = getSession();
  return Boolean(session && session.patientId);
}
