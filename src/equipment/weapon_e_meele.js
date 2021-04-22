
var eMeleeWeapRefObj = {
	'damageRange': {'val':oneToTwenty,'range':'melee','CP':oneToTwenty},
	'accuracy': {'val':[-2,-1,0,1,2,3], 'CM':[0.6,0.8,0.9,1,1.5,2]},
	'turnsUse': {'val':['Unlimited',1,2,3,4,5,7,10], 'CM':[1,0.3,0.4,0.5,0.6,0.7,0.8,0.9]},
	'attackFactor': {'val':['None',1,2,3,4,5], 'CM':[1,1.5,2,2.5,3,3.5]},
    'recharge': {'val':[0,1],'CM':[1,1.1]},
    'throw': {'val':[0,1],'CM':[1,1.2]},
    'quick': {'val':[0,1],'CM':[1,2]},
    'hyper': {'val':[0,1],'CM':[1,7.5]},
    'shield': {'val':[0,1],'CM':[1,1.5]},
    'variable': {'val':[0,1],'CM':[1,2]}//variable shield/regular weapon
}

function eMeleeWeapObj(){
	this.type = 'eMelee';
	this.title = 'Energy Melee';
	this.name = 'Enter Name';
	this.damageRange = 4;
	this.accuracy = 2;
	this.turnsUse = 2;
	this.attackFactor = 0;
	this.recharge = 0;
	this.throw = 0;
	this.quick = 1;
	this.hyper = 0;
	this.shield = 0;
	this.variable = 0;
	
	this.SPeff = 0;
	this.Weff = 0;
    
    //keep weight separate for unique calculations based on weapon type
	this.getWeight = function(){
        var weight = eMeleeWeapRefObj.damageRange.val[this.damageRange] / 2 - this.Weff;
				weight = Math.round(weight*100) / 100;//strange rounding issue
        return(weight);
    }
    
	//needed for calculating space / space efficiency properly
	this.getBaseCP = function(){
        var CP = eMeleeWeapRefObj.damageRange.CP[this.damageRange];
		CP = CP 
            * eMeleeWeapRefObj.accuracy.CM[this.accuracy] 
            * eMeleeWeapRefObj.turnsUse.CM[this.turnsUse]
            * eMeleeWeapRefObj.attackFactor.CM[this.attackFactor]
            * eMeleeWeapRefObj.recharge.CM[this.recharge] 
            * eMeleeWeapRefObj.throw.CM[this.throw]
            * eMeleeWeapRefObj.quick.CM[this.quick]
            * eMeleeWeapRefObj.hyper.CM[this.hyper] 
            * eMeleeWeapRefObj.shield.CM[this.shield]
            * eMeleeWeapRefObj.variable.CM[this.variable]
            ;
        CP = Math.round(CP*100) / 100;

        /*console.log(eMeleeWeapRefObj.accuracy.CM[this.accuracy]
            +' '+eMeleeWeapRefObj.turnsUse.CM[this.turnsUse]
            +' '+eMeleeWeapRefObj.attackFactor.CM[this.attackFactor]
        );*/
        return CP; 
    }
    
	this.tableHeaders = '<tr class="tableHeaders"><th>Damage</th><th>Structure</th><th>Range</th><th>Acc.</th>'
			+'<th>SP Eff.</th><th>SP</th><th>Weight Eff.</th><th>Weight</th><th>Scaled Wgt.</th><th>Scaled Cost</th></tr>';
    
	this.getString = function(index){
        var preview = false;
        if(arguments.length == 0) preview = true;

        var string = '<table>';
        //title and name input
        string += (!preview?'<tr><th colspan="100%">'+'Energy Melee'+' Weapon '
                   +'<input class="nameWeapon greenHighlight" data-type="'+'eMelee'+'" data-index="'+index+'" type="text" value="'+mecha.weaponList.eMelee[index].name+'"/></th></tr>':'')
        //main info
            +this.tableHeaders
            +'<tr><td>'+weapon.getDamage(eMeleeWeapRefObj,this)+'</td>'
            +'<td>'+weapon.getStructure(eMeleeWeapRefObj,this)+'</td>'
            +'<td>'+weapon.getRange(eMeleeWeapRefObj,this)+'</td>'
            +'<td>'+weapon.getAccuracy(eMeleeWeapRefObj,this)+'</td>'
//if !preview show inputs
					+(!preview?'<td class="greenHighlight">'+'<input class="weaponSPeff" data-type="'+'proj'+'" data-index="'+index+'" type="text" value="'+this.SPeff+'"/></td>':'<td></td>')
					+'<td>'+weapon.getSP(this)+'</td>'
					//if !preview show inputs
					+(!preview?'<td class="greenHighlight">'+'<input class="weaponWeff" data-type="'+'proj'+'" data-index="'+index+'" type="text" value="'+this.Weff+'"/></td>':'<td></td>')
					+'<td>'+this.getWeight()+'</td>'
					+'<td>'+mecha.getKGWeight(this.getWeight())+'</td>'
					+'<td>'+weapon.getScaledCP(this)+'</td></tr>'

					+'<tr><td colspan="100%"><span>Special:</span>'
                            +'|Bypass 4 Armor| '
							+(this.turnsUse?' |'+eMeleeWeapRefObj.turnsUse.val[this.turnsUse]+' Turns in Use| ':'')
							+(this.attackFactor?' |Auto Attack '+eMeleeWeapRefObj.attackFactor.val[this.attackFactor]+'|':'')
							+(this.recharge?' |Rechargable| ':'')
							+(this.throw?' |Thrown| ':'')
							+(this.quick?' |Quick| ':'')
							+(this.hyper?' |Hyper| ':'')
                            //shield / varable
							+(this.shield?' |Beam Shield'+(this.variable?', Variable':'')+(this.attackFactor?', Auto Defend '+eMeleeWeapRefObj.attackFactor.val[this.attackFactor]:'')+'| ':'')
							+'</td></tr>';

			string += '</table>';
        return(string);
    }
    
}


