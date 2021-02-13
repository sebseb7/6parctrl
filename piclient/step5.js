var h = 0;
exports.anim = {
	tick: function (count,phase,phaselength,level,setPix,leds,data) 
	{
		//console.log(phase);	
		if(phase == 0) {
			h = 255;
		}
		for(var led = 0;led < leds;led++)
			setPix(led,h,0,0);

		if(h > 10) {h-=10}else{h=0};
		
	},
	step:0.0167
}

