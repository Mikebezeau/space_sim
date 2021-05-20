import React from "react";
import useEquipStore from "../stores/equipStore";
import { equipList } from "../data/equipData";

//DISPLAY LIST OF SERVOS
const ServoList = () => {
  const { mechBP, equipActions, editServoId } = useEquipStore((state) => state);

  const handleDeleteServo = (id) => {
    equipActions.servoMenu.deleteServo(id);
  };

  const handleChangeType = (index, { target }) => {
    equipActions.servoMenu.changeProp(index, "type", target.value);
  };

  const handleChangeClass = (index, { target }) => {
    equipActions.servoMenu.changeProp(index, "class", target.value);
  };
  //console.log(mechBP, mechBP.servoList);

  return (
    <>
      {mechBP.servoList.map((servo, index) => (
        <div
          key={"type" + index}
          className={
            editServoId === servo.id ? "selectedItem" : "nonSelectedItem"
          }
        >
          <select
            name="servoType"
            value={servo.type}
            index={index}
            onChange={(e) => handleChangeType(index, e)}
          >
            {equipList.servo.type.map((value, key) => (
              <option key={"type" + index + key} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            name="servoClassType"
            value={servo.class}
            onChange={(e) => handleChangeClass(index, e)}
          >
            {equipList.class.type.map((value, key) => (
              <option key={"class" + index + key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <span>{servo.structure()}</span>
          <span>/{servo.SP()}</span>
          <span>/{servo.CP()}</span>
          <span>/{servo.armorVal()}</span>
          <span>/{servo.armorType()}</span>
          <button onClick={() => handleDeleteServo(servo.id)}>X</button>
        </div>
      ))}
    </>
  );
};

export const ServoSpaceAssignButtons = ({
  mechBP,
  servoSelectedId,
  callBack,
}) => {
  return (
    <>
      {mechBP.servoList.map((servo, index) => (
        <span
          key={"servo" + index}
          className={
            servoSelectedId === servo.id ? "selectedItem" : "nonSelectedItem"
          }
        >
          <button onClick={() => callBack(servo.id)}>
            {servo.type} {servo.usedSP(mechBP)} / {servo.SP()} SP
          </button>
        </span>
      ))}
    </>
  );
};

//DISPLAY LIST OF SERVOS
export const Servos = ({ heading }) => {
  const { equipActions } = useEquipStore((state) => state);

  const handleAddServo = () => {
    equipActions.servoMenu.addServo();
  };

  return (
    <>
      <h2>{heading}</h2>
      <ServoList />
      <button onClick={handleAddServo}>ADD SERVO</button>
    </>
  );
};
