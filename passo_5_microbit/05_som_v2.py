# 05: som, microfone e logo de toque (SO micro:bit V2)
#   botao A -> som feliz | botao B -> som triste
#   tocar no logo dourado -> coracao
#   bater palma perto -> carinha surpresa
from microbit import *
import audio

while True:
    if button_a.was_pressed():
        audio.play(Sound.HAPPY)
    if button_b.was_pressed():
        audio.play(Sound.SAD)
    if pin_logo.is_touched():
        display.show(Image.HEART)
    elif microphone.sound_level() > 150:
        display.show(Image.SURPRISED)
        sleep(500)
    else:
        display.clear()
    sleep(50)
