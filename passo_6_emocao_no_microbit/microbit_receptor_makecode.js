// Receptor do passo 6, versao MakeCode (makecode.microbit.org). Funciona no V1 e no V2.
// Como usar: Novo projeto > aba JavaScript > apagar tudo > colar este arquivo > voltar para Blocos.
// Nao precisa de extensao: a serial vem no nucleo (Avancado > Serial).
// Mesmo protocolo da versao MicroPython (microbit_receptor.py): uma palavra por linha, 115200.

serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
basic.showIcon(IconNames.Asleep) // esperando a primeira mensagem

serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let texto = serial.readLine().trim() // le ate o \n; trim tira o \r se a pagina mandar \r\n
    if (texto == "feliz") {
        basic.showIcon(IconNames.Happy)
    } else if (texto == "triste") {
        basic.showIcon(IconNames.Sad)
    } else if (texto == "raiva") {
        basic.showIcon(IconNames.Angry)
    } else if (texto == "surpresa") {
        basic.showIcon(IconNames.Surprised)
    } else if (texto == "medo") {
        basic.showIcon(IconNames.Confused)
    } else if (texto == "nojo") {
        basic.showIcon(IconNames.Silly)
    } else if (texto == "neutro") {
        basic.showIcon(IconNames.Meh)
    }
})
