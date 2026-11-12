# 01: matriz de LED (funciona no V1 e no V2)
from microbit import *

display.scroll("Ola, oficina!")  # texto rolando na matriz 5x5
display.show(Image.HEART)        # imagem pronta da biblioteca
sleep(1000)                      # espera 1 segundo (em milissegundos)
display.show(Image.HAPPY)
