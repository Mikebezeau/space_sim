import React from "react";
import useEquipStore from "../stores/equipStore";
import { weaponList } from "../data/weaponData";
import WeaponSliderControl from "../equipmentDesign/WeaponSliderControl";
import WeaponToggleControl from "../equipmentDesign/WeaponToggleControl";
import "../css/formContainers.css";
import "../css/sliderControl.css";
import "../css/toggleControl.css";

export const WeaponProjList = () => {
  const { mechBP } = useEquipStore((state) => state);
  return (
    <>
      {mechBP.weaponList.proj.map((value, index) => (
        <WeaponProjItem key={"projBP" + index} projBP={value} />
      ))}
    </>
  );
};

export const WeaponProjItem = ({ projBP, edit = false }) => {
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
                  handleChangeData("proj", projBP.id, "name", e.target.value)
                }
                value={projBP.data.name}
              />
            </td>
          </tr>
          <tr>
            <th>Damage</th>
            <th>Structure</th>
            <th>Range</th>
            <th>Acc.</th>
            <th>BV</th>
            {/*<th>SP Eff.</th>*/}
            <th>SP</th>
            {/*<th>Weight Eff.</th>*/}
            <th>Weight</th>
            {/*<th>Scaled Wgt.</th>*/}
            <th>Scaled Cost</th>
          </tr>
          <tr>
            <td>{projBP.damage()}</td>
            <td>{projBP.structure()}</td>
            <td>{projBP.range()}</td>
            <td>{projBP.accuracy()}</td>
            <td>{projBP.burstValue()}</td>
            {/*<td>
              <input
                onChange={(e) =>
                  handleChangeData("proj", projBP.id, "SPeff", e.target.value)
                }
                value={projBP.data.SPeff}
              />
            </td>
            <td>{projBP.SP()}</td>
            {/*<td>
              <input
                onChange={(e) =>
                  handleChangeData("proj", projBP.id, "wEff", e.target.value)
                }
                value={projBP.data.wEff}
              />
            </td>*/}
            <td>{projBP.weight()}</td>
            {/*<td>getKGWeight(this.getWeight())</td>*/}
            <td>{projBP.scaledCP()}</td>
          </tr>
          <tr>
            <td colSpan="100%">
              <span>Special:</span>
              {projBP.special !== 0 && (
                <span>
                  |{weaponList.proj.special.val[projBP.data.special]}
                  {projBP.data.variable !== 0 && <>, Variable</>}|
                </span>
              )}
              {projBP.data.multiFeed !== 0 && (
                <span>
                  |Multi-Feed:{" "}
                  {weaponList.proj.multiFeed.val[projBP.data.multiFeed]}|
                </span>
              )}
              {projBP.data.longRange !== 0 && (
                <span>|Extreme Range: -2 Accuracy|"</span>
              )}
              {projBP.data.hyperVelocity !== 0 && <span>|Hyper Velocity|</span>}
            </td>
          </tr>
          {projBP.data.ammoList.map((ammo, index) => (
            <tr key={index}>
              <td colSpan="2">Ammunition</td>
              <td colSpan="4">| {weaponList.proj.ammo.val[ammo.type]} |</td>
              <td colSpan="1">{ammo.numAmmo} Shots</td>
              <td>{/*projBP.getAmmoCP()*/}</td>
              <td>{/*mecha.getScaledCost(this.getAmmoCP())*/}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export const WeaponProjCreate = () => {
  const { projBP, equipActions } = useEquipStore((state) => state);

  const handleAddWeapon = () => {
    equipActions.weaponMenu.addProjWeapon();
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
      max: 10,
      label: "Range Mod:",
      label2: "Cost: X",
    },
    {
      field: "accuracy",
      subField: "val",
      subField2: "CM",
      min: 0,
      max: 4,
      label: "Accuracy:",
      label2: "Cost: X",
    },
    {
      field: "burstValue",
      subField: "val",
      subField2: "CM",
      min: 0,
      max: 7,
      label: "Burst Value:",
      label2: "Cost: X",
    },
    {
      field: "multiFeed",
      subField: "val",
      subField2: "CM",
      min: 0,
      max: 3,
      label: "Multi-Ammo:",
      label2: "Cost: X",
    },
    {
      field: "special",
      subField: "val",
      subField2: "CM",
      min: 0,
      max: 3,
      label: "Mode:",
      label2: "Cost: X",
    },
  ];

  const toggleControls = [
    { field: "longRange", label: "Extreme Range" },
    { field: "hyperVelocity", label: "Hyper Velocity" },
    { field: "variable", label: "Variable Mode" },
  ];

  return (
    <>
      <h2>Create Projectile Weapon</h2>
      <WeaponProjItem projBP={projBP} edit={true} />
      <hr />

      <div className="formControlCol1">
        <WeaponSliderControl
          weaponType={"proj"}
          weaponBP={projBP}
          controlData={sliderControls[0]}
        />
      </div>
      <div>
        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"proj"}
            weaponBP={projBP}
            controlData={sliderControls[1]}
          />
        </div>

        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"proj"}
            weaponBP={projBP}
            controlData={sliderControls[2]}
          />
        </div>

        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"proj"}
            weaponBP={projBP}
            controlData={sliderControls[3]}
          />
        </div>
      </div>

      <div>
        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"proj"}
            weaponBP={projBP}
            controlData={sliderControls[4]}
          />
        </div>

        <div className="formControlCol3"></div>

        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"proj"}
            weaponBP={projBP}
            controlData={sliderControls[5]}
          />
        </div>
      </div>

      <div>
        <div className="formControlCol3">
          <WeaponToggleControl
            weaponType={"proj"}
            weaponBP={projBP}
            controlData={toggleControls[0]}
          />
        </div>
        <div className="formControlCol3">
          <WeaponToggleControl
            weaponType={"proj"}
            weaponBP={projBP}
            controlData={toggleControls[1]}
          />
        </div>
        <div className="formControlCol3">
          <WeaponToggleControl
            weaponType={"proj"}
            weaponBP={projBP}
            controlData={toggleControls[2]}
          />
        </div>
      </div>

      <button className="addWeaponButton" onClick={handleAddWeapon}>
        Add Weapon
      </button>
    </>
  );
};
