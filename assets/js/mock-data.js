/* ==========================================================================
   MOCK-DATA.JS
   Dataset de prueba para el dashboard del paciente.
   Este archivo será reemplazado/enhanced en FASE 3 con generación de dataset por IA.
   ========================================================================== */

/* ==========================================================================
   PATIENT DATA
   Información del paciente actual
   ========================================================================== */

export const patientData = {
  id: 'P001',
  fullName: 'Laura Martínez',
  email: 'laura.martinez@email.com',
  phone: '3001234567',
  birthdate: '1990-05-15',
  address: 'Calle 123 #45-67',
  city: 'Bogotá',
  occupation: 'Abogada',
  avatarInitials: 'LM'
};

/* ==========================================================================
   APPOINTMENTS DATA
   Citas agendadas del paciente
   ========================================================================== */

export const appointmentsData = [
  {
    id: 'A001',
    patientId: 'P001',
    doctorName: 'Dra. Camila Ramírez',
    specialty: 'Medicina general',
    date: '2026-07-10',
    time: '10:00 AM',
    status: 'confirmed'
  },
  {
    id: 'A002',
    patientId: 'P001',
    doctorName: 'Dr. Andrés Gutiérrez',
    specialty: 'Cardiología',
    date: '2026-07-15',
    time: '2:30 PM',
    status: 'confirmed'
  },
  {
    id: 'A003',
    patientId: 'P001',
    doctorName: 'Dra. Valentina León',
    specialty: 'Dermatología',
    date: '2026-07-22',
    time: '11:00 AM',
    status: 'pending'
  }
];

/* ==========================================================================
   MEDICAL HISTORY DATA
   Historial de consultas médicas del paciente
   ========================================================================== */

export const medicalHistoryData = [
  {
    id: 'H001',
    patientId: 'P001',
    date: '2026-06-20',
    specialty: 'Medicina general',
    doctorName: 'Dra. Camila Ramírez',
    diagnosis: 'Gripe estacional con faringitis',
    recommendations: 'Reposo, hidratación abundante, analgésicos según necesidad',
    prescription: 'Paracetamol 500mg cada 8 horas por 5 días'
  },
  {
    id: 'H002',
    patientId: 'P001',
    date: '2026-05-18',
    specialty: 'Cardiología',
    doctorName: 'Dr. Andrés Gutiérrez',
    diagnosis: 'Taquicardia sinusal leve',
    recommendations: 'Reducir consumo de cafeína, ejercicio moderado, control de estrés',
    prescription: 'Metoprolol 25mg una vez al día por 30 días'
  },
  {
    id: 'H003',
    patientId: 'P001',
    date: '2026-04-10',
    specialty: 'Dermatología',
    doctorName: 'Dra. Valentina León',
    diagnosis: 'Dermatitis atópica moderada',
    recommendations: 'Evitar irritantes, usar hidratantes hipoalergénicos',
    prescription: 'Cremas con corticoesteroides tópicos por 14 días'
  },
  {
    id: 'H004',
    patientId: 'P001',
    date: '2026-03-05',
    specialty: 'Nutrición',
    doctorName: 'Dra. María González',
    diagnosis: 'Sobrepeso grado I',
    recommendations: 'Plan alimentario balanceado, actividad física regular',
    prescription: 'Multivitamínicos, suplemento de vitamina D'
  },
  {
    id: 'H005',
    patientId: 'P001',
    date: '2026-02-15',
    specialty: 'Psicología',
    doctorName: 'Dr. Santiago Mejía',
    diagnosis: 'Ansiedad generalizada leve',
    recommendations: 'Técnicas de relajación, terapia cognitivo-conductual',
    prescription: 'No requiere medicación'
  }
];

/* ==========================================================================
   PAYMENTS DATA
   Historial de pagos del paciente
   ========================================================================== */

export const paymentsData = [
  {
    id: 'PAY001',
    patientId: 'P001',
    appointmentId: 'A001',
    description: 'Consulta medicina general - Dra. Camila Ramírez',
    date: '2026-07-08',
    amount: 85000,
    status: 'completed',
    method: 'Tarjeta de crédito'
  },
  {
    id: 'PAY002',
    patientId: 'P001',
    appointmentId: 'A002',
    description: 'Consulta cardiología - Dr. Andrés Gutiérrez',
    date: '2026-07-13',
    amount: 120000,
    status: 'pending',
    method: 'PSE'
  },
  {
    id: 'PAY003',
    patientId: 'P001',
    appointmentId: 'H001',
    description: 'Consulta medicina general - Dra. Camila Ramírez',
    date: '2026-06-20',
    amount: 85000,
    status: 'completed',
    method: 'Tarjeta de crédito'
  },
  {
    id: 'PAY004',
    patientId: 'P001',
    appointmentId: 'H002',
    description: 'Consulta cardiología - Dr. Andrés Gutiérrez',
    date: '2026-05-18',
    amount: 120000,
    status: 'completed',
    method: 'Tarjeta de débito'
  },
  {
    id: 'PAY005',
    patientId: 'P001',
    appointmentId: 'H003',
    description: 'Consulta dermatología - Dra. Valentina León',
    date: '2026-04-10',
    amount: 95000,
    status: 'completed',
    method: 'Tarjeta de crédito'
  }
];

/* ==========================================================================
   STATS DATA
   Estadísticas del paciente para el resumen
   ========================================================================== */

export const statsData = {
  upcomingAppointments: 3,
  completedAppointments: 12,
  totalSpent: 450000,
  averageRating: 4.8
};

/* ==========================================================================
   ACTIVITY DATA
   Actividad reciente del paciente
   ========================================================================== */

export const activityData = [
  {
    id: 'ACT001',
    type: 'appointment',
    title: 'Nueva cita agendada',
    description: 'Consulta con Dra. Valentina León',
    date: '2026-07-05',
    icon: '📅'
  },
  {
    id: 'ACT002',
    type: 'payment',
    title: 'Pago realizado',
    description: 'Consulta medicina general - $85,000',
    date: '2026-07-08',
    icon: '💳'
  },
  {
    id: 'ACT003',
    type: 'history',
    title: 'Historial actualizado',
    description: 'Consulta cardiología completada',
    date: '2026-06-20',
    icon: '📋'
  }
];
