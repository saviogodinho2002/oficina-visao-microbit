# Passo 5 (dia 2): o micro:bit por dentro

Objetivo: entender o que é a placa e testar cada componente com um programa curto, antes de ligar ela ao projeto da webcam no passo 6. Os programas são em **MakeCode** (JavaScript que vira blocos).

## O que é o micro:bit

Um computador de bolso numa placa só (*single board computer*): chips, sensores e saídas soldados juntos. É comum ouvir que o micro:bit "é um microcontrolador", mas a própria Micro:bit Educational Foundation descreve como uma placa que **contém** um microcontrolador e que, com botões e display, fica mais perto de um computador.

- **Chip principal (microcontrolador)**: processador, memória e entradas/saídas num chip só. É ele que roda o seu programa. Diferente do PC, não tem sistema operacional nem roda vários programas: roda **um programa só, para sempre, em laço**, lendo sensores (entradas) e mexendo em LEDs, som e pinos (saídas). É o mesmo modelo do `drawLoop` da página no passo 1.
- **Chip da USB**: um segundo chip, perto do conector, que não liga em nenhum sensor. Roda o DAPLink e cuida de três coisas: a unidade MICROBIT (arrastar o `.hex`), a serial entre PC e chip principal e a gravação pelo navegador. É ele que aparece como **BBC micro:bit CMSIS-DAP** no MakeCode. No passo 6, a palavra da emoção faz o caminho PC → USB → chip da USB → serial → chip principal → LEDs.

| | V1 | V2 |
|---|---|---|
| Chip principal | nRF51822, Cortex-M0, 16 MHz | nRF52833, Cortex-M4, 64 MHz |
| Memória para o programa (flash) | 256 KB | 512 KB |
| Memória de trabalho (RAM) | 16 KB | 128 KB |
| Chip da USB | KL26 | KL27 (V2.0) ou nRF52820/nRF52833 (V2.2x) |

Para comparar: um notebook com 8 GB tem 65.536 vezes a memória de trabalho do V2. A placa compensa fazendo uma coisa só.

