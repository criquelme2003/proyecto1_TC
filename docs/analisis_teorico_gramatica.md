# Análisis teórico de la gramática LL(1) para expresiones aritméticas tipo Java

## 1. Descripción del lenguaje considerado
El lenguaje modela asignaciones simples al estilo Java cuyo lado derecho está compuesto por expresiones aritméticas con operadores binarios `+`, `-`, `*`, `/` y `%`, paréntesis para agrupar, identificadores (`id`) y números (`num`). Cada sentencia termina en `;` y puede escribirse como `id = Expr;`. Ejemplos:

- `x = a + b * (c - d);`
- `resultado = (num1 + num2) / 2;`

El objetivo es capturar la precedencia estándar (multiplicación, división y módulo por encima de suma y resta), asociatividad por la izquierda y el uso de paréntesis sin necesidad de cubrir el resto del lenguaje Java.

## 2. Gramática inicial G(L)
Se propone la gramática clásica para expresiones aritméticas, consciente de que presenta recursión por la izquierda:

- Conjunto de no terminales: `V_N = { S, Asig, E, T, F }`
- Conjunto de terminales: `V_T = { id, num, "+", "-", "*", "/", "%", "=", ";", "(", ")", "$" }`
- Símbolo inicial: `S`
- Producciones `P`:
  1. `S → Asig`
  2. `Asig → id = E ;`
  3. `E → E + T | E - T | T`
  4. `T → T * F | T / F | T % F | F`
  5. `F → ( E ) | id | num`

Las producciones 3 y 4 presentan recursión por la izquierda directa (las cabeceras `E` y `T` aparecen a la izquierda de las alternativas). No existe recursión indirecta, porque ningún no terminal invoca a otro que posteriormente vuelva a producir el primero antes de consumir algo.

## 3. Eliminación de recursión por la izquierda
El procedimiento genérico para eliminar recursión directa en `A → Aα_1 | Aα_2 | β_1 | ... | β_m` (con cada `β_i` sin iniciar en `A`) consiste en introducir un nuevo no terminal `A'`:

```
A → β_1 A' | ... | β_m A'
A' → α_1 A' | ... | α_n A' | ε
```

Aplicando este esquema:

### 3.1. Para `E`
- Separación: `β = { T }`, `α = { + T, - T }`
- Resultado:
  - `E → T E'`
  - `E' → + T E' | - T E' | ε`

### 3.2. Para `T`
- Separación: `β = { F }`, `α = { * F, / F, % F }`
- Resultado:
  - `T → F T'`
  - `T' → * F T' | / F T' | % F T' | ε`

El no terminal `F` no requiere transformaciones porque ya es libre de recursión por la izquierda y empieza con terminales distintos.

## 4. Gramática final apta para LL(1)
Incorporando los no terminales primados se obtiene:

1. `S → Asig`
2. `Asig → id = E ;`
3. `E → T E'`
4. `E' → + T E' | - T E' | ε`
5. `T → F T'`
6. `T' → * F T' | / F T' | % F T' | ε`
7. `F → ( E ) | id | num`

Esta gramática respeta la precedencia y asociatividad esperadas y no presenta recursión por la izquierda. Tampoco introduce ambigüedad porque cada nivel (`E`, `T`, `F`) maneja operadores de una precedencia concreta.

## 5. Cálculo de conjuntos FIRST
El algoritmo usado es el estándar iterativo: se inicializa cada `FIRST(A)` vacío, se agregan terminales que encabezan las producciones, se propagan los `FIRST` de los sucesores no terminales y se repite hasta alcanzar un punto fijo. Se agrega `ε` a `FIRST(A)` si alguna producción de `A` puede derivar la cadena vacía.

- `FIRST(F)` contiene los símbolos que pueden iniciar a `F`: `FIRST(F) = { "(", "id", "num" }`
- `FIRST(T') = { "*", "/", "%", ε }`
- `FIRST(T) = FIRST(F) = { "(", "id", "num" }`
- `FIRST(E') = { "+", "-", ε }`
- `FIRST(E) = FIRST(T) = { "(", "id", "num" }`
- `FIRST(Asig) = { "id" }`
- `FIRST(S) = { "id" }`

