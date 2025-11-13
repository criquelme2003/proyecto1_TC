public class PruebasAnalizador {

    public static void main(String[] args) {
        // Este main realmente da lo mismo para tu analizador,
        // lo importante son las líneas con expresiones.
        // Tu herramienta debería leer este archivo como texto
        // y analizar las asignaciones que encuentra.
    }

    // ==========================
    // ASIGNACIONES VÁLIDAS
    // ==========================

    int a = 10;
    int b = 20;
    int c = 3;

    // Válida: id = E ;
    int x = a + b * (c - 2);

    // Válida: paréntesis anidados
    int y = (a + b) / (c + 1);

    // Válida: uso de módulo
    int z = a % c;

    // Válida: combinación de todo
    int resultado = (a + b * (c - 1)) / (a % c + 1);

    // Válida: solo numéricos
    int k = (10 + 5) * 3;

    // ==========================
    // ASIGNACIONES INVÁLIDAS (según tu gramática)
    // ==========================

    // 1) Falta punto y coma al final (ERROR)
    int sinPuntoYComa = a + b * c

    // 2) Paréntesis desbalanceados (ERROR)
    int parentesisMal = (a + b * c;

    // 3) Operador doble (ERROR)
    int operadorDoble = a ++ b;

    // 4) Expresión sola (sin asignación) (ERROR según tu gramática)
    a + b * c;

    // 5) Asignación sin expresión a la derecha (ERROR)
    int vacia = ;

    // 6) Solo id sin igual (ERROR)
    sinIgual;

}
