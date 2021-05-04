import * as THREE from "three";
import create from "zustand";
import { equipList } from "../data/equipData";
import { weaponList } from "../data/weaponData";
import {
  applyScaledCPMult,
  servoUtil,
  mech,
  armorUtil,
} from "../util/equipUtil";
import { weaponUtil } from "../util/weaponUtil";

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
const initMechBP = function (guid) {
  //adding 3 servos and 2 weapons for testing
  let beamWeapons = [initWeaponBP(1, "beam"), initWeaponBP(2, "beam")];

  let servos = [
    initMechServo(1, 2, 6, "Torso"),
    initMechServo(2, 2, 6, "Wing"),
    initMechServo(3, 2, 6, "Wing"),
  ];

  return {
    id: guid, //will not need new id for reseting base design template blueprint
    name: "New Blueprint",
    scale: 2, //Mech, Light
    generatorClass: 0,
    generatorFragile: false,

    servoList: servos,
    hydraulicsType: 2,

    weightEff: 0,
    weightIneff: 0,

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
      beam: beamWeapons,
      proj: [],
      missile: [],
      eMelee: [],
      melee: [],
    },

    material: new THREE.MeshPhongMaterial({
      color: 0x999999,
      emissive: 0x999999,
      emissiveIntensity: 0.01,
      //roughness: station.roughness,
      //metalness: station.metalness,
    }),

    scaleType: function () {
      return equipList.scale.type[this.scale];
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
    crewServoLocation: function () {
      return servoUtil.servoLocation(this.crewLocationServoId[0], servos);
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
  };
};

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//                all MECH SERVO PROPERTIES and METHODS
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const initMechServo = function (guid, scale, classIndex = 0, type = "Torso") {
  return {
    id: guid,
    offset: { x: 0, y: 0, z: 0 },
    type: type,
    class: classIndex,
    scale: scale,
    SPMod: 0,
    wEff: 0,
    posX: 0,
    posY: 0,
    armor: { class: 0, type: 1 }, //type 1 = standard armor

    classType: function () {
      return equipList.class.type[this.class];
    }, //class name (i.e. striker)
    classValue: function () {
      return servoUtil.classValue(this.type, this.class);
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
const initWeaponData = function (weaponType, scale = 1) {
  switch (weaponType) {
    case "beam":
      return {
        scale: scale,
        weaponType: "beam",
        title: "Beam",
        name: "Enter Name",
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
    material: new THREE.MeshPhongMaterial({
      color: 0x999999,
      emissive: 0x999999,
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

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//                GLOBAL VARIABLES
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const [useEquipStore] = create((set, get) => {
  //globally available letiables
  return {
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //                MECH DESIGN MENU ACTIONS
    actions: {
      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      //                MECH BLUEPRINT: SELECTION, SAVING, DELETION
      blueprintMenu: {
        newBlueprint() {
          set((state) => ({ mechBP: initMechBP(get().playerMechBP, true) }));
        },
        selectBlueprint(id) {
          set((state) => ({
            mechBP: state.playerMechBP.find((bp) => bp.id === id),
          }));
        },
        saveBlueprint(id) {
          if (!get().playerMechBP.find((bp) => bp.id === id)) {
            id = guid(get().playerMechBP);
          } else {
            get().actions.blueprintMenu.deleteBlueprint(id);
          }

          set((state) => ({
            playerMechBP: [...state.playerMechBP, { ...state.mechBP, id: id }],
          }));

          return id;
        },
        deleteBlueprint(id) {
          set((state) => ({
            playerMechBP: state.playerMechBP.filter((bp) => bp.id !== id),
          }));
        },
      },

      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      //                MENU SELECTIONS
      changeMainMenuSelection(val) {
        //when "Edit Blueprint" selected, switches to 3d design mode
        set((state) => ({ mainMenuSelection: val }));
      },

      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      //                ASSIGN EQUIPMENT LOCATION TO SERVO SPACES
      assignPartLocationMenu: {
        setCrewLocation(locationServoId) {
          set((state) => ({
            mechBP: { ...state.mechBP, crewLocationServoId: [locationServoId] },
          }));
        },

        setWeaponLocation(weaponType, id, locationServoId) {
          const weaponList = get().mechBP.weaponList;
          weaponList[weaponType].find(
            (w) => w.id === id
          ).locationServoId = locationServoId;

          set((state) => ({
            mechBP: { ...state.mechBP, weaponList: weaponList },
          }));
        },
      },

      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      //                BASIC MECH: NAME, SCALE, CREW, PASSENGERS, HYDRAULICS
      basicMenu: {
        setName(val) {
          set((state) => ({
            mechBP: { ...state.mechBP, name: val },
          }));
        },
        setScale(val) {
          set((state) => ({
            mechBP: { ...state.mechBP, scale: val },
          }));
        },
        setCrew(val) {
          set((state) => ({
            mechBP: { ...state.mechBP, crew: val },
          }));
        },
        setPassengers(val) {
          set((state) => ({
            mechBP: { ...state.mechBP, passengers: val },
          }));
        },
        setHydraulics(val) {
          set((state) => ({
            mechBP: { ...state.mechBP, hydraulicsType: val },
          }));
        },
      },

      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      //                MECH SERVOS: SELECTION, DELETION, EDITING
      servoMenu: {
        addServo() {
          let servos = get().mechBP.servoList;
          servos.push(
            initMechServo(guid(get().mechBP.servoList), get().mechBP.scale)
          );
          set((state) => ({
            mechBP: { ...state.mechBP, servoList: servos },
          }));
        },
        deleteServo(id) {
          set((state) => ({
            mechBP: {
              ...state.mechBP,
              servoList: state.mechBP.servoList.filter((s) => s.id !== id),
            },
          }));
          //remove equipment from this location
          //remove from weapons
        },
        changeClass(index, classVal) {
          set((state) => ({
            mechBP: {
              ...state.mechBP,
              servoList: state.mechBP.servoList.map((s, i) =>
                i === index ? { ...s, class: classVal } : s
              ),
            },
          }));
        },
        changeType(index, typeVal) {
          set((state) => ({
            mechBP: {
              ...state.mechBP,
              servoList: state.mechBP.servoList.map((s, i) =>
                i === index ? { ...s, type: typeVal } : s
              ),
            },
          }));
        },
        selectServoID(id) {
          set((state) => ({ editServoId: id }));
        },
        adjustServoOffset(x, y, z) {
          const servo = get().mechBP.servoList.find(
            (s) => s.id === get().editServoId
          );
          if (servo) {
            let offset = servo.offset;
            offset.x += x;
            offset.y += y;
            offset.z += z;
            set((state) => ({
              mechBP: {
                ...state.mechBP,
                servoList: state.mechBP.servoList.map((s) =>
                  s.id === get().editServoId ? { ...s, offset: offset } : s
                ),
              },
            }));
          }
        },
      },

      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      //                WEAPON MENU: NAME, ADD
      weaponMenu: {
        setName(weaponType, val) {
          let weaponBP = weaponType + "BP";
          set((state) => ({
            //mechBP: { ...state.mechBP, name: val },
          }));
        },

        addBeamWeapon() {
          const weaponList = get().mechBP.weaponList;
          const id = guid(weaponList.beam);
          const addWeapon = initWeaponBP(id, "beam");
          addWeapon.data = get().beamBP.data;
          weaponList.beam.push(addWeapon);

          set((state) => ({
            mechBP: { ...state.mechBP, weaponList: weaponList },
          }));
        },

        selectWeaponID(id) {
          set((state) => ({ editWeaponId: id }));
        },
        adjustWeaponOffset(x, y, z) {
          const weapon = get().mechBP.findWeaponId(get().editWeaponId);
          console.log(weapon);
          if (weapon) {
            let offset = weapon.offset;
            offset.x += x;
            offset.y += y;
            offset.z += z;

            const weaponList = get().mechBP.weaponList;
            weaponList[weapon.data.weaponType].offset = offset;

            set((state) => ({
              mechBP: { ...state.mechBP, weaponList: weaponList },
            }));
          }
        },
      },
    },
    //these for the 3d ship editor, because they are in the 3d canvas instead of the HTML EquipmentMenu (need global)
    mainMenuSelection: 0,
    editServoId: null, //used for any selection of servoId in menus
    editWeaponId: 1, //used for any selection of weaponId in menus
    //MECH blueprint TEMPLATE
    mechBP: initMechBP(0),
    //weapon blueprints template
    beamBP: initWeaponBP(0, "beam"),
    //PLAYER MECH BLUEPRINT list
    playerMechBP: [initMechBP(1)],
    //ENEMY MECH BLUEPRINT list
    enemyMechBP: [],
  };
});

export default useEquipStore;
