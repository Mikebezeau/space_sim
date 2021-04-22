

//CLASS LIST***********************************
var classList = ['Superlight','Lightweight','Striker','Medium Striker','Heavy Striker','Mediumweight','Light Heavy','Medium Heavy','Armored Heavy','Super Heavy','Mega Heavy']
var classTorsoVal = [2,4,6,8,10,12,14,16,18,20,22];
var classHeadWingVal = [1,2,3,4,5,6,7,8,9,10,11];
var classArmLegVal = [2,3,4,5,6,7,8,9,10,11,12];
var classArmMeleeVal = [0,0,0,1,1,1,2,2,2,3,3];
var classLegMeleeVal = [0,0,1,1,2,2,3,3,4,4,5];

var classTreadVal = [2,4,6,8,10,12,14,16,18,20,22];
var classWheelVal = [1,2,3,4,5,6,7,8,9,10,12];

//COMMON 1-20 ARRAY
var oneToTwenty = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];


//DOUBLE SLIDER LABEL CREATOR
function doubleSliderLabel(topArr,bottomArr){
	var combinedArr = [];
	for(var i=0;i<topArr.length;i++){
		combinedArr[i] = '<b>'+topArr[i]+'</b>'+bottomArr[i];
	}
	return combinedArr;
}


//RETURN ARRAY WITH CONTENTS AS STRING
function castStringArray(array){
	var stringArray = [];
	for(var i=0; i<array.length; i++){
		stringArray[i] = String(array[i]);
	}
	return stringArray;
}


//RETURN ARRAY WITH CONTENTS AS PERCENTAGE
function castPercentArray(array){
	var percentArray = [];
	for(var i=0; i<array.length; i++){
		percentArray[i] = array[i]*100 + '%';
	}
	return percentArray;
}

//Convert MA to KMpH
function maToKMpH(MA){
    var KMpH = MA/21 * 1072 / 2; //alow for higher speeds out of combat for flying units
    //var KMpH = (MA * 50 / 1000) * 300; //300 insread of 600 for realistic speed
    //50 meters / hex : 1000 meters / Km : 1 turn = 10 seconds : 10 turns = 1 minute : 600 turns = 1 hour
    KMpH = Math.round(KMpH *10)/10; 
    return(KMpH);
}