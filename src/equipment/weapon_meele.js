
var meleeWeapRefObj = {
	'damageRange': {'val':oneToTwenty,'range':'melee','CP':[0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10]},
	'accuracy': {'val':[-1,0,1,2,], 'CM':[0.5,0.7,1,1.5]},
	'handy': {'val':[0,1], 'CM':[1,1.5]},
	'quick': {'val':[0,1], 'CM':[1,2]},
	'clumsy': {'val':[0,1], 'CM':[1,0.5]},
	'armorPiercing': {'val':[0,1], 'CM':[1,2]},
	'entangle': {'val':[0,1], 'CM':[1,1.5]},
	'throw': {'val':[0,1], 'CM':[1,1.2]},
	'returning': {'val':[0,1], 'CM':[1,1.5]},
	'disruptor': {'val':[0,1], 'CM':[1,2]},
	'shockOnly': {'val':[0,1], 'CM':[1,2]},
	'shockAdded': {'val':[0,1], 'CM':[1,3]},
}

function meleeWeapObj(){
	this.type = 'melee';
	this.title = 'Melee';
	this.name = 'Enter Name';
	this.damageRange = 1;
	this.accuracy = 2;
	this.handy = 0;
	this.quick = 0;
	this.clumsy = 0;
	this.armorPiercing = 0;
	this.entangle = 0;
	this.throw = 0;
	this.returning = 0;
	this.disruptor = 0;
	this.shockOnly = 0;
	this.shockAdded = 0;
	
	this.SPeff = 0;
	this.Weff = 0;
    
    //keep weight separate for unique calculations based on weapon type
	this.getWeight = function(){
        var weight = meleeWeapRefObj.damageRange.val[this.damageRange] / 2 - this.Weff;
				weight = Math.round(weight*100) / 100;//strange rounding issue
        return(weight);
    }
    
    //needed for calculating space / space efficiency properly
	this.getBaseCP = function(){
        var CP = meleeWeapRefObj.damageRange.CP[this.damageRange];
		CP = CP 
            * meleeWeapRefObj.accuracy.CM[this.accuracy] 
            * meleeWeapRefObj.handy.CM[this.handy]
            * meleeWeapRefObj.quick.CM[this.quick]
            * meleeWeapRefObj.clumsy.CM[this.clumsy] 
            * meleeWeapRefObj.armorPiercing.CM[this.armorPiercing]
            * meleeWeapRefObj.entangle.CM[this.entangle]
            * meleeWeapRefObj.throw.CM[this.throw] 
            * meleeWeapRefObj.returning.CM[this.returning]
            * meleeWeapRefObj.disruptor.CM[this.disruptor]
            * meleeWeapRefObj.shockOnly.CM[this.shockOnly]
            * meleeWeapRefObj.shockAdded.CM[this.shockAdded]
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
            +'<tr><td>'+weapon.getDamage(meleeWeapRefObj,this)+'</td>'
            +'<td>'+weapon.getStructure(meleeWeapRefObj,this)+'</td>'
            +'<td>'+weapon.getRange(meleeWeapRefObj,this)+'</td>'
            +'<td>'+weapon.getAccuracy(meleeWeapRefObj,this)+'</td>'
//if !preview show inputs
					+(!preview?'<td class="greenHighlight">'+'<input class="weaponSPeff" data-type="'+'proj'+'" data-index="'+index+'" type="text" value="'+this.SPeff+'"/></td>':'<td></td>')
					+'<td>'+weapon.getSP(this)+'</td>'
					//if !preview show inputs
					+(!preview?'<td class="greenHighlight">'+'<input class="weaponWeff" data-type="'+'proj'+'" data-index="'+index+'" type="text" value="'+this.Weff+'"/></td>':'<td></td>')
					+'<td>'+this.getWeight()+'</td>'
					+'<td>'+mecha.getKGWeight(this.getWeight())+'</td>'
					+'<td>'+weapon.getScaledCP(this)+'</td></tr>'

					+'<tr><td colspan="100%"><span>Special:</span>'
                            +(this.handy?' |Handy| ':'')
							+(this.clumsy?' |Clumsy| ':'')
							+(this.quick?' |Quick| ':'')
							+(this.armorPiercing?' |Armor Piercing| ':'')
							+(this.entangle?' |Entangle| ':'')
							+(this.throw?' |Throw| ':'')
							+(this.returning?' |Returning| ':'')
							+(this.disruptor?' |Disruptor| ':'')
							+(this.shockOnly?' |Shock Only| ':'')
							+(this.shockAdded?' |Shock Added| ':'')
					+'</td></tr>';

			string += '</table>';
        return(string);
    }
    
	this.getCP = function(){
		var CP = meleeWeapRefObj.damageRange.CP[this.damageRange];
		CP = CP 
            * meleeWeapRefObj.accuracy.CM[this.accuracy] 
            * meleeWeapRefObj.special.CM[this.special]
            ;
        CP = Math.round(CP*100) / 100;

        /*console.log(meleeWeapRefObj.accuracy.CM[this.accuracy]
            +' '+meleeWeapRefObj.special.CM[this.special]
        );*/
        return CP;
	}
}

