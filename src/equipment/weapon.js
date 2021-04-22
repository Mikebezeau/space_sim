
//WEAPON OBJECT
var weapon = {//change weapon variable to unique name
		//ADD WEAPON TO MECH SERVO
		'addWeapon': function(weaponType, weapon){
				weapon.location = {'servoType':0, 'posX':0, 'posY':0};
				mecha.weaponList[weaponType].push(weapon);
				updateMecha();
				alert('Weapon Added');
		},
		'displayWeapons': function(){
				var weaponListString = '';
				//main headers listed one time at top
				weaponListString += '<div style="text-align:center;">Weapon List</div>';
				
				//loop through weapon group lists
				var index = 0;
				for(var key in mecha.weaponList) {
					//list all weapon in that group
					for(var i=0; i<mecha.weaponList[key].length; i++){
						//container div, replaced when weapon updated
						weaponListString += '<div id="'+key+i+'" class="weaponListBox">';
						//weapon info
						weaponListString += mecha.weaponList[key][i].getString(i);
						weaponListString += '</div>';
					}
					index++;
				}
				$('#weaponList').html(weaponListString);
                $('#accordion').accordion('refresh');
		},
		'getDamage': function(refObj,weapon){
				var damage = refObj.damageRange.val[weapon.damageRange];
				
                //if melee weapon add servo & hydraulics bonus
                if(refObj.damageRange.range == 'melee'){
                    damage += hydrRefObj.getMelee();
                    damage += mecha.stats.getMeleeBonus();
                }
                
                damage = mecha.getScaledVal(damage);
                
				return(damage);
		},
		'getStructure': function(refObj,weapon){
				var structure = this.getDamage(refObj,weapon) / 2;//already scaled
				structure = Math.ceil(structure * 10) / 10;
				return(structure);
		},
		'getAccuracy': function(refObj,weapon){
				return refObj.accuracy.val[weapon.accuracy];
		},
		'getRange': function(refObj,weapon){
                var range = 0;
                if(refObj.damageRange.range == 'melee'){
                    //melee weapon, check for thrown
                    if(weapon.throw == 1){
                        //find an arm servo, range equals 1/2 kills
                        for(var i=0; i<mecha.servoList.length; i++){
                            if(mecha.servoList[i].type == 'Arm') range = mecha.servoList[i].getClassValue()/2;
                        }
                    }
                }else{
                    range = Math.round(refObj.damageRange.range[weapon.damageRange] * refObj.rangeMod.val[weapon.rangeMod]);
                    range = weapon.longRange?range*range:range;
                }
                
            //only scale range if scaling up
            if(mecha.scaleMult[mecha.scale] > 1) range = mecha.getScaledVal(range);
                range = Math.round(range);
                return(range);
        },
				
		'getBurstValue': function(refObj,weapon){
				return refObj.burstValue.val[weapon.burstValue]
		},
		
		'getSP': function(weapon){
				var SP = mecha.getScaledVal(weapon.getBaseCP());
				SP = SP - mecha.getScaledVal(weapon.SPeff); //inculde scale for calc spaces saved or it's just not fair!
				SP = Math.round(SP*10) / 10;//WTF weird number
				return(SP);
    },
		
		'getCP': function(weapon){
				var CP = weapon.getBaseCP();
				CP = CP + weapon.Weff*2 + weapon.SPeff*2;
				CP = Math.round(CP*10) / 10;
				return(CP);
		},
		
		'getScaledCP': function(weapon){
				var scaledCP = this.getCP(weapon);
				scaledCP = mecha.getScaledCost(scaledCP);
				scaledCP = Math.round(scaledCP*10) / 10;
				return(scaledCP);
		}

}//end weapon object
		

function initWeaponUI(){
    
    //NEW WEAPON STATS
    $('#beamWeaponOutput').html(newBeamWeapObj.getString());
    $('#projWeaponOutput').html(newProjWeapObj.getString());
    $('#missileWeaponOutput').html(newMissileWeapObj.getString());
    $('#eMeleeWeaponOutput').html(newEMeleeWeapObj.getString());
    $('#meleeWeaponOutput').html(newMeleeWeapObj.getString());
    
    //NAME WEAPONS - dynamic text input
	$('body').on('input', 'input.nameWeapon', function() {
        mecha.weaponList[$(this).data('type')][$(this).data('index')].name = $(this).val();
        //console.log($(this).val());
    });
    
    //UPDATE WEAPON SP EFFICIENCY - dynamic text input
	$('body').on('input', 'input.weaponSPeff', function() {
        
        var type = $(this).data('type');
        var index = $(this).data('index');
        
        mecha.weaponList[type][index].SPeff = $(this).val();
        
				//update weapon listing on page
				updateMecha();
				
				//focus on input for user
				$('#'+type+index+' input.weaponSPeff').focus();
				//move cursor to end of text
				var temp = $('#'+type+index+' input.weaponSPeff').val();
				$('#'+type+index+' input.weaponSPeff').val('');
				$('#'+type+index+' input.weaponSPeff').val(temp);
    });
    
    //UPDATE WEAPON Weight EFFICIENCY - dynamic text input
	$('body').on('input', 'input.weaponWeff', function() {
        
        var type = $(this).data('type');
        var index = $(this).data('index');
        
        mecha.weaponList[type][index].Weff = $(this).val();
        
				//update weapon listing on page
				updateMecha();
				
				//focus on input for user
				$('#'+type+index+' input.weaponWeff').focus();
				//move cursor to end of text
				var temp = $('#'+type+index+' input.weaponWeff').val();
				$('#'+type+index+' input.weaponWeff').val('');
				$('#'+type+index+' input.weaponWeff').val(temp);
    });
    
}