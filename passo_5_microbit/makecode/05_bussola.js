// 05: bussola (V1 e V2)
// na primeira vez a placa pede calibracao: incline ate acender todos os LEDs
basic.forever(function () {
    let direcao = input.compassHeading() // 0 a 359 graus, 0 = norte
    if (direcao < 45 || direcao >= 315) {
        basic.showString("N")
    } else if (direcao < 135) {
        basic.showString("L")
    } else if (direcao < 225) {
        basic.showString("S")
    } else {
        basic.showString("O")
    }
})
