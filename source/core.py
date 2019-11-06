from flask import Flask, request, jsonify
from pistonlamp import *
import json
import time

name='world'
pl = PistonLamp()
app = Flask(__name__)

@app.route('/api/control', methods = ['POST'])
def post():
    print "Calling post endpoint..."
    data = request.json
    print data
    command = data['targetState']
    if command == State.W_ON:
        pl.update_state(State.W_ON)
    elif command == State.ALL_OFF:
        pl.update_state(State.ALL_OFF)
    return "Done"

@app.route('/api/status', methods = ['GET'])
def get():
    print "Calling status endpoint..."
    response = {}
    if pl.get_state():
        response["currentState"] = True 
    else:
        response["currentState"] = False

    response = jsonify(response)
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=52100, debug=True)

