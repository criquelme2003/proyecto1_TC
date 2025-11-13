public class PruebasMix1 {

    // ==========================
    // CASOS VÁLIDOS
    // ==========================

    int a = 10;                     // VÁLIDO (asignación simple con num)
    int b = a + 5;                  // VÁLIDO (id + num)
    int c = (a + b) * 2;            // VÁLIDO (paréntesis + multiplicación)
    int d = a * b % c;              // VÁLIDO (uso de %)
    int e = (a + b * (c - 1));      // VÁLIDO (paréntesis anidados)

    int resultado1 = a + b * c;     // VÁLIDO (precedencia implícita)
    int resultado2 = (a + b) * (c - 2); // VÁLIDO

    // ==========================
    // CASOS INVÁLIDOS
    // ==========================

    int sinFin = a + b              // INVÁLIDO -> Falta ';'

    int malParentesis1 = (a + b * c;    // INVÁLIDO -> Paréntesis que no se cierra

    int malParentesis2 = a + (b * c));  // INVÁLIDO -> Paréntesis de más

    int dobleOperador = a ++ b;     // INVÁLIDO -> "++" no está en la gramática, ni "a ++ b" es forma E

    int operadorInicio = * a + b;   // INVÁLIDO -> La gramática no acepta comenzar expresión con '*'

    int vacia = ;                   // INVÁLIDO -> No hay expresión E antes de ';'



    // Línea solo expresión:
    a + b * c;                      // INVÁLIDO segun tu gramática -> falta "id =" al inicio

}
