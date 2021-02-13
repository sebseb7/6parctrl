var h = 0;
exports.anim = {
	tick: function (count,phase,phaselength,level,setPix,leds,data) 
	{
		for(var led = 0;led < leds;led++)
			setPix(led,data[1],data[2],data[3]);
	},
	step:0.0167
}