## 6. Cálculo de conjuntos FOLLOW (apoyo a la tabla LL(1))
Se aplica el algoritmo clásico: `FOLLOW(S)` incluye `$`; para cada producción `A → αBβ` se agregan los símbolos de `FIRST(β)` (excepto `ε`) a `FOLLOW(B)` y, si `β` ⇒* `ε`, también `FOLLOW(A)`.

Resultados:

- `FOLLOW(S) = { "$" }`
- `FOLLOW(Asig) = { "$" }`
- `FOLLOW(E) = { ")", ";" }`
- `FOLLOW(E') = { ")", ";" }`
- `FOLLOW(T) = { "+", "-", ")", ";" }`
- `FOLLOW(T') = { "+", "-", ")", ";" }`
- `FOLLOW(F) = { "*", "/", "%", "+", "-", ")", ";" }`

Los conjuntos resultan disjuntos en los puntos críticos, lo que evita conflictos de análisis.

## 7. Tabla sintáctica LL(1)
Cada entrada se llena aplicando las reglas:
1. Para `A → α`, incluimos la producción en `M[A, a]` para todo `a ∈ FIRST(α)` y `a ≠ ε`.
2. Si `ε ∈ FIRST(α)`, incluimos la producción en `M[A, b]` para todo `b ∈ FOLLOW(A)`.

Tabla predictiva (`ε` representa la producción vacía):

|      | id | num | + | - | * | / | % | ( | ) | = | ; | $ |
|------|----|-----|---|---|---|---|---|---|---|---|---|---|
| `S`      | `S → Asig` |     |   |   |   |   |   |   |   |   |   |   |
| `Asig`   | `Asig → id = E ;` |     |   |   |   |   |   |   |   |   |   |   |
| `E`      | `E → T E'` | `E → T E'` |   |   |   |   |   | `E → T E'` |   |   |   |   |
| `E'`     |    |     | `E' → + T E'` | `E' → - T E'` |   |   |   |   | `E' → ε` |   | `E' → ε` | `E' → ε` |
| `T`      | `T → F T'` | `T → F T'` |   |   |   |   |   | `T → F T'` |   |   |   |   |
| `T'`     |    |     | `T' → ε` | `T' → ε` | `T' → * F T'` | `T' → / F T'` | `T' → % F T'` |   | `T' → ε` |   | `T' → ε` | `T' → ε` |
| `F`      | `F → id` | `F → num` |   |   |   |   |   | `F → ( E )` |   |   |   |   |

Las celdas en blanco indican error o ausencia de producción válida. La tabla es libre de conflictos: ninguna celda contiene más de una producción.

## 8. Automata léxico (opcional)
Para tokenizar `id`, `num` y operadores basta un AFD sencillo:

- **Identificadores (`id`)**: estado inicial `q0` → letra (`[A-Za-z_]`) conduce a `q_id`; en `q_id`, letras, dígitos o `_` mantienen el estado; cualquier otro carácter acepta el token.
- **Números (`num`)**: `q0` → dígito (`[0-9]`) conduce a `q_num`; dígitos mantienen `q_num`; opcionalmente se podría añadir un estado para decimales si se requiriera.
- **Operadores y separadores**: cada símbolo individual (`+`, `-`, `*`, `/`, `%`, `=`, `(`, `)`, `;`) se reconoce mediante transiciones directas desde `q0` a estados de aceptación específicos.

Estas máquinas pueden combinarse en un AFD con múltiples estados de aceptación etiquetados por tipo de token.

## 9. Conclusiones
La gramática final refleja correctamente la precedencia y asociatividad de las operaciones aritméticas básicas en expresiones de asignación estilo Java. Al eliminar la recursión por la izquierda y diseñar niveles separados (`E`, `T`, `F`), se garantiza la condición LL(1): los conjuntos `FIRST` y `FOLLOW` no se solapan de forma conflictiva y la tabla sintáctica es determinista. El material (gramática, conjuntos y tabla) está listo para ser consumido por un analizador predictivo descendente.
