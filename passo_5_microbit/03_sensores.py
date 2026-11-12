# 03: sensores embutidos (funciona no V1 e no V2)
#   sacudir -> dado de 1 a 6 (acelerometro)
#   botao A -> temperatura em graus C
#   botao B -> nivel de luz (0 a 255), medido pela propria matriz de LED
from microbit import *
import random

while True:
    if accelerometer.was_gesture("shake"):
        display.show(str(random.randint(1, 6)))
        sleep(1000)
        display.clear()
    if button_a.was_pressed():
        display.scroll(str(temperature()) + "C")
    if button_b.was_pressed():
        display.scroll(str(display.read_light_level()))
    sleep(50)
