public class PruebasMix2 {

    // ==========================
    // CASOS VÁLIDOS
    // ==========================

    int num1 = 100;                         // VÁLIDO
    int num2 = 25;                          // VÁLIDO

    int suma = num1 + num2;                 // VÁLIDO
    int resta = num1 - num2;                // VÁLIDO
    int mezcla = num1 + num2 * (num1 - 3);  // VÁLIDO

    int complejo1 = (num1 % 3) * (num2 / 5); // VÁLIDO
    int complejo2 = ((num1 + num2) * (num1 - num2)); // VÁLIDO

    int soloNum = 5;                        // VÁLIDO
    int conParentesisNum = (5);             // VÁLIDO

    // ==========================
    // CASOS INVÁLIDOS
    // ==========================

    int sinIgual 5 + 3;                     // INVÁLIDO -> Falta '='

    int sinExpresion = ;                    // INVÁLIDO -> Falta E antes de ';'

    int operadorFinal = num1 + ;            // INVÁLIDO -> Operador al final sin operando

    int dosPuntos = num1 =:= num2;          // INVÁLIDO -> Tokens no definidos en la gramática

    int mezclaLoca = (num1 + ) num2;        // INVÁLIDO -> Paréntesis mal ubicados

    num1 = (num2 * (3 + 4);                 // INVÁLIDO -> Falta paréntesis de cierre y ';'

    = num1 + num2;                          // INVÁLIDO -> No empieza con id

}
