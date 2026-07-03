/* ==========================================================================
   VALIDATOR.JS
   Funciones de validación para el dataset de pacientes (FASE 4)
   Valida restricciones de negocio del dataset
   ========================================================================== */

/* ==========================================================================
   CONSTANTES DE VALIDACIÓN
   Listas de valores válidos para campos categóricos
   ========================================================================== */

const CIUDADES_VALIDAS = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'];

const ESPECIALIDADES_VALIDAS = [
  'Medicina general',
  'Pediatría',
  'Psicología',
  'Dermatología',
  'Nutrición',
  'Ginecología',
  'Cardiología',
  'Fisioterapia',
  'Psiquiatría',
  'Endocrinología'
];

const EPS_VALIDAS = ['Sura', 'Nueva EPS', 'Sanitas', 'Compensar', 'Particular'];

const FECHA_MIN = '2023-01-01';
const FECHA_MAX = '2025-05-01';

const EDAD_MIN = 18;
const EDAD_MAX = 90;

/* ==========================================================================
   REGLAS DE TARIFAS
   Montos según especialidad
   ========================================================================== */

function getMontoPorEspecialidad(especialidad) {
  if (especialidad === 'Medicina general') return 25;
  if (['Pediatría', 'Nutrición', 'Fisioterapia'].includes(especialidad)) return 35;
  if (['Cardiología', 'Psiquiatría', 'Endocrinología', 'Ginecología', 'Dermatología', 'Psicología'].includes(especialidad)) return 45;
  return 25;
}

/* ==========================================================================
   VALIDACIÓN DE IDs
   Verifica que los IDs sean únicos y consecutivos
   ========================================================================== */

