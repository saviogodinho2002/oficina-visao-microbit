// 10: microfone, so no V2
// bata palma: aparece a carinha surpresa; fale e veja a barra subir
input.onSound(DetectedSound.Loud, function () {
    basic.showIcon(IconNames.Surprised)
    basic.pause(500)
})
basic.forever(function () {
    led.plotBarGraph(input.soundLevel(), 255)
})
