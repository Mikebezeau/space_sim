import React from "react"; //import { weaponList } from "../data/weaponData";
import useEquipStore from "../stores/equipStore";

export const WeaponEMeleeList = () => {
  const { mechBP } = useEquipStore((state) => state);
  return (
    <>
      {mechBP.weaponList.eMelee.map((value, index) => (
        <WeaponEMeleeItem key={"eMeleeBP" + index} eMeleeBP={value} />
      ))}
    </>
  );
};

export const WeaponEMeleeItem = ({ eMeleeBP }) => {
  const { equipActions } = useEquipStore((state) => state);
  const handleChangeData = (weaponType, id, propName, val) => {
    equipActions.weaponMenu.setDataValue(weaponType, id, propName, val);
  };

  return (
    <table>
      <tbody>
        <tr class="tableHeaders">
          <th>Name</th>
          <th>Damage</th>
          <th>Structure</th>
          <th>Range</th>
          <th>Acc.</th>
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
                handleChangeData("eMelee", eMeleeBP.id, "name", e.target.value)
              }
              value={eMeleeBP.data.name}
            />
          </td>

          <td>{eMeleeBP.damage()}</td>
          <td>{eMeleeBP.structure()}</td>
          <td>{eMeleeBP.range()}</td>
          <td>{eMeleeBP.accuracy()}</td>
          <td>
            <input
              onChange={(e) =>
                handleChangeData("eMelee", eMeleeBP.id, "SPeff", e.target.value)
              }
              value={eMeleeBP.data.SPeff}
            />
          </td>
          <td>{eMeleeBP.SP()}</td>
          <td>
            <input
              onChange={(e) =>
                handleChangeData("eMelee", eMeleeBP.id, "wEff", e.target.value)
              }
              value={eMeleeBP.data.wEff}
            />
          </td>
          <td>{eMeleeBP.weight()}</td>
          <td>{"?" /*eMeleeBP.getKGWeight(this.getWeight())*/}</td>
          <td>{eMeleeBP.scaledCP()}</td>
        </tr>

        <tr>
          <td colSpan="100%">
            <span>Special:</span>
            |Bypass 4 Armor|
            {/*this.turnsUse
              ? " |" +
                eMeleeWeapRefObj.turnsUse.val[this.turnsUse] +
                " Turns in Use| "
              : ""}
            {this.attackFactor
              ? " |Auto Attack " +
                eMeleeWeapRefObj.attackFactor.val[this.attackFactor] +
                "|"
              : ""}
            {this.recharge ? " |Rechargable| " : ""}
            {this.throw ? " |Thrown| " : ""}
            {this.quick ? " |Quick| " : ""}
            {this.hyper ? " |Hyper| " : ""}
            {this.shield
              ? " |Beam Shield" +
                (this.variable ? ", Variable" : "") +
                (this.attackFactor
                  ? ", Auto Defend " +
                    eMeleeWeapRefObj.attackFactor.val[this.attackFactor]
                  : "") +
                "| "
                : ""*/}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const WeaponEMeleeCreate = () => {
  const { eMeleeBP, equipActions } = useEquipStore((state) => state);

  const handleAddWeapon = () => {
    equipActions.weaponMenu.addEMeleeWeapon();
    alert("weapon added");
  };
  return (
    <>
      <h2>Create Energy Melee Weapon</h2>
      <WeaponEMeleeItem eMeleeBP={eMeleeBP} />
      <button onClick={handleAddWeapon}>Add Weapon</button>
    </>
  );
};
