const SerialPort = require('serialport');
const midi = require('midi');
const { app, Menu, Tray } = require('electron');
const  drawing = require('pngjs-draw');
const fs = require('fs');

var png = drawing(require('pngjs').PNG);
let tray = null;

var loopMidiPort = 0;

fs.createReadStream(__dirname+'/trayicon.png')
  .pipe(new png({ filterType: 4 }))
  .on('parsed', function() {
		this.pack().pipe(fs.createWriteStream('tray.out.png')).on('close',function() {
			if(app) app.whenReady().then(() => {
				tray = new Tray('tray.out.png');
				const contextMenu = Menu.buildFromTemplate([
					{ label: 'Exit', role: 'quit', type: 'normal' }
				])
				tray.setContextMenu(contextMenu);
				updateTrayIcon();
			});
		});
  });

	function updateTrayIcon(){
		var png = drawing(require('pngjs').PNG);

		fs.createReadStream(__dirname+'/trayicon.png')
		  .pipe(new png({ filterType: 4 }))
		  .on('parsed', function() {

				if( loopMidiPort == 1 )
					this.fillRect(0,0,127,127, this.colors.new(0,255,0,255))
				else
					this.fillRect(0,0,127,127, this.colors.new(255,0,0,255))

				this.fillRect(0,127,127,127, this.colors.new(255,0,0,255))
				this.fillRect(127,0,127,127, this.colors.new(255,0,0,255))
				this.fillRect(127,127,127,127, this.colors.new(255,0,0,255))



		    this.pack().pipe(fs.createWriteStream('tray.out.png')).on('close',function() {
						tray.setImage('tray.out.png');
						setTimeout(updateTrayIcon,500)
				});
		  });
	}

var port = null;

var options = {
	'baudRate': 250000,
	'dataBits': 8,
	'stopBits': 2,
	'parity': 'none'
};