//DISPLAY THE TOTAL COST OF NEW ENERGY MELEE WEAPON
function updateEMeleeWeaponCP(newEMeleeWeapObj){
	var CP = weapon.getCP(newEMeleeWeapObj);
	$('#eMeleeCPTxt').val(CP);
    //display weapon info string
	$('#eMeleeWeaponOutput').html(newEMeleeWeapObj.getString());
}


//ENERGY MELEE WEAPON UI******************************************
function initEMeeleUI(){
    
    $('#eMeleeWeaponOutput').html(newEMeleeWeapObj.getString());
	
	//DAMAGE
	$("#sliderEMD").slider({
		min: 0,
		max: eMeleeWeapRefObj.damageRange.val.length-1,
        value: newEMeleeWeapObj.damageRange
	}).slider("pips", {
			rest: "label",
			labels: castStringArray(eMeleeWeapRefObj.damageRange.val)
    })
		// .slider("float", {
			// labels: eMeleeWeapRefObj.damage.val
    // })
		//slider changes
    .on("slidechange", function(e,ui) {
				newEMeleeWeapObj.damageRange = ui.value;
        $("#eMeleeDamageTxt").val(eMeleeWeapRefObj.damageRange.CP[newEMeleeWeapObj.damageRange]+" CP");
				updateEMeleeWeaponCP(newEMeleeWeapObj);
    });
    
	//ACCURACY
	$("#sliderEMA").slider({ 
        min: 0, 
        max: eMeleeWeapRefObj.accuracy.val.length-1,
        value: newEMeleeWeapObj.accuracy
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(eMeleeWeapRefObj.accuracy.val)
    })
		// .slider("float", {
			// labels: castStringArray(eMeleeWeapRefObj.accuracy.val)
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				newEMeleeWeapObj.accuracy = ui.value;
        $("#eMeleeAccuracyTxt").val(eMeleeWeapRefObj.accuracy.CM[ui.value]+" CM");
				updateEMeleeWeaponCP(newEMeleeWeapObj);
    });
    
	//TURNS IN USE
	$("#sliderEMTU").slider({ 
        min: 0, 
        max: eMeleeWeapRefObj.turnsUse.val.length-1,
        value: newEMeleeWeapObj.turnsUse
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(eMeleeWeapRefObj.turnsUse.val)
    })
		// .slider("float", {
			// labels: ["Unlimited",1,3,5,10]
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				newEMeleeWeapObj.turnsUse = ui.value;
        $("#eMeleeTurnsUseTxt").val(eMeleeWeapRefObj.turnsUse.CM[ui.value]+" CM");
				updateEMeleeWeaponCP(newEMeleeWeapObj);
    });
		
	//ATTACK FACTOR
	$("#sliderEMAF").slider({ 
        min: 0, 
        max: eMeleeWeapRefObj.attackFactor.val.length-1,
        value: newEMeleeWeapObj.attackFactor
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(eMeleeWeapRefObj.attackFactor.val)
    })
		// .slider("float", {
			// labels: ["Unlimited",1,3,5,10]
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				newEMeleeWeapObj.attackFactor = ui.value;
        $("#eMeleeAttackFactorTxt").val(eMeleeWeapRefObj.attackFactor.CM[ui.value]+" CM");
				updateEMeleeWeaponCP(newEMeleeWeapObj);
    });
    
    //RECHARGABLE
    $('#chkEMR').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newEMeleeWeapObj.recharge = val;
        $("#EMRtxt").val(eMeleeWeapRefObj.recharge.CM[val]+" CM");
        updateEMeleeWeaponCP(newEMeleeWeapObj);
    });
	
    //THROWN
    $('#chkEMT').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newEMeleeWeapObj.throw = val;
        $("#EMTtxt").val(eMeleeWeapRefObj.throw.CM[val]+" CM");
       updateEMeleeWeaponCP(newEMeleeWeapObj);
    });
	
    //QUICK
    $('#chkEMQ').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newEMeleeWeapObj.quick = val;
        $("#EMQtxt").val(eMeleeWeapRefObj.quick.CM[val]+" CM");
       updateEMeleeWeaponCP(newEMeleeWeapObj);
    });
	
    //HYPER
    $('#chkEMH').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newEMeleeWeapObj.hyper = val;
        $("#EMHtxt").val(eMeleeWeapRefObj.hyper.CM[val]+" CM");
       updateEMeleeWeaponCP(newEMeleeWeapObj);
    });
    
    //BEAM SHIELD
    $('#chkEMS').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newEMeleeWeapObj.shield = val;
        $("#EMStxt").val(eMeleeWeapRefObj.shield.CM[val]+" CM");
        if(val == 0){
            $("#chkEMV").checkboxradio({disabled: true});
            $("#chkEMV").prop("checked", false);
            $("#chkEMV").button("refresh");
            $("#EMVtxt").val("1 CM");
            newEMeleeWeapObj.variable = 0;
        }else{
            $("#chkEMV").checkboxradio({disabled: false});
        }
        updateEMeleeWeaponCP(newEMeleeWeapObj);
    });
	
    //VARIABLE BEAM SHIELD
    $('#chkEMV').checkboxradio({disabled: true});
    $('#chkEMV').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newEMeleeWeapObj.variable = val;
        $("#EMVtxt").val(eMeleeWeapRefObj.variable.CM[val]+" CM");
       updateEMeleeWeaponCP(newEMeleeWeapObj);
    });
	
    //ADD WEAPON
    $("#addEMeleeWeapon").button().click(function(){
        weapon.addWeapon('eMelee',newEMeleeWeapObj);
        newEMeleeWeapObj = new eMeleeWeapObj();
    });
}