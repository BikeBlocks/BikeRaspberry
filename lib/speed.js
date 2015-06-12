var speed = {
	lastSwitch:Date.now(),
	diameter:50
};
speed.gpio = require('onoff').Gpio;
speed.switch = new speed.gpio(18, 'in', 'both');

speed.switch.watch(function(err, value) {
	
	if(value == 0 && speed.lastValue != value ) {
		speed.duration = (Date.now() - speed.lastSwitch)/1000;
		speed.lastSwitch = Date.now();
		console.log("lap" + speed.duration)
		speed.lastSpeed = ((3.14 * speed.diameter)/speed.duration) * (3600/100000);
		console.log(speed.lastSpeed);
	}
	speed.lastValue = value;
});
module.exports.speed = function(){
	return Math.round(speed.lastSpeed);
}