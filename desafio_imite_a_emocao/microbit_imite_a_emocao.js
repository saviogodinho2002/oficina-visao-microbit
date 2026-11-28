// Desafio "Imite a emocao", lado do micro:bit (V1 e V2). MakeCode: cole na aba JavaScript e volte para Blocos.
// Sacudir sorteia a emocao-alvo e avisa a pagina ("alvo:feliz"). A pagina conta 3 segundos e responde
// "acertou" ou "errou". As palavras de emocao que a pagina continua mandando sao ignoradas aqui.
let alvo = ""
let pontos = 0
let sorteio = 0
let resposta = ""
serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
basic.showIcon(IconNames.Asleep)
input.onGesture(Gesture.Shake, function () {
    sorteio = randint(1, 4)
    if (sorteio == 1) {
        alvo = "feliz"
        basic.showIcon(IconNames.Happy)
    } else if (sorteio == 2) {
        alvo = "triste"
        basic.showIcon(IconNames.Sad)
    } else if (sorteio == 3) {
        alvo = "surpresa"
        basic.showIcon(IconNames.Surprised)
    } else {
        alvo = "raiva"
        basic.showIcon(IconNames.Angry)
    }
    serial.writeLine("alvo:" + alvo)
})
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    resposta = serial.readLine()
    if (resposta == "acertou") {
        pontos += 1
        basic.showIcon(IconNames.Yes)
    } else if (resposta == "errou") {
        basic.showIcon(IconNames.No)
    }
})
input.onButtonPressed(Button.A, function () {
    basic.showNumber(pontos)
})
