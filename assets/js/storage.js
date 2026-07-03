/* ==========================================================================
   STORAGE.JS
   Módulo centralizado de acceso a localStorage. Única fuente de verdad
   (Single Source of Truth) para lectura/escritura de datos persistentes.
   Ningún otro archivo debe llamar a localStorage directamente.
   ========================================================================== */

import { pacientesDataset } from '../../data/patients-dataset.js';
import { getNextId } from './utils.js';

/* ==========================================================================
   CLAVES DE STORAGE
   ========================================================================== */

export const STORAGE_KEYS = {
  PATIENTS: 'medicita_pacientes',
  SESSION: 'medicita_session',
  CLINICAL_DATA: 'medicita_clinical_data'
};

/* ==========================================================================
   PACIENTE DEMO (Laura Martínez)
   Se agrega al dataset inicial para conservar el dashboard de demostración
   que ya existía, ahora como un registro real dentro del mismo storage.
   ========================================================================== */

const DEMO_PATIENT = {
  id: 31,
  nombre: 'Laura Martínez',
  email: 'laura.martinez@email.com',
  ciudad: 'Bogotá',
  especialidad: 'Medicina general',
  edad: 34,
  fechaUltimaCita: '2026-06-20',
  eps: 'Sanitas',
  montoUSD: 25,
  activo: true,
  telefono: '3001234567',
  fechaNacimiento: '1990-05-15',
  direccion: 'Calle 123 #45-67',
  ocupacion: 'Abogada'
};

export const DEMO_PATIENT_ID = DEMO_PATIENT.id;

/* ==========================================================================
   HELPERS GENÉRICOS
   ========================================================================== */

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Error leyendo la clave "${key}" de localStorage:`, error);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error guardando la clave "${key}" en localStorage:`, error);
    return false;
  }
}

/* ==========================================================================
   PACIENTES
   Fuente única de verdad usada tanto por el dashboard como por la
   gestión de pacientes (patients-manager.js).
   ========================================================================== */

export function getPatients() {
  const stored = readJSON(STORAGE_KEYS.PATIENTS, null);
  if (stored) return stored;

  const initial = [...pacientesDataset, DEMO_PATIENT];
  writeJSON(STORAGE_KEYS.PATIENTS, initial);
  return initial;
}

export function savePatients(patients) {
  return writeJSON(STORAGE_KEYS.PATIENTS, patients);
}

export function getPatientById(id) {
  const patients = getPatients();
  return patients.find(p => p.id === Number(id)) || null;
}

export function getPatientByEmail(email) {
  if (!email) return null;
  const patients = getPatients();
  const normalized = email.trim().toLowerCase();
  return patients.find(p => p.email.toLowerCase() === normalized) || null;
}

export function addPatient(patientData) {
  const patients = getPatients();
  const newPatient = {
    ...patientData,
    id: getNextId(patients)
  };
  patients.push(newPatient);
  savePatients(patients);
  return newPatient;
}

export function updatePatient(id, changes) {
  const patients = getPatients();
  const index = patients.findIndex(p => p.id === Number(id));
  if (index === -1) return null;

  patients[index] = { ...patients[index], ...changes };
  savePatients(patients);
  return patients[index];
}

export function deletePatient(id) {
  const patients = getPatients();
  const filtered = patients.filter(p => p.id !== Number(id));
  savePatients(filtered);
  return filtered;
}

/* ==========================================================================
   SESIÓN
   Guarda el ID del paciente actualmente autenticado.
   ========================================================================== */

export function getSession() {
  return readJSON(STORAGE_KEYS.SESSION, null);
}

export function setSession(patientId) {
  return writeJSON(STORAGE_KEYS.SESSION, { patientId: Number(patientId) });
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    return true;
  } catch (error) {
    console.error('Error al eliminar la sesión:', error);
    return false;
  }
}

/* ==========================================================================
   DATOS CLÍNICOS (citas, historial, pagos) POR PACIENTE
   ========================================================================== */

export function getClinicalDataStore() {
  return readJSON(STORAGE_KEYS.CLINICAL_DATA, {});
}

export function getClinicalDataFor(patientId) {
  const store = getClinicalDataStore();
  return store[String(patientId)] || null;
}

export function saveClinicalDataFor(patientId, data) {
  const store = getClinicalDataStore();
  store[String(patientId)] = data;
  return writeJSON(STORAGE_KEYS.CLINICAL_DATA, store);
}
