
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

var phasecount2=0;
var h = 0;

var x = 0;
var y = 0;
var old_x = 0;
var old_y = 0;
var x2 = 0;
var y2 = 0;
var old_x2 = 0;
var old_y2 = 0;

var phasecount = 0;
var step = 0;

var step2 = 0;

var sideA = 0;
var sideB = 255;

var col = 16;
var gobo = 16;
exports.anim = {
	tick: function (count,phase,phaselength,setPar,setScan,setStrobe) 
	{
		if(count == 0.0167){
			var colsel = Math.floor(Math.random() * 5);
			var colarr = [16,32,48,80,110];
			var gobosel = Math.floor(Math.random() * 4);
			var goboarr = [16,52,68,72];
			col = colarr[colsel];
			gobo = goboarr[gobosel];
			console.log('switch');
		}
		if(phase == 0) {
			h += 0.55;
			if(h > 1 ) h-= 1; //Math.random();
			var h2 = h+0.5;
			if(h2 > 1) h2 -=1;
			const rgb = HSVtoRGB(h,1,1);
			const rgb2 = HSVtoRGB(h2,1,1);

			if(sideA==0) {
				sideA=255;
				sideB=0;
			}else{
				sideA=0;
				sideB=255;
			}

			phasecount2++;
			if(phasecount2==4) phasecount2=0;

			setPar(0,rgb2.r,rgb2.g,rgb2.b);
			setPar(1,rgb2.r,rgb2.g,rgb2.b);
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
		
		}else{
			setPar(2,0,0,0);
			setPar(3,0,0,0);
			setPar(4,0,0,0);
			setPar(5,0,0,0);
		}
		
		if(phase == 0) {
			phasecount++;
			if(phasecount==1) {
		step2++;
		if(step2 == 2) step2 = 0;
				phasecount=0;
				old_x = x;
				old_y = y;
				old_x2 = x2;
				old_y2 = y2;

				var length=0;
				var tries = 0;
				do{
					tries++;
					x = Math.random()*155+50;
					y = Math.random()*155+50;
					length = Math.sqrt((old_x-x)*(old_x-x) + (old_y-y)*(old_y-y));
				} while (((length < 30)||(length > 50))&&(tries < 40));
				tries = 0;
				do{
					tries++;
					x2 = Math.random()*155+50;
					y2 = Math.random()*155+50;
					length = Math.sqrt((old_x2-x2)*(old_x2-x2) + (old_y2-y2)*(old_y2-y2));
				} while (((length < 30)||(length > 50))&&(tries < 40));
		//		console.log(Math.sqrt((old_x-x)*(old_x-x) + (old_y-y)*(old_y-y)));
				step = 0;
			}
		}
		step++;
		//if(step >= ((phaselength+1)*1)) step = (phaselength+1)*1;
		
		var stepx = (x - old_x)/((phaselength+1)*1);
		var stepy = (y - old_y)/((phaselength+1)*1);

		var currx = old_x + (stepx*step);
		var curry = old_y + (stepy*step);
		
		var stepx2 = (x2 - old_x2)/((phaselength+1)*1);
		var stepy2 = (y2 - old_y2)/((phaselength+1)*1);

		var currx2 = old_x2 + (stepx2*step);
		var curry2 = old_y2 + (stepy2*step);

		//console.log(stepx);
		//console.log(currx);

		if(step2 == 0){
			setScan(0,255*Math.round(currx),255*Math.round(curry),sideA,col,gobo,100);
			setScan(1,255*(255-Math.round(currx)),255*Math.round(curry),sideB,col,gobo,164);
		}else{
			setScan(0,255*Math.round(currx),255*Math.round(curry),sideA,col,gobo,100);
			setScan(1,255*(255-Math.round(currx)),255*Math.round(curry),sideB,col,gobo,164);
		}

		setStrobe(0,0);

	},
	duration:180,
	step:0.0167
}

