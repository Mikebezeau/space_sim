import React from "react";
import { weaponList } from "../data/weaponData";
import useEquipStore from "../stores/equipStore";
import WeaponSliderControl from "../equipmentDesign/WeaponSliderControl";
import WeaponToggleControl from "../equipmentDesign/WeaponToggleControl";
import "../css/formContainers.css";
import "../css/sliderControl.css";
import "../css/toggleControl.css";

export const WeaponMissileList = () => {
  const { mechBP } = useEquipStore((state) => state);
  return (
    <>
      {mechBP.weaponList.missile.map((value, index) => (
        <WeaponMissileItem key={"missileBP" + index} missileBP={value} />
      ))}
    </>
  );
};

export const WeaponMissileItem = ({ missileBP }) => {
  const { equipActions } = useEquipStore((state) => state);
  const handleChangeData = (weaponType, id, propName, val) => {
    equipActions.weaponMenu.setDataValue(weaponType, id, propName, val);
  };

  return (
    <>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td>
              <input
                onChange={(e) =>
                  handleChangeData(
                    "missile",
                    missileBP.id,
                    "name",
                    e.target.value
                  )
                }
                value={missileBP.data.name}
              />
            </td>
          </tr>
          <tr>
            <th>Damage</th>
            <th>Structure</th>
            <th>Range</th>
            <th>Acc.</th>
            <th>Blast R.</th>
            {/*<th>SP Eff.</th>*/}
            <th>SP</th>
            {/*<th>Weight Eff.</th>*/}
            <th>Weight</th>
            {/*<th>Scaled Wgt.</th>*/}
            <th>Scaled Cost</th>
          </tr>

          <tr>
            <td>{missileBP.damage()}</td>
            <td>{missileBP.structure()}</td>
            <td>{missileBP.range()}</td>
            <td>{missileBP.accuracy()}</td>
            <td>
              {weaponList.missile.blastRadius.val[missileBP.data.blastRadius]}
            </td>
            {/*<td>
              <input
                onChange={(e) =>
                  handleChangeData(
                    "missile",
                    missileBP.id,
                    "SPeff",
                    e.target.value
                  )
                }
                value={missileBP.data.SPeff}
              />
              </td>*/}
            <td>{missileBP.SP()}</td>
            {/*<td>
              <input
                onChange={(e) =>
                  handleChangeData(
                    "missile",
                    missileBP.id,
                    "wEff",
                    e.target.value
                  )
                }
                value={missileBP.data.wEff}
              />
              </td>*/}
            <td>{missileBP.weight()}</td>
            {/*<td>getKGWeight(this.getWeight())</td>*/}
            <td>{missileBP.scaledCP()}</td>
          </tr>

          <tr>
            <td colSpan="100%">
              <span>Special:</span>
              {missileBP.special !== 0 && (
                <span>
                  |{weaponList.missile.special.val[missileBP.data.special]}
                  {missileBP.data.variable !== 0 && <>, Variable</>}|
                </span>
              )}
              {missileBP.data.type !== 0 && (
                <span>
                  |Warhead: {weaponList.missile.type.val[missileBP.data.type]}|
                </span>
              )}
              {missileBP.data.longRange !== 0 && (
                <span>|Extreme Range: -2 Accuracy|</span>
              )}
              {missileBP.data.hyperVelocity !== 0 && (
                <span>|Hyper Velocity|</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export const WeaponMissileCreate = () => {
  const { missileBP, equipActions } = useEquipStore((state) => state);

  const handleAddWeapon = () => {
    equipActions.weaponMenu.addMissileWeapon();
    alert("weapon added");
  };

  const sliderControls = [
    {
      field: "damageRange",
      subField: "val",
      subField2: "range",
      min: 0,
      max: 19,
      label: "Damage:",
      label2: "Range:",
    },
    {
      field: "rangeMod",
      subField: "val",
      subField2: "CM",
      min: 0,
      max: 12,
      label: "Range Mod:",
      label2: "Cost: X",
    },
    {
      field: "accuracy",
      subField: "val",
      subField2: "CM",
      min: 0,
      max: 5,
      label: "Accuracy:",
      label2: "Cost: X",
    },
    {
      field: "blastRadius",
      subField: "val",
      subField2: "CM",
      min: 0,
      max: 11,
      label: "Blast Radius:",
      label2: "Cost: X",
    },
    {
      field: "smart",
      subField: "val",
      subField2: "CM",
      min: 0,
      max: 4,
      label: "Smart:",
      label2: "Cost: X",
    },
    {
      field: "skill",
      subField: "val",
      subField2: "CM",
      min: 0,
      max: 5,
      label: "Smart Skill:",
      label2: "Cost: X",
    },
    {
      field: "type",
      subField: "val",
      subField2: "CM",
      min: 0,
      max: 4,
      label: "Warhead:",
      label2: "Cost: X",
    },
  ];

  const toggleControls = [
    { field: "longRange", label: "Extreme Range" },
    { field: "hyperVelocity", label: "Hyper Velocity" },
    { field: "special", label: "Anti-Missile" },
    { field: "variable", label: "Variable Mode" },
  ];

  return (
    <>
      <h2>Create Missile Weapon</h2>
      <WeaponMissileItem missileBP={missileBP} />

      <div className="formControlCol1">
        <WeaponSliderControl
          weaponType={"missile"}
          weaponBP={missileBP}
          controlData={sliderControls[0]}
        />
      </div>
      <div>
        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"missile"}
            weaponBP={missileBP}
            controlData={sliderControls[1]}
          />
        </div>

        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"missile"}
            weaponBP={missileBP}
            controlData={sliderControls[2]}
          />
        </div>

        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"missile"}
            weaponBP={missileBP}
            controlData={sliderControls[3]}
          />
        </div>
      </div>

      <div>
        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"missile"}
            weaponBP={missileBP}
            controlData={sliderControls[4]}
          />
        </div>

        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"missile"}
            weaponBP={missileBP}
            controlData={sliderControls[5]}
          />
        </div>
        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"missile"}
            weaponBP={missileBP}
            controlData={sliderControls[6]}
          />
        </div>
      </div>

      <div>
        <div className="formControlCol2">
          <WeaponToggleControl
            weaponType={"missile"}
            weaponBP={missileBP}
            controlData={toggleControls[0]}
          />
        </div>
        <div className="formControlCol2">
          <WeaponToggleControl
            weaponType={"missile"}
            weaponBP={missileBP}
            controlData={toggleControls[1]}
          />
        </div>
      </div>

      <div>
        <div className="formControlCol2">
          <WeaponToggleControl
            weaponType={"missile"}
            weaponBP={missileBP}
            controlData={toggleControls[2]}
          />
        </div>
        <div className="formControlCol2">
          <WeaponToggleControl
            weaponType={"missile"}
            weaponBP={missileBP}
            controlData={toggleControls[3]}
          />
        </div>
      </div>

      <button onClick={handleAddWeapon}>Add Weapon</button>
    </>
  );
};
