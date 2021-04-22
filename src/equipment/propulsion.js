
var propulsionRefObj = {
	'type': ['GES', 'Hydrojet', 'Thrusters', 'Anti-Gravity'],
	'typeNotes': ['Hover, max. 20 MA', 'Move on or under water, 1/3 MA if not a submersible or boat', 'Flight', 'Flight, no fuel required'],
    
    'CPperMAweightMult': [0.025, 0.025, 0.0375, 0.05],
        
    'getCPperMA': function(type, addFuelWeight){
        if(arguments.length < 2) addFuelWeight = 0;
        
        //Mach1 = 21 MA, escape vel. = 109 MA
        var weight = mecha.getWeight(); // + 10% if need to include fuel for new system
        if(addFuelWeight) weight += mecha.getWeight() * 0.1;
        var CPperMA = weight * this.CPperMAweightMult[type];
        return(CPperMA);
    },
    
	'getAccel': function(){
        //acceleration = MA/8
    },
    
	'getLift': function(){
        
    },
    
	'getFuelCP': function(){
        //base fuel load = 10% of total mech weight
    },
    
	'getCP': function(propulsionObj, addFuelWeight){ //add this to mecha.getCP()
        if(arguments.length < 2) addFuelWeight = 0;
        var CP = this.getCPperMA(propulsionObj.type, addFuelWeight) * propulsionObj.MA;
        CP = CP + propulsionObj.SPeff * 2;
        //scale ** use getScaledVal() ** getScaledCost() increases CP and SP, SP becomes to high
        CP = mecha.getScaledVal(CP);
        CP = Math.round(CP*10) / 10;
        return(CP);
    },
    
	'getSP': function(propulsionObj){//fuel weight has already been included at this point
        var SP = this.getCP(propulsionObj, 0);
        SP = SP - propulsionObj.SPeff;
        SP = mecha.getScaledVal(SP);
        SP = Math.round(SP*10) / 10;
        return(SP);
    },
    
}


function propulsionObj(){
	this.type = 0;//GES
    this.MA = 0;
    this.SPeff = 0;
    this.spaceAllocation = [];
    
    this.tableHeaders= '<tr><th>Type</th><th>MA</th><th>Max. MA</th><th>Accel.</th><th>Space Eff.</th><th>Space</th><th>CP</th></tr>';
    
    this.getString= function(index){
        var accel = Math.round(this.MA / 8 * 10) / 10;
        var propString = '<tr><th>'+propulsionRefObj.type[this.type]+'</th><th>'+this.MA+'</th><th>'+this.MA*2+'</th><th>'+accel+'</th>'
            +'<td class="greenHighlight"><input type="text" class="propulsionSPeff" data-index="'+index+'" value="'+this.SPeff+'"/>'
            +'</td><th>'+propulsionRefObj.getSP(this)+'</th><th>'+propulsionRefObj.getCP(this)+'</th></tr>';
        return(propString);
    }
}

function updatePropulsionCP(){
    var addFuelWeight = newPropulsionObj.type != 3 ? true : false; //add fuel weight if not grav
    var CP = mecha.getScaledVal(propulsionRefObj.getCP(newPropulsionObj, addFuelWeight));
    $("#propulsionCP").val(CP + ' CP / SP');
    var accel = Math.round(newPropulsionObj.MA / 8 * 10) / 10;
    $('#propulsionKMpH').val(maToKMpH(newPropulsionObj.MA));
    $('#propulsionAccelKMpH').val(accel);
    $('#propulsionMaxKMpH').val(maToKMpH(newPropulsionObj.MA * 2));
}

function displayPropulsion(){
    var propString = '<tr><th>Propulsion Systems</th></tr>';
    propString += newPropulsionObj.tableHeaders;
    for(var key in mecha.propulsionList) {
        propString += mecha.propulsionList[key].getString();
    }
   $('#propulsionList').html(propString);
}

function initPropulsionUI(){
    
    //PROPULSION TYPE SELECT MENU
    $("#propulsionType").selectmenu({
        change:function(event,ui){
            newPropulsionObj.type = $("#propulsionType").val();
            updatePropulsionCP();
        }
    });
    
    //MA SELECT MENU
    $("#propulsionMA").selectmenu({
        change:function(event,ui){
            newPropulsionObj.MA = $("#propulsionMA").val();
            updatePropulsionCP();
        }
    });
    
    //ADD PROPULSION
    $("#addPropulsion").button().click(function(){
        mecha.propulsionList.push(newPropulsionObj);
        newPropulsionObj = new propulsionObj();
        $("#propulsionMA").val(0);
        $("#propulsionMA").selectmenu('refresh');
        updatePropulsionCP();
        updateMecha();//will display propulsion list
    });
}
    