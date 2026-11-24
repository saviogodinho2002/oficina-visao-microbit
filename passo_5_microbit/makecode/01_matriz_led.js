// 01: matriz de LED, 25 LEDs em 5 colunas x 5 linhas (V1 e V2)
basic.showString("Oi!")          // texto rolando
basic.showIcon(IconNames.Heart)  // desenho pronto
basic.pause(1000)                // espera 1 segundo (em milissegundos)
basic.clearScreen()
// acende um LED por vez: x e a coluna (0 a 4), y e a linha (0 a 4)
for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
        led.plot(x, y)
        basic.pause(100)
    }
}
