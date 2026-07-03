/* ==========================================================================
   PATIENTS DATASET
   Dataset de pacientes de MediCita generado para FASE 3
   Estructura del dataset según especificaciones
   ========================================================================== */

/* ==========================================================================
   ESTRUCTURA DEL DATASET
   Campo          Tipo           Obligatorio  Restricciones
   id             ID/Clave       Sí          Entero único, > 0
   nombre         Texto libre    Sí          2 - 60 caracteres
   email          Texto libre    Sí          Formato válido, único
   ciudad         Categórico    Sí          Bogotá, Medellín, Cali, Barranquilla, Cartagena
   especialidad   Categórico    Sí          Lista de especialidades válidas
   edad           Numérico       Sí          18 - 90 (entero)
   fechaUltimaCita Fecha        Sí          2023-01-01 a 2025-12-31
   eps            Categórico    Sí          Sura / Nueva EPS / Sanitas / Compensar / Particular
   montoUSD       Numérico       Sí          Según especialidad (ver reglas)
   activo         Booleano       Sí          true / false

   Lista de especialidades válidas:
   - Medicina general
   - Pediatría
   - Psicología
   - Dermatología
   - Nutrición
   - Ginecología
   - Cardiología
   - Fisioterapia
   - Psiquiatría
   - Endocrinología

   Regla de tarifas (montoUSD):
   - Medicina general = 25
   - Especialidades básicas (Pediatría, Nutrición, Fisioterapia) = 35
   - Especialidades avanzadas (Cardiología, Psiquiatría, Endocrinología, Ginecología, Dermatología, Psicología) = 45
   ========================================================================== */

/* ==========================================================================
   REGISTROS DE EJEMPLO (Few-shot examples)
   5 registros creados manualmente para servir como guía de generación
   ========================================================================== */

const pacientesEjemplo = [
  {
    id: 1,
    nombre: 'Sofía Ramírez',
    email: 'sofia.ramirez@gmail.com',
    ciudad: 'Bogotá',
    especialidad: 'Psicología',
    edad: 29,
    fechaUltimaCita: '2024-02-10',
    eps: 'Sanitas',
    montoUSD: 45,
    activo: true
  },
  {
    id: 2,
    nombre: 'Andrés Rojas',
    email: 'andres.rojas@outlook.com',
    ciudad: 'Medellín',
    especialidad: 'Medicina general',
    edad: 41,
    fechaUltimaCita: '2024-05-22',
    eps: 'Nueva EPS',
    montoUSD: 25,
    activo: true
  },
  {
    id: 3,
    nombre: 'Camila Torres',
    email: 'camila.t@gmail.com',
    ciudad: 'Cali',
    especialidad: 'Nutrición',
    edad: 34,
    fechaUltimaCita: '2023-11-03',
    eps: 'Compensar',
    montoUSD: 35,
    activo: false
  },
  {
    id: 4,
    nombre: 'Carlos Méndez',
    email: 'carlos.mendez@hotmail.com',
    ciudad: 'Barranquilla',
    especialidad: 'Cardiología',
    edad: 52,
    fechaUltimaCita: '2024-01-18',
    eps: 'Sura',
    montoUSD: 45,
    activo: true
  },
  {
    id: 5,
    nombre: 'Laura González',
    email: 'laura.gonzalez@empresa.com.co',
    ciudad: 'Cartagena',
    especialidad: 'Dermatología',
    edad: 27,
    fechaUltimaCita: '2024-04-29',
    eps: 'Particular',
    montoUSD: 45,
    activo: true
  }
];

/* ==========================================================================
   DATASET COMPLETO (30 registros)
   Generado con IA basado en los ejemplos anteriores
   ========================================================================== */

