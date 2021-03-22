const SerialPort = require('serialport');
const midi = require('midi');
const { app, Menu, Tray } = require('electron');

let tray = null;
if(app) app.whenReady().then(() => {
	tray = new Tray(__dirname+'/trayicon.png');
	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Exit', role: 'quit', type: 'normal' }
	])
	tray.setContextMenu(contextMenu);
});

var port = null;

var options = {
	'baudRate': 250000,
	'dataBits': 8,
	'stopBits': 2,
	'parity': 'none'
};

function checkport() {
	SerialPort.list().then(
		function(ports){
			for(var serial of ports){
				if(serial.manufacturer == 'FTDI'){
					port = new SerialPort(serial.path,options);
					console.log('DMX found');
					port.on('error',function(){
						port.close(function(){
							port = null;
							setTimeout(checkport,2000);
						});
					});
				}
			}
			if(! port) {
				setTimeout(checkport,2000);
			}
		}
	)
}
checkport();

const input = new midi.Input();

for(var i = 0; i < input.getPortCount();i++){
	console.log(input.getPortName(i));
	if(input.getPortName(i) == 'loopMIDI Port 0'){
		input.openPort(i);
	}
}



var animations = [];
var padani = [];
var curr_anim = 0;

animations.push(require('./step1.js').anim);
animations.push(require('./step2.js').anim);
animations.push(require('./step3.js').anim);
animations.push(require('./step4.js').anim);
animations.push(require('./step5.js').anim);
animations.push(require('./step6.js').anim);
animations.push(require('./step7.js').anim);
padani.push(require('./pad1.js').anim);
padani.push(require('./pad2.js').anim);
padani.push(require('./pad3.js').anim);
padani.push(require('./pad1.js').anim);
padani.push(require('./pad1.js').anim);
padani.push(require('./pad1.js').anim);
padani.push(require('./pad1.js').anim);
padani.push(require('./pad8.js').anim);

curr_anim = animations.length-2;

function now(){
	return Math.floor(Date.now() / 1000);
}
var count = 0;

var channels = 40;
var dmxData = Buffer.alloc(513, 0);
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
var djblue=254;
var barred=254;
var knobmode=0;
var knobmodestate=0;
var lastphasets = now();
var decksel = 0;
var pads = 0;
input.on('message', (deltaTime, message) => {

	if((message[0]==176)&&(message[1]==100)){
		decksel = message[2];
	}
	else if((decksel == 127)&&(message[0]==176)&&(message[1]==101)){
		if((pads != 1)&&(message[2]==127)){
			pads = 1;
		}
		else if((pads == 1)&&(message[2]==127)){
			pads = 0;
		}
	}
	else if((decksel == 127)&&(message[0]==176)&&(message[1]==102)){
		if((pads != 2)&&(message[2]==127)){
			pads = 2;
		}
		else if((pads == 2)&&(message[2]==127)){
			pads = 0;
		}
	}
	else if((decksel == 127)&&(message[0]==176)&&(message[1]==103)){
		if((pads != 3)&&(message[2]==127)){
			pads = 3;
		}
		else if((pads == 3)&&(message[2]==127)){
			pads = 0;
		}
	}
	else if((decksel == 127)&&(message[0]==176)&&(message[1]==104)){
		if((pads != 4)&&(message[2]==127)){
			pads = 4;
		}
		else if((pads == 4)&&(message[2]==127)){
			pads = 0;
		}
	}
	else if((decksel == 127)&&(message[0]==176)&&(message[1]==105)){
		if((pads != 5)&&(message[2]==127)){
			pads = 5;
		}
		else if((pads == 5)&&(message[2]==127)){
			pads = 0;
		}
	}
	else if((decksel == 127)&&(message[0]==176)&&(message[1]==106)){
		if((pads != 6)&&(message[2]==127)){
			pads = 6;
		}
		else if((pads == 6)&&(message[2]==127)){
			pads = 0;
		}
	}
	else if((decksel == 127)&&(message[0]==176)&&(message[1]==107)){
		if((pads != 7)&&(message[2]==127)){
			pads = 7;
		}
		else if((pads == 7)&&(message[2]==127)){
			pads = 0;
		}
	}
	else if((decksel == 127)&&(message[0]==176)&&(message[1]==108)){
		if((pads != 8)&&(message[2]==127)){
			pads = 8;
		}
		else if((pads == 8)&&(message[2]==127)){
			pads = 0;
		}
	}
	else if((message[0]==176)&&(message[1]==120)){
		if(message[2] > knobmodestate) {
			knobmode = 1;
		}else{
			knobmode = 0;
		}
		knobmodestate = message[2];
	}
	else if((message[0]==176)&&(message[1]==124)){
		xfader = message[2];
	}
	else if((message[0]==176)&&(message[1]==122)&&(decksel==127)){
		if(knobmode == 0){
			djblue = message[2]*2;
		}else{
			barred = message[2]*2;
		}
	}
	else if((message[0]==176)&&(message[1]==125)){
		level = message[2];
	}
	else if((message[0]==176)&&(message[1]==126)&&(xfader<64)){
		var bphase = message[2];
		bphase+=64;
		if(bphase>=128)bphase-=128;
		if(bphase < lastphase){
			phaselength=phase;
			phase=0;
			lastphasets=now();
		}
		lastphase=bphase;
	}
	else if((message[0]==176)&&(message[1]==127)&&(xfader>=64)){
		var bphase = message[2];
		bphase+=64;
		if(bphase>=128)bphase-=128;
		if(bphase < lastphase){
			phaselength=phase;
			phase=0;
			lastphasets=now();
		}
		lastphase=bphase;
	}else{
		//console.log(message);
	}
});

