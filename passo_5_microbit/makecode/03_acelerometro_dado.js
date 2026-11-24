// 03: acelerometro, sacudir vira um dado (V1 e V2)
input.onGesture(Gesture.Shake, function () {
    basic.showNumber(randint(1, 6)) // sorteia de 1 a 6
})
