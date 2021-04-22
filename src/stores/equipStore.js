import create from "zustand";
import { equipList } from "../util/equipList";
import { scale, servo, mecha } from "../util/equipUtil";

const [useEquipStore] = create((set, get) => {
  //globally available letiables
  return {
    actions: {
      setName(val) {
        set((state) => ({ name: val }));
      },
      setScale(val) {
        set((state) => ({ scale: val }));
      },
      setCrew(val) {
        set((state) => ({ crew: val }));
        console.log(get().crew);
      },
      setPassengers(val) {
        set((state) => ({ passengers: val }));
      },
    },

    name: "Blueprint",
    scale: 1, //Mech, Light
    generatorClass: 0,
    generatorFragile: false,
    servoList: [],
    hydraulicsType: 2,

    weightEff: 0,
    weightIneff: 0,

    crew: 1,

    passengers: 0,
    controlType: 1,
    cockpitType: 0,

    propulsionList: [],
    partList: [],
    multSystemList: [],
    weaponList: { beam: [], proj: [], missile: [], eMelee: [], melee: [] },

    scaleType: function () {
      return equipList.scale.type[get().scale];
    },

    meleeBonus: function () {
      return mecha.meleeBonus(get().hydraulicsType);
    },
    scaledMeleeBonus: function () {
      return scale.scaledMeleeBonus(get().scale, get().meleeBonus());
    },

    crewSP: function () {
      return mecha.crewSP(get().cockpitType, get().crew, get().passengers);
    },
    crewCP: function () {
      return mecha.crewCP(get().crew, get().passengers);
    },

    totalWeight: function () {
      return mecha.totalWeight(
        get().servoList,
        get().weaponList,
        get().weightIneff,
        get().weightEff
      );
    },

    totalCP: function () {
      return mecha.totalCP(
        get().crewCP(),
        get().servoList,
        get().weaponList,
        get().partList,
        get().hydraulicsType,
        get().controlType,
        get().weightIneff,
        get().weightEff
      );
    },

    totalKGWeight: function () {
      return mecha.KGWeight(get().totalWeight());
    },

    totalScaledCP: function () {
      const crewCP = get().crewCP();
      //don't apply crewCP to scaled cost
      return (
        scale.applyScaledCP(get().scale, get().totalCP() - crewCP) + crewCP
      );
    },

    groundMA: function () {
      return mecha.groundMA(get().scale, get().totalWeight());
    },

    groundKMpH: function () {
      return mecha.groundKMpH(get().groundMA());
    },

    MV: function () {
      return mecha.MV(get().scale, get().totalWeight());
    },

    armMeleeBonus: function () {
      return servo.armMeleeBonus(get().servoList);
    },

    liftVal: function () {
      return mecha.liftVal(get().servoList, get().hydraulicsType);
    },
  };
});

export default useEquipStore;
