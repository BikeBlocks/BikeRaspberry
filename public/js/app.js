var bike = {
	status: {
		speed: 0,
		inclination: 0,
		acceleration: 0,
		braking: false,
		blinkingRight: false,
		blinkingLeft: false
	},
	settings: {
		refreshRate: 4
	},
	connected: false
};

rivets.bind($('#bike'), bike)

var socket = io.connect('http://localhost:3000');
var status = {};

socket.on('connect', function (data) {
	bike.connected = true;
	setInterval(function(){
		socket.emit("statusRequest");
	},1000/bike.settings.refreshRate)
});

socket.on('status', function (data) {
	console.log("Status received");
	console.log(data);
	_.assign(bike.status,data.status)
});

socket.on('settings', function (data) {
	console.log("Settings received");
	console.log(data);
	_.assign(bike.settings,data.settings)
});

