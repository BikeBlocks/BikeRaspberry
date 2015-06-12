var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var bike = {
	dummy: false,
	status: {
		speed: 1337,
		inclination: 42,
		acceleration: 0,
		braking: false,
		blinkingRight: false,
		blinkingLeft: false,
		noLights:true
	},
	settings: {
		wheelDiameter: 50,
		refreshRate:4
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
bike.pullValues = function() {
	bike.status.speed = speed.speed();
	bike.status.inclination = Math.round(gyro.inclination());
	bike.status.braking = gyro.braking();
	bike.status.blinkingLeft = lights.left() && (!bike.status.braking);
	bike.status.blinkingRight = lights.right() && (!bike.status.braking);
	bike.status.noLights = ! (bike.status.blinkingRight || bike.status.blinkingLeft || bike.status.braking)
	lights.braking(bike.status.braking);
}
bike.refreshInterval = setInterval(function(){
	bike.pullValues();
},1000/bike.settings.refreshRate)

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
	
	bike.emitter.emit('sendSettings',{reason:'welcome'});
	bike.emitter.emit('sendStatus',{reason:'welcome'});
	
	socket.on('settings', function (data) {
		_.assign(bike.settings, data.settings);
		bike.emitter.emit('sendSettings',{reason:'update'});
	});
	
	socket.on('settingsRequest', function (data) {
		bike.emitter.emit('sendSettings',{reason:'request'});
	});		
	socket.on('statusRequest', function (data) {
		bike.emitter.emit('sendStatus',{reason:'request'});
	});	

});