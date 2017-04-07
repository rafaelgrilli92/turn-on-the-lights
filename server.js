var express = require('express');
var app = express();
var onoff = require('onoff');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var Gpio = onoff.Gpio;
var led = new Gpio(14, 'out');
app.get('/toggle', function(req, res) {
	var value = (led.readSync() + 1) % 2;
	led.write(value, function() {
		console.log("Changed LED state to: " + value);
	});
	res.send(value == 0 ? 'OFF' : 'ON');
});

app.listen(8080, function () {
  console.log('Application listening on port %d', 8080)
});