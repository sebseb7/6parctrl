
var phasecount=0;
var phasecount2=0;

exports.anim = {
	tick: function (count,phase,phaselength,setPar,setScanner,setStrobe) 
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
		setScanner(0,255*128,255*128,255,(phasecount==1)?46:36,78,115,255);	
		setScanner(1,255*128,255*128,255,(phasecount==1)?36:46,78,141,255);	
		setStrobe(0,0);

	},
	duration:60,
	step:0.0167
}

