var lights = {
	braking: false,
	blinkingRight: false,
	blinkingLeft: false,
	leftValue:1,
	rightValue:1
};
/** Serial init **/
var SerialPort = require("serialport").SerialPort
lights.sp = new SerialPort("/dev/ttyUSB0", {
	baudrate: 9600,
	// defaults for Arduino serial communication
	dataBits: 8,
	parity: 'none',
	stopBits: 1,
	flowControl: false
});


/** gpio init**/
lights.gpio = require('onoff').Gpio;
lights.leftSwitch = new lights.gpio(17, 'in', 'both');
lights.rightSwitch = new lights.gpio(18, 'in', 'both');

lights.leftSwitch.watch(function(err, value) {
	console.log(value)
	if(value == 0 && lights.leftValue != value ) {
		if(lights.blinkingLeft) {
			lights.blinkingLeft = false;
			lights.blinkingRight = false;
		} else {
			lights.blinkingLeft = true;
			lights.blinkingRight = false;
		}
	}
	lights.leftValue = value;
	lights.send();
});

lights.rightSwitch.watch(function(err, value) {
	
	if(value == 0 && lights.rightValue != value ) {
		if(lights.blinkingRight) {
			lights.blinkingLeft = false;
			lights.blinkingRight = false;
		} else {
			lights.blinkingLeft = false;
			lights.blinkingRight = true;
		}
	}
	lights.rightValue = value;
	lights.send();
});

lights.send = function() {
	lights.sp.write("p");
	if(lights.blinkingLeft) {
		lights.sp.write("l");
	} else if (lights.blinkingRight) {
		lights.sp.write("r");
	}
	if(lights.braking) {
		lights.sp.write("s");
	}
}

module.exports.left = function(){
	return lights.blinkingLeft;
}

module.exports.right = function(){
	return lights.blinkingRight;
}

module.exports.braking = function(braking){
	lights.braking = braking;
}