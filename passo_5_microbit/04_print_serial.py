# 04: serial no sentido micro:bit -> PC (funciona no V1 e no V2)
# Tudo que vai no print() sai pelo cabo USB. No python.microbit.org,
# abra "Show serial" para ver as linhas chegando.
# No passo 6 fazemos o caminho contrario: PC -> micro:bit.
from microbit import *

while True:
    x = accelerometer.get_x()  # inclinacao para os lados, de -2048 a 2047 aprox.
    print("inclinacao:", x, "temperatura:", temperature())
    display.show(Image.ARROW_E if x > 300 else Image.ARROW_W if x < -300 else Image.SQUARE_SMALL)
    sleep(500)
