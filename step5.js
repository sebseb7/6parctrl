
function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (arguments.length === 1) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}

var h = 0;
exports.anim = {
	tick: function (count,phase,phaselength,setPar) 
	{
		//console.log(phase);	
		if(phase == 0) {
			h = 255;
		}
		setPar(2,h,0,0,0);
		setPar(3,h,0,0,0);
		setPar(4,h,0,0,0);
		setPar(5,h,0,0,0);

		if(h > 10) {h-=10}else{h=0};
		
		if((phase % 5) == 0 ){
			setPar(0,0,0,255);
			setPar(1,0,0,255);
		}
		else
		{
			setPar(0,0,0,0);
			setPar(1,0,0,0);
		}


	},
	duration:60,
	step:0.0167
}

