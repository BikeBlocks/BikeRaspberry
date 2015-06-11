var socket = io.connect('http://localhost:3000');
var status = {};
socket.on('status', function (data) {
	console.log("Status received");
	console.log(data);
	_.assign(status,data.status)
});