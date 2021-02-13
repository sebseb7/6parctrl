
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
var phasecount2=0;
var h = 0;
var rgb=HSVtoRGB(h,1,1);
exports.anim = {
	tick: function (count,phase,phaselength,setPar) 
	{
		//console.log(phase);	
		if(phase == 0) {
			h += 0.03;
			if(h > 1 ) h-= 1; //Math.random();
			rgb = HSVtoRGB(h,1,1);

			phasecount++;
			if(phasecount==2) phasecount=0;
			phasecount2++;
			if(phasecount2==6) phasecount2=0;

			setPar(2,rgb.r,rgb.g,rgb.b);
			setPar(3,rgb.r,rgb.g,rgb.b);
			setPar(4,rgb.r,rgb.g,rgb.b);
			setPar(5,rgb.r,rgb.g,rgb.b);
		}
		if(phasecount == 0 ){
			setPar(0,255,0,0);
			setPar(1,255,0,0);
		}
		else
		{
			setPar(0,0,0,255);
			setPar(1,0,0,255);
		}
		setPar(2,0,0,0);
		setPar(3,0,0,0);
		setPar(4,0,0,0);
		setPar(5,0,0,0);
			
		if((phase % 6) == 0){
			if(phasecount2==0){
				setPar(2,rgb.r,rgb.g,rgb.b);
			}
			if(phasecount2==1){
				setPar(3,rgb.r,rgb.g,rgb.b);
			}
			if(phasecount2==2){
				setPar(4,rgb.r,rgb.g,rgb.b);
			}
			if(phasecount2==3){
				setPar(5,rgb.r,rgb.g,rgb.b);
			}
			if(phasecount2==4){
				setPar(4,rgb.r,rgb.g,rgb.b);
			}
			if(phasecount2==5){
				setPar(3,rgb.r,rgb.g,rgb.b);
			}
		}


	},
	duration:60,
	step:0.0167
}

