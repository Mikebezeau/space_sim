//import all from equipment

//NEW PART CREATION OBJECTS
const newPropulsionObj = new propulsionObj();
const newBeamWeapObj = new beamWeapObj();
const newProjWeapObj = new projWeapObj();
const newMissileWeapObj = new missileWeapObj();
const newEMeleeWeapObj = new eMeleeWeapObj();
const newMeleeWeapObj = new meleeWeapObj();
const newShieldObj = new shieldObj();

const initEquip = () => {
  //INITIALIZE COMMON UI CONTROLS
  //POP UP DIALOG COMMON MENU
  /*
    $('#dialog').dialog();
    $('#dialog').dialog('close');
    */
  //CHECKBOX
  /*
    $('.chkBox').checkboxradio({
      classes: {
        "ui-checkboxradio": "highlight"
      }
    });
    */
  //TAB BUTTON CLICK CHANGES PAGE
  /*
	$('.tabBtn').click(function(){
		$('.tabPg').hide();
		$('#'+$(this).data('page')).show();
	});

    $('#accordion').accordion({heightStyle: 'content'});
    */
  //SHOW SERVO PAGE
  //$('#Servos').show();
  //INITIAILZE PART OBJECTS AND UI
  /*
    //CREW / UPDATE UI
    initCrewUI();
    //WEAPONS
    initBeamUI();
    initEMeeleUI();
    initMeeleUI();
    initMissileUI();
    initProjUI();
    //COMMON WEAPON UI
    initWeaponUI();
    //SHIELD
    initSheildUI();
    //SERVOS
    initServosUI();
    //PROPULSION
    initPropulsionUI();
    //PARTS
    initPartsUI();
    //MULTI SYSTEMS
    initSystemsUI();
    //MECHA / UPDATE UI
    initMechaUI();
    
    */
  //updateMecha();
  //FOR TESTING
  /*
    servoSelectComplete('Head',5);
    servoSelectComplete('Torso',5);
    servoSelectComplete('Arm',5);
    servoSelectComplete('Arm',5);
    servoSelectComplete('Leg',5);
    servoSelectComplete('Leg',5);
    
    weapon.addWeapon('proj',newProjWeapObj);
    weapon.addWeapon('beam',newBeamWeapObj);
    weapon.addWeapon('eMelee',newEMeleeWeapObj);
    */
};