//DISPLAY THE TOTAL COST OF NEW MELEE WEAPON
function updateMeleeWeaponCP(newMeleeWeapObj){
	var CP = weapon.getCP(newMeleeWeapObj);
	$('#meleeCPTxt').val(CP);
    //display weapon info string
	$('#meleeWeaponOutput').html(newMeleeWeapObj.getString());
}


//MELEE WEAPON UI******************************************
function initMeeleUI(){
    
    $('#meleeWeaponOutput').html(newMeleeWeapObj.getString());
	
	//DAMAGE
	$("#sliderMED").slider({
		min: 0,
		max: meleeWeapRefObj.damageRange.val.length-1,
        value: newMeleeWeapObj.damageRange
	}).slider("pips", {
			rest: "label",
			//labels: castStringArray(meleeWeapRefObj.damageRange.label)
			labels: meleeWeapRefObj.damageRange.label
    })
		// .slider("float", {
			// labels: meleeWeapRefObj.damageRange.val
    // })
		//slider changes
    .on("slidechange", function(e,ui) {
				newMeleeWeapObj.damageRange = ui.value;
        $("#meleeDamageTxt").val(meleeWeapRefObj.damageRange.CP[newMeleeWeapObj.damageRange]+" CP");
				updateMeleeWeaponCP(newMeleeWeapObj);
    });
    
	//ACCURACY
	$("#sliderMEA").slider({ 
        min: 0, 
        max: meleeWeapRefObj.accuracy.val.length-1,
        value: newMeleeWeapObj.accuracy
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(meleeWeapRefObj.accuracy.val)
    })
		// .slider("float", {
			// labels: castStringArray(meleeWeapRefObj.accuracy.val)
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				newMeleeWeapObj.accuracy = ui.value;
        $("#meleeAccuracyTxt").val(meleeWeapRefObj.accuracy.CM[ui.value]+" CM");
				updateMeleeWeaponCP(newMeleeWeapObj);
    });
    
    //Handy
    $('#chkMEH').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newMeleeWeapObj.handy = val;
        $("#MEHtxt").val(meleeWeapRefObj.handy.CM[val]+" CM");
       updateMeleeWeaponCP(newMeleeWeapObj);
    });
	
    //Clumsy
    $('#chkMEC').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newMeleeWeapObj.clumsy = val;
        $("#MECtxt").val(meleeWeapRefObj.clumsy.CM[val]+" CM");
       updateMeleeWeaponCP(newMeleeWeapObj);
    });
	
    //Quick
    $('#chkMEQ').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newMeleeWeapObj.quick = val;
        $("#MEQtxt").val(meleeWeapRefObj.quick.CM[val]+" CM");
       updateMeleeWeaponCP(newMeleeWeapObj);
    });
	
    //Armor Piercing
    $('#chkMEAP').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newMeleeWeapObj.armorPiercing = val;
        $("#MEAPtxt").val(meleeWeapRefObj.armorPiercing.CM[val]+" CM");
       updateMeleeWeaponCP(newMeleeWeapObj);
    });
	
    //Entangle
    $('#chkMEE').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newMeleeWeapObj.entangle = val;
        $("#MEEtxt").val(meleeWeapRefObj.entangle.CM[val]+" CM");
       updateMeleeWeaponCP(newMeleeWeapObj);
    });
	
    //Thrown
    $('#chkMET').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newMeleeWeapObj.throw = val;
        $("#METtxt").val(meleeWeapRefObj.throw.CM[val]+" CM");
       updateMeleeWeaponCP(newMeleeWeapObj);
    });
	
    //Returning
    $('#chkMER').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newMeleeWeapObj.returning = val;
        $("#MERtxt").val(meleeWeapRefObj.returning.CM[val]+" CM");
       updateMeleeWeaponCP(newMeleeWeapObj);
    });
	
    //Disruptor
    $('#chkMED').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newMeleeWeapObj.disruptor = val;
        $("#MEDtxt").val(meleeWeapRefObj.disruptor.CM[val]+" CM");
       updateMeleeWeaponCP(newMeleeWeapObj);
    });
	
    //Shock (Only)
    $('#chkMESO').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newMeleeWeapObj.shockOnly = val;
        $("#MESOtxt").val(meleeWeapRefObj.shockOnly.CM[val]+" CM");
       updateMeleeWeaponCP(newMeleeWeapObj);
    });
	
    //Shock (Added)
    $('#chkMESA').bind('change', function(){
        var val = $(this).is(':checked') ? 1 : 0;
        newMeleeWeapObj.shockAdded = val;
        $("#MESAtxt").val(meleeWeapRefObj.shockAdded.CM[val]+" CM");
       updateMeleeWeaponCP(newMeleeWeapObj);
    });
	
    //ADD WEAPON
    $("#addMeleeWeapon").button().click(function(){
        weapon.addWeapon('melee',newMeleeWeapObj);
        newMeleeWeapObj = new meleeWeapObj();
    });
}