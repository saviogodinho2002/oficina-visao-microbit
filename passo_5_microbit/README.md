# Passo 5: conhecendo o micro:bit

Objetivo: apresentar a placa e programar ela em Python com programas curtos, antes de ligar ela ao projeto da webcam no passo 6.

## O que é

O BBC micro:bit é uma placa pequena feita para ensino, com um microcontrolador e vários sensores já soldados. Programa-se pelo navegador, sem instalar nada.

| Recurso | V1 | V2 |
|---|---|---|
| Matriz de LED 5x5 (também mede luz ambiente) | sim | sim |
| Botões A e B | sim | sim |
| Acelerômetro (inclinação, gestos como sacudir) | sim | sim |
| Bússola, sensor de temperatura | sim | sim |
| Rádio e Bluetooth | sim | sim |
| Pinos de entrada e saída na borda | sim | sim |
| USB (energia, gravação e serial) | sim | sim |
| Alto-falante e microfone | não | sim |
| Logo dourado sensível ao toque | não | sim |

Como diferenciar: o V2 tem um microfone (furinho com LED ao lado do logo) na frente e um alto-falante redondo atrás.

## Linguagem e ferramenta

- **MicroPython**: Python reduzido para microcontroladores. Tudo da placa vem do módulo `microbit` (`from microbit import *`).
- **Editor**: <https://python.microbit.org> (oficial da Micro:bit Educational Foundation). Roda no navegador.
- **Documentação da API**: <https://microbit-micropython.readthedocs.io/en/v2-docs/>

## Gravar um programa na placa

1. Ligue o micro:bit no PC com um cabo micro USB **de dados**.
2. Abra <https://python.microbit.org> no **Chrome ou Edge**.
3. Cole o programa no editor.
4. Clique em **Send to micro:bit** e escolha o dispositivo na lista do navegador (conexão WebUSB).

Se o botão não conectar (navegador sem WebUSB ou firmware antigo da placa), use o caminho que funciona em qualquer sistema: clique em **Save** para baixar o arquivo `.hex` e arraste ele para a unidade **MICROBIT** que aparece como um pendrive. A placa grava e reinicia sozinha.

Para ver o que o programa imprime com `print()`, use **Show serial** no editor.

## Programas

Todos funcionam no V1 e no V2, exceto o 05.

| Arquivo | Mostra | Funções da API |
|---|---|---|
| [01_ola.py](01_ola.py) | texto rolando e imagens prontas | `display.scroll`, `display.show`, `Image.HEART`, `sleep` |
| [02_botoes.py](02_botoes.py) | carinha feliz no A, triste no B, coração nos dois | `button_a.is_pressed()`, laço `while True` |
| [03_sensores.py](03_sensores.py) | sacudir vira dado, A mostra temperatura, B mostra luz | `accelerometer.was_gesture("shake")`, `temperature()`, `display.read_light_level()` |
| [04_print_serial.py](04_print_serial.py) | manda dados para o PC pelo USB | `print()`, `accelerometer.get_x()` |
| [05_som_v2.py](05_som_v2.py) | **só V2**: sons, toque no logo, palma | `audio.play(Sound.HAPPY)`, `pin_logo.is_touched()`, `microphone.sound_level()` |

Pontos para comentar em cada um:

- **01**: `Image.HAPPY`, `Image.SAD` e outras são imagens 5x5 que já vêm na biblioteca. No passo 6 usamos elas para desenhar a emoção, sem desenhar LED por LED.
- **02**: todo programa de micro:bit é um laço infinito, como o `drawLoop` da página no passo 1. O `sleep(50)` evita que o laço rode mais rápido que o necessário.
- **03**: `was_pressed()` lembra se o botão foi apertado desde a última consulta (não perde o clique enquanto a tela rola texto), diferente de `is_pressed()`, que só olha o estado atual.
- **04**: introduz a **serial**. Cada `print()` vira uma linha de texto que sai pelo cabo USB e aparece em **Show serial**. É o caminho micro:bit para PC. No passo 6 fazemos o caminho contrário, PC para micro:bit.
- **05**: em um V1, ele dá erro porque o V1 não tem alto-falante nem microfone.

## Imagens prontas que vamos usar no passo 6

`Image.HAPPY`, `Image.SAD`, `Image.ANGRY`, `Image.SURPRISED`, `Image.CONFUSED`, `Image.SILLY`, `Image.MEH`, `Image.ASLEEP`. A lista completa está em <https://microbit-micropython.readthedocs.io/en/v2-docs/image.html>.

Experimente no editor trocar `Image.HEART` do 01 por cada uma delas para ver o desenho.
