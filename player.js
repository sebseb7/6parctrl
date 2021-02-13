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

function setPar(x,r,g,b){
	dmxData[(x*4)+1]=r;
	dmxData[(x*4)+2]=g;
	dmxData[(x*4)+3]=b;
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
/*	console.log(message);

	if((message[0]==176)&&(message[1]==0))
		dmxData[1]=message[2]*2
	if((message[0]==176)&&(message[1]==1))
		dmxData[2]=message[2]*2
	if((message[0]==176)&&(message[1]==2))
		dmxData[3]=message[2]*2
	if((message[0]==176)&&(message[1]==3))
		dmxData[5]=message[2]*2
	if((message[0]==176)&&(message[1]==4))
		dmxData[6]=message[2]*2
	if((message[0]==176)&&(message[1]==5))
		dmxData[7]=message[2]*2
	if((message[0]==176)&&(message[1]==6))
		dmxData[9]=message[2]*2
	if((message[0]==176)&&(message[1]==7))
		dmxData[10]=message[2]*2
	if((message[0]==176)&&(message[1]==16))
		dmxData[11]=message[2]*2
	if((message[0]==176)&&(message[1]==17))
		dmxData[12]=message[2]*2
	if((message[0]==176)&&(message[1]==18))
		dmxData[13]=message[2]*2
	if((message[0]==176)&&(message[1]==19))
		dmxData[14]=message[2]*2
	if((message[0]==176)&&(message[1]==20))
		dmxData[15]=message[2]*2
	if((message[0]==176)&&(message[1]==21))
		dmxData[16]=message[2]*2
	if((message[0]==176)&&(message[1]==22))
		dmxData[17]=message[2]*2
	if((message[0]==176)&&(message[1]==23))
		dmxData[18]=message[2]*2
*/
});

var levelalert=0;
setInterval(function () {
	
	/*if(level > 100) levelalert = 20;
	if(levelalert > 0) levelalert--;
	if((level > 100)|| levelalert>0){
		dmxData[25]=255;
		dmxData[26]=0;
		dmxData[27]=0;
	}
	else{
		dmxData[25]=0;
		dmxData[26]=0;
		dmxData[27]=djblue;
	}*/
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
				//console.log(Buffer.from(dmxData));
			});
		});
	});
}, 1000 / 60);

