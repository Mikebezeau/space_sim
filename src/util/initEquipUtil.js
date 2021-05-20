import * as THREE from "three";
import { equipList } from "../data/equipData";
import { weaponList } from "../data/weaponData";
import { applyScaledCPMult, servoUtil, mech, armorUtil } from "./equipUtil";
import { weaponUtil } from "./weaponUtil";
import mechDesigns from "../data/mechDesigns";

//CREATING UNIQUE IDS
const guid = (A) => {
  //global unique ID
  //return lowest number possible from array.guid
  let n = A.length;
  // To mark the occurrence of elements
  let present = new Array(n + 1);

  for (let i = 0; i < n + 1; i++) {
    present[i] = false;
  }
  // Mark the occurrences
  for (let i = 0; i < n; i++) {
    if (A[i].id > 0 && A[i].id <= n) {
      present[A[i].id] = true;
    }
  }
  // Find the first element which didn't appear in the original array
  for (let i = 1; i <= n; i++) {
    if (!present[i]) {
      return i;
    }
  }
  return n + 1;
};

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//                all MECH PROPERTIES and METHODS
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const loadBlueprint = function (importBP) {
  function transferProperties(mergBP, parsedBP) {
    Object.keys(parsedBP).forEach((key) => {
      if (typeof parsedBP[key] !== "object") {
        mergBP[key] =
          key === "name" || key === "type"
            ? parsedBP[key]
            : Number(parsedBP[key]);
      } else if (
        key === "offset" ||
        key === "rotation" ||
        key === "scaleAdjust"
      ) {
        mergBP[key] = transferProperties(mergBP[key], parsedBP[key]);
      }
    });
    return mergBP;
  }

  const parsedBP = JSON.parse(importBP);
  let mergBP = initMechBP();
  mergBP = transferProperties(mergBP, parsedBP);

  /*
    crewLocationServoId: [],
    passengersLocationServoId: [],
    propulsionList: [],
    partList: [],
    multSystemList: [],
    */

  parsedBP.servoList.forEach((parsedServo) => {
    const servoBP = initMechServo(0);
    mergBP.servoList.push(transferProperties(servoBP, parsedServo));
  });

  //parsedBP.weaponList.forEach((list, key) => {
  Object.keys(parsedBP.weaponList).forEach((key) => {
    parsedBP.weaponList[key].forEach((parsedWeapon) => {
      const weaponBP = initWeaponBP(0, key);
      mergBP.weaponList[key].push(transferProperties(weaponBP, parsedWeapon));
    });
  });

  //console.log(mergBP.weaponList);
  //console.log(mergBP.servoList);
  return mergBP;
};

const initPlayerMechBP = function () {
  let playerMechBP = loadBlueprint(JSON.stringify(mechDesigns.player[0]));
  playerMechBP.id = 1;
  return [playerMechBP];
};

//ENEMY MECH BLUEPRINT list
const initEnemyMechBP = function (bluePrintIndex) {
  let emenyMechBP = loadBlueprint(
    JSON.stringify(mechDesigns.enemy[bluePrintIndex])
  );
  return emenyMechBP;
};

