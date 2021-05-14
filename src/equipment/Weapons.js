import React from "react";
import { useState } from "react";
import useEquipStore from "../stores/equipStore";
import { equipList } from "../data/equipData";
import { WeaponBeamList, WeaponBeamCreate } from "./WeaponBeam";
import { WeaponProjList, WeaponProjCreate } from "./WeaponProj";
import { WeaponMissileList, WeaponMissileCreate } from "./WeaponMissile";
import { WeaponEMeleeList, WeaponEMeleeCreate } from "./WeaponEMelee";
import { WeaponMeleeList, WeaponMeleeCreate } from "./WeaponMelee";
import { ServoSpaceAssignButtons } from "./Servos";

export const WeaponsAssignSpaces = ({ heading }) => {
  const { mechBP, equipActions } = useEquipStore((state) => state);
  const [servoSelectedId, setServoSelectedId] = useState(0);

  const handleWeapSelect = (weaponType, id) => {
    equipActions.assignPartLocationMenu.setWeaponLocation(
      weaponType,
      id,
      servoSelectedId
    );
  };

  const handleServoSelect = (id) => {
    setServoSelectedId(id);
  };

  return (
    <>
      <h2>{heading}</h2>
      <ServoSpaceAssignButtons
        mechBP={mechBP}
        servoSelectedId={servoSelectedId}
        callBack={handleServoSelect}
      />
      <hr />
      {Object.values(mechBP.weaponList).map((weapons, index) => (
        <span key={"weaponList" + index}>
          {weapons.map((weapon, index) => (
            <button
              key={weapon.data.weaponType + index}
              onClick={() =>
                handleWeapSelect(weapon.data.weaponType, weapon.id)
              }
            >
              {weapon.data.name} {weapon.SP()} SP{" "}
              {weapon.servoLocation(mechBP.servoList) &&
                ">>> " + weapon.servoLocation(mechBP.servoList).type}
            </button>
          ))}
        </span>
      ))}
    </>
  );
};

export const Weapons = ({ heading }) => {
  const [selection, setSelection] = useState(-1); //set to view weapon list by default

  const handleWeaponMenu = (index) => {
    setSelection(index);
  };

  return (
    <>
      <h2>{heading}</h2>
      <div>
        <button onClick={() => handleWeaponMenu(-1)}>View List</button> Add
        Weapon:
        {equipList.weapon.type.map((weaponType, index) => (
          <button
            key={"weaponType" + index}
            onClick={() => handleWeaponMenu(index)}
          >
            {weaponType}
          </button>
        ))}
      </div>
      {selection === -1 && <WeaponList />}
      {selection === 0 && <WeaponBeamCreate />}
      {selection === 1 && <WeaponProjCreate />}
      {selection === 2 && <WeaponMissileCreate />}
      {selection === 3 && <WeaponEMeleeCreate />}
      {selection === 4 && <WeaponMeleeCreate />}
    </>
  );
};

const WeaponList = () => {
  return (
    <>
      <h2>Weapon List</h2>
      <WeaponBeamList />
      <WeaponProjList />
      <WeaponMissileList />
      <WeaponEMeleeList />
      <WeaponMeleeList />
    </>
  );
};
