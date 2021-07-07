import { equipList } from "../data/equipData";

function applyScaledWeightMult(scale, weight) {
  return Math.round(weight * equipList.scale.weightMult[scale] * 10) / 10;
}

function applyScaledCPMult(scale, CP) {
  return Math.round(CP * equipList.scale.costMult[scale] * 10) / 10;
}

const armorUtil = {
  value: function (armor) {
    //cost points
    return equipList.class.armorVal[armor.class]; //each weight point reduced costs 2 CP
  },

  type: function (armor) {
    return (
      equipList.armor.rating[armor.rating] +
      "(" +
      equipList.armor.threshold[armor.rating] +
      ")"
    );
  },

  threshold: function (armor) {
    return equipList.armor.threshold[armor.rating];
  },

  CP: function (armor) {
    //cost points
    var CP = equipList.class.armorVal[armor.class]; //each weight point reduced costs 2 CP
    CP = CP + equipList.armor.costMP[armor.rating];
    return CP;
  },

  weight: function (armor) {
    //
    return 0;
  },
};

const servoUtil = {
  servoLocation: function (locationServoId, servos) {
    return servos.find((s) => s.id === locationServoId);
  },

  classValue: function (type, classIndex) {
    //class number value
    var servoVal = 0;
    switch (type) {
      case "Head":
      case "Pod":
      case "Wing":
        servoVal = equipList.class.headWingVal[classIndex];
        break;
      case "Arm":
      case "Leg":
        servoVal = equipList.class.armLegVal[classIndex];
        break;
      case "Torso":
        servoVal = equipList.class.torsoVal[classIndex];
        break;
      default:
    }
    return servoVal;
  },

  size: function (scale, classValue) {
    //used to calculate size of servo parts 3d rendering
    let size = applyScaledWeightMult(scale, classValue);
    return size / 4; //slight reflection of volume change when dimensions change
  },

  structure: function (scale, classValue, SPMod) {
    return applyScaledWeightMult(scale, classValue) - SPMod; //space modifier (bonus space reduces structure points)
  },

  SP: function (scale, classValue, SPMod) {
    //space points
    var SP = applyScaledWeightMult(
      scale,
      classValue // + hydrRefObj.SP[mecha.hydraulicsType]
    );
    SP = SP + SPMod; //space modifier (bonus space allotted)
    return SP;
  },
  usedSP: function (id, mechBP) {
    let usedSP = 0;
    //look for weapons in this location
    Object.values(mechBP.weaponList).forEach((weapons) => {
      weapons.forEach((weapon) => {
        usedSP += weapon.locationServoId === id ? weapon.scaledCP() : 0;
      });
    });
    //check hydraulics
    //check crew
    if (mechBP.crewLocationServoId[0] === id) usedSP += mechBP.crewSP();
    //check all else
    return usedSP;
  },
  CP: function (classValue, wEff, armor) {
    //cost points
    var CP = classValue + 2 * wEff; //each weight point reduced costs 2 CP
    CP = CP + armorUtil.CP(armor);
    return CP;
  },

  scaledCP: function (scale, CP) {
    //cost points
    return applyScaledCPMult(scale, CP);
  },

  weight: function (classValue, wEff, armor) {
    //space points
    var weight = classValue / 2;
    weight = weight + armorUtil.weight(armor.class); //armor weight
    weight = weight - wEff;
    return weight;
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

const mech = {
  size(servoList) {
    let mechSize = 0;
    //let largestOffset = 0;
    //find largest servo and set size to this value
    servoList.forEach((s, i) => {
      //servo & offset
      mechSize = s.size() > mechSize ? s.size() : mechSize;
      //const offsetVal =
      //  Math.abs(s.offset.x) + Math.abs(s.offset.y) + Math.abs(s.offset.z);
      //largestOffset = offsetVal > largestOffset ? offsetVal : largestOffset;
    });
    return mechSize; // + largestOffset;
  },

  meleeBonus(hydraulicsType) {
    return equipList.hydraulics.melee[hydraulicsType];
  },

  scaledMeleeBonus: function (hydraulicsType) {
    let meleeBonus = applyScaledWeightMult(
      equipList.hydraulics.melee[hydraulicsType]
    ); //scale melee damage bonus with mech scale
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

  servoWeaponList: function (servoId, weaponList) {
    let servoWeapons = [];
    Object.values(weaponList).forEach((weapons, key) => {
      weapons.forEach((weapon) => {
        if (weapon.locationServoId === servoId) {
          servoWeapons.push(weapon);
        }
      });
    });
    return servoWeapons;
  },

  findWeaponId: function (weaponId, weaponList) {
    let found = null;
    Object.values(weaponList).forEach((weapons) => {
      weapons.forEach((weapon) => {
        if (weapon.id === weaponId) found = weapon;
      });
    });
    return found;
  },

  totalWeight: function (servoList, weaponList, weightIneff, weightEff) {
    let weight = 0;
    for (let i = 0; i < servoList.length; i++) {
      //servo & armor weight
      weight += servoList[i].weight();
    }
    for (let key in weaponList) {
      for (let i = 0; i < weaponList[key].length; i++) {
        weight += weaponList[key][i].weight();
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
      CP += servoList[i].CP();
    }
    for (let key in weaponList) {
      for (let i = 0; i < weaponList[key].length; i++) {
        //CP += weapon.getCP(weaponList[key][i]);
        CP += weaponList[key][i].CP();
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

  liftVal: function (scale, servoList, hydraulicsType) {
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
      applyScaledWeightMult(scale, liftVal) *
      equipList.hydraulics.lift[hydraulicsType];
    return liftVal;
  },

  maxWeaponRange: function (allWeaponList) {
    let maxRange = 0;
    allWeaponList.forEach((weapon) => {
      maxRange = weapon.range > maxRange ? weapon.range : maxRange;
    });
    return maxRange;
  },
};

export { applyScaledWeightMult, applyScaledCPMult, servoUtil, mech, armorUtil };
