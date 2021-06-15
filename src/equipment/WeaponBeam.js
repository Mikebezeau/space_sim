import React from "react";
import useEquipStore from "../stores/equipStore";
import { weaponList } from "../data/weaponData";
import WeaponSliderControl from "../equipmentDesign/WeaponSliderControl";
import WeaponToggleControl from "../equipmentDesign/WeaponToggleControl";
import "../css/formContainers.css";
import "../css/sliderControl.css";
import "../css/toggleControl.css";

export const WeaponBeamList = () => {
  const { mechBP } = useEquipStore((state) => state);
  const { equipActions } = useEquipStore((state) => state);
  const handleDeleteWeapon = (weaponType, id) => {
    equipActions.weaponMenu.deleteWeapon(weaponType, id);
  };
  return (
    <>
      {mechBP.weaponList.beam.map((beamBP, index) => (
        <span key={"beamBP" + index}>
          <button onClick={() => handleDeleteWeapon("beam", beamBP.id)}>
            X
          </button>
          <WeaponBeamItem beamBP={beamBP} />
        </span>
      ))}
    </>
  );
};

export const WeaponBeamItem = ({ beamBP, edit = false }) => {
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
                  handleChangeData("beam", beamBP.id, "name", e.target.value)
                }
                value={beamBP.data.name}
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
            <th>Cost</th>
          </tr>

          <tr>
            <td>{beamBP.damage()}</td>
            <td>{beamBP.data.fragile ? "1" : beamBP.structure()}</td>
            <td>{beamBP.range()}</td>
            <td>{beamBP.accuracy()}</td>
            <td>{beamBP.burstValue()}</td>
            {/*<td>
              <input
                onChange={(e) =>
                  handleChangeData("beam", beamBP.id, "SPeff", e.target.value)
                }
                value={beamBP.data.SPeff}
              />
              </td>*/}
            <td>{beamBP.SP()}</td>
            {/*<td>
              <input
                onChange={(e) =>
                  handleChangeData("beam", beamBP.id, "wEff", e.target.value)
                }
                value={beamBP.data.wEff}
              />
              </td>*/}
            <td>{beamBP.weight()}</td>
            {/*<td>mecha.getKGWeight(beamBP.getWeight())</td>*/}
            <td>{beamBP.scaledCP()}</td>
          </tr>
          <tr>
            <td colSpan="100%">
              <span>Special:</span>
              {beamBP.data.special !== 0 && (
                <span>
                  |{weaponList.beam.special.val[beamBP.data.special]}
                  {beamBP.data.variable && <>, Variable</>}|
                </span>
              )}
              {Number(beamBP.data.shots) !== 0 && (
                <span>
                  |{weaponList.beam.shots.val[beamBP.data.shots]} Shot
                  {Number(beamBP.data.shots) !== 1 && <>s</>}|
                </span>
              )}
              {Number(beamBP.data.shots) === 0 && (
                <span>|0 Shots, Must Charge|</span>
              )}
              {beamBP.data.warmUp !== 0 && (
                <span>
                  |Warm Up: {weaponList.beam.warmUp.val[beamBP.data.warmUp]}|
                </span>
              )}
              {beamBP.data.wideAngle !== 0 && (
                <span>
                  |Wide Angle:{" "}
                  {weaponList.beam.wideAngle.val[beamBP.data.wideAngle]}|
                </span>
              )}
              {beamBP.data.longRange !== 0 && (
                <span>|Extreme Range: -2 Accuracy|</span>
              )}
              {beamBP.data.megaBeam !== 0 && <span>|Mega Beam|</span>}
              {beamBP.data.disruptor !== 0 && <span>|Disruptor|</span>}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export const WeaponBeamCreate = () => {
  const { beamBP, equipActions } = useEquipStore((state) => state);
  const handleAddWeapon = () => {
    equipActions.weaponMenu.addBeamWeapon();
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
      max: 9,
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
      field: "burstValue",
      subField: "val",
      subField2: "CM",
      min: 0,
      max: 7, //8 is for "unlimited" BV, game does not have option yet (will be a constant ray)
      label: "Burst Value:",
      label2: "Cost: X",
    },
    {
      field: "shots",
      subField: "val",
      subField2: "CM",
      min: 0,
      max: 5,
      label: "Num Shots:",
      label2: "Cost: X",
    },
    {
      field: "warmUp",
      subField: "val",
      subField2: "CM",
      min: 0,
      max: 3,
      label: "Warm Up:",
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
    { field: "variable", label: "Variable Mode" },
    { field: "fragile", label: "Fragile Structure" },
    { field: "longRange", label: "Extreme Range" },
    { field: "megaBeam", label: "Mega Beam" },
    { field: "disruptor", label: "EMP Disruption" },
  ];

  return (
    <>
      <h2>Create Beam Weapon</h2>
      <WeaponBeamItem beamBP={beamBP} edit={true} />
      <hr />

      <div className="formControlCol1">
        <WeaponSliderControl
          weaponType={"beam"}
          weaponBP={beamBP}
          controlData={sliderControls[0]}
        />
      </div>

      <div>
        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"beam"}
            weaponBP={beamBP}
            controlData={sliderControls[1]}
          />
        </div>

        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"beam"}
            weaponBP={beamBP}
            controlData={sliderControls[2]}
          />
        </div>

        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"beam"}
            weaponBP={beamBP}
            controlData={sliderControls[3]}
          />
        </div>
      </div>

      <div>
        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"beam"}
            weaponBP={beamBP}
            controlData={sliderControls[4]}
          />
        </div>

        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"beam"}
            weaponBP={beamBP}
            controlData={sliderControls[5]}
          />
        </div>

        <div className="formControlCol3">
          <WeaponSliderControl
            weaponType={"beam"}
            weaponBP={beamBP}
            controlData={sliderControls[6]}
          />
        </div>
      </div>

      <div>
        <div className="formControlCol3">
          <WeaponToggleControl
            weaponType={"beam"}
            weaponBP={beamBP}
            controlData={toggleControls[1]}
          />
        </div>
        <div className="formControlCol3">
          <WeaponToggleControl
            weaponType={"beam"}
            weaponBP={beamBP}
            controlData={toggleControls[2]}
          />
        </div>
        <div className="formControlCol3">
          <WeaponToggleControl
            weaponType={"beam"}
            weaponBP={beamBP}
            controlData={toggleControls[0]}
          />
        </div>
      </div>

      <div>
        <div className="formControlCol3">
          <WeaponToggleControl
            weaponType={"beam"}
            weaponBP={beamBP}
            controlData={toggleControls[3]}
          />
        </div>
        <div className="formControlCol3">
          <WeaponToggleControl
            weaponType={"beam"}
            weaponBP={beamBP}
            controlData={toggleControls[4]}
          />
        </div>
      </div>

      <button className="addWeaponButton" onClick={handleAddWeapon}>
        Add Weapon
      </button>
    </>
  );
};
