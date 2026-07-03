# 📋MediCita

### Contexto

**MediCita** es una startup healthtech colombiana, el proyecto tiene como objetivo crear un sistema usando la IA como asistente de diseño, generación de datos y código. El objetivo del taller es construir un prototipo funcional completo

## 💻 Prompts Utilizados

**IA'S utilizadas:** 

1. **Chat gpt:** Para crear prompts que sean claras y bien definidas.
2. **Claude Code:** Para generar el código y la lógica del sistema.

### Prompts
Antes de crear al primer prompt se pidio a **Chat GPT** que generará un codigo, con el conxtexto de lo que se necesitaba para que se creara la estructura de los archivos y que todo tenga sentido al momento de unir todo, indicando la fases que se necesitaban para la creación del proyecto.

[Primer Prompt](https://docs.google.com/document/d/1FRoVEj7oormxx5N30JKhVOcv4Qec2mDE2N7YWmn8n28/edit?usp=sharing)

---

## 🔍 Validación de Datos

### Auditoría de Calidad del Dataset de Pacientes

Se realizó una auditoría de calidad sobre el dataset de pacientes generado en la FASE 3, identificando y corrigiendo errores para mejorar la coherencia y realismo de los datos.

### Tabla de Errores Encontrados y Correcciones

| Error encontrado | Registros afectados | Causa probable | Corrección aplicada |
|-----------------|-------------------|----------------|---------------------|
| Fechas fuera de rango | IDs 7, 16, 21, 26 | Generación automática sin validación de límites | Cambiadas de 2024-06-XX a 2024-05-XX para cumplir rango 2023-01-01 a 2025-05-01 |
| Duplicación de registros | IDs 1-5 | Registros manuales duplicados en array final | Mantenida solo una copia en `pacientesDataset`, eliminada duplicación en `pacientesEjemplo` |
| Distribución uniforme de ciudades | Todos (30 registros) | Generación equitativa sin ponderación real | Mejorada distribución: Bogotá (40%), Medellín (30%), Cali (15%), Barranquilla (10%), Cartagena (5%) |
| Emails genéricos repetitivos | IDs 10, 16, 21, 26 | Uso excesivo de dominios genéricos | Reemplazados con dominios corporativos colombianos reales (bancolombia.com.co, ecopetrol.com.co, unal.edu.co, aviatur.com.co) |

### Estado Actual del Dataset

- **Total registros**: 30 pacientes
- **IDs**: Únicos y consecutivos (1-30) ✅
- **Emails**: Formato válido y únicos ✅
- **Fechas**: Todas en rango válido (2023-01-01 a 2025-05-01) ✅
- **Edades**: Rango válido (18-90 años) ✅
- **Montos USD**: Coherentes con especialidad ✅
- **Categorías**: Todas en listas válidas ✅
- **Distribución**: Mejorada para mayor realismo ✅

### Archivos de Validación

- `data/patients-dataset.js` - Dataset de pacientes con validación interna
- `assets/js/validator.js` - Funciones de validación programática
- `assets/js/mock-data.js` - Integración del dataset en el dashboard

---

## 🏗️ Auditoría de Arquitectura y Refactorización

Se realizó una auditoría completa del proyecto para unificar la fuente de datos entre el registro, el dashboard y la gestión de pacientes, sin modificar el diseño visual existente.

### Problemas Encontrados y Corregidos

| Problema | Causa | Corrección |
|---|---|---|
| No existía autenticación ni sesión | El formulario de registro solo validaba, no persistía datos | Se creó `auth.js` con `registerOrLogin()`, `logout()`, `getCurrentPatient()` |
| Dashboard mostraba siempre el mismo paciente estático | `mock-data.js` exportaba un objeto fijo (`patientData`) sin relación con ningún login | `dashboard.js` ahora obtiene el paciente autenticado vía `auth.js` |
| Tres fuentes de datos desconectadas (mock-data, dataset, localStorage) | Cada módulo manejaba su propia copia de los pacientes | Se creó `storage.js` como única fuente de verdad (`getPatients`, `savePatients`) usada por dashboard y gestión de pacientes |
| Funciones duplicadas (`isValidEmail`, `isValidPhone`, `getMontoPorEspecialidad`) en 4 archivos | Falta de un módulo de utilidades compartido | Se creó `utils.js` centralizando validaciones, formato y reglas de negocio |
| Adherencia del paciente cambiaba en cada render (`Math.random()`) | Valor no persistente, se recalculaba en cada filtro/búsqueda | `getAdherencia(id)` genera un valor determinístico estable por paciente |
| Bug al editar paciente: `montoUSD` no se recalculaba al cambiar de especialidad | El objeto actualizado omitía el campo `montoUSD` | Se agregó `montoUSD` recalculado en la actualización del registro |
| Dashboard sin datos clínicos por paciente (citas, historial, pagos) | Esos datos solo existían para el paciente demo hardcodeado | Se creó `clinical-data.js`: conserva los datos originales para el paciente demo y genera datos mínimos coherentes para el resto |

### Nuevos Módulos JavaScript

| Archivo | Responsabilidad |
|---|---|
| `assets/js/utils.js` | Validaciones, formateo de moneda/fecha y reglas de negocio compartidas |
| `assets/js/storage.js` | Única fuente de verdad para localStorage (pacientes, sesión, datos clínicos) |
| `assets/js/auth.js` | Registro, inicio de sesión, cierre de sesión y paciente autenticado |
| `assets/js/clinical-data.js` | Citas, historial médico, pagos y estadísticas por paciente |

### Flujo Actualizado

1. **Registro/Login** (landing page): el formulario busca el correo en el dataset; si existe, inicia sesión con ese registro; si no, crea un paciente nuevo. En ambos casos redirige a `pages/dashboard.html`.
2. **Dashboard**: carga al paciente autenticado desde `auth.js` y sus datos clínicos desde `clinical-data.js`. Los cambios de perfil se guardan en `storage.js`.
3. **Gestión de pacientes**: usa el mismo `storage.js`, por lo que cualquier edición se refleja también si ese paciente inicia sesión en el dashboard.
4. **Cerrar sesión**: limpia la sesión y vuelve a la landing page.