var dmxmode = 'normal';
function checkport() {
	SerialPort.list().then(
		function(ports){
			for(var serial of ports){
				if(serial.manufacturer == 'FTDI'){
					port = new SerialPort(serial.path,options);
					console.log('DMX found');
					if(serial.serialNumber == 'EN264290') {
						console.log('enttec');
						dmxmode = 'enttec'
					}else{
						dmxmode = 'normal';
					}
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

const input_nxs = new midi.Input();
var nxs = false;
for(var i = 0; i < input_nxs.getPortCount();i++){
	console.log(input_nxs.getPortName(i));
	if(input_nxs.getPortName(i) == 'DJM-900nexus 1'){
		input_nxs.openPort(i);
		console.log('open');
	}
}

const input = new midi.Input();

for(var i = 0; i < input.getPortCount();i++){
	console.log(input.getPortName(i));
	if(input.getPortName(i) == 'loopMIDI Port 0'){
		input.openPort(i);
		loopMidiPort = 1;
	}
}

const nanoctrl = new midi.Input();
const nanoout = new midi.Output();
var nanoavail = false;
for(var i = 0; i < nanoout.getPortCount();i++){
	console.log(nanoout.getPortName(i));
	if(nanoout.getPortName(i) == 'nanoKONTROL2 2'){
		nanoout.openPort(i);
	}
}

for(var i = 0; i < nanoctrl.getPortCount();i++){
	console.log(nanoctrl.getPortName(i));
	if(nanoctrl.getPortName(i) == 'nanoKONTROL2 1'){
		nanoctrl.openPort(i);
		nanoavail = true;
	}
}


var auto = 1;
var leds = 1;
var scans = 1;
var strobe = 1;
var fog = 1;
var manualfog = 0;
var mstrobe1=0;
var mstrobe2=0
var programmode = 0;

var animations = [];
var padani = [];
var curr_anim = 0;
nanoout.sendMessage([176,45,127]);
nanoout.sendMessage([176,44,127]);
nanoout.sendMessage([176,43,127]);
nanoout.sendMessage([176,42,127]);
nanoout.sendMessage([176,41,127]);

animations.push(require('./step1.js').anim);
animations.push(require('./step3.js').anim);
animations.push(require('./step4.js').anim);
animations.push(require('./step5.js').anim);
animations.push(require('./step6.js').anim);
animations.push(require('./step2.js').anim);
animations.push(require('./step7.js').anim);
padani.push(require('./pad1.js').anim);
padani.push(require('./pad2.js').anim);
padani.push(require('./pad3.js').anim);
padani.push(require('./pad1.js').anim);
padani.push(require('./pad1.js').anim);
padani.push(require('./pad1.js').anim);
padani.push(require('./pad1.js').anim);
padani.push(require('./pad8.js').anim);
		
for(var i = 0; i < animations.length;i++){
	nanoout.sendMessage([176,32+i,0]);
}
nanoout.sendMessage([176,32+curr_anim,127]);
var anim_enabled = animations.length;
function now(){
	return Math.floor(Date.now() / 1000);
}
var count = 0;

var channels = 65;
var dmxData = Buffer.alloc(channels, 0);
function setPar(x,r,g,b,uv=0){
	if ((leds == 0)&&(x<6)) return;
	dmxData[(x*4)+1]=r;
	dmxData[(x*4)+2]=g;
	dmxData[(x*4)+3]=b;
	dmxData[(x*4)+4]=uv;
}

function setScan(n,x,y,v,c,g,gr){
	if (scans == 0) return;
	const lowerlim = 64;
	const upperlim = 191;

	const factor = 255/(255-((255-upperlim)+lowerlim));
	x = x / factor;
	x = x + lowerlim*255;

	dmxData[(n*14)+36]=x >> 8;
	dmxData[(n*14)+37]=x%255;
	dmxData[(n*14)+38]=y >> 8;
	dmxData[(n*14)+39]=y%255;
	dmxData[(n*14)+40]=0;
	dmxData[(n*14)+41]=v;
	dmxData[(n*14)+42]=0;
	dmxData[(n*14)+43]=c;
	dmxData[(n*14)+44]=g;
	dmxData[(n*14)+45]=gr;
	dmxData[(n*14)+46]=255;
	dmxData[(n*14)+47]=0;
	dmxData[(n*14)+48]=0;
}
function setStrobe(b,f){
	if (strobe == 0) return;
	dmxData[33]=b;
	dmxData[34]=f;
	dmxData[35]=0;
}
function setFog(v){
	dmxData[64]=v;
}
var phasetype = 0;

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
var lastnxsts = 0;
var decksel = 0;
var pads = 0;
input_nxs.ignoreTypes(true, false, true);
var midiclock=0;
input_nxs.on('message', (deltaTime, message) => {

	if(phasetype == 2) return;

	if(message[0]==250){
		midiclock=0;
		console.log('start');
	}else if(message[0]==248){
		midiclock++;
		if(midiclock == 24) {
			midiclock=0;
			phaselength=phase;
			phase=0;
			lastphasets=now();
			lastnxsts = now();
			if(phasetype != 1){
				phasetype = 1;
				console.log('djm phase');
			}
		}
	}else{

	//	console.log(message);
	}
});
function fogon(){
	setTimeout(function(){
		if(fog) dmxData[64]=255;
		fogoff();
	},3*60*1000);
}
function fogoff(){
	setTimeout(function(){
		if(fog && !manualfog)dmxData[64]=0;
		fogon();
	},20*1000);
}
fogon();

nanoctrl.on('message', (deltaTime, message) => {
	if((message[0]==176)&&(message[1]==16)){
		djblue = message[2]*2;
	}
	else if((message[0]==176)&&(message[1]==17)){
		barred = message[2]*2;
	}
	else if((message[0]==176)&&(message[1]==0)){
		if(strobe == 0) dmxData[33]=message[2]*2
		mstrobe1=message[2]*2;
	}
	else if((message[0]==176)&&(message[1]==1)){
		if(strobe == 0) dmxData[34]=message[2]*2;
		mstrobe2=message[2]*2;
	}
	else if((message[0]==176)&&(message[1]==2)){
		//dmxData[41]=message[2]*2;
	}
	else if((message[0]==176)&&(message[1]==3)){
		//dmxData[43]=message[2]*2;
	}
	else if((message[0]==176)&&(message[1]==4)){
		//dmxData[44]=message[2]*2;
	}
	else if((message[0]==176)&&(message[1]==5)){
		//dmxData[45]=message[2]*2;
	}
	else if((message[0]==176)&&(message[1]==6)){
		//dmxData[46]=message[2]*2;
	}
	else if((message[0]==176)&&(message[1]==7)){
		//dmxData[64]=message[2]*2;
	}
	else if((message[0]==176)&&(message[1]==41)&&(message[2]==0)){
		if(leds == 1) {
			nanoout.sendMessage([176,41,0]);
			setPar(1,0,0,0);
			setPar(2,0,0,0);
			setPar(3,0,0,0);
			setPar(4,0,0,0);
			setPar(5,0,0,0);
			setPar(0,0,0,0);
			leds=0;
		}else{
			leds=1;
			nanoout.sendMessage([176,41,127]);
		}
	}
	else if((message[0]==176)&&(message[1]==45)&&(message[2]==127)){
		if(auto == 1) {
			nanoout.sendMessage([176,45,0]);
			auto=0;
		}else{
			auto=1;
			nanoout.sendMessage([176,45,127]);
		}
	}
	else if((message[0]==176)&&(message[1]==42)&&(message[2]==127)){
		if(scans == 1) {
			nanoout.sendMessage([176,42,0]);
			setScan(0,255*127,255*127,0,0,0,0);
			setScan(1,255*127,255*127,0,0,0,0);
			scans=0;
		}else{
			nanoout.sendMessage([176,42,127]);
			scans=1;
		}
	}
	else if((message[0]==176)&&(message[1]==44)&&(message[2]==127)){
		if(strobe == 1) {
			nanoout.sendMessage([176,44,0]);
			setStrobe(mstrobe1,mstrobe2);
			strobe=0;
		}else{
			nanoout.sendMessage([176,44,127]);
			strobe=1;
			setStrobe(0,0);
		}
	}
	else if((message[0]==176)&&(message[1]==43)&&(message[2]==127)){
		if(fog == 1) {
			nanoout.sendMessage([176,43,0]);
			fog=0;
			if(!manualfog)dmxData[64]=0;
		}else{
			nanoout.sendMessage([176,43,127]);
			fog=1;
		}
	}
	else if((message[0]==176)&&(message[1]==46)&&(message[2]==127)){
		if(manualfog == 1) {
			nanoout.sendMessage([176,46,0]);
			manualfog=0;
			dmxData[64]=0;
		}else{
			nanoout.sendMessage([176,46,127]);
			manualfog=1;
			dmxData[64]=255;
		}
	}
	else if((message[0]==176)&&(message[1]==62)&&(message[2]==127)){
		programmode=1;
		for(var i = 0; i < animations.length;i++){
			if(animations[i].enabled) {
				nanoout.sendMessage([176,32+i,127]);
			}else{
				nanoout.sendMessage([176,32+i,0]);
			}
		}
	}
	else if((message[0]==176)&&(message[1]==62)&&(message[2]==0)){
		programmode=0;
		for(var i = 0; i < animations.length;i++){
			if(i == curr_anim) {
				nanoout.sendMessage([176,32+i,127]);
			}else{
				nanoout.sendMessage([176,32+i,0]);
			}
		}
	}
	else if((message[0]==176)&&(message[1]>31)&&(message[1]<40)&&(message[2]==127)){
		var new_ani = message[1]-32;
		if(new_ani >= animations.length) return;
		if(programmode == 1) {
			if(animations[new_ani].enabled){
				if(anim_enabled > 2){
					animations[new_ani].enabled=0;
					nanoout.sendMessage([176,32+new_ani,0]);
					anim_enabled--;
				}
			}else{
				anim_enabled++;
				animations[new_ani].enabled=1;
				nanoout.sendMessage([176,32+new_ani,127]);
			}
		}else{
			count=0;
			nanoout.sendMessage([176,32+curr_anim,0]);
			curr_anim=new_ani;
			nanoout.sendMessage([176,32+curr_anim,127]);
		}
	}
	//else
	//console.log(message);
	//console.log(message[2]*2);
});
input.on('message', (deltaTime, message) => {

	//if(now() - lastphasets < 3) return;

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
			if(phasetype != 2){
				phasetype = 2;
				console.log('traktor phase');
			}
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
			if(phasetype != 2){
				phasetype = 2;
				console.log('traktor phase');
			}
		}
		lastphase=bphase;
	}else{
		//console.log(message);
	}
//		console.log(message);
});
var levelalert=0;
var leveltrigger;
const ENTTEC_PRO_DMX_STARTCODE = 0x00;
const ENTTEC_PRO_START_OF_MSG = 0x7e;
const ENTTEC_PRO_END_OF_MSG = 0xe7;
const ENTTEC_PRO_SEND_DMX_RQ = 0x06;


setInterval(function () {

//	console.log(phase);
	if(now() - lastphasets > 3){
		if(phase > 12) phase=0;
		phaselength=12;
		if(phasetype != 3){
			phasetype = 3;
			console.log('dummy phase');
		}
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
		padani[pads-1].tick(count,phase,phaselength,setPar,setScan,setStrobe);
	}else{
		count+=animations[curr_anim].step;
		animations[curr_anim].tick(count,phase,phaselength,setPar,setScan,setStrobe);
	}
	phase++;
	if(count > animations[curr_anim].duration / 4){
		count=0;
		if(auto == 1){
			if(programmode==0) nanoout.sendMessage([176,32+curr_anim,0]);
			do{
				curr_anim++;
				if(curr_anim == animations.length) {
					curr_anim = 0;
				}
			}while(animations[curr_anim].enabled==0);
			if(programmode==0) nanoout.sendMessage([176,32+curr_anim,127]);
		}
		//console.log((new Date())+' new ani '+curr_anim);
	}
	dmxData[30]=0;
	if (port && dmxmode == 'enttec') {
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
/*	if (port && dmxmode != 'enttec')
		port.set({brk:true,rts:true}, function() {
			Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1);
			port.set({brk:false,rts:true}, function() {
				Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1);
				port.write(dmxData, function(err) {
					if (err) {
						return console.log('Error on write DMX data ', err.message);
					}
					port.drain();
				});
			});
		});*/
}, 1000 / 40);