Fontes: [What is a micro:bit?](https://support.microbit.org/support/solutions/articles/19000013983-what-is-a-micro-bit-) (Micro:bit Educational Foundation), [Hardware](https://tech.microbit.org/hardware/) e páginas de revisão [1.5](https://tech.microbit.org/hardware/1-5-revision/), [2.0](https://tech.microbit.org/hardware/2-0-revision/), [2.2x](https://tech.microbit.org/hardware/2-2-revision/), [DAPLink e a interface USB](https://tech.microbit.org/software/daplink-interface).

## A placa por fora

| Componente | Onde | V1 | V2 |
|---|---|---|---|
| Matriz de 25 LEDs (também mede luz) | frente | sim | sim |
| Botões A e B | frente | sim | sim |
| Logo dourado sensível ao toque | frente | não | sim |
| Microfone (furinho com LED ao lado do logo) | frente | não | sim |
| Acelerômetro e bússola | atrás | sim | sim |
| Sensor de temperatura (dentro do processador) | atrás | sim | sim |
| Alto-falante | atrás | não | sim |
| Rádio e Bluetooth (antena) | atrás | sim | sim |
| Pinos na borda (P0, P1, P2, 3V, GND e os finos) | embaixo | sim | sim |
| USB (energia, gravação e serial) e conector de bateria | em cima | sim | sim |

## Gravar no MakeCode

1. Ligue o micro:bit com um cabo micro USB **de dados**.
2. Abra <https://makecode.microbit.org> no **Chrome ou Edge** e crie um **Novo projeto**.
3. Vá na aba **JavaScript**, apague o que tiver e cole o programa. Volte para **Blocos** para ver em blocos.
4. Clique nos **"..."** ao lado de **Download** → **Conectar dispositivo** → **BBC micro:bit CMSIS-DAP**. Só precisa na primeira vez.
5. Clique em **Download**: grava direto pela USB.

**Não arraste o `.hex` para a unidade MICROBIT no Mac.** Esse caminho falha de forma aleatória no macOS: a placa cria um `FAIL.TXT` na unidade com `The transfer timed out` ou `Checksum calculation failure`. É um problema conhecido do macOS com a unidade do micro:bit desde o macOS 13 ([DAPLink #982](https://github.com/ARMmbed/DAPLink/issues/982)), não do programa nem da placa. No Windows e no Linux, baixar e arrastar também funciona.

Não precisa de extensão para nenhum teste: tudo vem no núcleo do MakeCode (rádio, música e serial incluídos).

## Tour dos componentes

Um programa por componente, na pasta [makecode/](makecode/). Cole, grave e faça o teste da coluna "na placa".

| Arquivo | Componente | Na placa | Placa |
|---|---|---|---|
| [01_matriz_led.js](makecode/01_matriz_led.js) | matriz de LED | texto, coração e os 25 LEDs acendendo um a um (`led.plot(x, y)`) | V1 e V2 |
| [02_botoes.js](makecode/02_botoes.js) | botões | A soma 1, B zera, A+B mostra um coração | V1 e V2 |
| [03_acelerometro_dado.js](makecode/03_acelerometro_dado.js) | acelerômetro | sacuda: aparece um número de 1 a 6 | V1 e V2 |
| [04_acelerometro_nivel.js](makecode/04_acelerometro_nivel.js) | acelerômetro | nível de bolha: o ponto escorrega para o lado mais baixo | V1 e V2 |
| [05_bussola.js](makecode/05_bussola.js) | bússola | mostra N, L, S ou O; na primeira vez pede calibração (incline até acender tudo) | V1 e V2 |
| [06_temperatura.js](makecode/06_temperatura.js) | temperatura | botão A mostra a temperatura em graus | V1 e V2 |
| [07_luz.js](makecode/07_luz.js) | luz | barra de luz; tampe a placa com a mão e veja baixar | V1 e V2 |
| [08_pinos.js](makecode/08_pinos.js) | pinos de toque | segure o GND e toque em P0, P1 ou P2 | V1 e V2 |
| [09_logo_toque.js](makecode/09_logo_toque.js) | logo de toque | encoste no logo: coração; solte: apaga | só V2 |
| [10_microfone.js](makecode/10_microfone.js) | microfone | barra de som; bata palma: carinha surpresa | só V2 |
| [11_som.js](makecode/11_som.js) | som | A toca uma escala, B um efeito de risada | V2 (no V1, só a escala, pelo pino 0 com fone ou buzzer) |
| [12_radio.js](makecode/12_radio.js) | rádio | em dupla, mesmo grupo: A manda "oi", B manda "tchau", a outra placa mostra | V1 e V2 |
| [13_serial_grafico.js](makecode/13_serial_grafico.js) | serial | "Mostrar console do dispositivo" no MakeCode: gráfico ao vivo da inclinação | V1 e V2 |

Pontos para comentar:

- **01**: a matriz é uma grade de coordenadas, como os pixels de uma imagem no dia 1. `x` é a coluna e `y` a linha, de 0 a 4.
- **02**: os `input.onButtonPressed` são eventos: a placa chama a função quando o botão é apertado, como um `onclick` na página.
- **04**: `Math.map` converte a faixa da aceleração (-1023 a 1023) para a faixa da tela (0 a 4). É a mesma ideia de normalizar uma medida, como a razão do olho no passo 3.
- **07**: a luz é medida pela própria matriz de LED, sem sensor separado.
- **08**: o corpo humano conduz eletricidade e fecha o circuito entre o pino e o GND.
- **12**: o número do grupo é como um canal: só placas no mesmo grupo se ouvem. Cada dupla escolhe um número diferente (0 a 255) para não misturar com as vizinhas.
- **13**: é a serial no sentido micro:bit para PC. No passo 6 fazemos o contrário: o PC manda a emoção para a placa.

## Desafio

Junte dois componentes num programa só. Exemplos: sacudir sorteia uma carinha e toca um som; o botão A manda pelo rádio a temperatura da sua placa para a da dupla.

## Carinhas prontas usadas no passo 6

`IconNames.Happy`, `Sad`, `Angry`, `Surprised`, `Confused`, `Silly`, `Meh`, `Asleep` (no MakeCode, bloco **mostrar ícone**). Teste trocando o `IconNames.Heart` do 01 por cada uma.

## Alternativa em MicroPython

Para quem usar o <https://python.microbit.org> em vez do MakeCode, os programas desta pasta em Python cobrem parte do tour:

| Arquivo | Mostra |
|---|---|
| [01_ola.py](01_ola.py) | texto rolando e imagens prontas |
| [02_botoes.py](02_botoes.py) | carinha feliz no A, triste no B, coração nos dois |
| [03_sensores.py](03_sensores.py) | sacudir vira dado, A mostra temperatura, B mostra luz |
| [04_print_serial.py](04_print_serial.py) | manda dados para o PC pelo USB (**Show serial** no editor) |
| [05_som_v2.py](05_som_v2.py) | **só V2**: sons, toque no logo, palma |

No python.microbit.org, grave com **Send to micro:bit**. Documentação da API: <https://microbit-micropython.readthedocs.io/en/v2-docs/>.
