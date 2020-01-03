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
  this.powerControlUrl = url.parse(config['powerControlUrl']['url']);
  this.powerControlUrl["port"] = config['port'];
  delete this.powerControlUrl.host;
  this.powerStatusUrl = url.parse(config['powerStatusUrl']['url']);
  this.powerStatusUrl["port"] = config['port'];
  delete this.powerStatusUrl.host;
  this.brightnessStatusUrl = url.parse(config['brightnessStatusUrl']['url']);
  this.brightnessStatusUrl["port"] = config['port'];
  delete this.brightnessStatusUrl.host;
  this.brightnessControlUrl = url.parse(config['brightnessControlUrl']['url']);
  this.brightnessControlUrl["port"] = config['port'];
  delete this.brightnessControlUrl.host;
}

pistonLight.prototype = {
  getServices: function() {
    console.log("Running 'getServices'...");
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Brielle")
      .setCharacteristic(Characteristic.Model, "Version 1");

    let pistonlightService = new Service.Lightbulb("Piston Light");
    pistonlightService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerState.bind(this))
      .on('set', this.setPowerState.bind(this));
    pistonlightService.addCharacteristic(Characteristic.Brightness)
        .on("get", this.getBrightness.bind(this))
        .on("set", this.setBrightness.bind(this));
    console.log(this)

    this.informationService = informationService;
    this.pistonlightService = pistonlightService;
    return [informationService, pistonlightService];
  },
  getPowerState: function (next) {
    console.log("Running 'getPowerState'...");
    const me = this;
    request({
      url: url.format(this.powerStatusUrl),
      method: 'GET',
      json: true
    },
    function (error, response, body) {
      if (error) {
        console.log("Error in calling getPowerState");
        me.log(error.message);
        return next(error);
      }
      console.log(body);
      return next(null, body.currentState);
    });
  },
  setPowerState: function (on, next) {
    console.log("Running 'setPowerState'...");
    const me = this;
    request({
      url: url.format(this.powerControlUrl),
      method: 'POST',
      body: {'targetState': on},
      headers: {'Content-type': 'application/json'},
      json: true
    },
    function (error, response) {
      if (error) {
        console.log("Error in calling setPowerState");
        me.log(error.message);
        return next(error);
      }
      return next();
    });
  },
  getBrightness: function (next) {
    console.log("Running 'getBrightness'...");
    const me = this;
    request({
      url: url.format(this.brightnessStatusUrl),
      method: 'GET',
      json: true
    },
    function (error, response, body) {
      if (error) {
        console.log("Error in calling getBrightness");
        me.log(error.message);
        return next(error);
      }
      console.log(body);
      return next(null, body.brightness);
    });
  },
  setBrightness: function (brightness, next) {
    console.log("Running 'setBrightness'...");
    const me = this;
    request({
      url: url.format(this.brightnessControlUrl),
      method: 'POST',
      body: {'brightness': brightness},
      headers: {'Content-type': 'application/json'},
      json: true
    },
    function (error, response) {
      if (error) {
        console.log("Error in calling setBrightness");
        me.log(error.message);
        return next(error);
      }
      return next();
    });
  },
};

