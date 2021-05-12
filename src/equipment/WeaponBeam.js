import useEquipStore from "../stores/equipStore";

export const WeaponBeamList = () => {
  const { mechBP } = useEquipStore((state) => state);
  return (
    <>
      {mechBP.weaponList.beam.map((value, index) => (
        <WeaponBeamItem key={"beamBP" + index} beamBP={value} />
      ))}
    </>
  );
};

export const WeaponBeamItem = ({ beamBP }) => {
  const { equipActions } = useEquipStore((state) => state);
  const handleChangeData = (weaponType, id, propName, val) => {
    equipActions.weaponMenu.setDataValue(weaponType, id, propName, val);
  };

  return (
    <>
      <table>
        <tbody>
          <tr className="tableHeaders">
            <th>Name</th>
            <th>Damage</th>
            <th>Structure</th>
            <th>Range</th>
            <th>Acc.</th>
            <th>BV</th>
            <th>SP Eff.</th>
            <th>SP</th>
            <th>Weight Eff.</th>
            <th>Weight</th>
            <th>Cost</th>
          </tr>

          <tr>
            <td>
              <input
                onChange={(e) =>
                  handleChangeData("beam", beamBP.id, "name", e.target.value)
                }
                value={beamBP.data.name}
              />
            </td>
            <td>{beamBP.damage()}</td>
            <td>{beamBP.data.fragile ? "1" : beamBP.structure()}</td>
            <td>{beamBP.range()}</td>
            <td>{beamBP.accuracy()}</td>
            <td>{beamBP.burstValue()}</td>
            <td>
              <input
                onChange={(e) =>
                  handleChangeData("beam", beamBP.id, "SPeff", e.target.value)
                }
                value={beamBP.data.SPeff}
              />
            </td>
            <td>{beamBP.SP()}</td>
            <td>
              <input
                onChange={(e) =>
                  handleChangeData("beam", beamBP.id, "wEff", e.target.value)
                }
                value={beamBP.data.wEff}
              />
            </td>

            <td>{beamBP.weight()}</td>
            {/*<td>mecha.getKGWeight(beamBP.getWeight())</td>*/}
            <td>{beamBP.scaledCP()}</td>
          </tr>
          <tr>
            <td colSpan="100%">
              <span>Special:</span>
              {/*(beamBP.special
        ?  
          beamWeapRefObj.special.val[beamBP.special] +
          (beamBP.variable ? ", Variable| " : "| ")
        : "") +
      (beamBP.shots
        ? " |" + beamWeapRefObj.shots.val[beamBP.shots] + " Shots|"
        : "|0 Shots, Must Charge| ") +
      (beamBP.warmUp
        ? " |Warm Up: " + beamWeapRefObj.warmUp.val[beamBP.warmUp] + "|"
        : "") +
      (beamBP.wideAngle
        ? " |Wide Angle: " +
          beamWeapRefObj.wideAngle.val[beamBP.wideAngle] +
          "| "
        : "") +
      (beamBP.longRange ? " |Long Range: -2 Accuracy| " : "") +
      (beamBP.megaBeam ? " |Mega Beam| " : "") +
      (beamBP.disruptor ? " |Disruptor| " : "") +*/}
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

  return (
    <>
      <h2>Create Beam Weapon</h2>
      <WeaponBeamItem beamBP={beamBP} />
      <button onClick={handleAddWeapon}>Add Weapon</button>
    </>
  );
};
