// 12: radio, em dupla (V1 e V2)
// as duas placas precisam do MESMO grupo; cada dupla escolhe um numero diferente (0 a 255)
radio.setGroup(7)
input.onButtonPressed(Button.A, function () {
    radio.sendString("oi")
})
input.onButtonPressed(Button.B, function () {
    radio.sendString("tchau")
})
radio.onReceivedString(function (recebido) {
    basic.showString(recebido)
})
