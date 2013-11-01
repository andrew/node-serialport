"use strict";

var serialPort = require('../serialport');
var sinon = require("sinon");
var chai = require('chai');
var FakeHardware = require('../test_mocks/linux-hardware');
var expect = chai.expect;
var fs = require('fs');
var SerialPort = serialPort.SerialPort;
var fakeHardware = new FakeHardware(serialPort);

describe('SerialPort', function () {
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  })

  describe('Constructor', function () {
    it("opens the port immediately", function (done) {
      var port = new SerialPort('/dev/fun', function (err) {
        expect(err).to.not.be.ok;
        done();
      });
    });

    it('emits an error on the factory when erroring without a callback', function (done) {
      // setup the bindings to report an error during open
      var stubOpen = sandbox.stub(fakeHardware.binding, 'open', function (path, opt, cb) {
        cb('fakeErrr!');
      });

      // finish the test on error
      serialPort.once('error', function (err) {
        chai.assert.isDefined(err, "didn't get an error");
        done();
      });

      var port = new SerialPort('johnJacobJingleheimerSchmidt');
    });

    it('errors with invalid databits', function (done) {

      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      var port = new SerialPort('johnJacobJingleheimerSchmidt', { databits : 19 }, false, errorCallback);
    });

  });

  describe('#open', function () {

    it('passes the port to the bindings', function (done) {
      var openSpy = sandbox.spy(fakeHardware.binding, 'open');
      var port = new SerialPort('/dev/happyPort', {}, false);
      port.open(function (err) {
        expect(err).to.not.be.ok;
        expect(openSpy.calledWith('/dev/happyPort'));
        done();
      });

    });

    it('calls back an error when opening an invalid port', function (done) {
      var stubOpen = sandbox.stub(fakeHardware.binding, 'open', function (path, opt, cb) {
        cb('fakeErrr!');
      });

      var port = new SerialPort('johnJacobJingleheimerSchmidt', {}, false);
      port.open(function (err) {
        expect(err).to.be.ok;
        done();
      });
    });

    it("emits data after being reopened", function (done) {
      var testFd = fs.openSync('package.json', 'r');

      var mockRead = sandbox.stub(serialPort.fs, 'read', function (fd, buffer, offset, length, position, cb) {
        fs.read(testFd, buffer, offset, length, position, cb);
      });

      var port = new SerialPort('/dev/fun', function () {
        port.close();
        port.open(function () {
          port.once('data', function (res) {
            expect(res).to.eql(data);
            done();
          });
          port.serialPoller.detectRead();
        });
      });
    });

  });

});

