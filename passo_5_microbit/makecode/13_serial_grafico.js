// 13: serial, do micro:bit para o PC (V1 e V2)
// com a placa conectada no MakeCode, clique em "Mostrar console do dispositivo": aparece um grafico ao vivo
basic.forever(function () {
    serial.writeValue("x", input.acceleration(Dimension.X))
    basic.pause(100)
})