export function validateIds(dataset) {
  const errors = [];

  // Verificar que todos los IDs sean números positivos
  dataset.forEach((paciente, index) => {
    const recordNum = index + 1;
    if (typeof paciente.id !== 'number' || paciente.id <= 0 || !Number.isInteger(paciente.id)) {
      errors.push(`Registro ${recordNum}: ID debe ser un número entero positivo (actual: ${paciente.id})`);
    }
  });

  // Verificar IDs únicos
  const ids = dataset.map(p => p.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    errors.push(`Hay IDs duplicados: ${[...new Set(duplicates)].join(', ')}`);
  }

  // Verificar que los IDs sean consecutivos
  const sortedIds = [...ids].sort((a, b) => a - b);
  for (let i = 1; i < sortedIds.length; i++) {
    if (sortedIds[i] !== sortedIds[i - 1] + 1) {
      errors.push(`Los IDs no son consecutivos: falta ${sortedIds[i - 1] + 1} entre ${sortedIds[i - 1]} y ${sortedIds[i]}`);
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/* ==========================================================================
   VALIDACIÓN DE EMAILS
   Verifica formato válido y sin duplicados
   ========================================================================== */

export function validateEmails(dataset) {
  const errors = [];

  // Verificar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  dataset.forEach((paciente, index) => {
    const recordNum = index + 1;
    if (!emailRegex.test(paciente.email)) {
      errors.push(`Registro ${recordNum}: Email inválido "${paciente.email}"`);
    }
  });

  // Verificar emails únicos
  const emails = dataset.map(p => p.email);
  const uniqueEmails = new Set(emails);
  if (emails.length !== uniqueEmails.size) {
    const duplicates = emails.filter((email, index) => emails.indexOf(email) !== index);
    errors.push(`Hay emails duplicados: ${[...new Set(duplicates)].join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/* ==========================================================================
   VALIDACIÓN DE MONTO USD
   Verifica coherencia con especialidad
   ========================================================================== */

export function validateMontoUSD(dataset) {
  const errors = [];
  const warnings = [];

  dataset.forEach((paciente, index) => {
    const recordNum = index + 1;
    const montoEsperado = getMontoPorEspecialidad(paciente.especialidad);

    if (paciente.montoUSD !== montoEsperado) {
      errors.push(`Registro ${recordNum}: Monto USD incorrecto para ${paciente.especialidad}. Esperado: ${montoEsperado}, Actual: ${paciente.montoUSD}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/* ==========================================================================
   VALIDACIÓN DE EDAD
   Verifica que la edad esté entre 18 y 90
   ========================================================================== */

export function validateEdad(dataset) {
  const errors = [];

  dataset.forEach((paciente, index) => {
    const recordNum = index + 1;

    if (typeof paciente.edad !== 'number' || !Number.isInteger(paciente.edad)) {
      errors.push(`Registro ${recordNum}: Edad debe ser un número entero (actual: ${paciente.edad})`);
    } else if (paciente.edad < EDAD_MIN || paciente.edad > EDAD_MAX) {
      errors.push(`Registro ${recordNum}: Edad fuera de rango permitido (${EDAD_MIN}-${EDAD_MAX}). Actual: ${paciente.edad}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/* ==========================================================================
   VALIDACIÓN DE FECHA ÚLTIMA CITA
   Verifica que esté entre 2023-01-01 y 2025-05-01
   ========================================================================== */

export function validateFechaUltimaCita(dataset) {
  const errors = [];

  const fechaMin = new Date(FECHA_MIN);
  const fechaMax = new Date(FECHA_MAX);

  dataset.forEach((paciente, index) => {
    const recordNum = index + 1;
    const fecha = new Date(paciente.fechaUltimaCita);

    if (isNaN(fecha.getTime())) {
      errors.push(`Registro ${recordNum}: Fecha inválida "${paciente.fechaUltimaCita}"`);
    } else if (fecha < fechaMin || fecha > fechaMax) {
      errors.push(`Registro ${recordNum}: Fecha fuera de rango permitido (${FECHA_MIN} a ${FECHA_MAX}). Actual: ${paciente.fechaUltimaCita}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/* ==========================================================================
   VALIDACIÓN DE CATEGORÍAS
   Verifica ciudad, eps y especialidad estén en listas válidas
   ========================================================================== */

export function validateCategorias(dataset) {
  const errors = [];

  dataset.forEach((paciente, index) => {
    const recordNum = index + 1;

    // Validar ciudad
    if (!CIUDADES_VALIDAS.includes(paciente.ciudad)) {
      errors.push(`Registro ${recordNum}: Ciudad inválida "${paciente.ciudad}". Valores válidos: ${CIUDADES_VALIDAS.join(', ')}`);
    }

    // Validar especialidad
    if (!ESPECIALIDADES_VALIDAS.includes(paciente.especialidad)) {
      errors.push(`Registro ${recordNum}: Especialidad inválida "${paciente.especialidad}". Valores válidos: ${ESPECIALIDADES_VALIDAS.join(', ')}`);
    }

    // Validar EPS
    if (!EPS_VALIDAS.includes(paciente.eps)) {
      errors.push(`Registro ${recordNum}: EPS inválida "${paciente.eps}". Valores válidos: ${EPS_VALIDAS.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/* ==========================================================================
   VALIDACIÓN DE NOMBRES
   Verifica que el nombre tenga entre 2 y 60 caracteres
   ========================================================================== */

export function validateNombres(dataset) {
  const errors = [];

  dataset.forEach((paciente, index) => {
    const recordNum = index + 1;

    if (typeof paciente.nombre !== 'string') {
      errors.push(`Registro ${recordNum}: Nombre debe ser texto (actual: ${typeof paciente.nombre})`);
    } else if (paciente.nombre.length < 2 || paciente.nombre.length > 60) {
      errors.push(`Registro ${recordNum}: Nombre debe tener entre 2 y 60 caracteres (actual: ${paciente.nombre.length})`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/* ==========================================================================
   VALIDACIÓN DE ACTIVO
   Verifica que activo sea booleano
   ========================================================================== */

export function validateActivo(dataset) {
  const errors = [];

  dataset.forEach((paciente, index) => {
    const recordNum = index + 1;

    if (typeof paciente.activo !== 'boolean') {
      errors.push(`Registro ${recordNum}: Activo debe ser true o false (actual: ${paciente.activo})`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/* ==========================================================================
   VALIDACIÓN COMPLETA
   Ejecuta todas las validaciones y retorna un reporte consolidado
   ========================================================================== */

export function validateDatasetCompleto(dataset) {
  const resultados = {
    ids: validateIds(dataset),
    emails: validateEmails(dataset),
    montoUSD: validateMontoUSD(dataset),
    edad: validateEdad(dataset),
    fechaUltimaCita: validateFechaUltimaCita(dataset),
    categorias: validateCategorias(dataset),
    nombres: validateNombres(dataset),
    activo: validateActivo(dataset)
  };

  const todosValidos = Object.values(resultados).every(r => r.isValid);
  const todosErrores = Object.values(resultados).flatMap(r => r.errors);
  const todosWarnings = Object.values(resultados).flatMap(r => r.warnings || []);

  return {
    isValid: todosValidos,
    errors: todosErrores,
    warnings: todosWarnings,
    detalles: resultados,
    totalRegistros: dataset.length,
    resumen: {
      idsValidos: resultados.ids.isValid,
      emailsValidos: resultados.emails.isValid,
      montosValidos: resultados.montoUSD.isValid,
      edadesValidas: resultados.edad.isValid,
      fechasValidas: resultados.fechaUltimaCita.isValid,
      categoriasValidas: resultados.categorias.isValid
    }
  };
}

/* ==========================================================================
   FUNCIÓN DE UTILIDAD
   Imprime reporte de validación en consola
   ========================================================================== */

export function imprimirReporteValidacion(resultados) {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('REPORTE DE VALIDACIÓN DEL DATASET');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total registros: ${resultados.totalRegistros}`);
  console.log(`Estado general: ${resultados.isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
  console.log(`Errores: ${resultados.errors.length}`);
  console.log(`Warnings: ${resultados.warnings.length}`);
  console.log('───────────────────────────────────────────────────────────────');
  console.log('Resumen por validación:');
  console.log(`  IDs: ${resultados.resumen.idsValidos ? '✅' : '❌'}`);
  console.log(`  Emails: ${resultados.resumen.emailsValidos ? '✅' : '❌'}`);
  console.log(`  Montos USD: ${resultados.resumen.montosValidos ? '✅' : '❌'}`);
  console.log(`  Edades: ${resultados.resumen.edadesValidas ? '✅' : '❌'}`);
  console.log(`  Fechas: ${resultados.resumen.fechasValidas ? '✅' : '❌'}`);
  console.log(`  Categorías: ${resultados.resumen.categoriasValidas ? '✅' : '❌'}`);

  if (resultados.errors.length > 0) {
    console.log('───────────────────────────────────────────────────────────────');
    console.log('ERRORES:');
    resultados.errors.forEach(error => console.log(`  ❌ ${error}`));
  }

  if (resultados.warnings.length > 0) {
    console.log('───────────────────────────────────────────────────────────────');
    console.log('WARNINGS:');
    resultados.warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
  }

  console.log('═══════════════════════════════════════════════════════════');
}
