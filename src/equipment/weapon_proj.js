
var projDamageRangeRange = [3,4,5,6,7,7,8,8,9,9,10,10,11,11,12,12,12,13,13,13];
var projWeapRefObj = {
	'damageRange': {
		'val':oneToTwenty,
		'range':projDamageRangeRange,
		'label':doubleSliderLabel(oneToTwenty,projDamageRangeRange),
		'CP':oneToTwenty},
	'accuracy': {'val':[-2,-1,0,1,2], 'CM':[0.6,0.8,1,1.5,2]},
	'burstValue': {'val':[0,2,3,4,5,6,7,8], 'CM':[1,1.5,2,2.5,3,3.5,4,4.5]},
	'rangeMod': {'val':[0,0.25,0.5,0.75,1,1.25,1.5,1.75,2,2.5,3], 'CM':[0.5,0.62,0.75,0.88,1,1.12,1.25,1.38,1.5,1.75,2]},
	'multiFeed':{'val':[1,2,3,4], 'CM':[1,1.2,1.4,1.6]},
	'longRange':{'val':[0,1], 'CM':[1,1.33]},
	'hyperVelocity':{'val':[0,1], 'CM':[1,1.25]},
	'special': {'val':['None','Anti-Personnel','Anti-Missile','Anit-Personnel & Anti-Missile'], 'CM':[1,1,1,1.8]},
	'variable': {'val':[0,1,2,3], 'CM':[1,1.8,1.8,1.45]}
}

var projAmmoRefObj = {
	'val':["High Explosive","Tracer","Kinetic","Tangler","Armor Piercing","Disruptor","Incendiary","Scatter Shot",
		"Blast","Blast 2","Blast 3","Blast 4","Blast 5"],
	'CM':[1,3,3,3,4,4,4,5,6,8,10,12,14]
}

function projAmmoObj(){
	this.typeList = [0], //can have multiple types in one ammo
	this.numAmmo = 10
}

function projWeapObj(){
	this.type = 'proj';
	this.title = 'Projectile';
	this.name = 'Enter Name';
	this.damageRange = 3;
	this.accuracy = 2;
	this.rangeMod = 4;
	this.burstValue = 2;
	this.multiFeed = 0;
	this.longRange = 0;
	this.hyperVelocity = 0;
	this.ammoList = [new projAmmoObj];
	
	this.special = 0;//phalanx & anti-personnel
	this.variable = 0;
	
	this.SPeff = 0;
	this.Weff = 0;
    
    //keep weight seperate for unique calculations based on weapon type
	this.getWeight = function(){
			var weight = projWeapRefObj.damageRange.val[this.damageRange] / 2 - this.Weff;
			weight = Math.round(weight*100) / 100;//strange rounding issue
			return(weight);
	}
  
	this.getBaseCP = function(){
		var CP = projWeapRefObj.damageRange.CP[this.damageRange];
		CP = CP 
            * projWeapRefObj.accuracy.CM[this.accuracy] 
            * projWeapRefObj.rangeMod.CM[this.rangeMod]
            * projWeapRefObj.burstValue.CM[this.burstValue]
            * projWeapRefObj.multiFeed.CM[this.multiFeed]
            * projWeapRefObj.longRange.CM[this.longRange]
            * projWeapRefObj.hyperVelocity.CM[this.hyperVelocity]
            * projWeapRefObj.special.CM[this.special]
            * projWeapRefObj.variable.CM[this.variable]
            ;
        return(CP);
	}
  
    this.getAmmoCP = function(){
        var CP = 0;
        for(var i=0;i<this.ammoList.length;i++){
            var baseCP = weapon.getCP(this);
            for(var j=0;j<this.ammoList[i].typeList.length;j++){
                baseCP = baseCP * projAmmoRefObj.CM[this.ammoList[i].typeList[j]];
            }
            CP += (baseCP * this.ammoList[i].numAmmo);
        }

        CP = CP / 10;
        CP = Math.round(CP*100)/100;
        //console.log(CP);
		return(CP);
    }
    
	this.tableHeaders = '<tr class="tableHeaders"><th>Damage</th><th>Structure</th><th>Range</th><th>Acc.</th><th>BV</th><th>SP Eff.</th><th>SP</th><th>Weight Eff.</th><th>Weight</th><th>Scaled Wgt.</th><th>Scaled Cost</th></tr>';
    
	this.getString = function(index){
			var preview = false;
			if(arguments.length == 0) preview = true;
			
			var string = '<table>';
			//title and name input
			string += (!preview?'<tr><th colspan="100%">'+'Projectile'+' Weapon '
					+'<input class="nameWeapon greenHighlight" data-type="'+'proj'+'" data-index="'+index+'" type="text" value="'+mecha.weaponList.proj[index].name+'"/></th></tr>':'')
					//main info
					+this.tableHeaders
					+'<tr><td>'+weapon.getDamage(projWeapRefObj,this)+'</td>'
					+'<td>'+weapon.getStructure(projWeapRefObj,this)+'</td>'
					+'<td>'+weapon.getRange(projWeapRefObj,this)+'</td>'
					+'<td>'+weapon.getAccuracy(projWeapRefObj,this)+'</td>'
					+'<td>'+weapon.getBurstValue(projWeapRefObj,this)+'</td>'
					//if !preview show inputs
					+(!preview?'<td class="greenHighlight">'+'<input class="weaponSPeff" data-type="'+'proj'+'" data-index="'+index+'" type="text" value="'+this.SPeff+'"/></td>':'<td></td>')
					+'<td>'+weapon.getSP(this)+'</td>'
					//if !preview show inputs
					+(!preview?'<td class="greenHighlight">'+'<input class="weaponWeff" data-type="'+'proj'+'" data-index="'+index+'" type="text" value="'+this.Weff+'"/></td>':'<td></td>')
					+'<td>'+this.getWeight()+'</td>'
					+'<td>'+mecha.getKGWeight(this.getWeight())+'</td>'
					+'<td>'+weapon.getScaledCP(this)+'</td></tr>'
					
					+'<tr><td colspan="100%"><span>Special:</span>'
                        +(this.special?'|'+projWeapRefObj.special.val[this.special]+(this.variable?', Variable|':'|'):'')
                        +(this.multiFeed?'|Multi-Feed: '+projWeapRefObj.multiFeed.val[this.multiFeed]+'|':'')
                        +(this.longRange?'|Long Range: -2 Accuracy|':'')+(this.hyperVelocity?'|Hyper Velocity|':'')+'</td></tr>';

            
            for(var i=0;i<this.ammoList.length;i++){
                string += '<tr><td colspan="2">Ammunition</td><td colspan="7">';
                for(var j=0;j<this.ammoList[i].typeList.length;j++){
                    string +='|'+projAmmoRefObj.val[this.ammoList[i].typeList[j]]+'|';
                }
                string += '</td><td colspan="1">'+this.ammoList[i].numAmmo+' Shots</td>';
                //string += '</td><td>'+this.getAmmoCP()+'</td>';
                string += '</td><td>'+mecha.getScaledCost(this.getAmmoCP())+'</td></tr>';
            }

			string += '</table>';

			return(string);
	}
}

