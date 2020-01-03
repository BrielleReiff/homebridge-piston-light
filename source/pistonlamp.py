from __future__ import division
from neopixel import *
from enum import Enum

# LED strip configuration
LED_COUNT = 72  # Number of LED pixels
LED_PIN = 18  # GPIO pin connected to the pixels (must support PWM!)
LED_FREQ_HZ = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA = 5  # DMA channel to use for generating signal
LED_BRIGHTNESS = 255  # Set to 0 for darkest and 255 for brightest
LED_INVERT = False  # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL = 0
LED_STRIP = ws.SK6812_STRIP_RGBW


class State(Enum):
    ALL_OFF = 0
    W_ON = 1


class PistonLamp:
    def __init__(self):
        self.strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ,
                                       LED_DMA, LED_INVERT, LED_BRIGHTNESS,
                                       LED_CHANNEL, LED_STRIP)
        self.strip.begin()
        self.state = State.ALL_OFF
        self.buffer = []
        self.init_buffer()
        self.write_buffer()
        self.r = 0
        self.g = 0
        self.b = 0
        self.w = 0
        self.update_state(State.W_ON, None, None, None, 100)

    def init_buffer(self):
        for i in range (0, LED_COUNT):
            self.buffer.append([0,0,0,0])

    def get_state(self):
        return self.state

    def update_state(self, state, r=None, g=None, b=None, w=None):
        self.state = state
        if w: self.w = w
        if self.state == State.ALL_OFF:
            for i in range(0, LED_COUNT):
                self.buffer[i][0] = 0
                self.buffer[i][1] = 0
                self.buffer[i][2] = 0
                self.buffer[i][3] = 0
        elif self.state == State.W_ON:
            for i in range(0, LED_COUNT):
                self.buffer[i][0] = 0
                self.buffer[i][1] = 0
                self.buffer[i][2] = 0
                self.buffer[i][3] = int(255*(self.w/100))
        self.write_buffer()

    def get_brightness(self):
        return max([self.r, self.g, self.b, self.w])

    def update_brightness(self, brightness):
        """Assumes just white brightness."""
        self.update_state(self.state, None, None, None, brightness)

    def write_buffer(self):
        for i in range(0, LED_COUNT):
            self.strip.setPixelColor(i, Color(self.buffer[i][1],
                                              self.buffer[i][0],
                                              self.buffer[i][2],
                                              self.buffer[i][3]))
        self.strip.show()