export const pacientesDataset = [
  // Registros manuales (few-shot examples) - IDs 1-5
  {
    id: 1,
    nombre: 'Sofía Ramírez',
    email: 'sofia.ramirez@gmail.com',
    ciudad: 'Bogotá',
    especialidad: 'Psicología',
    edad: 29,
    fechaUltimaCita: '2024-02-10',
    eps: 'Sanitas',
    montoUSD: 45,
    activo: true
  },
  {
    id: 2,
    nombre: 'Andrés Rojas',
    email: 'andres.rojas@outlook.com',
    ciudad: 'Medellín',
    especialidad: 'Medicina general',
    edad: 41,
    fechaUltimaCita: '2024-05-22',
    eps: 'Nueva EPS',
    montoUSD: 25,
    activo: true
  },
  {
    id: 3,
    nombre: 'Camila Torres',
    email: 'camila.t@gmail.com',
    ciudad: 'Cali',
    especialidad: 'Nutrición',
    edad: 34,
    fechaUltimaCita: '2023-11-03',
    eps: 'Compensar',
    montoUSD: 35,
    activo: false
  },
  {
    id: 4,
    nombre: 'Carlos Méndez',
    email: 'carlos.mendez@hotmail.com',
    ciudad: 'Barranquilla',
    especialidad: 'Cardiología',
    edad: 52,
    fechaUltimaCita: '2024-01-18',
    eps: 'Sura',
    montoUSD: 45,
    activo: true
  },
  {
    id: 5,
    nombre: 'Laura González',
    email: 'laura.gonzalez@empresa.com.co',
    ciudad: 'Cartagena',
    especialidad: 'Dermatología',
    edad: 27,
    fechaUltimaCita: '2024-04-29',
    eps: 'Particular',
    montoUSD: 45,
    activo: true
  },
  // Registros generados por IA (IDs 6-30)
  {
    id: 6,
    nombre: 'Diego Fernández',
    email: 'diego.f86@yahoo.com',
    ciudad: 'Bogotá',
    especialidad: 'Pediatría',
    edad: 38,
    fechaUltimaCita: '2024-03-15',
    eps: 'Sanitas',
    montoUSD: 35,
    activo: true
  },
  {
    id: 7,
    nombre: 'María Alejandra Castro',
    email: 'maria.castro@outlook.com',
    ciudad: 'Medellín',
    especialidad: 'Ginecología',
    edad: 31,
    fechaUltimaCita: '2024-05-08',
    eps: 'Sura',
    montoUSD: 45,
    activo: true
  },
  {
    id: 8,
    nombre: 'Javier Rodríguez',
    email: 'javier.r@gmail.com',
    ciudad: 'Cali',
    especialidad: 'Fisioterapia',
    edad: 45,
    fechaUltimaCita: '2023-12-20',
    eps: 'Nueva EPS',
    montoUSD: 35,
    activo: false
  },
  {
    id: 9,
    nombre: 'Ana María López',
    email: 'ana.lopez22@gmail.com',
    ciudad: 'Bogotá',
    especialidad: 'Psiquiatría',
    edad: 36,
    fechaUltimaCita: '2024-05-10',
    eps: 'Compensar',
    montoUSD: 45,
    activo: true
  },
  {
    id: 10,
    nombre: 'Felipe Gómez',
    email: 'felipe.gomez@bancolombia.com.co',
    ciudad: 'Barranquilla',
    especialidad: 'Endocrinología',
    edad: 48,
    fechaUltimaCita: '2024-02-28',
    eps: 'Particular',
    montoUSD: 45,
    activo: true
  },
  {
    id: 11,
    nombre: 'Daniela Vargas',
    email: 'daniela.vargasm@hotmail.com',
    ciudad: 'Bogotá',
    especialidad: 'Medicina general',
    edad: 25,
    fechaUltimaCita: '2024-04-05',
    eps: 'Sanitas',
    montoUSD: 25,
    activo: true
  },
  {
    id: 12,
    nombre: 'Miguel Ángel Ríos',
    email: 'miguel.rios@gmail.com',
    ciudad: 'Medellín',
    especialidad: 'Nutrición',
    edad: 33,
    fechaUltimaCita: '2023-10-17',
    eps: 'Nueva EPS',
    montoUSD: 35,
    activo: false
  },
  {
    id: 13,
    nombre: 'Carolina Soto',
    email: 'carolina.soto@outlook.com',
    ciudad: 'Medellín',
    especialidad: 'Dermatología',
    edad: 28,
    fechaUltimaCita: '2024-05-30',
    eps: 'Sura',
    montoUSD: 45,
    activo: true
  },
  {
    id: 14,
    nombre: 'Roberto Sánchez',
    email: 'roberto.sanchez86@yahoo.com',
    ciudad: 'Cali',
    especialidad: 'Cardiología',
    edad: 55,
    fechaUltimaCita: '2024-01-25',
    eps: 'Compensar',
    montoUSD: 45,
    activo: true
  },
  {
    id: 15,
    nombre: 'Patricia Morales',
    email: 'patricia.morales@gmail.com',
    ciudad: 'Barranquilla',
    especialidad: 'Psicología',
    edad: 40,
    fechaUltimaCita: '2024-03-22',
    eps: 'Sanitas',
    montoUSD: 45,
    activo: true
  },
  {
    id: 16,
    nombre: 'Gustavo Adolfo Herrera',
    email: 'gustavo.herrera@ecopetrol.com.co',
    ciudad: 'Bogotá',
    especialidad: 'Pediatría',
    edad: 42,
    fechaUltimaCita: '2024-05-12',
    eps: 'Nueva EPS',
    montoUSD: 35,
    activo: true
  },
  {
    id: 17,
    nombre: 'Lucía Fernanda Ortiz',
    email: 'lucia.ortiz@gmail.com',
    ciudad: 'Bogotá',
    especialidad: 'Ginecología',
    edad: 30,
    fechaUltimaCita: '2023-09-14',
    eps: 'Particular',
    montoUSD: 45,
    activo: false
  },
  {
    id: 18,
    nombre: 'Ricardo Muñoz',
    email: 'ricardo.munoz@outlook.com',
    ciudad: 'Medellín',
    especialidad: 'Fisioterapia',
    edad: 37,
    fechaUltimaCita: '2024-04-18',
    eps: 'Sura',
    montoUSD: 35,
    activo: true
  },
  {
    id: 19,
    nombre: 'Valentina Romero',
    email: 'valentina.romero22@hotmail.com',
    ciudad: 'Cali',
    especialidad: 'Psiquiatría',
    edad: 32,
    fechaUltimaCita: '2024-05-25',
    eps: 'Compensar',
    montoUSD: 45,
    activo: true
  },
  {
    id: 20,
    nombre: 'Alberto Quintero',
    email: 'alberto.quintero@gmail.com',
    ciudad: 'Bogotá',
    especialidad: 'Endocrinología',
    edad: 50,
    fechaUltimaCita: '2024-02-08',
    eps: 'Sanitas',
    montoUSD: 45,
    activo: true
  },
  {
    id: 21,
    nombre: 'Natalia Pineda',
    email: 'natalia.pineda@unal.edu.co',
    ciudad: 'Barranquilla',
    especialidad: 'Medicina general',
    edad: 26,
    fechaUltimaCita: '2024-05-03',
    eps: 'Nueva EPS',
    montoUSD: 25,
    activo: true
  },
  {
    id: 22,
    nombre: 'Jorge Eduardo Castro',
    email: 'jorge.castro@gmail.com',
    ciudad: 'Medellín',
    especialidad: 'Nutrición',
    edad: 39,
    fechaUltimaCita: '2023-11-28',
    eps: 'Sura',
    montoUSD: 35,
    activo: false
  },
  {
    id: 23,
    nombre: 'Sandra Milena Burgos',
    email: 'sandra.burgos@outlook.com',
    ciudad: 'Bogotá',
    especialidad: 'Dermatología',
    edad: 35,
    fechaUltimaCita: '2024-04-12',
    eps: 'Compensar',
    montoUSD: 45,
    activo: true
  },
  {
    id: 24,
    nombre: 'César Augusto Vega',
    email: 'cesar.vega@yahoo.com',
    ciudad: 'Medellín',
    especialidad: 'Cardiología',
    edad: 58,
    fechaUltimaCita: '2024-01-30',
    eps: 'Particular',
    montoUSD: 45,
    activo: true
  },
  {
    id: 25,
    nombre: 'Claudia Marcela Díaz',
    email: 'claudia.diaz@gmail.com',
    ciudad: 'Cali',
    especialidad: 'Psicología',
    edad: 31,
    fechaUltimaCita: '2024-05-15',
    eps: 'Sanitas',
    montoUSD: 45,
    activo: true
  },
  {
    id: 26,
    nombre: 'Luis Fernando Navarro',
    email: 'luis.navarro@aviatur.com.co',
    ciudad: 'Barranquilla',
    especialidad: 'Pediatría',
    edad: 44,
    fechaUltimaCita: '2024-05-20',
    eps: 'Nueva EPS',
    montoUSD: 35,
    activo: true
  },
  {
    id: 27,
    nombre: 'María José Arango',
    email: 'maria.arango@hotmail.com',
    ciudad: 'Bogotá',
    especialidad: 'Ginecología',
    edad: 29,
    fechaUltimaCita: '2023-10-05',
    eps: 'Sura',
    montoUSD: 45,
    activo: false
  },
  {
    id: 28,
    nombre: 'William Andrés Gil',
    email: 'william.gil@gmail.com',
    ciudad: 'Bogotá',
    especialidad: 'Fisioterapia',
    edad: 46,
    fechaUltimaCita: '2024-03-28',
    eps: 'Compensar',
    montoUSD: 35,
    activo: true
  },
  {
    id: 29,
    nombre: 'Adriana Carolina Salazar',
    email: 'adriana.salazar@outlook.com',
    ciudad: 'Medellín',
    especialidad: 'Psiquiatría',
    edad: 34,
    fechaUltimaCita: '2024-05-08',
    eps: 'Sanitas',
    montoUSD: 45,
    activo: true
  },
  {
    id: 30,
    nombre: 'Hernán Darío Beltrán',
    email: 'hernan.beltran@empresa.co',
    ciudad: 'Cali',
    especialidad: 'Endocrinología',
    edad: 51,
    fechaUltimaCita: '2024-02-14',
    eps: 'Particular',
    montoUSD: 45,
    activo: true
  }
];

