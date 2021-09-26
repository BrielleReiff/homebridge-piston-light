from flask import Flask, request, jsonify
from pistonlamp import *
import json
import time

name='world'
pl = PistonLamp()
app = Flask(__name__)

@app.route('/api/control/power', methods = ['POST'])
def power_control():
    data = request.json
    print data
    pl.update_state(data['targetState'])
    return "Done"

@app.route('/api/status/power', methods = ['GET'])
def power_status():
    response = {}
    if pl.get_state():
        response["currentState"] = True
    else:
        response["currentState"] = False
    response = jsonify(response)
    return response

@app.route('/api/control/brightness', methods = ['POST'])
def brightness_control():
    data = request.json
    print data
    pl.update_brightness(data['brightness'])
    return "Done"

@app.route('/api/status/brightness', methods = ['GET'])
def brightness_status():
    response = {}
    response["brightness"] = pl.get_brightness()
    response = jsonify(response)
    return response

@app.route('/api/control/hue', methods = ['POST'])
def hue_control():
    data = request.json
    print data
    pl.update_hue(data['hue'])
    return "Done"

@app.route('/api/status/hue', methods = ['GET'])
def hue_status():
    response = {}
    response["hue"] = pl.get_hue()
    response = jsonify(response)
    return response

@app.route('/api/control/saturation', methods = ['POST'])
def saturation_control():
    data = request.json
    print data
    pl.update_saturation(data['saturation'])
    return "Done"

@app.route('/api/status/saturation', methods = ['GET'])
def saturation_status():
    response = {}
    response["saturation"] = pl.get_saturation()
    response = jsonify(response)
    return response

@app.route('/api/control/colortemperature', methods = ['POST'])
def color_temperature_control():
    data = request.json
    print data
    pl.update_color_temperature(data['colorTemperature'])
    return "Done"

@app.route('/api/status/colortemperature', methods = ['GET'])
def color_temperature_status():
    response = {}
    response["colorTemperature"] = pl.get_color_temperature()
    response = jsonify(response)
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=52100, debug=True)

