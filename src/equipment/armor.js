//ARMOR***********************************
/*
var armorType = {
  rating: ["Ablative", "Standard", "Alpha", "Beta", "Gamma"],
  threshold: [0, 1, 2, 3, 4],
  costMP: [0.5, 1, 1.5, 2, 3],
};

var classArmorVal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
*/
const armorObj = {
  class: 5,
  type: 1, //STANDARD RATING
  shield: 0, //NOT A SHIELD
  getClass: function () {
    return lists.classList[get().class]; //class name
  },

  getAV: function () {
    var AV = lists.classArmorVal[get().class]; //class armor value
    AV = mecha.getScaledVal(AV);
    return AV;
  },

  getThreshold: function () {
    var threshold = lists.armorType.threshold[get().type];
    return threshold;
  },

  getWeight: function () {
    var weight = lists.classArmorVal[get().class] / 2;
    return weight;
  },

  getCP: function () {
    var CP =
      lists.classArmorVal[get().class] * lists.armorType.costMP[get().type];
    return CP;
  },

  getScaledCP: function () {
    var CP = get().getCP();
    CP = get().getScaledCost(CP);
    return CP;
  },
};
