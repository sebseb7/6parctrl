
var phasecount=0;
var phasecount2=0;

exports.anim = {
	tick: function (count,phase,phaselength,setPar) 
	{
		if(phasecount2<4){
			setPar(0,0,0,255);
			setPar(1,0,0,255);
		}else{
			setPar(0,0,255,0);
			setPar(1,0,255,0);
		}
		
		setPar(2,0,0,0);
		setPar(3,0,0,0);
		setPar(4,0,0,0);
		setPar(5,0,0,0);
		
		if(phase == 0) {
			phasecount++;
			if(phasecount==2) phasecount=0;
			phasecount2++;
			if(phasecount2==8) phasecount2=0;
		}

		const segment = phaselength/3;
		if(phasecount==0){
			if(phase < segment){
				setPar(2,255,0,0);
				setPar(3,0,0,0,255);
				setPar(4,0,0,0,255);
				setPar(5,0,0,0,255);
			}
			else if(phase < segment*2){
				setPar(3,255,0,0);
				setPar(2,0,0,0,255);
				setPar(4,0,0,0,255);
				setPar(5,0,0,0,255);
			}
			else {
				setPar(4,255,0,0);
				setPar(3,0,0,0,255);
				setPar(2,0,0,0,255);
				setPar(5,0,0,0,255);
			}
		}else{
			if(phase < segment){
				setPar(5,255,0,0);
				setPar(3,0,0,0,255);
				setPar(4,0,0,0,255);
				setPar(2,0,0,0,255);
			}
			else if(phase < segment*2){
				setPar(4,255,0,0);
				setPar(3,0,0,0,255);
				setPar(2,0,0,0,255);
				setPar(5,0,0,0,255);
			}
			else {
				setPar(3,255,0,0);
				setPar(2,0,0,0,255);
				setPar(4,0,0,0,255);
				setPar(5,0,0,0,255);
			}
		}


	},
	duration:60,
	step:0.0167
}

