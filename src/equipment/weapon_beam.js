
var beamRange = [4,6,7,8,9,10,11,11,12,13,13,14,14,15,15,16,16,17,17,18];

var beamWeapRefObj = {
	'damageRange': {'val':oneToTwenty,
        'range':beamRange,
        'label':doubleSliderLabel(oneToTwenty,beamRange),
        'CP':[1.5,3,4.5,6,7.5,9,10.5,12,13.5,15,16.5,18,19.5,21,22.5,24,25.5,27,28.5,30]
    },
	'rangeMod': {'val':[0.25,0.5,0.75,1,1.25,1.5,1.75,2,2.5,3], 'CM':[0.62,0.75,0.88,1,1.12,1.25,1.38,1.5,1.75,2]},
	'accuracy': {'val':[-2,-1,0,1,2,3], 'CM':[0.6,0.8,0.9,1,1.5,2]},
	'shots': {'val':['0',1,3,5,10,'Unlimited'], 'CM':[0.33,0.5,0.7,0.8,0.9,1]},
	'warmUp': {'val':['None',1,2,3], 'CM':[1,0.9,0.7,0.6]},
	'wideAngle': {'val':['None','Hex',60,180,300,360], 'CM':[1,2,3,5,7,9]},
	'burstValue': {'val':['None',2,3,4,5,6,7,8,"Unlimited"], 'CM':[1,1.5,2,2.5,3,3.5,4,4.5,5]},
	'special': {'val':['None','Anti-Personnel','Anti-Missile','Anit-Personnel & Anti-Missile'], 'CM':[1,1,1,1.8]},
	'variable': {'val':[0,1,2,3], 'CM':[1,1.8,1.8,1.45]},
	'fragile': {'val':[0,1], 'CM':[1,0.75]},
	'longRange': {'val':[0,1], 'CM':[1,1.33]},
	'megaBeam': {'val':[0,1], 'CM':[1,10]},
	'disruptor': {'val':[0,1], 'CM':[1,2]},
}

