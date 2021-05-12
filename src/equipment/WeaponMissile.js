import { weaponList } from "../data/weaponData";
import useEquipStore from "../stores/equipStore";

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
          <tr class="tableHeaders">
            <th>Name</th>
            <th>Damage</th>
            <th>Structure</th>
            <th>Range</th>
            <th>Acc.</th>
            <th>Blast R.</th>
            <th>SP Eff.</th>
            <th>SP</th>
            <th>Weight Eff.</th>
            <th>Weight</th>
            <th>Scaled Wgt.</th>
            <th>Scaled Cost</th>
          </tr>

          <tr>
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
            <td>{missileBP.damage()}</td>
            <td>{missileBP.structure()}</td>
            <td>{missileBP.range()}</td>
            <td>{missileBP.accuracy()}</td>
            <td>
              {weaponList.missile.blastRadius.val[missileBP.data.blastRadius]}
            </td>
            <td>
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
            </td>
            <td>{missileBP.SP()}</td>
            <td>
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
            </td>
            <td>{missileBP.weight()}</td>
            <td>{"?" /*getKGWeight(this.getWeight())*/}</td>
            <td>{missileBP.scaledCP()}</td>
          </tr>

          <tr>
            <td colSpan="100%">
              <span>Special:</span>
              {/*this.type?' |'+missileWeapRefObj.type.val[this.type]+'| ':''}
                {this.special?' |'+missileWeapRefObj.special.val[this.special]+(this.variable?', Variable| ':'| '):''}
                {this.longRange?' |Long Range: -2 Accuracy| ':''}
  {this.hyperVelocity?' |Hyper Velocity| ':''*/}
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
  return (
    <>
      <h2>Create Missile Weapon</h2>
      <WeaponMissileItem missileBP={missileBP} />
      <button onClick={handleAddWeapon}>Add Weapon</button>
    </>
  );
};
