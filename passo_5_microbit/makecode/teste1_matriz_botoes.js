// Teste 1: matriz de LED e botoes (V1 e V2)
// A mostra feliz, B mostra triste, A e B juntos apagam. As carinhas sao as mesmas do passo 6.
basic.showIcon(IconNames.Asleep)
input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.Happy)
})
input.onButtonPressed(Button.B, function () {
    basic.showIcon(IconNames.Sad)
})
input.onButtonPressed(Button.AB, function () {
    basic.clearScreen()
})
