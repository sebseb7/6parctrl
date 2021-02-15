exports.anim = {
	tick: function (count,phase,phaselength,level,setPix,leds,data) 
	{
		for(var j=0;j<1;j++){
			var yc = j/5*Math.cos(count/10);
			var yc2 = (j-2)/5+0.5*Math.cos(count/10);
			for(var i=0;i<leds;i++){
				var compa = Math.sin(i/300+count/100);
				var compb = Math.sin(10*(i/100*Math.sin(count/20)+yc)+count/70);
				var xc2 = (i-500)/1000+0.5*Math.cos(count/12);
				var compc = Math.sin(Math.sqrt(100*(xc2*xc2+yc2*yc2)+1)+count/100);
				var r = (Math.sin((compa+compc)*Math.PI)+1)*128;
				var g = (Math.sin((compa+compb)*Math.PI+2*Math.PI/3)+1)*128;
				var b = (Math.sin((compb+compc)*Math.PI+4*Math.PI/3)+1)*128;
				setPix(i,r,g,b);
			}
		}
	},
	step:0.1167
}

