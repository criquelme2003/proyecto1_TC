# Manual de Usuario - Analizador Sintáctico LL(1)

## Inicio Rápido

### Acceso a la aplicación

1. Abre una terminal en el directorio del proyecto
2. Ejecuta: `npm run dev`
3. Se abrirá automáticamente en `http://localhost:5173`

## Interfaz Principal

La aplicación tiene dos paneles principales:

- **Panel Izquierdo**: Editor de código Java
- **Panel Derecho**: Cinco pestañas con información del análisis

## Cómo Usar

### 1. Escribe tu código

En el editor izquierdo, ingresa asignaciones aritméticas con este formato:

```java
variable = expresión ;
```

Ejemplos válidos:

```java
x = 5 ;
resultado = a + b * c ;
y = (a + b) * (c - d) ;
promedio = (x + y) / 2 ;
```

### 2. Presiona "Analizar"

Haz clic en el botón de análisis. La aplicación:

- Tokeniza el código
- Identifica asignaciones
- Ejecuta el análisis sintáctico LL(1)
- Genera una traza paso a paso

### 3. Revisa los resultados

Las pestañas muestran:

- **Análisis**: Resultado de cada asignación y su traza
- **Gramática**: Reglas y no terminales utilizados
- **FIRST/FOLLOW**: Conjuntos para cada no terminal
- **Tabla Sintáctica**: Matriz de decisión LL(1)

## Interpretación de Resultados

### Análisis Exitoso

- Estado: ✓ Aceptada
- La expresión respeta la gramática LL(1)

### Análisis Fallido

- Estado: ✗ Rechazada
- Mensaje: Especifica qué está mal
- Posición: Marca en rojo la ubicación del error

### Errores Comunes

| Error                     | Causa                            | Solución                           |
| ------------------------- | -------------------------------- | ---------------------------------- |
| Falta `;`                 | Falta punto y coma               | Añade `;` al final                 |
| Paréntesis desbalanceados | `(` sin `)` o viceversa          | Verifica que cierren correctamente |
| Operador inválido         | Símbolo no reconocido            | Solo `+`, `-`, `*`, `/`, `%`       |
| No es asignación          | No sigue el patrón `id = expr ;` | Ajusta el formato                  |

## Traza de Análisis

Cada paso muestra:

- **Pila**: Símbolos a procesar (derecha = tope)
- **Entrada**: Tokens restantes
- **Producción**: Regla aplicada

Ejemplo:

```
Pila: S Asig E T F    Entrada: id = 5 ;    Acción: -
Pila: Asig E T F      Entrada: = 5 ;       Acción: Comparar id
```

## Tokens Reconocidos

- **id**: Identificadores (letras, dígitos, guion bajo)
- **num**: Números enteros
- **Operadores**: `+`, `-`, `*`, `/`, `%`
- **Delimitadores**: `(`, `)`, `;`, `=`

## Limitaciones

- Solo acepta asignaciones aritméticas
- No procesa números decimales
- No soporta comentarios
- No valida semántica (solo sintaxis)

## Solución de Problemas

| Problema                         | Solución                                 |
| -------------------------------- | ---------------------------------------- |
| "No se encontraron asignaciones" | Verifica el formato `id = expr ;`        |
| Código marcado en rojo           | Hay error sintáctico en esa posición     |
| Tabla muy pequeña                | Amplía el zoom del navegador (Ctrl+Plus) |
| Página no responde               | Recarga (F5)                             |

## Ejemplos

### Ejemplo 1: Simple

```java
x = 5 ;
```

✓ Aceptada

### Ejemplo 2: Con precedencia

```java
resultado = a + b * c - d / e ;
```

✓ Aceptada (multiplicación y división primero)

### Ejemplo 3: Paréntesis

```java
y = (a + b) * (c - d) ;
```

✓ Aceptada (paréntesis alteran precedencia)

### Ejemplo 4: Error - Falta punto y coma

```java
x = a + b
```

✗ Rechazada (falta `;`)

### Ejemplo 5: Error - Paréntesis desbalanceados

```java
x = (a + b ;
```

✗ Rechazada (`)` faltante)

## Gramática Utilizada

La gramática LL(1) sin recursión por la izquierda:

```
S    → Asig
Asig → id = E ;
E    → T E'
E'   → + T E' | - T E' | ε
T    → F T'
T'   → * F T' | / F T' | % F T' | ε
F    → ( E ) | id | num
```

**Precedencia**: `*`, `/`, `%` antes que `+`, `-`

**Asociatividad**: Izquierda
