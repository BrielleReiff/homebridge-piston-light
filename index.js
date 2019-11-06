let Service, Characteristic;

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("piston-light-plugin", "PistonLight", pistonLight);
};

const request = require('request');
const url = require('url');

function pistonLight(log, config) {
  this.log = log;
  this.getUrl = url.parse(config['getUrl']);
  console.log(this.getUrl);
  this.postUrl = url.parse(config['postUrl']);
  console.log(this.postUrl);
}

pistonLight.prototype = {
  getServices: function() {
    console.log("Running 'getServices'...");
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Brielle")
      .setCharacteristic(Characteristic.Model, "Version 1");

    let switchService = new Service.Switch("Piston Light");
    switchService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getSwitchOnCharacteristic.bind(this))
      .on('set', this.setSwitchOnCharacteristic.bind(this));

    this.informationService = informationService;
    this.switchService = switchService;
    return [informationService, switchService];
  },
  getSwitchOnCharacteristic: function (next) {
    console.log("Running 'getSwitchOnCharacteristic'...");
    const me = this;
    request({
      url: "http://0.0.0.0:52100/api/status",
      method: 'GET',
      json: true
    },
    function (error, response, body) {
      if (error) {
        console.log("Error in calling getSwitchOnCharacteristic");
        me.log(error.message);
        return next(error);
      }
      console.log(body);
      return next(null, body.currentState);
    });
  },
  setSwitchOnCharacteristic: function (on, next) {
    console.log("Running 'setSwitchOnCharacteristic'...");
    const me = this;
    request({
      url: "http://0.0.0.0:52100/api/control",
      body: {'targetState': on},
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      json: true
    },
    function (error, response) {
      if (error) {
        console.log("Error in calling setSwitchOnCharacteristic");
        me.log(error.message);
        return next(error);
      }
      return next();
    });
  }
};

