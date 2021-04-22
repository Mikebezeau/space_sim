
var missileDamageRangeRange = [4,5,6,7,8,9,9,10,11,11,12,12,13,13,14,14,14,15,15,16];

var missileWeapRefObj = {
	'damageRange': {
		'val':oneToTwenty,
		'range':missileDamageRangeRange,
		'label':doubleSliderLabel(oneToTwenty,missileDamageRangeRange),
		'CP':[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2]
	},
	'blastRadius': {'val':['None',1,2,3,4,5,6,7,8,9,10,20], 'CM':[1,3,4,5,6,7,7.5,8,8.5,9,10,20]},
	'accuracy': {'val':[-2,-1,0,1,2,3], 'CM':[0.6,0.8,1,1.3,1.6,2]},
	'rangeMod': {'val':[0,0.25,0.5,0.75,1,1.25,1.5,1.75,2,5,10,30,50], 'CM':[0.5,0.62,0.75,0.88,1,1.12,1.25,1.38,1.5,3,5.5,15.5,25.5]},
	'smart': {'val':['None',1,2,3,4], 'CM':[1,2.5,3,3.5,4]},
	'skill': {'val':[6,9,12,15,18,20], 'CM':[1,1.3,1.6,1.9,2.2,2.5]},
	'type': {'val':['Regular','Fuse','Scatter','Smoke & Scatter','Nuclear'], 'CM':[1,1.1,0.5,1,1000]},
	'special': {'val':['None','Anti-Missile'], 'CM':[1,1]},
	'variable': {'val':[0,1], 'CM':[1,1.8]},
	'longRange': {'val':[0,1], 'CM':[1,1.33]},
	'hyperVelocity': {'val':[0,1], 'CM':[1,1.25]}
}

function missileWeapObj(){
	this.damageRange = 0;
	this.accuracy = 2;
	this.blastRadius = 0;
	this.rangeMod = 4;
	this.smart = 0;
	this.skill = 0;
	this.type = 0;
	this.special = 0;
	this.variable = 0;
	this.longRange = 0;
	this.hyperVelocity = 0;
	this.numMissile = 10;
	
	this.SPeff = 0;
	this.Weff = 0;
    
    //keep weight separate for unique calculations based on weapon type
	this.getWeight = function(){
        var weight = missileWeapRefObj.damageRange.val[this.damageRange] / 2 - this.Weff;
				weight = Math.round(weight*100) / 100;//strange rounding issue
        return(weight);
    }
    
    this.tableHeaders = '<tr class="tableHeaders"><th>Damage</th><th>Structure</th><th>Range</th><th>Blast R.</th><th>Acc.</th>'
            +'<th>SP Eff.</th><th>SP</th><th>Weight Eff.</th><th>Weight</th><th>Scaled Wgt.</th><th>Scaled Cost</th></tr>';

	this.getString = function(index){
        var preview = false;
		if(arguments.length == 0) preview = true;
        
        var string = '<table>';
        //title and name input
			string += (!preview?'<tr><th colspan="100%">'+'Missile'+' Weapon '
					+'<input class="nameWeapon greenHighlight" data-type="'+'missile'+'" data-index="'+index+'" type="text" value="'+mecha.weaponList.missile[index].name+'"/></th></tr>':'')
            +this.tableHeaders
            + '<tr><td>'+weapon.getDamage(missileWeapRefObj,this)+'</td>'
            +'<td>'+weapon.getStructure(missileWeapRefObj,this)+'</td>'
            +'<td>'+weapon.getRange(missileWeapRefObj,this)+'</td>'
            +'<td>'+missileWeapRefObj.blastRadius.val[this.blastRadius]+'</td>'
            +'<td>'+weapon.getAccuracy(missileWeapRefObj,this)+'</td>'
        
            //if !preview show inputs
            +(!preview?'<td class="greenHighlight">'+'<input class="weaponSPeff" data-type="'+'missile'+'" data-index="'+index+'" type="text" value="'+this.SPeff+'"/></td>':'<td></td>')
            +'<td>'+weapon.getSP(this)+'</td>'
        //if !preview show inputs
            +(!preview?'<td class="greenHighlight">'+'<input class="weaponWeff" data-type="'+'missile'+'" data-index="'+index+'" type="text" value="'+this.Weff+'"/></td>':'<td></td>')
            +'<td>'+this.getWeight()+'</td>'
            +'<td>'+mecha.getKGWeight(this.getWeight())+'</td>'
            +'<td>'+weapon.getScaledCP(this)+'</td></tr>'

            +'<tr><td colspan="100%"><span>Special:</span>'
                +(this.type?' |'+missileWeapRefObj.type.val[this.type]+'| ':'')
                +(this.special?' |'+missileWeapRefObj.special.val[this.special]+(this.variable?', Variable| ':'| '):'')
                +(this.longRange?' |Long Range: -2 Accuracy| ':'')
                +(this.hyperVelocity?' |Hyper Velocity| ':'');

            +'</table>';

        return(string);
    }
    
	this.getBaseCP = function(){
		var CP = missileWeapRefObj.damageRange.CP[this.damageRange];
		CP = CP 
            * missileWeapRefObj.accuracy.CM[this.accuracy] 
            * missileWeapRefObj.blastRadius.CM[this.blastRadius]
            * missileWeapRefObj.rangeMod.CM[this.rangeMod]
            * missileWeapRefObj.smart.CM[this.smart]
            * missileWeapRefObj.skill.CM[this.skill]
            * missileWeapRefObj.type.CM[this.type]
            * missileWeapRefObj.special.CM[this.special]
            * missileWeapRefObj.variable.CM[this.variable]
            * missileWeapRefObj.longRange.CM[this.longRange]
            * missileWeapRefObj.hyperVelocity.CM[this.hyperVelocity]
            * this.numMissile
            ;
        CP = Math.round(CP*100) / 100;

        /*console.log(missileWeapRefObj.damageRange.CP[this.damageRange]
            +' '+missileWeapRefObj.accuracy.CM[this.accuracy]
            +' '+missileWeapRefObj.blastRadius.CM[this.blastRadius]
            +' '+missileWeapRefObj.rangeMod.CM[this.rangeMod]
            +' '+missileWeapRefObj.smart.CM[this.smart]
            +' '+missileWeapRefObj.skill.CM[this.skill]
            +' '+missileWeapRefObj.type.CM[this.type]
            +' '+missileWeapRefObj.special.CM[this.special]
            +' '+missileWeapRefObj.variable.CM[this.variable]
            +' '+missileWeapRefObj.longRange.CM[this.longRange]
            +' '+missileWeapRefObj.hyperVelocity.CM[this.hyperVelocity]
            +' '+this.numMissile
            +' '+CP
        );*/
        
        return CP; 
	}
}

