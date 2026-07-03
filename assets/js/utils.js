/* ==========================================================================
   UTILS.JS
   Funciones de utilidad compartidas por todo el proyecto: validaciones,
   formateo y reglas de negocio. Única fuente de verdad para evitar
   duplicación de lógica (DRY) entre dashboard, patients-manager y validator.
   ========================================================================== */

/* ==========================================================================
   PATRONES DE VALIDACIÓN
   Fuente única para expresiones regulares usadas en todos los formularios
   (registro, perfil del dashboard, gestión de pacientes).
   ========================================================================== */

export const PATTERNS = {
  // Solo letras (incluye tildes y ñ), con un único espacio entre palabras
  onlyLetters: /^[A-Za-zÁÉÍÓÚÑáéíóúñ]+(?:\s[A-Za-zÁÉÍÓÚÑáéíóúñ]+)*$/,
  // Formato de correo estándar
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Celular colombiano: exactamente 10 dígitos
  phone: /^\d{10}$/
};

/* ==========================================================================
   VALIDACIONES
   ========================================================================== */

export function isValidEmail(email) {
  return typeof email === 'string' && PATTERNS.email.test(email);
}

export function isValidPhone(phone) {
  return typeof phone === 'string' && PATTERNS.phone.test(phone);
}

export function isOnlyLetters(value) {
  return typeof value === 'string' && PATTERNS.onlyLetters.test(value.trim());
}

/**
 * Verifica que el campo no esté vacío ni contenga únicamente espacios.
 */
export function isBlank(value) {
  return !value || value.trim() === '';
}

/**
 * Filtra en tiempo real los caracteres no permitidos mientras el usuario
 * escribe, evitando el error antes de que ocurra (ej. bloquear dígitos en
 * un campo de nombre o letras en un campo de teléfono).
 */
export function restrictLiveInput(input, allowedCharRegex) {
  input.addEventListener('input', () => {
    const cleanValue = [...input.value].filter((char) => allowedCharRegex.test(char)).join('');
    input.value = cleanValue;
  });
}

/**
 * Restringe un campo de texto a solo letras y espacios en tiempo real.
 * Además bloquea espacios al inicio y colapsa espacios dobles, evitando
 * que el campo quede "vacío" a simple vista por estar lleno de espacios.
 */
export function restrictToLettersLive(input) {
  input.addEventListener('input', () => {
    let value = [...input.value]
      .filter((char) => /[A-Za-zÁÉÍÓÚÑáéíóúñ\s]/.test(char))
      .join('');
    value = value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
    input.value = value;
  });
}

/**
 * Restringe un campo de texto a solo dígitos en tiempo real (ej. teléfono).
 */
export function restrictToDigitsLive(input) {
  input.addEventListener('input', () => {
    input.value = [...input.value].filter((char) => /[0-9]/.test(char)).join('');
  });
}

/* ==========================================================================
   REGLAS DE NEGOCIO
   ========================================================================== */

export function getMontoPorEspecialidad(especialidad) {
  if (especialidad === 'Medicina general') return 25;
  if (['Pediatría', 'Nutrición', 'Fisioterapia'].includes(especialidad)) return 35;
  if (['Cardiología', 'Psiquiatría', 'Endocrinología', 'Ginecología', 'Dermatología', 'Psicología'].includes(especialidad)) return 45;
  return 25;
}

export function generarFechaAleatoria() {
  const fechaMin = new Date('2023-01-01');
  const fechaMax = new Date('2025-05-01');
  const randomTime = fechaMin.getTime() + Math.random() * (fechaMax.getTime() - fechaMin.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
}

/**
 * Genera un porcentaje de adherencia determinístico a partir del ID del
 * paciente (misma entrada siempre produce la misma salida). Evita usar
 * Math.random() en cada render, lo que causaba valores inconsistentes.
 */
export function getAdherencia(id) {
  const seed = Number(id) || 0;
  const pseudoRandom = Math.abs(Math.sin(seed * 999)) * 10000;
  const decimal = pseudoRandom - Math.floor(pseudoRandom);
  return Math.floor(decimal * 30) + 70; // Rango 70-100
}

/**
 * Genera las iniciales (máx. 2 letras) a partir de un nombre completo.
 * Ej: "Laura Martínez" -> "LM"
 */
export function getInitials(nombreCompleto) {
  if (!nombreCompleto || typeof nombreCompleto !== 'string') return '';
  return nombreCompleto
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * Genera el siguiente ID entero disponible en un array de registros.
 */
export function getNextId(lista) {
  if (!Array.isArray(lista) || lista.length === 0) return 1;
  return Math.max(...lista.map(item => item.id)) + 1;
}

/* ==========================================================================
   FORMATO
   ========================================================================== */

export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function getDayOfMonth(dateString) {
  const date = new Date(dateString);
  return date.getDate();
}

export function getMonthName(dateString) {
  const date = new Date(dateString);
  const monthNames = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  return monthNames[date.getMonth()];
}
