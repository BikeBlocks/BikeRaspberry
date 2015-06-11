var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var bike = {
	dummy: true,
	status: {
		speed: 1337,
		inclination: 42,
		acceleration: 0.42,
		braking: false,
		blinkingRight: false,
		blinkingLeft: false
	},
	settings: {
		wheelDiameter: 50
	},
	emitter: new EventEmitter()
};

if (bike.dummy) {
	var gyro = require("./lib/dummyGyro.js");
	var speed = require("./lib/dummySpeed.js");
	var lights = require("./lib/dummyLights.js");
} else {
	var gyro = require("./lib/gyro.js");
	var speed = require("./lib/speed.js");
	var lights = require("./lib/lights.js");
}



/* Express http Server */
var express = require('express');
var app = express();

app.use(express.static('public'));

var server = app.listen(3000, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Test app online at http://%s:%s', host, port);

});

/* Socket Communication */
var io = require('socket.io')(server);

io.on('connection', function (socket) {
	
	bike.emitter.on('sendStatus',function(data){
		socket.emit('status', {
			status: bike.status
		});
	});
	
	bike.emitter.on('sendSettings',function(data){
		socket.emit('settings', {
			settings: bike.settings
		});
	});
	
	bike.emitter.emit('sendStatus',{welcome:true});
	
	socket.on('settings', function (data) {
		_.merge(bike.settings, bike.settings, data.settings)
	});

});