import { equipList } from "../data/equipData";
import { weaponList } from "../data/weaponData";
import { applyScaledWeightMult, applyScaledCPMult } from "./equipUtil";

const weaponUtil = {
  //keep weight separate for unique calculations based on weapon type
  weight: function (data) {
    let weight =
      weaponList[data.weaponType].damageRange.val[data.damageRange] / 2 -
      data.wEff;
    weight = Math.round(weight * 100) / 100; //strange rounding issue
    return weight;
  },

  //needed for calculating space / space efficiency properly
  baseCP: function (data) {
    switch (data.weaponType) {
      case "beam":
        let CP = weaponList.beam.damageRange.CP[data.damageRange];
        CP =
          CP *
          weaponList.beam.accuracy.CM[data.accuracy] *
          weaponList.beam.shots.CM[data.shots] *
          weaponList.beam.rangeMod.CM[data.rangeMod] *
          weaponList.beam.warmUp.CM[data.warmUp] *
          weaponList.beam.wideAngle.CM[data.wideAngle] *
          weaponList.beam.burstValue.CM[data.burstValue] *
          weaponList.beam.special.CM[data.special] *
          weaponList.beam.variable.CM[data.variable] *
          weaponList.beam.fragile.CM[data.fragile] *
          weaponList.beam.longRange.CM[data.longRange] *
          weaponList.beam.megaBeam.CM[data.megaBeam] *
          weaponList.beam.disruptor.CM[data.disruptor];
        return CP;
      default:
        console.log("invalid weapon type");
        return null;
    }
  },

  damage: function (data) {
    var damage = weaponList[data.weaponType].damageRange.val[data.damageRange];

    //if melee weapon add servo & hydraulics bonus
    /*
    if (weaponList[weaponType].damageRange.range == "melee") {
      damage += hydrRefObj.getMelee();
      damage += mecha.stats.getMeleeBonus();
    }
*/
    damage = applyScaledWeightMult(data.scale, damage);
    return damage;
  },
  structure: function (damage) {
    var structure = damage / 2; //already scaled
    structure = Math.ceil(structure * 10) / 10;
    return structure;
  },
  accuracy: function (data) {
    return weaponList[data.weaponType].accuracy.val[data.accuracy];
  },
  range: function (data, housingSservo) {
    var range = 0;
    if (weaponList[data.weaponType].damageRange.range === "melee") {
      //melee weapon, check for thrown
      if (data.throw === 1) {
        //find an arm servo, range equals 1/2 kills
        /*
        for (var i = 0; i < mecha.servoList.length; i++) {
          if (mecha.servoList[i].type == "Arm")
            range = mecha.servoList[i].getClassValue() / 2;
        }
        */
      }
    } else {
      range = Math.round(
        weaponList[data.weaponType].damageRange.range[data.damageRange] *
          weaponList[data.weaponType].rangeMod.val[data.rangeMod]
      );
      range = data.longRange ? range * range : range;
    }

    //only scale range if scaling up
    if (equipList.scale.weightMult[data.scale] > 1)
      range = applyScaledWeightMult(data.scale, range);
    range = Math.round(range);
    return range;
  },

  SP: function (baseCP, data) {
    var SP = applyScaledWeightMult(data.scale, baseCP);
    SP = SP - applyScaledWeightMult(data.scale, data.SPeff); //inculde scale for calc spaces saved or it's just not fair!
    SP = Math.round(SP * 10) / 10; //WTF weird number
    return SP;
  },

  CP: function (baseCP, data) {
    var CP = baseCP;
    CP = CP + data.wEff * 2 + data.SPeff * 2;
    CP = Math.round(CP * 10) / 10;
    return CP;
  },

  scaledCP: function (scale, CP) {
    //var scaledCP = this.CP(weapon);
    CP = applyScaledCPMult(scale, CP);
    CP = Math.round(CP * 10) / 10;
    return CP;
  },
}; //end weapon object};

export { weaponUtil };
