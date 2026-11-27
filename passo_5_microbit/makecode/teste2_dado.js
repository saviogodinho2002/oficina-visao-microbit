// Teste 2: dado, com variavel e evento de sensor (V1 e V2)
// Sacudir sorteia de 1 a 6 e guarda em numero. O botao A mostra de novo o ultimo numero.
let numero = 0
input.onGesture(Gesture.Shake, function () {
    numero = randint(1, 6)
    basic.showNumber(numero)
})
input.onButtonPressed(Button.A, function () {
    basic.showNumber(numero)
})
