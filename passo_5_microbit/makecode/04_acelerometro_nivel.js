// 04: acelerometro, nivel de bolha (V1 e V2)
// a aceleracao vai de -1023 a 1023 em cada eixo; Math.map converte para a coluna/linha 0 a 4
basic.forever(function () {
    let x = Math.round(Math.constrain(Math.map(input.acceleration(Dimension.X), -1023, 1023, 0, 4), 0, 4))
    let y = Math.round(Math.constrain(Math.map(input.acceleration(Dimension.Y), -1023, 1023, 0, 4), 0, 4))
    basic.clearScreen()
    led.plot(x, y) // o ponto escorrega para o lado mais baixo
    basic.pause(50)
})
