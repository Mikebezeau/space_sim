import { equipList } from "../data/equipData";
import { weaponList } from "../data/weaponData";
import { applyScaledWeightMult, applyScaledCPMult } from "./mechServoUtil";

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
    let CP = 0;
    switch (data.weaponType) {
      case "beam":
        CP = weaponList.beam.damageRange.CP[data.damageRange];
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
      case "proj":
        CP = weaponList.proj.damageRange.CP[data.damageRange];
        CP =
          CP *
          weaponList.proj.accuracy.CM[data.accuracy] *
          weaponList.proj.rangeMod.CM[data.rangeMod] *
          weaponList.proj.burstValue.CM[data.burstValue] *
          weaponList.proj.multiFeed.CM[data.multiFeed] *
          weaponList.proj.longRange.CM[data.longRange] *
          weaponList.proj.hyperVelocity.CM[data.hyperVelocity] *
          weaponList.proj.special.CM[data.special] *
          weaponList.proj.variable.CM[data.variable];
        return CP;
      case "missile":
        CP = weaponList.missile.damageRange.CP[data.damageRange];
        CP =
          CP *
          weaponList.missile.accuracy.CM[data.accuracy] *
          weaponList.missile.blastRadius.CM[data.blastRadius] *
          weaponList.missile.rangeMod.CM[data.rangeMod] *
          weaponList.missile.smart.CM[data.smart] *
          weaponList.missile.skill.CM[data.skill] *
          weaponList.missile.type.CM[data.type] *
          weaponList.missile.special.CM[data.special] *
          weaponList.missile.variable.CM[data.variable] *
          weaponList.missile.longRange.CM[data.longRange] *
          weaponList.missile.hyperVelocity.CM[data.hyperVelocity] *
          data.numMissile;
        CP = Math.round(CP * 100) / 100;

        return CP;

      case "eMelee":
        CP = weaponList.eMelee.damageRange.CP[data.damageRange];
        CP =
          CP *
          weaponList.eMelee.accuracy.CM[data.accuracy] *
          weaponList.eMelee.turnsUse.CM[data.turnsUse] *
          weaponList.eMelee.attackFactor.CM[data.attackFactor] *
          weaponList.eMelee.recharge.CM[data.recharge] *
          weaponList.eMelee.throw.CM[data.throw] *
          weaponList.eMelee.quick.CM[data.quick] *
          weaponList.eMelee.hyper.CM[data.hyper] *
          weaponList.eMelee.shield.CM[data.shield] *
          weaponList.eMelee.variable.CM[data.variable];
        CP = Math.round(CP * 100) / 100;

        /*console.log(weaponList.eMelee.accuracy.CM[data.accuracy]
                +' '+weaponList.eMelee.turnsUse.CM[data.turnsUse]
                +' '+weaponList.eMelee.attackFactor.CM[data.attackFactor]
            );*/
        return CP;

      case "melee":
        CP = weaponList.melee.damageRange.CP[data.damageRange];
        CP =
          CP *
          weaponList.melee.accuracy.CM[data.accuracy] *
          weaponList.melee.handy.CM[data.handy] *
          weaponList.melee.quick.CM[data.quick] *
          weaponList.melee.clumsy.CM[data.clumsy] *
          weaponList.melee.armorPiercing.CM[data.armorPiercing] *
          weaponList.melee.entangle.CM[data.entangle] *
          weaponList.melee.throw.CM[data.throw] *
          weaponList.melee.returning.CM[data.returning] *
          weaponList.melee.disruptor.CM[data.disruptor] *
          weaponList.melee.shockOnly.CM[data.shockOnly] *
          weaponList.melee.shockAdded.CM[data.shockAdded];
        CP = Math.round(CP * 100) / 100;

        return CP;
      default:
        console.log("invalid weapon type");
        return null;
    }
  },

  //FOR PROJECTILE WEAPONS ONLY
  ammoCP: function (weaponCP, ammoList) {
    let CP = 0;
    for (var i = 0; i < ammoList.length; i++) {
      let baseCP = weaponCP;
      for (var j = 0; j < ammoList[i].typeList.length; j++) {
        baseCP = baseCP * weaponList.proj.ammo.CM[ammoList[i].type];
      }
      CP += baseCP * ammoList[i].numAmmo;
    }

    CP = CP / 10;
    CP = Math.round(CP * 100) / 100;
    return CP;
  },

  damage: function (data) {
    let damage = weaponList[data.weaponType].damageRange.val[data.damageRange];

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
    let acc = weaponList[data.weaponType].accuracy.val[data.accuracy];
    acc = data.longRange ? acc - 2 : acc;
    return acc;
  },
  range: function (data, housingSservo = null) {
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
      range = data.longRange ? range * 10 : range;
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
    CP = applyScaledCPMult(scale, CP);
    CP = Math.round(CP * 10) / 10;
    return CP;
  },
}; //end weapon object};

export { weaponUtil };