function beamWeapObj(){
	this.type = 'beam';
	this.title = 'Beam';
	this.name = 'Enter Name';
	this.damageRange = 6;
	this.accuracy = 3;
	this.shots = 5;
	this.rangeMod = 3;
	this.warmUp = 0;
	this.wideAngle = 0;
	this.burstValue = 0;
	this.special = 0;
	this.variable = 0;
	this.fragile = 0;
	this.longRange = 0;
	this.megaBeam = 0;
	this.disruptor = 0;
	
	this.SPeff = 0;
	this.Weff = 0;
    
    //keep weight separate for unique calculations based on weapon type
	this.getWeight = function(){
        var weight = beamWeapRefObj.damageRange.val[this.damageRange] / 2 - this.Weff;
				weight = Math.round(weight*100) / 100;//strange rounding issue
        return(weight);
    }
    
	//needed for calculating space / space efficiency properly
	this.getBaseCP = function(){
		var CP = beamWeapRefObj.damageRange.CP[this.damageRange];
		CP = CP 
				* beamWeapRefObj.accuracy.CM[this.accuracy] 
				* beamWeapRefObj.shots.CM[this.shots]
				* beamWeapRefObj.rangeMod.CM[this.rangeMod]
				* beamWeapRefObj.warmUp.CM[this.warmUp]
				* beamWeapRefObj.wideAngle.CM[this.wideAngle]
				* beamWeapRefObj.burstValue.CM[this.burstValue]
				* beamWeapRefObj.special.CM[this.special]
				* beamWeapRefObj.variable.CM[this.variable]
				* beamWeapRefObj.fragile.CM[this.fragile]
				* beamWeapRefObj.longRange.CM[this.longRange]
				* beamWeapRefObj.megaBeam.CM[this.megaBeam]
				* beamWeapRefObj.disruptor.CM[this.disruptor]
				;
		return(CP);
	}
	
	this.tableHeaders = '<tr class="tableHeaders"><th>Damage</th><th>Structure</th><th>Range</th><th>Acc.</th><th>BV</th>'
			+'<th>SP Eff.</th><th>SP</th><th>Weight Eff.</th><th>Weight</th><th>Scaled Wgt.</th><th>Scaled Cost</th></tr>';
    
	this.getString = function(index){
			var preview = false;
			if(arguments.length == 0) preview = true;
			
			var string = '<table>';
			//title and name input
			string += (!preview?'<tr><th colspan="100%">'+'Beam'+' Weapon '
					+'<input class="nameWeapon greenHighlight" data-type="'+'beam'+'" data-index="'+index+'" type="text" value="'+mecha.weaponList.beam[index].name+'"/></th></tr>':'')
					//main info
					+this.tableHeaders
					+'<tr><td>'+weapon.getDamage(beamWeapRefObj,this)+'</td>'
					+'<td>'+(this.fragile?'1':weapon.getStructure(beamWeapRefObj,this))+'</td>'
					+'<td>'+weapon.getRange(beamWeapRefObj,this)+'</td>'
					+'<td>'+weapon.getAccuracy(beamWeapRefObj,this)+'</td>'
					+'<td>'+weapon.getBurstValue(beamWeapRefObj,this)+'</td>'
					//if !preview show inputs
					+(!preview?'<td class="greenHighlight">'+'<input class="weaponSPeff" data-type="'+'beam'+'" data-index="'+index+'" type="text" value="'+this.SPeff+'"/></td>':'<td></td>')
					+'<td>'+weapon.getSP(this)+'</td>'
					//if !preview show inputs
					+(!preview?'<td class="greenHighlight">'+'<input class="weaponWeff" data-type="'+'beam'+'" data-index="'+index+'" type="text" value="'+this.Weff+'"/></td>':'<td></td>')
					+'<td>'+this.getWeight()+'</td>'
					+'<td>'+mecha.getKGWeight(this.getWeight())+'</td>'
					+'<td>'+weapon.getScaledCP(this)+'</td></tr>'
					
					+'<tr><td colspan="100%"><span>Special:</span>'
							+(this.special?' |'+beamWeapRefObj.special.val[this.special]+(this.variable?', Variable| ':'| '):'')
							+(this.shots?' |'+beamWeapRefObj.shots.val[this.shots]+' Shots|':'|0 Shots, Must Charge| ')
							+(this.warmUp?' |Warm Up: '+beamWeapRefObj.warmUp.val[this.warmUp]+'|':'')
							+(this.wideAngle?' |Wide Angle: '+beamWeapRefObj.wideAngle.val[this.wideAngle]+'| ':'')
							+(this.longRange?' |Long Range: -2 Accuracy| ':'')
							+(this.megaBeam?' |Mega Beam| ':'')
							+(this.disruptor?' |Disruptor| ':'')+'</td></tr>';

			string += '</table>';

			return(string);
	}
    
	this.consoleCP = function(){
        /*console.log(beamWeapRefObj.damageRange.CP[this.damageRange]
						+' '+beamWeapRefObj.accuracy.CM[this.accuracy]
            +' '+beamWeapRefObj.shots.CM[this.shots]
            +' '+beamWeapRefObj.rangeMod.CM[this.rangeMod]
            +' '+beamWeapRefObj.warmUp.CM[this.warmUp]
            +' '+beamWeapRefObj.wideAngle.CM[this.wideAngle]
            +' '+beamWeapRefObj.burstValue.CM[this.burstValue]
            +' '+beamWeapRefObj.special.CM[this.special]
            +' '+beamWeapRefObj.variable.CM[this.variable]
            +' '+beamWeapRefObj.fragile.CM[this.fragile]
            +' '+beamWeapRefObj.longRange.CM[this.longRange]
            +' '+beamWeapRefObj.megaBeam.CM[this.megaBeam]
            +' '+beamWeapRefObj.disruptor.CM[this.disruptor]);*/
	}
}


//DISPLAY THE TOTAL COST OF NEW BEAM WEAPON
function updateBeamWeaponCP(newBeamWeapObj){
	var CP = weapon.getCP(newBeamWeapObj);
	$('#beamCPTxt').val(CP);
    //display preview weapon info string
	$('#beamWeaponOutput').html(newBeamWeapObj.getString());
}


