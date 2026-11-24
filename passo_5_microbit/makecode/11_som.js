// 11: som. No V2 sai pelo alto-falante da placa; no V1 a melodia sai pelo pino 0
// (precisa de fone ou buzzer entre P0 e GND) e o efeito do botao B nao toca.
input.onButtonPressed(Button.A, function () {
    music.play(music.stringPlayable("C D E F G A B C5 ", 120), music.PlaybackMode.UntilDone)
})
input.onButtonPressed(Button.B, function () {
    music.play(music.builtinPlayableSoundEffect(soundExpression.giggle), music.PlaybackMode.UntilDone)
})
