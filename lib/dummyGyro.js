var gyro = {};
var EventEmitter = require('events').EventEmitter;

gyro.inclination = function() {
	return Math.floor(Math.random() * 45);
}

gyro.acceleration = function() {
	return Math.floor(Math.random() * 8 - 4); // Acc between -4g and 4g
}


gyro.emitter = new EventEmitter();

gyro.sendBrake = function() {
	gyro.emitter.emit("brake",{acceleration:gyro.acceleration()})
}

gyro.randomlySendbrake = function() {
	gyro.sendBrake();
	setTimeout(
		gyro.randomlySendbrake,
		Math.floor(Math.random() * 10000 + 3000)
	);
}
gyro.randomlySendbrake();


module.exports.inclination = gyro.inclination;
module.exports.acceleration = gyro.acceleration;
module.exports.emitter = gyro.emitter;