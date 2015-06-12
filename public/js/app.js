var bike = {
	status: {
		speed: 0,
		inclination: 0,
		acceleration: 0,
		braking: false,
		blinkingRight: false,
		blinkingLeft: false,
		noLights:false
	},
	settings: {
		refreshRate: 4
	},
	connected: false
};
rivets.binders.color = function(el, value) {
	el.style.color = value ? '#76ff03' : '#c5cae9';
}
rivets.binders.rotate = function(el, value) {
	$(el).css('transform',"rotate("+(-1*value)+"deg)");
	
}

rivets.bind($('.bike'), bike)


var socket = io.connect('http://' + window.location.host);
var status = {};

socket.on('connect', function (data) {
	bike.connected = true;
	bike.pullInterval = setInterval(function(){
		socket.emit("statusRequest");
	},1000/bike.settings.refreshRate)
});

socket.on('disconnect', function (data) {
	bike.connected = false;
	clearInterval(bike.pullInterval)
});

socket.on('status', function (data) {
	//console.log("Status received");
	//console.log(data);
	_.assign(bike.status,data.status)
});

socket.on('settings', function (data) {
	console.log("Settings received");
	console.log(data);
	_.assign(bike.settings,data.settings)
});

