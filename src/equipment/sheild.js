


var shieldRefObj = {
	'type': [{'class':["Superlight","Striker","Heavy Striker","Light Heavy","Armored Heavy","Mega Heavy"],
			'SP':[2,4,6,8,10,12],
			'CP':[1,2,3,4,6,9]},
		{'class':["Superlight","Striker","Heavy Striker","Light Heavy","Armored Heavy","Mega Heavy"],
			'SP':[2,4,6,8,10,12],
			'CP':[1,2,3,4,6,9]},
		{'class':["Superlight","Striker","Heavy Striker","Light Heavy","Armored Heavy","Mega Heavy"],
			'SP':[2,4,6,8,10,12],
			'CP':[1,2,3,4,6,9]}],
	'parryFactor': {'val':[1,2,3,5,10], 'CM':[0.5,1,1.5,2,3]},
	'binders': {'val':[1,2,3,5,10], 'space':[1,3,5,7,9,11], 'CM':[1.1,1.3,1.5,1.4,1.3,1.2]}
}

function shieldObj(){
	this.type = 0;
	this.class = 0;
	this.parryFactor = 0;
	this.binders = 0;
	this.armor = new armorObj();
	
    this.getString = function(includeHeader){
        var string = '<table><tr><th>Damage</th><th>Structure</th><th>Range</th><th>Accuracy</th><th>BV</th><th>Special</th><th>Other</th><th>Notes</th><th>Cost</th><th>Space</th></tr>';/*
        string += '<tr><td>'+beamWeapRefObj.damage.val[this.damage]+'</td>'
            +'<td>'+(this.fragile?'1':Math.round(beamWeapRefObj.damage.val[this.damage] / 2))+'</td>'
            +'<td>'+this.getRange()+'</td>'
            +'<td>'+beamWeapRefObj.accuracy.val[this.accuracy]+'</td>'
            +'<td>'+beamWeapRefObj.burstValue.val[this.burstValue]+'</td>'

            +'<td>'+(this.special?beamWeapRefObj.special.val[this.special]:'')+(this.variable?', Variable':'')+'</td>'

            +'<td>'+(this.shots?beamWeapRefObj.shots.val[this.shots]+' Shots':'')+(this.warmUp?'Warm Up: '+beamWeapRefObj.warmUp.val[this.warmUp]:'')+'</td>'

            +'<td>'+(this.wideAngle?'Wide Angle: '+beamWeapRefObj.wideAngle.val[this.wideAngle]:'')
            +(this.longRange?'|Long Range|':'')
            +(this.megaBeam?'|Mega Beam|':'')
            +(this.disruptor?'|Disruptor|':'')+'</td>'

            +'<td>'+this.getCP()+'</td>'
            +'<td>'+this.getCP()+'</td>'
*/
            +'<tr>'
            //delete line above
            +'</tr></table>';

        return(string);
    }
    
	this.getCP = function(){
		var CP = shieldRefObj.type[this.type].CP[this.class];
		CP = CP 
            * shieldRefObj.parryFactor.CM[this.parryFactor] 
            * shieldRefObj.binders.CM[this.binders]
            ;
        CP = Math.round(CP*100) / 100;

        /*console.log(shieldRefObj.parryFactor.CM[this.parryFactor]
            +' '+shieldRefObj.binders.CM[this.binders]
        );*/
        return CP;
	}
}

//DISPLAY THE TOTAL COST OF NEW SHIELD
function updateShieldCP(newShieldObj){
	var CP = newShieldObj.getCP();
	$('#shieldCPTxt').val(CP);
}


