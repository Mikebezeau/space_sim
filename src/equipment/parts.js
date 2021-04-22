

//PARTS***********************************
var partList = ['Weapon Link','Command Armor','Energy Absorbers','Gravatic Propulsion','Reconnaissance Systems','Refined Powerplants','Refined Sensors','Statistical Enhancement','Stealth', 'Anti Spotting Radar','Weapon Mount']

function partObj(partID, val1, val2, CP){
	//console.log(partList);
	this.type = partList[partID];
	this.partID = partID;
	//val1Title...
	this.val1 = val1;
	this.val2 = val2;
	this.CP = CP;
}

function cmdArmor(partID, val1, val2, CP){
	//console.log(partList);
	this.type = partList[partID];
	this.partID = partID;
	//val1Title...
	this.val1 = val1;
	this.val2 = val2;
	this.CP = CP;
}


//ADD PART TO MECHA
function addPart(partID, val1, val2, CP){
	var newPart = new partObj(partID, val1, val2, CP);
	mecha.partList.push(newPart);
	//console.log(newPart);
    alert(newPart.type+' Added');
	updateMecha();
}


//DISPLAY LIST OF PARTS
function displayParts(){
	$('#partList').html('');
	var partsString = '';//'<div style="text-align:center;">Parts List</div>';
	for(var i=0; i<mecha.partList.length; i++){
        partsString += '<div data-id="'+i+'" class="">'+mecha.partList[i].type;
        switch(mecha.partList[i].type){
            case 'Weapon Link':
                partsString += '<input class="partVal1" data-index="'+i+'" value="'+mecha.partList[i].val1+'"/>';
                partsString += '<input class="partCP" data-index="'+i+'" value="'+mecha.partList[i].CP+' CP"/>';
                break;
            case 'Energy Absorbers':
                partsString += '';
                break;
                
        }
        partsString += '</div>';
	}
	$('#partList').append(partsString);
    
    $('#accordion').accordion('refresh');
}


//PARTS
function initPartsUI(){
    
	//DISPLAY PART BUTTONS
	for(var i=0; i<partList.length; i++)
	{
		$('#partSelect').append('<div class="partBtn" data-part-id="'+i+'">'+partList[i]+'</div>');
	}
	//PART SELECTION
	$('.partBtn').click(function(){
		$('.partTabPg').hide();
		$('#part'+$(this).data('part-id')).show();
	});
	
}