const initMechBP = function (guid) {
  return {
    id: guid, //will not need new id for reseting base design template blueprint
    name: "New Blueprint",
    scale: 2, //Mech, Light
    generatorClass: 0,
    generatorFragile: false,

    servoList: [],
    hydraulicsType: 2,

    weightEff: 0,
    weightIneff: 0,

    landingBay: 0,
    landingBayServoLocationId: 0,
    landingBayPosition: { x: 0, y: 0, z: 0 },

    crew: 1,
    passengers: 0,
    controlType: 1,
    cockpitType: 0,
    crewLocationServoId: [],
    passengersLocationServoId: [],

    propulsionList: [],
    partList: [],
    multSystemList: [],
    weaponList: {
      beam: [],
      proj: [],
      missile: [],
      eMelee: [],
      melee: [],
    },

    material: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#999"),
      emissive: new THREE.Color("#999"),
      emissiveIntensity: 0.01,
      //roughness: station.roughness,
      //metalness: station.metalness,
    }),

    scaleType: function () {
      return equipList.scale.type[this.scale];
    },

    scaleVal: function (val) {
      return val * equipList.scale.weightMult[this.scale];
    },
    size: function () {
      return mech.size(this.servoList);
    },

    meleeBonus: function () {
      return mech.meleeBonus(this.hydraulicsType);
    },
    scaledMeleeBonus: function () {
      return mech.scaledMeleeBonus(this.scale, this.meleeBonus());
    },

    crewSP: function () {
      return mech.crewSP(this.cockpitType, this.crew, this.passengers);
    },
    crewCP: function () {
      return mech.crewCP(this.crew, this.passengers);
    },
    getServoById: function (id) {
      return servoUtil.servoLocation(id, this.servoList);
    },
    servoWeaponList: function (servoId) {
      return mech.servoWeaponList(servoId, this.weaponList);
    },
    findWeaponId: function (weaponId) {
      return mech.findWeaponId(weaponId, this.weaponList);
    },
    totalWeight: function () {
      return mech.totalWeight(
        this.servoList,
        this.weaponList,
        this.weightIneff,
        this.weightEff
      );
    },

    totalCP: function () {
      return mech.totalCP(
        this.crewCP(),
        this.servoList,
        this.weaponList,
        this.partList,
        this.hydraulicsType,
        this.controlType,
        this.weightIneff,
        this.weightEff
      );
    },

    totalKGWeight: function () {
      return mech.KGWeight(this.totalWeight());
    },

    totalScaledCP: function () {
      const crewCP = this.crewCP();
      //don't apply crewCP to scaled cost
      return applyScaledCPMult(this.scale, this.totalCP() - crewCP) + crewCP;
    },

    groundMA: function () {
      return mech.groundMA(this.scale, this.totalWeight());
    },

    groundKMpH: function () {
      return mech.groundKMpH(this.groundMA());
    },

    MV: function () {
      return mech.MV(this.scale, this.totalWeight());
    },

    armMeleeBonus: function () {
      return servoUtil.armMeleeBonus(this.servoList);
    },

    liftVal: function () {
      return mech.liftVal(this.scale, this.servoList, this.hydraulicsType);
    },

    concatWeaponList: function () {
      return this.weaponList.beam
        .concat(this.weaponList.proj)
        .concat(this.weaponList.missile)
        .concat(this.weaponList.eMelee)
        .concat(this.weaponList.melee);
    },
  };
};

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//                all MECH SERVO PROPERTIES and METHODS
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const initMechServo = function (guid, scale, classIndex = 0, type = "Torso") {
  return {
    id: guid,
    offset: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scaleAdjust: { x: 0, y: 0, z: 0 },
    type: type,
    class: classIndex,
    scale: scale,
    shape: 0,
    SPMod: 0,
    wEff: 0,
    armor: { class: 0, rating: 1 }, //rating 1 = standard armor

    material: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#999"),
      emissive: new THREE.Color("#999"),
      emissiveIntensity: 0.01,
      //roughness: station.roughness,
      //metalness: station.metalness,
    }),

    classType: function () {
      return equipList.class.type[this.class];
    }, //class name (i.e. striker)

    classValue: function () {
      return servoUtil.classValue(this.type, this.class);
    },

    size: function (scale, classValue) {
      return servoUtil.size(this.scale, this.classValue());
    },

    structure: function () {
      return servoUtil.structure(this.scale, this.classValue(), this.SPMod);
    },

    SP: function () {
      //space points
      return servoUtil.SP(this.scale, this.classValue(), this.SPMod);
    },
    usedSP: function (mechBP) {
      //space points used by equipment in that location
      return servoUtil.usedSP(this.id, mechBP);
    },

    CP: function () {
      //cost points
      return servoUtil.CP(this.classValue(), this.wEff, this.armor);
    },

    scaledCP: function () {
      //scaled cost points
      return servoUtil.scaledCP(this.scale, this.CP());
    },
    armorVal: function () {
      return armorUtil.value(this.armor);
    },
    armorType: function () {
      return armorUtil.type(this.armor);
    },
    armorThreshold: function () {
      return armorUtil.threshold(this.armor);
    },
    armorCP: function () {
      return armorUtil.CP(this.armor);
    },

    weight: function () {
      return servoUtil.weight(this.classValue(), this.wEff, this.armor);
    },
    /*
      cmdArmor = new cmdArmor();
      getPosX = function(){return posX(this.posX)};//position label, right/left
      getPosY = function(){return posY(this.posY)};//position label, front/back
  */
  };
};

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//                BASE WEAPON METHODS
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//initWeaponData only used locally (initWeaponBP)
const initWeaponData = function (weaponType, scale = 1) {
  switch (weaponType) {
    case "beam":
      return {
        scale: scale,
        weaponType: "beam",
        title: "Beam",
        name: "Beam",
        damageRange: 6,
        accuracy: 3,
        shots: 5,
        rangeMod: 3,
        warmUp: 0,
        wideAngle: 0,
        burstValue: 0,
        special: 0,
        variable: 0,
        fragile: 0,
        longRange: 0,
        megaBeam: 0,
        disruptor: 0,

        SPeff: 0,
        wEff: 0,
      };
    case "proj":
      return {
        scale: scale,
        weaponType: "proj",
        title: "Projectile",
        name: "Projectile",
        damageRange: 3,
        accuracy: 2,
        rangeMod: 4,
        burstValue: 2,
        multiFeed: 0,
        longRange: 0,
        hyperVelocity: 0,
        ammoList: [{ type: 0, numAmmo: 10 }],

        special: 0, //phalanx & anti-personnel
        variable: 0,

        SPeff: 0,
        wEff: 0,
      };
    case "missile":
      return {
        scale: scale,
        weaponType: "missile",
        title: "Missile",
        name: "Missile",
        damageRange: 0,
        accuracy: 2,
        blastRadius: 0,
        rangeMod: 4,
        smart: 0,
        skill: 0,
        type: 0,
        special: 0,
        variable: 0,
        longRange: 0,
        hyperVelocity: 0,
        numMissile: 10,

        SPeff: 0,
        wEff: 0,
      };
    case "eMelee":
      return {
        scale: scale,
        weaponType: "eMelee",
        title: "Energy Melee",
        name: "Energy Melee",
        damageRange: 4,
        accuracy: 2,
        turnsUse: 2,
        attackFactor: 0,
        recharge: 0,
        throw: 0,
        quick: 1,
        hyper: 0,
        shield: 0,
        variable: 0,

        SPeff: 0,
        wEff: 0,
      };
    case "melee":
      return {
        scale: scale,
        weaponType: "melee",
        title: "Melee",
        name: "Melee",
        damageRange: 1,
        accuracy: 2,
        handy: 0,
        quick: 0,
        clumsy: 0,
        armorPiercing: 0,
        entangle: 0,
        throw: 0,
        returning: 0,
        disruptor: 0,
        shockOnly: 0,
        shockAdded: 0,

        SPeff: 0,
        wEff: 0,
      };
    default:
      console.log("invalid weapon type");
      return null;
  }
};

