const SerialPort = require('serialport');
const midi = require('midi');

const input = new midi.Input();

for(var i = 0; i < input.getPortCount();i++){
	console.log(input.getPortName(i));
	if(input.getPortName(i) == 'loopMIDI Port 0'){
		input.openPort(i);
	}
}

var options = {
	'baudRate': 250000,
	'dataBits': 8,
	'stopBits': 2,
	'parity': 'none'
};

var port = new SerialPort('COM4',options);

var animations = [];
var curr_anim = 0;

animations.push(require('./step6.js').anim);
animations.push(require('./step5.js').anim);
animations.push(require('./step4.js').anim);
animations.push(require('./step3.js').anim);
animations.push(require('./step1.js').anim);
animations.push(require('./step2.js').anim);

var count = 0;

var channels = 40;
var dmxData = [];
for(var i = 0; i < channels; i++) {
	dmxData[i] = 0; 
}

function setPar(x,r,g,b,uv=0){
	dmxData[(x*4)+1]=r;
	dmxData[(x*4)+2]=g;
	dmxData[(x*4)+3]=b;
	dmxData[(x*4)+4]=uv;
}

var lastphase=0;
var phase=0;
var phaselength=0;
var xfader=0;
var level=0;
var shift=0;
var djblue=254;
input.on('message', (deltaTime, message) => {

	if((message[0]==176)&&(message[1]==124)){
		xfader = message[2];
	}
	if((message[0]==176)&&(message[1]==121)){
		shift = message[2];
	}
	if((message[0]==176)&&(message[1]==122)&&(shift==127)){
		djblue = message[2]*2;
	}
	if((message[0]==176)&&(message[1]==125)){
		level = message[2];
	}
	if((message[0]==176)&&(message[1]==126)&&(xfader<64)){
		var bphase = message[2];
		bphase+=64;
		if(bphase>=128)bphase-=128;
		if(bphase < lastphase){
			phaselength=phase;
			phase=0;
		}
		lastphase=bphase;
	}
	if((message[0]==176)&&(message[1]==127)&&(xfader>=64)){
		var bphase = message[2];
		bphase+=64;
		if(bphase>=128)bphase-=128;
		if(bphase < lastphase){
			phaselength=phase;
			phase=0;
		}
		lastphase=bphase;
	}
});

var levelalert=0;
var leveltrigger;
setInterval(function () {

	if(level > 100) { leveltrigger++ } else {leveltrigger=0};
	if(leveltrigger > 10) levelalert = 20;
	if(levelalert > 0) levelalert--;
	if(levelalert>0){
		setPar(6,255,0,0);
		setPar(7,0,0,255);
	
	}
	else{
		setPar(6,0,0,djblue);
		setPar(7,255,0,0,255);
	}
	
	setPar(8,phase % 255,phaselength % 255,level);

	count+=animations[curr_anim].step;
	animations[curr_anim].tick(count,phase,phaselength,setPar);
	phase++;
	if(count > animations[curr_anim].duration){
		count=0;
		curr_anim++;
	}
	if(curr_anim == animations.length) {
		curr_anim = 0;
	}
	port.set({brk:true,rts:true}, function() {
		Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1);
		port.set({brk:false,rts:true}, function() {
			Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1);
			port.write(Buffer.from(dmxData), function(err) {
				if (err) {
					return console.log('Error on write DMX data ', err.message);
				}
				port.drain();
			});
		});
	});
}, 1000 / 60);

