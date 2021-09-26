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
  this.hueStatusUrl = url.parse(config['hueStatusUrl']['url']);
  this.hueStatusUrl["port"] = config['port'];
  delete this.hueStatusUrl.host;
  this.hueControlUrl = url.parse(config['hueControlUrl']['url']);
  this.hueControlUrl["port"] = config['port'];
  delete this.hueControlUrl.host;
  this.saturationStatusUrl = url.parse(config['saturationStatusUrl']['url']);
  this.saturationStatusUrl["port"] = config['port'];
  delete this.saturationStatusUrl.host;
  this.saturationControlUrl = url.parse(config['saturationControlUrl']['url']);
  this.saturationControlUrl["port"] = config['port'];
  delete this.saturationControlUrl.host;
  this.colorTemperatureStatusUrl = url.parse(config['colorTemperatureStatusUrl']['url']);
  this.colorTemperatureStatusUrl["port"] = config['port'];
  delete this.colorTemperatureStatusUrl.host;
  this.colorTemperatureControlUrl = url.parse(config['colorTemperatureControlUrl']['url']);
  this.colorTemperatureControlUrl["port"] = config['port'];
  delete this.colorTemperatureControlUrl.host;
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
    pistonlightService.addCharacteristic(Characteristic.Hue)
        .on("get", this.getHue.bind(this))
        .on("set", this.setHue.bind(this));
    pistonlightService.addCharacteristic(Characteristic.Saturation)
        .on("get", this.getSaturation.bind(this))
        .on("set", this.setSaturation.bind(this));
    pistonlightService.addCharacteristic(Characteristic.ColorTemperature)
        .on("get", this.getColorTemperature.bind(this))
        .on("set", this.setColorTemperature.bind(this))
        .setProps({
            minValue: 0,
            maxValue: 100
        });
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
  getHue: function (next) {
    console.log("Running 'getHue'...");
    const me = this;
    request({
      url: url.format(this.hueStatusUrl),
      method: 'GET',
      json: true
    },
    function (error, response, body) {
      if (error) {
        console.log("Error in calling getHue");
        me.log(error.message);
        return next(error);
      }
      console.log(body);
      return next(null, body.hue);
    });
  },
  setHue: function (hue, next) {
    console.log("Running 'setHue'...");
    const me = this;
    request({
      url: url.format(this.hueControlUrl),
      method: 'POST',
      body: {'hue': hue},
      headers: {'Content-type': 'application/json'},
      json: true
    },
    function (error, response) {
      if (error) {
        console.log("Error in calling setHue");
        me.log(error.message);
        return next(error);
      }
      return next();
    });
  },
  getSaturation: function (next) {
    console.log("Running 'getSaturation'...");
    const me = this;
    request({
      url: url.format(this.saturationStatusUrl),
      method: 'GET',
      json: true
    },
    function (error, response, body) {
      if (error) {
        console.log("Error in calling getSaturation");
        me.log(error.message);
        return next(error);
      }
      console.log(body);
      return next(null, body.hue);
    });
  },
  setSaturation: function (saturation, next) {
    console.log("Running 'setSaturation'...");
    const me = this;
    request({
      url: url.format(this.saturationControlUrl),
      method: 'POST',
      body: {'saturation': saturation},
      headers: {'Content-type': 'application/json'},
      json: true
    },
    function (error, response) {
      if (error) {
        console.log("Error in calling setSaturation");
        me.log(error.message);
        return next(error);
      }
      return next();
    });
  },
  getColorTemperature: function (next) {
    console.log("Running 'getColorTemperature'...");
    const me = this;
    request({
      url: url.format(this.colorTemperatureStatusUrl),
      method: 'GET',
      json: true
    },
    function (error, response, body) {
      if (error) {
        console.log("Error in calling getColorTemperature");
        me.log(error.message);
        return next(error);
      }
      console.log(body);
      return next(null, body.colorTemperature);
    });
  },
  setColorTemperature: function (colorTemperature, next) {
    console.log("Running 'setColorTemperature'...");
    const me = this;
    request({
      url: url.format(this.colorTemperatureControlUrl),
      method: 'POST',
      body: {'colorTemperature': colorTemperature},
      headers: {'Content-type': 'application/json'},
      json: true
    },
    function (error, response) {
      if (error) {
        console.log("Error in calling setColorTemperature");
        me.log(error.message);
        return next(error);
      }
      return next();
    });
  },
};

