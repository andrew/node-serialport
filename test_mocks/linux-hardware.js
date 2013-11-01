// This takes a serial-port factory and mocks the shit out of it
"use strict";
var mockBinding = require('../test_mocks/serial-port-binding');

var FakeHardware = function (serialPort, optBinding) {
  var Binding = optBinding || mockBinding;
  this.binding = new Binding();

  serialPort.SerialPortBinding = this.binding;
  serialPort.list = this.binding.list;
};

module.exports = FakeHardware;
