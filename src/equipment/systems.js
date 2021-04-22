
var systemsList = ['Scaling','Cloaking','Maneuver Verniers','Refined Hydraulics','Techno Organics','Transformable'];


function initSystemsUI(){
    
    for(var i=0; i<systemsList.length; i++)
	{
		$('#systemSelect').append('<div class="systemBtn" data-part-id="'+i+'">'+systemsList[i]+'</div>');
	}
    
}