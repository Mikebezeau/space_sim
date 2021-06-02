const oneToTwenty = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

//******************************************************
//***************** MULTI USE
const beamRange = [
  4, 6, 7, 8, 9, 10, 11, 11, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18,
];

export const weaponList = {
  weapon: {
    type: ["Beam", "Projectile", "Missile", "Energy Melee", "Melee"],
  },

  beam: {
    beamRange: beamRange,
    damageRange: {
      val: oneToTwenty,
      range: beamRange,
      //label: doubleSliderLabel(oneToTwenty, beamRange),
      CP: [
        1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5, 15, 16.5, 18, 19.5, 21, 22.5,
        24, 25.5, 27, 28.5, 30,
      ],
    },
    rangeMod: {
      val: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3],
      CM: [0.62, 0.75, 0.88, 1, 1.12, 1.25, 1.38, 1.5, 1.75, 2],
    },
    accuracy: { val: [-2, -1, 0, 1, 2, 3], CM: [0.6, 0.8, 0.9, 1, 1.5, 2] },
    shots: {
      val: [0, 1, 3, 5, 10, "Unlimited"],
      CM: [0.33, 0.5, 0.7, 0.8, 0.9, 1],
    },
    warmUp: { val: ["None", 1, 2, 3], CM: [1, 0.9, 0.7, 0.6] },
    wideAngle: {
      val: ["None", "Hex", 60, 180, 300, 360],
      CM: [1, 2, 3, 5, 7, 9],
    },
    burstValue: {
      val: ["None", 2, 3, 4, 5, 6, 7, 8, "Unlimited"],
      CM: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    },
    special: {
      val: [
        "None",
        "Anti-Personnel",
        "Anti-Missile",
        "Anit-Personnel & Anti-Missile",
      ],
      CM: [1, 1, 1, 1.8],
    },
    variable: { val: [0, 1, 2, 3], CM: [1, 1.8, 1.8, 1.45] },
    fragile: { val: [0, 1], CM: [1, 0.75] },
    longRange: { val: [0, 1], CM: [1, 1.33] },
    megaBeam: { val: [0, 1], CM: [1, 10] },
    disruptor: { val: [0, 1], CM: [1, 2] },
  },

  proj: {
    damageRange: {
      val: oneToTwenty,
      range: [
        3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 12, 13, 13, 13,
      ],
      CP: oneToTwenty,
    },
    accuracy: { val: [-2, -1, 0, 1, 2], CM: [0.6, 0.8, 1, 1.5, 2] },
    burstValue: {
      val: [0, 2, 3, 4, 5, 6, 7, 8],
      CM: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
    },
    rangeMod: {
      val: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3],
      CM: [0.5, 0.62, 0.75, 0.88, 1, 1.12, 1.25, 1.38, 1.5, 1.75, 2],
    },
    multiFeed: { val: [1, 2, 3, 4], CM: [1, 1.2, 1.4, 1.6] },
    longRange: { val: [0, 1], CM: [1, 1.33] },
    hyperVelocity: { val: [0, 1], CM: [1, 1.25] },
    special: {
      val: [
        "None",
        "Anti-Personnel",
        "Anti-Missile",
        "Anit-Personnel & Anti-Missile",
      ],
      CM: [1, 1, 1, 1.8],
    },
    variable: { val: [0, 1, 2, 3], CM: [1, 1.8, 1.8, 1.45] },
    ammo: {
      val: [
        "High Explosive",
        "Tracer",
        "Kinetic",
        "Tangler",
        "Armor Piercing",
        "Disruptor",
        "Incendiary",
        "Scatter Shot",
        "Blast",
        "Blast 2",
        "Blast 3",
        "Blast 4",
        "Blast 5",
      ],
      CM: [1, 3, 3, 3, 4, 4, 4, 5, 6, 8, 10, 12, 14],
    },
  },

  missile: {
    damageRange: {
      val: oneToTwenty,
      range: [
        4, 5, 6, 7, 8, 9, 9, 10, 11, 11, 12, 12, 13, 13, 14, 14, 14, 15, 15, 16,
      ],
      CP: [
        0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5,
        1.6, 1.7, 1.8, 1.9, 2,
      ],
    },
    blastRadius: {
      val: ["None", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20],
      CM: [1, 3, 4, 5, 6, 7, 7.5, 8, 8.5, 9, 10, 20],
    },
    accuracy: { val: [-2, -1, 0, 1, 2, 3], CM: [0.6, 0.8, 1, 1.3, 1.6, 2] },
    rangeMod: {
      val: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 5, 10, 30, 50],
      CM: [0.5, 0.62, 0.75, 0.88, 1, 1.12, 1.25, 1.38, 1.5, 3, 5.5, 15.5, 25.5],
    },
    smart: { val: ["None", 1, 2, 3, 4], CM: [1, 2.5, 3, 3.5, 4] },
    skill: { val: [6, 9, 12, 15, 18, 20], CM: [1, 1.3, 1.6, 1.9, 2.2, 2.5] },
    type: {
      val: ["Regular", "Fuse", "Scatter", "Smoke & Scatter", "Nuclear"],
      CM: [1, 1.1, 0.5, 1, 1000],
    },
    special: { val: ["None", "Anti-Missile"], CM: [1, 1] },
    variable: { val: [0, 1], CM: [1, 1.8] },
    longRange: { val: [0, 1], CM: [1, 1.33] },
    hyperVelocity: { val: [0, 1], CM: [1, 1.25] },
  },

  eMelee: {
    damageRange: { val: oneToTwenty, range: "melee", CP: oneToTwenty },
    accuracy: { val: [-2, -1, 0, 1, 2, 3], CM: [0.6, 0.8, 0.9, 1, 1.5, 2] },
    turnsUse: {
      val: ["Unlimited", 1, 2, 3, 4, 5, 7, 10],
      CM: [1, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
    },
    attackFactor: {
      val: ["None", 1, 2, 3, 4, 5],
      CM: [1, 1.5, 2, 2.5, 3, 3.5],
    },
    recharge: { val: [0, 1], CM: [1, 1.1] },
    throw: { val: [0, 1], CM: [1, 1.2] },
    quick: { val: [0, 1], CM: [1, 2] },
    hyper: { val: [0, 1], CM: [1, 7.5] },
    shield: { val: [0, 1], CM: [1, 1.5] },
    variable: { val: [0, 1], CM: [1, 2] }, //variable shield/regular weapon
  },

  melee: {
    damageRange: {
      val: oneToTwenty,
      range: "melee",
      CP: [
        0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9,
        9.5, 10,
      ],
    },
    accuracy: { val: [-1, 0, 1, 2], CM: [0.5, 0.7, 1, 1.5] },
    handy: { val: [0, 1], CM: [1, 1.5] },
    quick: { val: [0, 1], CM: [1, 2] },
    clumsy: { val: [0, 1], CM: [1, 0.5] },
    armorPiercing: { val: [0, 1], CM: [1, 2] },
    entangle: { val: [0, 1], CM: [1, 1.5] },
    throw: { val: [0, 1], CM: [1, 1.2] },
    returning: { val: [0, 1], CM: [1, 1.5] },
    disruptor: { val: [0, 1], CM: [1, 2] },
    shockOnly: { val: [0, 1], CM: [1, 2] },
    shockAdded: { val: [0, 1], CM: [1, 3] },
  },
};
