import React from "react";
import useEquipStore from "../stores/equipStore";

export const WeaponMeleeList = () => {
  const { mechBP } = useEquipStore((state) => state);
  return (
    <>
      {mechBP.weaponList.melee.map((value, index) => (
        <WeaponMeleeItem key={"meleeBP" + index} meleeBP={value} />
      ))}
    </>
  );
};

export const WeaponMeleeItem = ({ meleeBP }) => {
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
                handleChangeData("melee", meleeBP.id, "name", e.target.value)
              }
              value={meleeBP.data.name}
            />
          </td>
          <td>{meleeBP.damage()}</td>
          <td>{meleeBP.structure()}</td>
          <td>{meleeBP.range()}</td>
          <td>{meleeBP.accuracy()}</td>
          <td>
            <input
              onChange={(e) =>
                handleChangeData("melee", meleeBP.id, "SPeff", e.target.value)
              }
              value={meleeBP.data.SPeff}
            />
          </td>
          <td>{meleeBP.SP()}</td>
          <td>
            <input
              onChange={(e) =>
                handleChangeData("melee", meleeBP.id, "wEff", e.target.value)
              }
              value={meleeBP.data.wEff}
            />
          </td>
          <td>{meleeBP.weight()}</td>
          <td>{"?" /*mecha.getKGWeight(this.getWeight())*/}</td>
          <td>{meleeBP.scaledCP()}</td>
        </tr>

        <tr>
          <td colSpan="100%">
            <span>Special:</span>
            {meleeBP.data.handy ? " |Handy| " : ""}
            {meleeBP.data.clumsy ? " |Clumsy| " : ""}
            {meleeBP.data.quick ? " |Quick| " : ""}
            {meleeBP.data.armorPiercing ? " |Armor Piercing| " : ""}
            {meleeBP.data.entangle ? " |Entangle| " : ""}
            {meleeBP.data.throw ? " |Throw| " : ""}
            {meleeBP.data.returning ? " |Returning| " : ""}
            {meleeBP.data.disruptor ? " |Disruptor| " : ""}
            {meleeBP.data.shockOnly ? " |Shock Only| " : ""}
            {meleeBP.data.shockAdded ? " |Shock Added| " : ""}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const WeaponMeleeCreate = () => {
  const { meleeBP, equipActions } = useEquipStore((state) => state);
  console.log(meleeBP);
  const handleAddWeapon = () => {
    equipActions.weaponMenu.addMeleeWeapon();
    alert("weapon added");
  };
  return (
    <>
      <h2>Create Melee Weapon</h2>
      <WeaponMeleeItem meleeBP={meleeBP} />
      <button onClick={handleAddWeapon}>Add Weapon</button>
    </>
  );
};
