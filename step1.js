
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

var phasecount=0;
var h = 0;

exports.anim = {
	tick: function (count,phase,phaselength,setPar) 
	{
	
		if(phase == 0) {
			h += 0.55;
			if(h > 1 ) h-= 1; //Math.random();
			var h2 = h+0.5;
			if(h2 > 1) h2 -=1;
			const rgb = HSVtoRGB(h,1,1);
			const rgb2 = HSVtoRGB(h2,1,1);

			phasecount++;
			if(phasecount==4) phasecount=0;

			setPar(0,rgb2.r,rgb2.g,rgb2.b);
			setPar(1,rgb2.r,rgb2.g,rgb2.b);
			if(phasecount==0){
				setPar(2,rgb.r,rgb.g,rgb.b);
			}
			if(phasecount==1){
				setPar(3,rgb.r,rgb.g,rgb.b);
			}
			if(phasecount==2){
				setPar(4,rgb.r,rgb.g,rgb.b);
			}
			if(phasecount==3){
				setPar(5,rgb.r,rgb.g,rgb.b);
			}
		
		}else{
			setPar(2,0,0,0);
			setPar(3,0,0,0);
			setPar(4,0,0,0);
			setPar(5,0,0,0);
		}


	},
	duration:60,
	step:0.0167
}

