// 08: pinos de toque P0, P1 e P2 (V1 e V2)
// segure o GND com uma mao e toque no pino com a outra: o corpo fecha o circuito
input.onPinPressed(TouchPin.P0, function () {
    basic.showIcon(IconNames.Yes)
})
input.onPinPressed(TouchPin.P1, function () {
    basic.showIcon(IconNames.No)
})
input.onPinPressed(TouchPin.P2, function () {
    basic.showIcon(IconNames.Heart)
})
