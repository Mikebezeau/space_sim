import create from "zustand";
import {
  loadBlueprint,
  initPlayerMechBP,
  initMechBP,
  initMechServo,
  initWeaponBP,
} from "../util/initEquipUtil";

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
//                GLOBAL VARIABLES
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const [useEquipStore] = create((set, get) => {
  //globally available letiables
  return {
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //                MECH DESIGN MENU ACTIONS
    equipActions: {
      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      //                MECH BLUEPRINT: SELECTION, SAVING, DELETION
      blueprintMenu: {
        newBlueprint() {
          set((state) => ({
            mechBP: initMechBP(0),
          }));
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
            get().equipActions.blueprintMenu.deleteBlueprint(id);
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
        importBlueprint(importBP) {
          set((state) => ({ mechBP: loadBlueprint(importBP) }));
        },
        exportBlueprint() {
          function replacer(key, value) {
            if (key === "metadata" || key === "material") return undefined;
            else return value;
          }
          return JSON.stringify(get().mechBP, replacer);
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
          weaponList[weaponType].find((w) => w.id === id).locationServoId =
            locationServoId;

          set((state) => ({
            mechBP: { ...state.mechBP, weaponList: weaponList },
          }));
        },
      },

      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      //                BASIC MECH: NAME, SCALE, CREW, PASSENGERS, HYDRAULICS
      basicMenu: {
        setProp(prop, val) {
          set((state) => ({
            mechBP: { ...state.mechBP, [prop]: val },
          }));
        },
        editShipRotation(axis, direction) {
          let rotation = get().editShipRotation;
          if (axis === "reset") rotation = { x: 0, y: 0, z: 0 };
          else {
            //rotate a fraction of a radian and use mod (%) to reset to 0 when full 360 reached
            rotation[axis] = (rotation[axis] + direction * 0.25) % 3.25;
          }
          set((state) => ({
            editShipRotation: rotation,
          }));
        },
      },

      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      //                MECH SERVOS: SELECTION, DELETION, EDITING
      servoMenu: {
        changeProp(index, prop, val) {
          set((state) => ({
            mechBP: {
              ...state.mechBP,
              servoList: state.mechBP.servoList.map((s, i) =>
                i === index ? { ...s, [prop]: val } : s
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
        adjustServoRotation(axis, direction) {
          const servo = get().mechBP.servoList.find(
            (s) => s.id === get().editServoId
          );
          //return;
          if (servo) {
            let rotation = servo.rotation;
            if (axis === "reset") rotation = { x: 0, y: 0, z: 0 };
            else {
              rotation[axis] = (rotation[axis] + direction * 0.25) % 3.25;
            }
            set((state) => ({
              mechBP: {
                ...state.mechBP,
                servoList: state.mechBP.servoList.map((s) =>
                  s.id === get().editServoId ? { ...s, rotation: rotation } : s
                ),
              },
            }));
          }
        },
        adjustServoScale(axis, val) {
          const servo = get().mechBP.servoList.find(
            (s) => s.id === get().editServoId
          );

          //return;
          if (servo) {
            let scaleAdjust = {};
            //reset to 0
            if (axis === "reset") {
              scaleAdjust = { x: 0, y: 0, z: 0 };

              //alter scale
            } else {
              //make scale in other axis smaller to keep general size correct
              /*
              scaleAdjust.x = servo.scaleAdjust.x - val * 0.1;
              scaleAdjust.y = servo.scaleAdjust.y - val * 0.1;
              scaleAdjust.z = servo.scaleAdjust.z - val * 0.1;
              scaleAdjust[axis] = scaleAdjust[axis] + val * 0.1 + val * 0.3;
              */
              scaleAdjust.x = servo.scaleAdjust.x;
              scaleAdjust.y = servo.scaleAdjust.y;
              scaleAdjust.z = servo.scaleAdjust.z;
              scaleAdjust[axis] = scaleAdjust[axis] + val * 0.05 * servo.scale;
            }
            //if not getting to small in any axis
            if (
              scaleAdjust.x - val * 0.1 < -0.8 ||
              scaleAdjust.y - val * 0.1 < -0.8 ||
              scaleAdjust.z - val * 0.1 < -0.8
            ) {
              return;
            }
            set((state) => ({
              mechBP: {
                ...state.mechBP,
                servoList: state.mechBP.servoList.map((s) =>
                  s.id === get().editServoId
                    ? { ...s, scaleAdjust: scaleAdjust }
                    : s
                ),
              },
            }));
          }
        },
        selectServoShape(index, shapeIndex) {
          set((state) => ({
            mechBP: {
              ...state.mechBP,
              servoList: state.mechBP.servoList.map((s, i) =>
                i === index ? { ...s, shape: shapeIndex } : s
              ),
            },
          }));
        },
      },

      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      //                WEAPON MENU: NAME, ADD
      weaponMenu: {
        selectWeaponID(id) {
          set((state) => ({ editWeaponId: id }));
        },

        adjustWeaponOffset(x, y, z) {
          const weapon = get().mechBP.findWeaponId(get().editWeaponId);

          if (weapon) {
            let offset = weapon.offset;
            offset.x += x;
            offset.y += y;
            offset.z += z;

            const weaponList = get().mechBP.weaponList;
            set((state) => ({
              mechBP: { ...state.mechBP, weaponList: weaponList },
            }));
          }
        },

        setDataValue: function (weaponType, id, propName, val) {
          const weapon = id
            ? get().mechBP.findWeaponId(id)
            : get()[weaponType + "BP"];

          if (weapon) {
            weapon.data[propName] = val;

            if (id) {
              //editing weapon already assigned to mech in its weapon list array
              const weaponList = get().mechBP.weaponList;

              set((state) => ({
                mechBP: { ...state.mechBP, weaponList: weaponList },
              }));
            } else {
              //editing a new weapon design
              set((state) => ({ [weaponType + "BP"]: weapon }));
            }
          }
        },

        addBeamWeapon() {
          const id = guid(get().mechBP.concatWeaponList());
          const weaponList = get().mechBP.weaponList;
          const addWeapon = initWeaponBP(id, "beam");
          addWeapon.data = JSON.parse(JSON.stringify(get().beamBP.data));
          weaponList.beam.push(addWeapon);

          set((state) => ({
            mechBP: { ...state.mechBP, weaponList: weaponList },
          }));
        },

        addProjWeapon() {
          const id = guid(get().mechBP.concatWeaponList());
          const weaponList = get().mechBP.weaponList;
          const addWeapon = initWeaponBP(id, "proj");
          addWeapon.data = JSON.parse(JSON.stringify(get().projBP.data));
          weaponList.proj.push(addWeapon);

          set((state) => ({
            mechBP: { ...state.mechBP, weaponList: weaponList },
          }));
        },

        addMissileWeapon() {
          const id = guid(get().mechBP.concatWeaponList());
          const weaponList = get().mechBP.weaponList;
          const addWeapon = initWeaponBP(id, "missile");
          addWeapon.data = JSON.parse(JSON.stringify(get().missileBP.data));
          weaponList.missile.push(addWeapon);

          set((state) => ({
            mechBP: { ...state.mechBP, weaponList: weaponList },
          }));
        },

        addEMeleeWeapon() {
          const id = guid(get().mechBP.concatWeaponList());
          const weaponList = get().mechBP.weaponList;
          const addWeapon = initWeaponBP(id, "eMelee");
          addWeapon.data = JSON.parse(JSON.stringify(get().eMeleeBP.data));
          weaponList.eMelee.push(addWeapon);

          set((state) => ({
            mechBP: { ...state.mechBP, weaponList: weaponList },
          }));
        },

        addMeleeWeapon() {
          const id = guid(get().mechBP.concatWeaponList());
          const weaponList = get().mechBP.weaponList;
          const addWeapon = initWeaponBP(id, "melee");
          addWeapon.data = JSON.parse(JSON.stringify(get().meleeBP.data));
          weaponList.melee.push(addWeapon);

          set((state) => ({
            mechBP: { ...state.mechBP, weaponList: weaponList },
          }));
        },
      },
    },
    //these for the 3d ship editor, because they are in the 3d canvas instead of the HTML EquipmentMenu (need global)
    mainMenuSelection: 0,
    editServoId: null, //used for any selection of servoId in menus
    editWeaponId: 1, //used for any selection of weaponId in menus
    editShipRotation: { x: 0, y: 0, z: 0 }, //used for any selection of weaponId in menus
    //MECH blueprint TEMPLATE
    mechBP: initMechBP(0),
    //weapon blueprints template
    beamBP: initWeaponBP(0, "beam"),
    projBP: initWeaponBP(0, "proj"),
    missileBP: initWeaponBP(0, "missile"),
    eMeleeBP: initWeaponBP(0, "eMelee"),
    meleeBP: initWeaponBP(0, "melee"),
    //PLAYER MECH BLUEPRINT list
    playerMechBP: initPlayerMechBP(), //returns array of players mech blueprints
  };
});

export default useEquipStore;