//INIT BEAM WEAPON UI******************************************
function initBeamUI(){
    
    //display
    $('#beamWeaponOutput').html(newBeamWeapObj.getString());

    //DAMAGE RANGE
    $( "#sliderBD" ).slider({
        min: 0,
        max: beamWeapRefObj.damageRange.val.length-1
    }).slider("pips", {
        rest: "label",
        labels: beamWeapRefObj.damageRange.label
    })
    /*	.slider("float", {
                labels: beamWeapRefObj.damageRange.label
        })*/
    //slider change
        .on("slidechange", function(e,ui) {
        newBeamWeapObj.damageRange = ui.value;
        $("#beamDamageTxt").val(beamWeapRefObj.damageRange.CP[newBeamWeapObj.damageRange]+" CP");
        $("#beamRangeTxt").val(weapon.getRange(beamWeapRefObj,newBeamWeapObj));
        updateBeamWeaponCP(newBeamWeapObj);
    });

    //ACCURACY
    $("#sliderBA").slider({ 
        min: 0, 
        max: beamWeapRefObj.accuracy.val.length-1,
        orientation: "vertical",
        value: newBeamWeapObj.accuracy
    })
        .slider("pips", {
        rest: "label",
        labels: castStringArray(beamWeapRefObj.accuracy.val)
    })
        .slider("float", {
        labels: castStringArray(beamWeapRefObj.accuracy.val)
    })
    //slider change
        .on("slidechange", function(e,ui) {
        newBeamWeapObj.accuracy = ui.value;
        $("#beamAccuracyTxt").val(beamWeapRefObj.accuracy.CM[ui.value]+" CM");
        updateBeamWeaponCP(newBeamWeapObj);
    });

    //# SHOTS
    $("#sliderBS").slider({ 
        min: 0, 
        max: beamWeapRefObj.shots.val.length-1,
        orientation: "vertical",
        value: newBeamWeapObj.shots
    })
        .slider("pips", {
        rest: "label",
        labels: castStringArray(beamWeapRefObj.shots.val)
    })
    //.slider("float", {
    //	labels: beamWeapRefObj.shots.val
    //})
    //slider change
        .on("slidechange", function(e,ui) {
        newBeamWeapObj.shots = ui.value;
        $("#beamShotsTxt").val(beamWeapRefObj.shots.CM[ui.value]+" CM");
        updateBeamWeaponCP(newBeamWeapObj);
    });

    //RANGE MOD
    $("#sliderBR").slider({ 
        min: 0, 
        max: beamWeapRefObj.rangeMod.val.length-1,
        value: newBeamWeapObj.rangeMod
    })
        .slider("pips", {
        rest: "label",
        labels: castPercentArray(beamWeapRefObj.rangeMod.val)
    })
    //.slider("float", {
    //	labels: beamWeapRefObj.rangeMod.val
    //})
    //slider change
        .on("slidechange", function(e,ui) {
        newBeamWeapObj.rangeMod = ui.value;
        $("#beamRangeModTxt").val(beamWeapRefObj.rangeMod.CM[ui.value]+" CM");
        $("#beamRangeTxt").val(weapon.getRange(beamWeapRefObj,newBeamWeapObj));
        updateBeamWeaponCP(newBeamWeapObj);
    });

    //WARM UP
    $("#sliderBWU").slider({ 
        min: 0, 
        max: beamWeapRefObj.warmUp.val.length-1,
        orientation: "vertical",
        value: newBeamWeapObj.warmUp
    })
        .slider("pips", {
        rest: "label",
        labels: castStringArray(beamWeapRefObj.warmUp.val)
    })
    // .slider("float", {
    // labels: beamWeapRefObj.warmUp.val
    // })
    //slider change
        .on("slidechange", function(e,ui) {
        newBeamWeapObj.warmUp = ui.value;
        $("#beamWarmUpTxt").val(beamWeapRefObj.warmUp.CM[ui.value]+" CM");
        updateBeamWeaponCP(newBeamWeapObj);
    });

    //WIDE ANGLE
    $("#sliderBWA").slider({ 
        min: 0, 
        max: beamWeapRefObj.wideAngle.val.length-1,
        orientation: "vertical",
        value: newBeamWeapObj.wideAngle
    })
        .slider("pips", {
        rest: "label",
        labels: castStringArray(beamWeapRefObj.wideAngle.val)
    })
    // .slider("float", {
    // labels: beamWeapRefObj.wideAngle.val
    // })
    //slider change
        .on("slidechange", function(e,ui) {
        newBeamWeapObj.wideAngle = ui.value;
        $("#beamWideAngleTxt").val(beamWeapRefObj.wideAngle.CM[ui.value]+" CM");
        updateBeamWeaponCP(newBeamWeapObj);
    });

    //BURST VALUE
    $("#sliderBBV").slider({ 
        min: 0, 
        max: beamWeapRefObj.burstValue.val.length-1,
        value: newBeamWeapObj.burstValue
    })
        .slider("pips", {
        rest: "label",
        labels: castStringArray(beamWeapRefObj.burstValue.val)
    })
    // .slider("float", {
    // labels: beamWeapRefObj.burstValue.val
    // })
    //slider change
        .on("slidechange", function(e,ui) {
        newBeamWeapObj.burstValue = ui.value;
        $("#beamBurstValueTxt").val(beamWeapRefObj.burstValue.CM[ui.value]+" CM");
        updateBeamWeaponCP(newBeamWeapObj);
    });

    //SPECIAL
    $("#sliderBSP").slider({ 
        min: 0, 
        max: 3,
        orientation: "vertical",
        value: 0
    })
        .slider("pips", {
        rest: "label",
        labels: castStringArray(beamWeapRefObj.special.val)
    })
    // .slider("float", {
    // labels: beamWeapRefObj.special.val
    // })
    //slider change
    .on("slidechange", function(e,ui) {
        newBeamWeapObj.special = ui.value;
        $('#chkBeamVar').is(':checked') ? newBeamWeapObj.variable = newBeamWeapObj.special : newBeamWeapObj.variable = 0;
        $("#beamSpecialTxt").val(beamWeapRefObj.special.CM[ui.value]+" CM");
        if(ui.value == 0){
            $("#chkBeamVar").checkboxradio({disabled: true});
            $("#chkBeamVar").prop("checked", false);
            $("#chkBeamVar").button("refresh");
            $("#beamVarTxt").val("1 CM");
            newBeamWeapObj.variable = 0;
        }else{
            $("#chkBeamVar").checkboxradio({disabled: false});
        }
        $("#beamVarTxt").val(beamWeapRefObj.variable.CM[newBeamWeapObj.variable]+" CM");
        updateBeamWeaponCP(newBeamWeapObj);
        //console.log(beamWeapRefObj.variable.CM,beamWeapRefObj.variable.CM[newBeamWeapObj.variable],newBeamWeapObj.variable);

    });

    //VARIABLE FIRE MODE (start disabled)
    $('#chkBeamVar').checkboxradio({disabled: true});
    $('#chkBeamVar').bind('change', function(){
        $(this).is(':checked') ? newBeamWeapObj.variable = newBeamWeapObj.special : newBeamWeapObj.variable = 0;
        $("#beamVarTxt").val(beamWeapRefObj.variable.CM[newBeamWeapObj.variable]+" CM");
        //console.log(beamWeapRefObj.variable.CM);
        updateBeamWeaponCP(newBeamWeapObj);
    });

    //FRAGILE WEAPON
    $('#chkBeamFragile').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newBeamWeapObj.fragile = val;
        $("#beamFragileTxt").val(beamWeapRefObj.fragile.CM[val]+" CM");
        updateBeamWeaponCP(newBeamWeapObj);
    });
    
    
    //LONG RANGE
    $('#chkBeamLR').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newBeamWeapObj.longRange = val;
        $("#beamLongRangeTxt").val(beamWeapRefObj.longRange.CM[val]+" CM");
        $("#beamRangeTxt").val(newBeamWeapObj.getRange());
        updateBeamWeaponCP(newBeamWeapObj);
    });
	
    //Mega Beam
    $('#chkBeamMB').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newBeamWeapObj.megaBeam = val;
        $("#beamMegaBeamTxt").val(beamWeapRefObj.megaBeam.CM[val]+" CM");
        updateBeamWeaponCP(newBeamWeapObj);
    });
	
    //Disruptor
    $('#chkBeamD').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newBeamWeapObj.disruptor = val;
        $("#beamDisruptorTxt").val(beamWeapRefObj.disruptor.CM[val]+" CM");
        updateBeamWeaponCP(newBeamWeapObj);
    });
	
    //ADD WEAPON
    $("#addBeamWeapon").button().click(function(){
        weapon.addWeapon('beam',newBeamWeapObj);
        newBeamWeapObj = new beamWeapObj();
    });
	
}