//DISPLAY THE TOTAL COST OF NEW PROJECTILE WEAPON
function updateProjWeaponCP(newProjWeapObj){
	var CP = weapon.getCP(newProjWeapObj);
	$('#projCPTxt').val(CP);
    CP = newProjWeapObj.getAmmoCP();
	$('#projNumAmmoCP').val(CP);
    //display weapon info string
	$('#projWeaponOutput').html(newProjWeapObj.getString());
}


//ADDING / REMOVING MULTI AMMO


//PROJECTILE WEAPON UI******************************************
function initProjUI(){
    
    //display
    $('#projWeaponOutput').html(newProjWeapObj.getString());
	
	//DAMAGE
	$( "#sliderPD" ).slider({
		min: 0,
		max: projWeapRefObj.damageRange.val.length-1,
        value: newProjWeapObj.damageRange
	}).slider("pips", {
			rest: "label",
			labels: castStringArray(projWeapRefObj.damageRange.label)
    })
	/*	.slider("float", {
			labels: projWeapRefObj.damageRange.val
    })*/
		//slider changes
    .on("slidechange", function(e,ui) {
				newProjWeapObj.damageRange = ui.value;
        $("#projDamageTxt").val(weapon.getDamage(projWeapRefObj,newProjWeapObj)+" CP");
				updateProjWeaponCP(newProjWeapObj);
				$("#projRangeTxt").val(weapon.getRange(projWeapRefObj,newProjWeapObj));
    });
    
	//RANGE
	$("#sliderPR").slider({ 
        min: 0, 
        max: projWeapRefObj.rangeMod.val.length-1,
        value: newProjWeapObj.rangeMod
    })
    .slider("pips", {
        rest: "label",
        labels: castPercentArray(projWeapRefObj.rangeMod.val)
    })
		// .slider("float", {
			// labels: projWeapRefObj.rangeMod.val
    // })
		// and whenever the slider changes
    .on("slidechange", function(e,ui) {
				newProjWeapObj.rangeMod = ui.value;
                $("#projRangeModTxt").val(projWeapRefObj.rangeMod.CM[ui.value]+" CM");
				$("#projRangeTxt").val(weapon.getRange(projWeapRefObj,newProjWeapObj));
				updateProjWeaponCP(newProjWeapObj);
    });
    
	//ACCURACY
	$("#sliderPA").slider({ 
        min: 0, 
        max: projWeapRefObj.accuracy.val.length-1,
        orientation: "vertical",
        value: newProjWeapObj.accuracy
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(projWeapRefObj.accuracy.val)
    })
		// .slider("float", {
			// labels: castStringArray(projWeapRefObj.accuracy.val)
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				newProjWeapObj.accuracy = ui.value;
        $("#projAccuracyTxt").val(projWeapRefObj.accuracy.CM[ui.value]+" CM");
				updateProjWeaponCP(newProjWeapObj);
    });
    
	//BURST VALUE
	$("#sliderPB").slider({
				min: 0, 
        max: projWeapRefObj.burstValue.val.length-1,
        value: newProjWeapObj.burstValue
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(projWeapRefObj.burstValue.val)
    })
		// .slider("float", {
			// labels: projWeapRefObj.burstValue.val
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				newProjWeapObj.burstValue = ui.value;
        $("#projBurstTxt").val(projWeapRefObj.burstValue.CM[ui.value]+" CM");
				updateProjWeaponCP(newProjWeapObj);
    });
		
	//MULTI-FEED
	$("#sliderPMF").slider({
				min: 0, 
        max: projWeapRefObj.multiFeed.val.length-1,
        orientation: "vertical",
        value: newProjWeapObj.multiFeed
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(projWeapRefObj.multiFeed.val)
    })
		// .slider("float", {
			// labels: projWeapRefObj.multiFeed.val
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				newProjWeapObj.multiFeed = ui.value;
        $("#projMultiFeedTxt").val(projWeapRefObj.multiFeed.CM[ui.value]+" CM");
				updateProjWeaponCP(newProjWeapObj);
    });
		
	//SPECIAL
	$("#sliderPSP").slider({
				min: 0, 
        max: projWeapRefObj.special.val.length-1,
        orientation: "vertical",
        value: newProjWeapObj.special
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(projWeapRefObj.special.val)
    })
		// .slider("float", {
			// labels: projWeapRefObj.special.val
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				//console.log(projWeapRefObj.variable.CM,projWeapRefObj.variable.CM[newProjWeapObj.variable],newProjWeapObj.variable);
				newProjWeapObj.special = ui.value;
				$('#chkProjVar').is(':checked') ? newProjWeapObj.variable = newProjWeapObj.special : newProjWeapObj.variable = 0;
        $("#projSpecialTxt").val(projWeapRefObj.special.CM[ui.value]+" CM");
				if(ui.value == 0){
						$( "#chkProjVar" ).checkboxradio({disabled: true});
						$("#chkProjVar").prop("checked", false);
						$("#chkProjVar").button("refresh");
						$("#projVarTxt").val("1 CM");
						newProjWeapObj.variable = 0;
				}else{
						$( "#chkProjVar" ).checkboxradio({disabled: false});
				}
				$("#projVarTxt").val(projWeapRefObj.variable.CM[newProjWeapObj.variable]+" CM");
				updateProjWeaponCP(newProjWeapObj);
				//console.log(projWeapRefObj.variable.CM,projWeapRefObj.variable.CM[newProjWeapObj.variable],newProjWeapObj.variable);
		}
	);
  
    //VARIABLE FIRE MODE (start disabled)
    $('#chkProjVar').checkboxradio({disabled: true});
    $('#chkProjVar').bind('change', function(){
        $(this).is(':checked') ? newProjWeapObj.variable = newProjWeapObj.special : newProjWeapObj.variable = 0;
        $("#projVarTxt").val(projWeapRefObj.variable.CM[newProjWeapObj.variable]+" CM");
        //console.log(projWeapRefObj.variable.CM);
        updateProjWeaponCP(newProjWeapObj);
    });
    
    //LONG RANGE
    $('#chkProjLR').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newProjWeapObj.longRange = val;
        $("#projLongRangeTxt").val(projWeapRefObj.longRange.CM[val]+" CM");
        updateProjWeaponCP(newProjWeapObj);
    });
	
    //HYPER VELOCITY
    $('#chkProjHV').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newProjWeapObj.hyperVelocity = val;
        $("#projHyperVelocityTxt").val(projWeapRefObj.hyperVelocity.CM[val]+" CM");
        updateProjWeaponCP(newProjWeapObj);
    });
	
	//AMMO TYPE
    $("#projAT").selectmenu({
      position: {my:"bottom",at:"top"},
      classes: {
        "ui-selectmenu-menu": "highlight"
      },
      select: function(event,ui) {
          var ammoListIndex = 0;
          var typeListIndex = 0;
          //.ammoList[i].typeList[j]
          newProjWeapObj.ammoList[ammoListIndex].typeList[typeListIndex] = $("#projAT").val();
          $("#projAmmoTypeTxt").val(projAmmoRefObj.CM[newProjWeapObj.ammoList[ammoListIndex].typeList[typeListIndex]]+" CM");
          updateProjWeaponCP(newProjWeapObj);
      }
    });
    
    //NUM AMMO SPINNER
    $("#spnPNA").spinner({
        min:1,
        max:100,
        classes: {
        "ui-spinner": "highlight"},
        create: function(event,ui){
            $("#spnPNA").spinner("value",newProjWeapObj.ammoList[0].numAmmo);
        },
        stop:function(event,ui){
            var ammoListIndex = 0;
            
            newProjWeapObj.ammoList[ammoListIndex].numAmmo = $("#spnPNA").spinner("value");
            updateProjWeaponCP(newProjWeapObj);
        }
    });
    
    //ADD WEAPON
    $("#addProjWeapon").button().click(function(){
        weapon.addWeapon('proj',newProjWeapObj);
        newProjWeapObj = new projWeapObj();
    });
}