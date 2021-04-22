import { equipConst, equipList } from "./equipList";

export const scale = {
  applyScaledWeight: function (scale, weight) {
    return Math.round(weight * equipList.scale.weightMult[scale] * 10) / 10;
  },

  applyScaledCP: function (scale, CP) {
    console.log(scale, CP);
    return Math.round(CP * equipList.scale.costMult[scale] * 10) / 10;
  },
};

export const servo = {
  class: function (servo) {
    return equipList.class.type[servo.class];
  }, //class name (i.e. striker)

  classValue: function (servo) {
    //class number value
    var servoVal = 0;
    switch (servo.type) {
      case "Head":
      case "Wing":
        servoVal = equipList.class.headWingVal[servo.class];
        break;
      case "Arm":
      case "Leg":
        servoVal = equipList.class.armLegVal[servo.class];
        break;
      case "Torso":
        servoVal = equipList.class.torsoVal[servo.class];
        break;
    }
    return servoVal;
  },

  weight: function () {
    //space points
    var weight = this.getClassValue() / 2;
    weight = weight + this.armor.getWeight(); //armor weight
    weight = weight - this.wEff;
    return weight;
  },

  armorCP: function () {
    //cost points
    var CP = this.getClassValue() + 2 * this.wEff; //each weight point reduced costs 2 CP
    CP = CP + this.armor.getCP();
    return CP;
  },

  scaledCP: function (scale, servo) {
    //cost points
    let CP = servo.getCP() + servo.armor.getCP();
    CP = scale.applyScaledCP(scale, CP);
    return CP;
  },

  armMeleeBonus: function (servoList) {
    //melee damage bonus
    let meleeVal = 0;
    for (let i = 0; i < servoList.length; i++) {
      //find arm class
      if (servoList[i].type === "Arm")
        meleeVal = equipList.class.armMeleeVal[servoList[i].class];
    }
    return meleeVal;
  },
};

export const mecha = {
  meleeBonus(hydraulicsType) {
    return equipList.hydraulics.melee[hydraulicsType];
  },

  scaledMeleeBonus: function (hydraulicsType) {
    let meleeBonus = scale.applyScaledWeight(
      equipList.hydraulics.melee[hydraulicsType]
    ); //scale melee damage bonus with mecha scale
    return meleeBonus;
  },

  crewSP: function (cockpitType, crew, passengers) {
    let SP = 0;
    if (cockpitType !== 2) SP = crew * 10;
    SP += 10 * passengers;
    return SP;
  },

  crewCP: function (crew, passengers) {
    let CP = 0;
    CP = (crew - 1) * 2;
    CP += passengers * 1;
    return CP;
  },

  totalWeight: function (servoList, weaponList, weightIneff, weightEff) {
    let weight = 0;
    for (let i = 0; i < servoList.length; i++) {
      //servo & armor weight
      weight += servoList[i].getWeight();
      //console.log(weight);
    }
    for (let key in weaponList) {
      for (let i = 0; i < weaponList[key].length; i++) {
        weight += weaponList[key][i].getWeight();
        //console.log(weight);
      }
    }
    if (weightIneff) weight = weight * 2;
    weight = weight - weightEff;
    return weight;
  },

  totalCP: function (
    crewCP,
    servoList,
    weaponList,
    partList,
    hydraulicsType,
    controlType,
    weightIneff,
    weightEff
  ) {
    let CP = 0;

    //crew CP
    CP += crewCP;

    for (let i = 0; i < servoList.length; i++) {
      //servo & armor weight
      CP += servoList[i].getCP();
    }
    for (let key in weaponList) {
      for (let i = 0; i < weaponList[key].length; i++) {
        //CP += weapon.getCP(weaponList[key][i]);
        CP += weaponList[key][i].getCP();
      }
    }
    //Parts CP
    for (let i = 0; i < partList.length; i++) {
      CP += partList[i].CP;
    }
    //Weight Inefficiency
    if (weightIneff) CP = CP * 0.8; //%20 cost reduction

    //Cost Multiple Systems *** create function systems.getCM()
    CP = CP * equipList.hydraulics.CM[hydraulicsType];
    //controls CM
    CP = CP * equipList.controls.CM[controlType];

    //Weight Efficiency (after multipliers)
    CP = CP + 2 * weightEff; //2 CP / 1 weight

    CP = Math.round(CP * 100) / 100;
    return CP;
  },

  KGWeight: function (weight) {
    weight = weight / 2.5; //(weight * equipList.scale.weightMult[get().scale]) / 2.5;
    let KG = Math.round(weight * 1000);
    if (KG > 1000) {
      //convert to tonnes
      let tonnes = KG / 1000;
      tonnes = Math.round(tonnes * 10) / 10;
      return tonnes + " tonnes";
    }
    return KG + " kg";
  },

  //Convert MA to KMpH
  MAtoKMpH: function (MA) {
    let KMpH = ((MA / 21) * 1072) / 2; //alow for higher speeds out of combat for flying units
    //let KMpH = (MA * 50 / 1000) * 300; //300 insread of 600 for realistic speed
    //50 meters / hex : 1000 meters / Km : 1 turn = 10 seconds : 10 turns = 1 minute : 600 turns = 1 hour
    KMpH = Math.round(KMpH * 10) / 10;
    return KMpH;
  },

  groundMA: function (scale, weight) {
    let MA = 0;
    if (weight < 20) MA = 6;
    else if (weight < 40) MA = 5;
    else if (weight < 60) MA = 4;
    else if (weight < 80) MA = 3;
    else MA = 2;
    if (scale === 0) MA = MA / 2; //half MA for power armor
    return MA;
  },

  groundKMpH: function (groundMA) {
    let MAKMpH = this.MAtoKMpH(groundMA);
    return MAKMpH;
  },

  MV: function (scale, weight) {
    let scaleMod = scale * 2;
    let MV = 0;
    if (weight < 20) MV = -1 - scaleMod;
    else if (weight < 30) MV = -2 - scaleMod;
    else if (weight < 40) MV = -3 - scaleMod;
    else if (weight < 50) MV = -4 - scaleMod;
    else if (weight < 60) MV = -5 - scaleMod;
    else if (weight < 70) MV = -6 - scaleMod;
    else if (weight < 80) MV = -7 - scaleMod;
    else if (weight < 90) MV = -8 - scaleMod;
    else if (weight < 100) MV = -9 - scaleMod;
    //else return -10 - scale;
    if (MV > 0) MV = 0; //max MV of 0
    return MV;
  },

  liftVal: function (servoList, hydraulicsType) {
    //lifting ability
    let torsoClass = 0;
    let liftVal = 0;
    for (let i = 0; i < servoList.length; i++) {
      //find torso class
      if (servoList[i].type === "Torso") torsoClass = servoList[i].class;
    }
    //  /2.5 for conversion
    liftVal = ((torsoClass + 1) * 5) / 2.5;
    liftVal =
      scale.applyScaledWeight(liftVal) *
      equipList.hydraulics.lift[hydraulicsType];
    return liftVal;
  },
};