//SHIELD******************************************
function initSheildUI(){
  $( "#shieldBtn" ).click(function(){
		//display
		$('#shieldOutput').html(newShieldObj.getString());
		// newShieldObj = new shieldObj();
		// console.log(newShieldObj);
	});
	
	$(".shieldActive").hide();
	$(".shieldReactive").hide();
	
	//TYPE
	$("#shieldType input").checkboxradio({
		classes: {
			"ui-checkboxradio": "highlight"}
		})
		.on('change', function(e) {
			var type = parseInt($('#Shield input[name="shieldType"]:checked').val());
			newShieldObj.type = type;
			switch(type){
				case 0:
					$(".shieldStandard").show();
					$(".shieldActive").hide();
					$(".shieldReactive").hide();
					$("#parryFactor").hide();
					$("#binderSpace").show();
					break;
				case 1:
					$(".shieldStandard").hide();
					$(".shieldActive").show();
					$(".shieldReactive").hide();
					$("#parryFactor").show();
					$("#binderSpace").show();
					break;
				case 2:
					$(".shieldStandard").hide();
					$(".shieldActive").hide();
					$(".shieldReactive").show();
					$("#parryFactor").show();
					$("#binderSpace").hide();
					break;
				
			}
		}
	);
	
	//STANDARD - CLASS
	//console.log(shieldRefObj.type[0].SP.length);
	//console.log(shieldRefObj.type[0].SP);
	//console.log(shieldRefObj.type[0].class);
	$("#sliderSSC").slider({
		min: 0,
		max: shieldRefObj.type[0].SP.length-1,
        value: 0
	}).slider("pips", {
			rest: "label",
			labels: castStringArray(shieldRefObj.type[0].class)
    })
		// .slider("float", {
			// labels: shieldRefObj.type[0].SP
    // })
		//slider changes
    .on("slidechange", function(e,ui) {
				//console.log(ui.value);
				newShieldObj.class = ui.value;
        $("#shieldStandardClassTxt").val(shieldRefObj.type[0].CP[newShieldObj.class]+" CP");
				updateShieldCP(newShieldObj);
    });
	
	//ACTIVE - CLASS
	//console.log(shieldRefObj.type[1].SP.length);
	//console.log(shieldRefObj.type[1].SP);
	//console.log(shieldRefObj.type[1].class);
	$("#sliderSAC").slider({
		min: 0,
		max: shieldRefObj.type[1].SP.length-1,
        value: 0
	}).slider("pips", {
			rest: "label",
			labels: castStringArray(shieldRefObj.type[1].class)
    })
		// .slider("float", {
			// labels: shieldRefObj.type[1].SP
    // })
		//slider changes
    .on("slidechange", function(e,ui) {
				//console.log(ui.value);
				newShieldObj.class = ui.value;
        $("#shieldStandardClassTxt").val(shieldRefObj.type[1].CP[newShieldObj.class]+" CP");
				updateShieldCP(newShieldObj);
    });
	
	//REACTIVE - CLASS
	//console.log(shieldRefObj.type[2].SP.length);
	//console.log(shieldRefObj.type[2].SP);
	//console.log(shieldRefObj.type[2].class);
	$("#sliderSRC").slider({
		min: 0,
		max: shieldRefObj.type[2].SP.length-1,
        value: 0
	}).slider("pips", {
			rest: "label",
			labels: castStringArray(shieldRefObj.type[2].class)
    })
		// .slider("float", {
			// labels: shieldRefObj.type[2].SP
    // })
		//slider changes
    .on("slidechange", function(e,ui) {
				//console.log(ui.value);
				newShieldObj.class = ui.value;
        $("#shieldStandardClassTxt").val(shieldRefObj.type[2].CP[newShieldObj.class]+" CP");
				updateShieldCP(newShieldObj);
    });
	
	//PARRY FACTOR
	$("#parryFactor").hide();
	$("#sliderSPF").slider({ 
        min: 0, 
        max: shieldRefObj.parryFactor.val.length-1,
        value: newShieldObj.parryFactor
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(shieldRefObj.parryFactor.val)
    })
		// .slider("float", {
			// labels: shieldRefObj.parryFactor.val
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				newShieldObj.parryFactor = ui.value;
        $("#shieldParryFactorTxt").val(shieldRefObj.parryFactor.CM[ui.value]+" CM");
				updateShieldCP(newShieldObj);
    });
    
	//BINDER SPACE
	$("#sliderSBS").slider({ 
        min: 0, 
        max: shieldRefObj.parryFactor.val.length-1,
        value: newShieldObj.parryFactor
    })
    .slider("pips", {
        rest: "label",
        labels: castStringArray(shieldRefObj.parryFactor.val)
    })
		// .slider("float", {
			// labels: shieldRefObj.parryFactor.val
    // })
		//slider change
    .on("slidechange", function(e,ui) {
				newShieldObj.parryFactor = ui.value;
        $("#shieldParryFactorTxt").val(shieldRefObj.parryFactor.CM[ui.value]+" CM");
				updateShieldCP(newShieldObj);
    });
}