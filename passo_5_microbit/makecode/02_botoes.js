// 02: botoes A e B (V1 e V2)
// A soma 1 e mostra o total, B zera, A e B juntos mostram um coracao
let cliques = 0
input.onButtonPressed(Button.A, function () {
    cliques += 1
    basic.showNumber(cliques)
})
input.onButtonPressed(Button.B, function () {
    cliques = 0
    basic.showNumber(cliques)
})
input.onButtonPressed(Button.AB, function () {
    basic.showIcon(IconNames.Heart)
})
