var express = require('express');
var app = express();

app.use(express.static(__dirname));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

if (process.env.NODE_ENV === 'production') {
    var GPIOs = {};
    var onoff = require('onoff');
    var Gpio = onoff.Gpio;

    app.get('/toggleLed', function(req, res) {
        var pinNumber = req.query.pinNumber;
        setGPIO(pinNumber, function(led) {
            var value = (led.readSync() + 1) % 2;
            led.write(value, function() {
                console.log("Changed LED state to: " + value);
            });
            res.send(value == 0 ? 'OFF' : 'ON');
        });
    });

    function setGPIO(pinNumber, callback) {
        if (!GPIOs[pinNumber])
            GPIOs[pinNumber] = new Gpio(pinNumber, 'out');

        return callback(GPIOs[pinNumber]);
    }
}

app.listen(8080, function () {
  console.log('Application listening on port %d', 8080)
});