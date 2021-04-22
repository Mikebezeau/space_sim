import create from "zustand";
import useEquipStore from "./equipStore";

const { lists, getScaledCost, getScaledVal, hydrRefObj } = useEquipStore(
  (state) => state
);

//SERVO***********************************
//storage 1 SP = 100kg
const [useServoStore] = create((set, get) => {
  return {
    type: "",
    class: 0,

    getClass: function () {
      return lists.classList[get().class];
    }, //class name (i.e. striker)

    getClassValue: function () {
      //class number value
      let servoVal = 0;
      switch (get().type) {
        case "Head":
        case "Wing":
          servoVal = lists.classHeadWingVal[get().class];
          break;
        case "Arm":
        case "Leg":
          servoVal = lists.classArmLegVal[get().class];
          break;
        case "Torso":
          servoVal = lists.classTorsoVal[get().class];
          break;
      }
      return servoVal;
    },

    getStructure: function () {
      let structure = getScaledVal(get().getClassValue());
      structure = structure - get().SPMod; //space modifier (bonus space reduces structure points)
      return structure;
    },

    getSP: function () {
      //space points
      let SP = getScaledVal(
        get().getClassValue() + hydrRefObj.SP[lists.hydraulicsType]
      );
      SP = SP + get().SPMod; //space modifier (bonus space allotted)
      return SP;
    },
    SPMod: 0,

    getWeight: function () {
      //space points
      let weight = get().getClassValue() / 2;
      weight = weight + get().armor.getWeight(); //armor weight
      weight = weight - get().wEff;
      return weight;
    },
    wEff: 0,

    armor: {
      class: 5,
      type: 1, //STANDARD RATING
      shield: 0, //NOT A SHIELD
    },

    //cmdArmor : new cmdArmor(),
    posX: 0,
    posY: 0,

    getCP: function () {
      //cost points
      let CP = get().getClassValue() + 2 * this.wEff; //each weight point reduced costs 2 CP
      CP = CP + get().armor.getCP();
      return CP;
    },

    getScaledCP: function () {
      //cost points
      let CP = get().getCP() + get().armor.getCP();
      CP = getScaledCost(CP);
      return CP;
    },
  };
});

export default useServoStore;

/*
//SERVO BUTTON CLICK ADDS SERVO, PROMPT USER TO SELECT ATTACH LOCATION
function selectServoClass(servoType) {
  servoValues = classHeadWingVal;


  //SHOW SERVO CLASS SELECTION
//selectServoClass("Head"); mecha.servoList.push(newServo);
  let servoSelectHtml = "<h3>Select Servo Class</h3>";
  for (let i = 0; i < classList.length; i++) {
    servoSelectComplete(servoType, i)
      classList[i] servoValues[i] 
  }
  */
