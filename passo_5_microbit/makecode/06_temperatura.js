// 06: temperatura, medida pelo sensor do processador (V1 e V2)
input.onButtonPressed(Button.A, function () {
    basic.showNumber(input.temperature())
    basic.showString("C")
})
