/* ==========================================================================
   CLINICAL-DATA.JS
   Proporciona los datos clínicos (citas, historial, pagos, estadísticas
   y actividad) del paciente actualmente autenticado. El paciente de
   demostración (Laura Martínez) conserva el contenido original de la
   Fase 2. Cualquier otro paciente recibe datos generados a partir de su
   propio registro (especialidad, EPS, monto) para que el dashboard nunca
   se muestre vacío o roto.
   ========================================================================== */

import {
  patientData as demoProfile,
  appointmentsData as demoAppointments,
  medicalHistoryData as demoHistory,
  paymentsData as demoPayments,
  statsData as demoStats,
  activityData as demoActivity
} from './mock-data.js';
import { DEMO_PATIENT_ID, getClinicalDataFor, saveClinicalDataFor } from './storage.js';
import { formatCurrency } from './utils.js';

/* ==========================================================================
   GENERACIÓN DE DATOS POR DEFECTO
   Para pacientes nuevos o del dataset que aún no tienen actividad clínica.
   ========================================================================== */

function generarDatosPorDefecto(patient) {
  const proximaFecha = new Date();
  proximaFecha.setDate(proximaFecha.getDate() + 7);
  const fechaFormateada = proximaFecha.toISOString().split('T')[0];

  const appointments = [
    {
      id: `A-${patient.id}-1`,
      patientId: String(patient.id),
      doctorName: `Especialista en ${patient.especialidad}`,
      specialty: patient.especialidad,
      date: fechaFormateada,
      time: '10:00 AM',
      status: 'confirmed'
    }
  ];

  const history = patient.fechaUltimaCita ? [
    {
      id: `H-${patient.id}-1`,
      patientId: String(patient.id),
      date: patient.fechaUltimaCita,
      specialty: patient.especialidad,
      doctorName: `Especialista en ${patient.especialidad}`,
      diagnosis: 'Consulta de control',
      recommendations: 'Seguir indicaciones médicas y agendar control',
      prescription: 'Según indicación médica'
    }
  ] : [];

  const payments = patient.fechaUltimaCita ? [
    {
      id: `PAY-${patient.id}-1`,
      patientId: String(patient.id),
      appointmentId: `H-${patient.id}-1`,
      description: `Consulta ${patient.especialidad}`,
      date: patient.fechaUltimaCita,
      amount: (patient.montoUSD || 25) * 4000,
      status: 'completed',
      method: 'EPS ' + patient.eps
    }
  ] : [];

  const stats = {
    upcomingAppointments: appointments.length,
    completedAppointments: history.length,
    totalSpent: payments.reduce((sum, p) => sum + p.amount, 0),
    averageRating: history.length > 0 ? 4.5 : 0
  };

  const activity = [
    {
      id: `ACT-${patient.id}-1`,
      type: 'appointment',
      title: 'Cuenta creada en MediCita',
      description: `Bienvenido(a), ${patient.nombre}`,
      date: new Date().toISOString().split('T')[0],
      icon: '👋'
    }
  ];

  return { appointments, history, payments, stats, activity };
}

/* ==========================================================================
   API PÚBLICA
   ========================================================================== */

export function getClinicalData(patient) {
  if (!patient) {
    return { appointments: [], history: [], payments: [], stats: demoStats, activity: [] };
  }

  // Paciente de demostración: conserva el contenido original de la Fase 2
  if (patient.id === DEMO_PATIENT_ID) {
    return {
      appointments: demoAppointments,
      history: demoHistory,
      payments: demoPayments,
      stats: demoStats,
      activity: demoActivity
    };
  }

  // Otros pacientes: se genera una vez y se persiste para mantener
  // consistencia entre recargas de página.
  const cached = getClinicalDataFor(patient.id);
  if (cached) return cached;

  const generated = generarDatosPorDefecto(patient);
  saveClinicalDataFor(patient.id, generated);
  return generated;
}

export { formatCurrency };
