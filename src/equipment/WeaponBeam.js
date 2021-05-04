import useEquipStore from "../stores/equipStore";

export const WeaponBeamList = () => {
  const { mechBP } = useEquipStore((state) => state);
  console.log(mechBP.weaponList.beam);
  return (
    <>
      {mechBP.weaponList.beam.map((value, index) => (
        <WeaponBeamItem key={"beamBP" + index} beamBP={value} />
      ))}
    </>
  );
};

export const WeaponBeamItem = ({ beamBP }) => {
  return (
    <>
      <table>
        <tbody>
          <tr>
            <th colSpan="100%">Beam Weapon</th>
          </tr>
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
            {/*<th>Weight</th>*/}
            <th>Cost</th>
          </tr>

          <tr>
            <td>
              <input
                className="nameWeapon greenHighlight"
                data-type="beam"
                data-index="index"
                type="text"
                value={beamBP.data.name}
              />
            </td>
            <td>{beamBP.damage()}</td>
            <td>{beamBP.data.fragile ? "1" : beamBP.structure()}</td>
            <td>{beamBP.range()}</td>
            <td>{beamBP.accuracy()}</td>
            <td>{beamBP.burstValue()}</td>
            <td className="greenHighlight">
              <input
                className="weaponSPeff"
                data-type="beam"
                data-index="index"
                type="text"
                value={beamBP.data.SPeff}
              />
            </td>
            <td>{beamBP.SP()}</td>
            <td className="greenHighlight">
              <input
                className="weaponWeff"
                data-type="beam"
                data-index={0}
                type="text"
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

const WeaponBeam = () => {
  const { beamBP, actions } = useEquipStore((state) => state);

  const handleAddWeapon = () => {
    actions.weaponMenu.addBeamWeapon();
  };

  return (
    <>
      <h2>Create Beam Weapon</h2>
      <WeaponBeamItem beamBP={beamBP} />
      <button onClick={handleAddWeapon}>Add Weapon</button>
    </>
  );
};

export default WeaponBeam;
