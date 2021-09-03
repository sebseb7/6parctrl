
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

var posx1 = 0;
var posx2 = 0;
var posy1 = 0;
var posy2 = 0;
var side = 0;

exports.anim = {
	tick: function (count,phase,phaselength,setPar,setScanner,setStrobe) 
	{
		//console.log(phase);	
		if(phase == 0) {
			h = 255;
			if(side==0){
				side=1;
				posx1 = Math.random()*255*255;
				posy1 = Math.random()*255*255;
			}else{
				side=0;
				posx2 = Math.random()*255*255;
				posy2 = Math.random()*255*255;
			}
		}
		setPar(2,h,0,0,0);
		setPar(3,h,0,0,0);
		setPar(4,h,0,0,0);
		setPar(5,h,0,0,0);

		if(h > (255/(0.7*phaselength))) {h-=(255/(0.7*phaselength))}else{h=0};
		
		if((phase % 5) == 0 ){
			setPar(0,0,0,255);
			setPar(1,0,0,255);
		}
		else
		{
			setPar(0,0,0,0);
			setPar(1,0,0,0);
		}

		setScanner(0,posx1,posy1,(side==0)?h:0,112,0,0,255);	
		setScanner(1,posx2,posy2,(side==0)?0:h,112,0,0,255);	
		setStrobe(0,0);


	},
	duration:120,
	step:0.0167,
	enabled:1
}