const initWeaponBP = function (guid, weaponType, scale) {
  return {
    id: guid,
    offset: { x: 0, y: 0, z: 0 },
    locationServoId: null,
    material: new THREE.MeshStandardMaterial({
      color: new THREE.Color("#999"),
      emissive: new THREE.Color("#999"),
      emissiveIntensity: 0.01,
      //roughness: station.roughness,
      //metalness: station.metalness,
    }),

    data: initWeaponData(weaponType, scale),

    servoLocation: function (servos) {
      return servoUtil.servoLocation(this.locationServoId, servos);
    },

    weight: function () {
      return weaponUtil.weight(this.data);
    },

    //needed for calculating space / space efficiency properly
    baseCP: function () {
      return weaponUtil.baseCP(this.data);
    },

    damage: function () {
      return weaponUtil.damage(this.data);
    },

    structure: function () {
      return weaponUtil.structure(this.damage());
    },
    accuracy: function () {
      return weaponList[this.data.weaponType].accuracy.val[this.data.accuracy];
    },
    range: function (housingSservo) {
      return weaponUtil.range(this.data, housingSservo);
    },

    burstValue: function () {
      return weaponList[this.data.weaponType].burstValue.val[
        this.data.burstValue
      ];
    },

    SP: function () {
      return weaponUtil.SP(this.baseCP(), this.data);
    },

    CP: function () {
      return weaponUtil.CP(this.baseCP(), this.data);
    },

    scaledCP: function () {
      return weaponUtil.scaledCP(this.data.scale, this.CP());
    },
  };
};

export {
  guid,
  loadBlueprint,
  initPlayerMechBP,
  initEnemyMechBP,
  initMechBP,
  initMechServo,
  initWeaponBP,
};
