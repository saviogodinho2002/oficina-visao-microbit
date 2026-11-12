# 02: botoes A e B (funciona no V1 e no V2)
from microbit import *

while True:  # o programa do micro:bit roda para sempre, igual a um game loop
    if button_a.is_pressed() and button_b.is_pressed():
        display.show(Image.HEART)
    elif button_a.is_pressed():
        display.show(Image.HAPPY)
    elif button_b.is_pressed():
        display.show(Image.SAD)
    else:
        display.clear()
    sleep(50)
