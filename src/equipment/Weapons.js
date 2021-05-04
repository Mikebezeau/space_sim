import { useState } from "react";
import useEquipStore from "../stores/equipStore";
import { equipList } from "../data/equipData";
import WeaponBeam from "./WeaponBeam";
import { ServoSpaceAssignButtons } from "./Servos";

import { WeaponBeamList } from "./WeaponBeam";

export const WeaponsAssignSpaces = () => {
  const { mechBP, actions } = useEquipStore((state) => state);
  const [servoSelectedId, setServoSelectedId] = useState(0);

  const handleWeapSelect = (weaponType, id) => {
    actions.assignPartLocationMenu.setWeaponLocation(
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
                weapon.servoLocation(mechBP.servoList).type}
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
      {selection === 0 && <WeaponBeam />}
    </>
  );
};

const WeaponList = () => {
  return (
    <>
      <h2>Weapon List</h2>
      <WeaponBeamList />
    </>
  );
};
