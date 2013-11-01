// This exports a SerialPortBinding like object that has functions
// that will emulate a happy object. These functions can be spied on
// mocked or otherwise abused for testing.

"use strict";

var SerialPortBinding = function (fakePort){
  this.fakePort = fakePort || {
    comName: '/dev/really-cool-serialport',
    manufacturer: '',
    serialNumber: '',
    pnpId: '',
    locationId: '',
    vendorId: '',
    productId: ''
  };
};

SerialPortBinding.prototype = {
  open: function (path, opt, cb) {
    this.path = path;
    this.options = opt;
    cb && cb(null, 'fakeFileDescriptor');
  },
  write: function (fd, buffer, cb) {
    this.lastWrite = buffer;
    cb && cb(null, buffer.length);
  },
  close: function (fd, cb) {
    cb && cb(null);
  },
  list: function (cb) {
    cb && cb([ this.fakeSerialPort ]);
  },
  flush: function (fd, cb) {
    cb && cb(null, undefined);
  },
  SerialportPoller: function (fd, cb) {
    this.detectRead = function () {
      cb();
    };
    this.start = function () {};
    this.close = function () {};
  }
};

module.exports = SerialPortBinding;