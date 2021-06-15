import React from "react";
import { weaponList } from "../data/weaponData";

const WeaponSliderControl = ({ weaponType, weaponBP, controlData }) => {
  const handleSliderChange = (e, field) => {
    weaponBP.data[field] = e.target.value;
  };
  return (
    <>
      <div className="slidecontainer">
        <input
          onInput={(e) => handleSliderChange(e, controlData.field)}
          type="range"
          min={controlData.min}
          max={controlData.max}
          value={weaponBP.data[controlData.field]}
          className="slider"
        />
      </div>
      <span className="formSliderLabel">
        {controlData.label}{" "}
        {
          weaponList[weaponType][controlData.field][controlData.subField][
            weaponBP.data[controlData.field]
          ]
        }
      </span>
      <span className="formSliderLabelCost">
        {controlData.label2}{" "}
        {
          weaponList[weaponType][controlData.field][controlData.subField2][
            weaponBP.data[controlData.field]
          ]
        }
      </span>
    </>
  );
};

export default WeaponSliderControl;
