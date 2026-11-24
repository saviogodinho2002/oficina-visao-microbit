// 07: luz ambiente, medida pela propria matriz de LED (V1 e V2)
// tampe a placa com a mao e veja a barra baixar
basic.forever(function () {
    led.plotBarGraph(input.lightLevel(), 255) // 0 = escuro, 255 = muita luz
})
