# Receptor do passo 6: le a emocao que o navegador manda pela serial USB
# e mostra a carinha correspondente na matriz de LED. Funciona no V1 e no V2.
# Trecho gerado com LLM na oficina; esta e a versao de referencia.
from microbit import *

IMAGENS = {
    "feliz": Image.HAPPY,
    "triste": Image.SAD,
    "raiva": Image.ANGRY,
    "surpresa": Image.SURPRISED,
    "medo": Image.CONFUSED,
    "nojo": Image.SILLY,
    "neutro": Image.MEH,
}

uart.init(baudrate=115200)  # mesma velocidade do navegador (baudRate: 115200)
display.show(Image.ASLEEP)  # esperando a primeira mensagem
buffer = b""

while True:
    if uart.any():
        dados = uart.read()
        if dados:
            buffer += dados
        fim = buffer.find(b"\n")
        while fim != -1:  # pode ter chegado mais de uma linha de uma vez
            linha = buffer[:fim]
            buffer = buffer[fim + 1:]
            texto = str(linha, "utf-8").strip()
            if texto in IMAGENS:
                display.show(IMAGENS[texto])
            fim = buffer.find(b"\n")
    sleep(10)
