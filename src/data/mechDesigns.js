const mechDesigns = {
  player: [
    {
      id: 0,
      name: "Starship",
      scale: 2,
      generatorClass: 0,
      generatorFragile: 0,
      servoList: [
        {
          id: 1,
          offset: { x: 0, y: 0, z: -4 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: -0.7, y: -0.7, z: 2.2 },
          type: "Torso",
          class: 10,
          scale: 2,
          shape: 1,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 2,
          offset: { x: -1.5, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: {
            x: -5.551115123125783e-17,
            y: -0.4,
            z: 1.4000000000000001,
          },
          type: "Wing",
          class: 6,
          scale: 2,
          shape: 0,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 3,
          offset: { x: 1.5, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: {
            x: -5.551115123125783e-17,
            y: -0.4,
            z: 1.4000000000000001,
          },
          type: "Wing",
          class: 6,
          scale: 2,
          shape: 0,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 4,
          offset: { x: -2.5, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: -0.25 },
          scaleAdjust: { x: -0.4, y: 0.4, z: 0 },
          type: "Torso",
          class: 4,
          scale: 2,
          shape: 0,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 5,
          offset: { x: 2.5, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0.25 },
          scaleAdjust: { x: -0.4, y: 0.4, z: 0 },
          type: "Torso",
          class: 4,
          scale: 2,
          shape: 0,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 6,
          offset: { x: -0.5, y: 1, z: -1 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: -0.4, y: -0.8, z: 1.6 },
          type: "Torso",
          class: 4,
          scale: 2,
          shape: 1,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 7,
          offset: { x: 0.5, y: 1, z: -1 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: -0.4, y: -0.7999999999999998, z: 1.6 },
          type: "Torso",
          class: 4,
          scale: 2,
          shape: 1,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 8,
          offset: { x: -2.5, y: 0, z: -2 },
          rotation: { x: 0, y: 0, z: -0.25 },
          scaleAdjust: { x: -0.7, y: -0.29999999999999993, z: 0.5 },
          type: "Torso",
          class: 4,
          scale: 2,
          shape: 1,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 9,
          offset: { x: 2.5, y: 0, z: -2 },
          rotation: { x: 0, y: 0, z: 0.25 },
          scaleAdjust: { x: -0.7, y: -0.29999999999999993, z: 0.5 },
          type: "Torso",
          class: 4,
          scale: 2,
          shape: 1,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 10,
          offset: { x: 0, y: 1, z: 0 },
          rotation: { x: -1.5, y: 0, z: 0 },
          scaleAdjust: {
            x: -0.09999999999999998,
            y: -0.09999999999999998,
            z: -0.09999999999999995,
          },
          type: "Torso",
          class: 2,
          scale: 2,
          shape: 11,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 11,
          offset: { x: -1.5, y: 0, z: 1 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: {
            x: -0.30000000000000004,
            y: -0.30000000000000004,
            z: 0.30000000000000004,
          },
          type: "Wing",
          class: "5",
          scale: 2,
          shape: 11,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 12,
          offset: { x: 1.5, y: 0, z: 1 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: {
            x: -0.30000000000000004,
            y: -0.30000000000000004,
            z: 0.30000000000000004,
          },
          type: "Wing",
          class: "5",
          scale: 2,
          shape: 11,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 13,
          offset: { x: -1.5, y: 0, z: 1 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: 0, y: 0, z: 2.400000000000001 },
          type: "Wing",
          class: "2",
          scale: 2,
          shape: 11,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 14,
          offset: { x: 1.5, y: 0, z: 1 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: 0, y: 0, z: 2.400000000000001 },
          type: "Wing",
          class: "2",
          scale: 2,
          shape: 11,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 15,
          offset: { x: 0, y: 0, z: 1 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: {
            x: -0.20000000000000004,
            y: -0.20000000000000004,
            z: 3.700000000000002,
          },
          type: "Wing",
          class: "8",
          scale: 2,
          shape: 11,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 16,
          offset: { x: 0, y: 0, z: 2 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: {
            x: -0.20000000000000004,
            y: -0.20000000000000004,
            z: -0.8999999999999999,
          },
          type: "Wing",
          class: "6",
          scale: 2,
          shape: 11,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
      ],
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
        beam: [
          {
            id: 1,
            offset: { x: 0, y: -0.5, z: 1 },
            locationServoId: 2,
            data: {
              scale: 1,
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
            },
          },
          {
            id: 2,
            offset: { x: 0, y: -0.5, z: 1 },
            locationServoId: 3,
            data: {
              scale: 1,
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
            },
          },
        ],
        proj: [],
        missile: [],
        eMelee: [],
        melee: [],
      },
    },
  ],

  enemy: [
    {
      id: 0,
      name: "Enemy",
      scale: "4",
      generatorClass: 0,
      generatorFragile: false,
      servoList: [
        {
          id: 1,
          offset: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: -0.4, y: -0.4, z: 5.200000000000002 },
          type: "Torso",
          class: "6",
          scale: "4",
          shape: 1,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 2,
          offset: { x: -5, y: 0, z: 10 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: 0, y: 0, z: 0 },
          type: "Pod",
          class: "4",
          scale: "4",
          shape: 11,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 3,
          offset: { x: 5, y: 0, z: 10 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: 0, y: 0, z: 0 },
          type: "Pod",
          class: "4",
          scale: "4",
          shape: 11,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 4,
          offset: { x: -4.5, y: 0, z: 12 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: 0, y: 0, z: 0 },
          type: "Pod",
          class: "4",
          scale: "4",
          shape: 11,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 5,
          offset: { x: 4.5, y: 0, z: 13 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: 0, y: 0, z: 0 },
          type: "Pod",
          class: "4",
          scale: "4",
          shape: 11,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 6,
          offset: { x: 0, y: 0, z: 11 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: 0, y: 0, z: 0 },
          type: "Wing",
          class: "8",
          scale: "4",
          shape: 1,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 7,
          offset: { x: 0, y: 1.5, z: 10 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: -0.4, y: 0, z: 1.4 },
          type: "Torso",
          class: "3",
          scale: "4",
          shape: 1,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
      ],
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
      weaponList: { beam: [], proj: [], missile: [], eMelee: [], melee: [] },
    },
    {
      id: 0,
      name: "Battleship",
      scale: "6",
      generatorClass: 0,
      generatorFragile: false,
      servoList: [
        {
          id: 1,
          offset: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: {
            x: -0.30000000000000004,
            y: -0.6000000000000001,
            z: 3.3,
          },
          type: "Torso",
          class: "10",
          scale: "6",
          shape: 1,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
        {
          id: 2,
          offset: { x: 0, y: 24.5, z: 19 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: 0, y: 0, z: 2.7 },
          type: "Pod",
          class: "8",
          scale: "6",
          shape: 0,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
      ],
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
      weaponList: { beam: [], proj: [], missile: [], eMelee: [], melee: [] },
    },
    {
      id: 0,
      name: "New Blueprint",
      scale: "7",
      generatorClass: 0,
      generatorFragile: false,
      servoList: [
        {
          id: 1,
          offset: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scaleAdjust: { x: 0, y: 0, z: 0 },
          type: "Pod",
          class: "10",
          scale: "7",
          shape: 4,
          SPMod: 0,
          wEff: 0,
          armor: { class: 0, rating: 1 },
        },
      ],
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
      weaponList: { beam: [], proj: [], missile: [], eMelee: [], melee: [] },
    },
  ],
};

export default mechDesigns;
