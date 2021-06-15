import React from "react";
import { weaponList } from "../data/weaponData";

const WeaponToggleControl = ({ weaponType, weaponBP, controlData }) => {
  const handleCheckboxChange = (e, field) => {
    weaponBP.data[field] = e.currentTarget.checked ? 1 : 0;
  };
  return (
    <div className="toggleContainer">
      <span>{controlData.label}</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={weaponBP.data[controlData.field]}
          value={1}
          onChange={(e) => handleCheckboxChange(e, controlData.field)}
        />
        <span className="toggleslider"></span>
      </label>
      <span className="formToggleLabelCost">
        Cost: X
        {
          weaponList[weaponType][controlData.field].CM[
            weaponBP.data[controlData.field]
          ]
        }
      </span>
    </div>
  );
};

export default WeaponToggleControl;