//DISPLAY THE TOTAL COST OF NEW MISSILE WEAPON
function updateMissileWeaponCP(newMissileWeapObj){
	var CP = weapon.getCP(newMissileWeapObj);
	$('#missileCPTxt').val(CP);
    //display preview weapon info string
	$('#missileWeaponOutput').html(newMissileWeapObj.getString());
}


//MISSILE WEAPON UI******************************************
function initMissileUI(){

	$('#missileWeaponOutput').html(newMissileWeapObj.getString());
	
	//DAMAGE
	$( "#sliderMD" ).slider({
		min: 0,
		max: missileWeapRefObj.damageRange.val.length-1,
        value: newMissileWeapObj.damageRange
	}).slider("pips", {
			rest: "label",
			labels: castStringArray(missileWeapRefObj.damageRange.label)
    })
		// .slider("float", {
			// labels: missileWeapRefObj.damageRange.val
    // })
		//slider changes
    .on("slidechange", function(e,ui) {
				newMissileWeapObj.damageRange = ui.value;
        $("#missileDamageTxt").val(missileWeapRefObj.damageRange.CP[newMissileWeapObj.damageRange]+" CP");
				updateMissileWeaponCP(newMissileWeapObj);
				$("#missileRangeTxt").val(weapon.getRange(missileWeapRefObj,newMissileWeapObj));
    });
    
    //RANGE
	$("#sliderMR").slider({ 
        min: 0, 
        max: missileWeapRefObj.rangeMod.val.length-1,
        value: newMissileWeapObj.rangeMod
    })
    .slider("pips", {
        rest: "label",
        labels: castPercentArray(missileWeapRefObj.rangeMod.val)
    })
		// .slider("float", {
			// labels: missileWeapRefObj.rangeMod.val
    // })
		// and whenever the slider changes
    .on("slidechange", function(e,ui) {
				newMissileWeapObj.rangeMod = ui.value;
        $("#missileRangeModTxt").val(missileWeapRefObj.rangeMod.CM[ui.value]+" CM");
				updateMissileWeaponCP(newMissileWeapObj);
				$("#missileRangeTxt").val(weapon.getRange(missileWeapRefObj,newMissileWeapObj));
    });
    
	//ACCURACY
	$("#sliderMA").slider({ 
        min: 0, 
        max: missileWeapRefObj.accuracy.val.length-1,
        orientation: "vertical",
        value: newMissileWeapObj.accuracy
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(missileWeapRefObj.accuracy.val)
    })
		// .slider("float", {
			// labels: castStringArray(missileWeapRefObj.accuracy.val)
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				newMissileWeapObj.accuracy = ui.value;
        $("#missileAccuracyTxt").val(missileWeapRefObj.accuracy.CM[ui.value]+" CM");
				updateMissileWeaponCP(newMissileWeapObj);
    });
    
	//BLAST RADIUS
	$("#sliderMBR").slider({ 
        min: 0, 
        max: missileWeapRefObj.blastRadius.val.length-1,
        value: newMissileWeapObj.blastRadius
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(missileWeapRefObj.blastRadius.val)
    })
		// .slider("float", {
			// labels: castStringArray(missileWeapRefObj.blastRadius.val)
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				newMissileWeapObj.blastRadius = ui.value;
        $("#missileBlastRadiusTxt").val(missileWeapRefObj.blastRadius.CM[ui.value]+" CM");
				updateMissileWeaponCP(newMissileWeapObj);
    });
		
    //SMART
	$("#sliderMS").slider({ 
        min: 0, 
        max: missileWeapRefObj.smart.val.length-1,
        orientation: "vertical",
        value: newMissileWeapObj.smart
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(missileWeapRefObj.smart.val)
    })
		// .slider("float", {
			// labels: castStringArray(missileWeapRefObj.smart.val)
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				newMissileWeapObj.smart = ui.value;
        $("#missileSmartTxt").val(missileWeapRefObj.smart.CM[ui.value]+" CM");
				updateMissileWeaponCP(newMissileWeapObj);
    });
    
    //SKILL
	$("#sliderMSK").slider({ 
        min: 0, 
        max: missileWeapRefObj.skill.val.length-1,
        orientation: "vertical",
        value: newMissileWeapObj.skill
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(missileWeapRefObj.skill.val)
    })
		// .slider("float", {
			// labels: castStringArray(missileWeapRefObj.skill.val)
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				newMissileWeapObj.skill = ui.value;
        $("#missileSkillTxt").val(missileWeapRefObj.skill.CM[ui.value]+" CM");
				updateMissileWeaponCP(newMissileWeapObj);
    });
    
	//TYPE
    $("#missileT").selectmenu({
      position: {my:"bottom",at:"top"},
      classes: {
        "ui-selectmenu-menu": "highlight"
      },
      select: function(event,ui) {
        newMissileWeapObj.type = $("#missileT").val();
        $("#missileTypeTxt").val(missileWeapRefObj.type.CM[newMissileWeapObj.type]+" CM");
		updateMissileWeaponCP(newMissileWeapObj);
      }
    });
    
    //SPECIAL (ANTI-MISSILE)
    $('#chkMissileSpecial').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        //disable variable if not checked
        if(val == 0){
            $("#chkMissileVar").checkboxradio({disabled: true});
            $("#chkMissileVar").prop("checked", false);
            $("#chkMissileVar").button("refresh");
            $("#missileVarTxt").val("1 CM");
            newMissileWeapObj.variable = 0;
        }else{
            $( "#chkMissileVar" ).checkboxradio({disabled: false});
        }
        newMissileWeapObj.special = val;
        $("#missileSpecialTxt").val(missileWeapRefObj.special.CM[val]+" CM");
        updateMissileWeaponCP(newMissileWeapObj);
    });
	
    //VARIABLE FIRE MODE (start disabled)
    $('#chkMissileVar').checkboxradio({disabled: true});
    $('#chkMissileVar').bind('change', function(){
        $(this).is(':checked') ? newMissileWeapObj.variable = newMissileWeapObj.special : newMissileWeapObj.variable = 0;//if there is anti personnel as well
        $("#missileVarTxt").val(missileWeapRefObj.variable.CM[newMissileWeapObj.variable]+" CM");
        updateMissileWeaponCP(newMissileWeapObj);
    });

    //LONG RANGE
    $('#chkMissileLongRange').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newMissileWeapObj.longRange = val;
        $("#missileLongRangeTxt").val(missileWeapRefObj.longRange.CM[val]+" CM");
        $("#missileRangeTxt").val(weapon.getRange(missileWeapRefObj,newMissileWeapObj));
        updateMissileWeaponCP(newMissileWeapObj);
    });
	
    //HYPER VELOCITY
    $('#chkMissileHyperV').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newMissileWeapObj.hyperVelocity = val;
        $("#missileHyperVTxt").val(missileWeapRefObj.hyperVelocity.CM[val]+" CM");
        updateMissileWeaponCP(newMissileWeapObj);
    });
	
    //NUM MISSILES SPINNER
    $("#spnMNM").spinner({
        min:1,
        max:100,
        classes: {
        "ui-spinner": "highlight"},
        create: function(event,ui){
            updateMissileWeaponCP(newMissileWeapObj);
            $("#spnMNM").spinner("value",newMissileWeapObj.numMissile);
        },
        stop:function(event,ui){
            newMissileWeapObj.numMissile = $("#spnMNM").spinner("value");
            updateMissileWeaponCP(newMissileWeapObj);
        }
    });
    
    //ADD WEAPON
    $("#addMissileWeapon").button().click(function(){
        weapon.addWeapon('missile',newMissileWeapObj);
        newMissileWeapObj = new missileWeapObj();
    });
}