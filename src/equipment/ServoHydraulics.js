import React from "react";
import useEquipStore from "../stores/equipStore";
import { equipList } from "../data/equipData";

//DISPLAY LIST OF SERVOS
const ServoHydraulics = ({ heading }) => {
  const { mechBP, equipActions } = useEquipStore((state) => state);

  const handleHydraulics = (e) => {
    equipActions.basicMenu.setProp("hydraulicsType", e.target.value);
  };

  return (
    <>
      <h2>{heading}</h2>
      <table>
        <tr>
          <th>Servo Hydraulics</th>
          <th colspan="3">
            <div className="sliderLable">
              <select
                name="hydraulics"
                id="hydraulics"
                value={mechBP.hydraulicsType}
                onChange={handleHydraulics}
              >
                {equipList.hydraulics.type.map((value, key) => (
                  <option value={key}>{value}</option>
                ))}
              </select>
            </div>
          </th>
        </tr>
        <tr>
          <th>Cost Mult.</th>
          <th>Spaces</th>
          <th></th>
        </tr>
        <tr>
          <th>{equipList.hydraulics.CM[mechBP.hydraulicsType]}</th>
          <th>{equipList.hydraulics.SP[mechBP.hydraulicsType]}</th>
          <th></th>
        </tr>
        <tr>
          <th>Melee Damage</th>
          <th>Lifting Mult.</th>
          <th>Lifting Ability</th>
        </tr>
        <tr>
          <th>{equipList.hydraulics.melee[mechBP.hydraulicsType]}</th>
          <th>{equipList.hydraulics.lift[mechBP.hydraulicsType]}</th>
          <th>{mechBP.liftVal()} KG</th>
        </tr>
      </table>
    </>
  );
};

export default ServoHydraulics;
