export const SCALE = 0.001; //MAX=? MIN=0.001

export const IS_MOBLIE = /Mobi|Android/i.test(navigator.userAgent);

export const FLIGHT = 1,
  MAIN_MENU = 2,
  EQUIPMENT_SCREEN = 3,
  NUM_SCREEN_OPTIONS = 3;
// A helper function to calculate the distance between two points in 3d space.
// Used to detect lasers intersecting with enemies.
export const distance = (p1, p2) => {
  const a = p2.x - p1.x;
  const b = p2.y - p1.y;
  const c = p2.z - p1.z;

  return Math.sqrt(a * a + b * b + c * c);
};

export const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

/*
//DOUBLE SLIDER LABEL CREATOR
function doubleSliderLabel(topArr, bottomArr) {
  var combinedArr = [];
  for (var i = 0; i < topArr.length; i++) {
    combinedArr[i] = "<b>" + topArr[i] + "</b>" + bottomArr[i];
  }
  return combinedArr;
}

//RETURN ARRAY WITH CONTENTS AS STRING
function castStringArray(array) {
  var stringArray = [];
  for (var i = 0; i < array.length; i++) {
    stringArray[i] = String(array[i]);
  }
  return stringArray;
}

//RETURN ARRAY WITH CONTENTS AS PERCENTAGE
function castPercentArray(array) {
  var percentArray = [];
  for (var i = 0; i < array.length; i++) {
    percentArray[i] = array[i] * 100 + "%";
  }
  return percentArray;
}
*/
