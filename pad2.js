var c2=0;
exports.anim = {
	tick: function (count,phase,phaselength,setPar) 
	{
		c2++;
		if(c2 % 3 == 0) {
			setPar(0,255,255,255);
			setPar(1,255,255,255);
			setPar(2,255,255,255);
			setPar(3,255,255,255);
			setPar(4,255,255,255);
			setPar(5,255,255,255);
		}else{
			setPar(0,0,0,0,0);
			setPar(1,0,0,0,0);
			setPar(2,0,0,0,0);
			setPar(3,0,0,0,0);
			setPar(4,0,0,0,0);
			setPar(5,0,0,0,0);
		}
	},
	duration:60,
	step:0.0167
}

