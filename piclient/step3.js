
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

var h = Math.random();
var pos = Math.floor(Math.random() * Math.floor(5));

exports.anim = {
	tick: function (count,phase,phaselength,level,setPix,leds,data) 
	{
		var v =0;
		if(count%7 == 1 || count%7 == 4) {
			v=1
		}
		else if(count%7 == 5) {
			h = Math.random();
			var newpos = pos
			while(newpos == pos) {
				newpos = Math.floor(Math.random() * Math.floor(5));
			}
			pos=newpos;
		}

		const rgb = HSVtoRGB(h,1,v);
		for(var x=0;x<leds;x++){
			if((x-x%30)==pos*30) {
				setPix(x,rgb.r,rgb.g,rgb.b)
			}else{
				setPix(x,0,0,0);
			};
		}
	},
	step:1
}