var levelalert=0;
var leveltrigger;
const ENTTEC_PRO_DMX_STARTCODE = 0x00;
const ENTTEC_PRO_START_OF_MSG = 0x7e;
const ENTTEC_PRO_END_OF_MSG = 0xe7;
const ENTTEC_PRO_SEND_DMX_RQ = 0x06;

setInterval(function () {
	
	if(now() - lastphasets > 3){
		if(phase > 20) phase=0;
		phaselength=20;
	}

	if(level > 100) { leveltrigger++ } else {leveltrigger=0};
	if(leveltrigger > 10) levelalert = 20;
	if(levelalert > 0) levelalert--;
	if(levelalert>0){
		setPar(6,255,0,0);
		setPar(7,0,0,255);
	
	}
	else{
		setPar(6,0,0,djblue);
		setPar(7,barred,0,0,barred);
	}
	
	if(pads != 0) {
		padani[pads-1].tick(count,phase,phaselength,setPar);
		setPar(8,phase % 255,phaselength % 255,level,1);
	}else{
		setPar(8,phase % 255,phaselength % 255,level,curr_anim);
		count+=animations[curr_anim].step;
		animations[curr_anim].tick(count,phase,phaselength,setPar);
	}
	phase++;
	if(count > animations[curr_anim].duration){
		count=0;
		curr_anim++;
		//console.log(curr_anim);
	}
	if(curr_anim == animations.length) {
		curr_anim = 0;
	}
	if (port) {
		const hdr = Buffer.from([
			ENTTEC_PRO_START_OF_MSG,
			ENTTEC_PRO_SEND_DMX_RQ,
			(dmxData.length) & 0xff,
			((dmxData.length) >> 8) & 0xff,
			ENTTEC_PRO_DMX_STARTCODE,
		]);
		const msg = Buffer.concat([
			hdr,
			dmxData.slice(1),
			Buffer.from([ENTTEC_PRO_END_OF_MSG]),
		]);
		port.write(msg, function(err) {
			if (err) {
				return console.log('Error on write DMX data ', err.message);
			}
			port.drain();
		});
	}
}, 1000 / 40);

