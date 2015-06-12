var gyro = {};
var i2c = require('i2c-bus');
var MPU6050 = require('i2c-mpu6050');
var _ = require('lodash');
var address = 0x68;
var i2c1 = i2c.openSync(1);
 
gyro.sensor = new MPU6050(i2c1, address);
gyro.values = [1,2,1,2];
gyro.index = 0;
gyro.braking = false;
setInterval(function(){
	var data = gyro.sensor.readSync();
	console.log(data)
	if(data.accel.x < -0.1)
		gyro.braking = true;
	else
		gyro.braking = false;
	gyro.values[gyro.index] = data.rotation.y;
	if(gyro.index >= 9) gyro.index = -1;
	gyro.index ++;
},10)

module.exports.inclination = function(){
	//console.log(gyro.values);
	return _.reduce(gyro.values, function(total, n) {
	  return total + n;
	}) / gyro.values.length;
}
module.exports.braking = function() {
	return gyro.braking;
}