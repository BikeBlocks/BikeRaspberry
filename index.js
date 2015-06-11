var bike = {
	dummy: true
};

if(bike.dummy) {
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
  socket.emit('update', { hello: 'world' });
	
  socket.on('my other event', function (data) {
    console.log(data);
  });
	
});