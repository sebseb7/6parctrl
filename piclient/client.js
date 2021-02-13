const SerialPort = require('serialport');
const ws281x = require('rpi-ws281x-native');
const NUM_LEDS = 150;
ws281x.init(NUM_LEDS,{dmaNum:10,gpioPin:10});
var pixelData = new Uint32Array(NUM_LEDS);

var options = {
	'baudRate': 250000,
	'dataBits': 8,
	'stopBits': 2,
	'parity': 'none'
};

var port = new SerialPort('/dev/serial/by-id/usb-Silicon_Labs_CP2102_USB_to_UART_Bridge_Controller_0001-if00-port0',options);

port.on('readable', function () {
	var data = port.read();
	if(data.length == 40) {
		process(data);
	}
})

var animations = [];
animations.push(require('./step1.js').anim);
animations.push(require('./step2.js').anim);
animations.push(require('./step3.js').anim);
animations.push(require('./step4.js').anim);
animations.push(require('./step5.js').anim);
animations.push(require('./step6.js').anim);

function setPix(x,r,g,b){
	const ledvar = b | r<<8 | g<<16;
	pixelData[x]=ledvar;
}
var count=0;

var lastStep = 0;
function process(data) {
//	console.log('Data:', data)

	if(lastStep != data[36]) count = 0;
	lastStep = data[36];

	count+=animations[data[36]].step;
	animations[data[36]].tick(count,data[33],data[34],data[35],setPix,NUM_LEDS,data);
	ws281x.render(pixelData);
}

