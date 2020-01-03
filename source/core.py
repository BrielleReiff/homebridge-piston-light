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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=52100, debug=True)

