exports.anim = {
	tick: function (count,phase,phaselength,level,setPix,leds,data) 
	{
		for(var i = 0; i < leds; i++){
			if(level > i) {
				if(i > 110){
					setPix(i,255,0,0);
				}else if(i > 70){
					setPix(i,255,255,0);
				}else{
					setPix(i,0,255,0);
				}
			}else{
				setPix(i,0,0,0);
			}
		}
	},
	step:0.0167
}