/* ==========================================================================
   VALIDACIÓN DEL DATASET
   Funciones para validar que todos los registros cumplan las restricciones
   ========================================================================== */

export function validateDataset(dataset) {
  const errors = [];
  const warnings = [];

  // Validar estructura de cada registro
  dataset.forEach((paciente, index) => {
    const recordNum = index + 1;

    // Validar ID
    if (typeof paciente.id !== 'number' || paciente.id <= 0 || !Number.isInteger(paciente.id)) {
      errors.push(`Registro ${recordNum}: ID debe ser entero único > 0`);
    }

    // Validar nombre
    if (typeof paciente.nombre !== 'string' || paciente.nombre.length < 2 || paciente.nombre.length > 60) {
      errors.push(`Registro ${recordNum}: Nombre debe tener 2-60 caracteres`);
    }

    // Validar email (formato básico)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paciente.email)) {
      errors.push(`Registro ${recordNum}: Email debe tener formato válido`);
    }

    // Validar ciudad
    const ciudadesValidas = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'];
    if (!ciudadesValidas.includes(paciente.ciudad)) {
      errors.push(`Registro ${recordNum}: Ciudad debe ser una de las permitidas`);
    }

    // Validar especialidad
    const especialidadesValidas = [
      'Medicina general', 'Pediatría', 'Psicología', 'Dermatología',
      'Nutrición', 'Ginecología', 'Cardiología', 'Fisioterapia',
      'Psiquiatría', 'Endocrinología'
    ];
    if (!especialidadesValidas.includes(paciente.especialidad)) {
      errors.push(`Registro ${recordNum}: Especialidad no válida`);
    }

    // Validar edad
    if (typeof paciente.edad !== 'number' || paciente.edad < 18 || paciente.edad > 90 || !Number.isInteger(paciente.edad)) {
      errors.push(`Registro ${recordNum}: Edad debe ser entero entre 18 y 90`);
    }

    // Validar fecha
    const fecha = new Date(paciente.fechaUltimaCita);
    const fechaMin = new Date('2023-01-01');
    const fechaMax = new Date('2025-12-31');
    if (isNaN(fecha.getTime()) || fecha < fechaMin || fecha > fechaMax) {
      errors.push(`Registro ${recordNum}: Fecha debe estar entre 2023-01-01 y 2025-12-31`);
    }

    // Validar EPS
    const epsValidas = ['Sura', 'Nueva EPS', 'Sanitas', 'Compensar', 'Particular'];
    if (!epsValidas.includes(paciente.eps)) {
      errors.push(`Registro ${recordNum}: EPS debe ser una de las permitidas`);
    }

    // Validar montoUSD según especialidad
    const montoEsperado = getMontoPorEspecialidad(paciente.especialidad);
    if (paciente.montoUSD !== montoEsperado) {
      warnings.push(`Registro ${recordNum}: Monto USD (${paciente.montoUSD}) difiere del esperado para ${paciente.especialidad} (${montoEsperado})`);
    }

    // Validar activo
    if (typeof paciente.activo !== 'boolean') {
      errors.push(`Registro ${recordNum}: Activo debe ser true o false`);
    }
  });

  // Validar IDs únicos
  const ids = dataset.map(p => p.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    errors.push('Hay IDs duplicados en el dataset');
  }

  // Validar emails únicos
  const emails = dataset.map(p => p.email);
  const uniqueEmails = new Set(emails);
  if (emails.length !== uniqueEmails.size) {
    errors.push('Hay emails duplicados en el dataset');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalRecords: dataset.length
  };
}

function getMontoPorEspecialidad(especialidad) {
  if (especialidad === 'Medicina general') return 25;
  if (['Pediatría', 'Nutrición', 'Fisioterapia'].includes(especialidad)) return 35;
  if (['Cardiología', 'Psiquiatría', 'Endocrinología', 'Ginecología', 'Dermatología', 'Psicología'].includes(especialidad)) return 45;
  return 25; // Default
}

// Ejecutar validación al cargar el módulo
const validation = validateDataset(pacientesDataset);
console.log('Validación del dataset (interna):', validation);

// Exportar para validación externa con validator.js
export { pacientesDataset };
