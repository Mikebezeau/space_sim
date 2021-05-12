import useEquipStore from "../stores/equipStore";
import { equipList } from "../data/equipData";
import { useKBControls } from "../hooks/useMouseKBControls";
import { geoList } from "../data/shapeGeometry";

//DISPLAY LIST OF SERVOS
const ServoList = () => {
  const { mechBP, actions, editServoId } = useEquipStore((state) => state);

  const handleDeleteServo = (id) => {
    actions.servoMenu.deleteServo(id);
  };

  const handleChangeType = (index, { target }) => {
    actions.servoMenu.changeProp(index, "type", target.value);
  };

  const handleChangeClass = (index, { target }) => {
    actions.servoMenu.changeProp(index, "class", target.value);
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

export const ServoEditButtons = ({ heading }) => {
  //lust of servos, player clicks one of the buttons to select that servo, and then will be able to edit size/location
  const { mechBP, actions, editServoId, editWeaponId } = useEquipStore(
    (state) => state
  );

  const handleRotateShipView = (axis, direction) => {
    actions.basicMenu.editShipRotation(axis, direction);
  };

  //position up arow
  function handleMovePartUp() {
    editServoId
      ? actions.servoMenu.adjustServoOffset(0, 0.5, 0)
      : actions.weaponMenu.adjustWeaponOffset(0, 0.5, 0);
  }
  useKBControls("KeyQ", handleMovePartUp);

  //position down arow
  function handleMovePartDown() {
    actions.servoMenu.adjustServoOffset(0, -0.5, 0);
    actions.weaponMenu.adjustWeaponOffset(0, -0.5, 0);
  }
  useKBControls("KeyA", handleMovePartDown);

  //position up arow
  function handleMovePartForward() {
    editServoId
      ? actions.servoMenu.adjustServoOffset(0, 0, -1)
      : actions.weaponMenu.adjustWeaponOffset(0, 0, -1);
  }
  useKBControls("ArrowUp", handleMovePartForward);

  //position down arow
  function handleMovePartBackward() {
    actions.servoMenu.adjustServoOffset(0, 0, 1);
    actions.weaponMenu.adjustWeaponOffset(0, 0, 1);
  }
  useKBControls("ArrowDown", handleMovePartBackward);

  //position left arow
  function handleMovePartLeft() {
    actions.servoMenu.adjustServoOffset(-0.5, 0, 0);
    actions.weaponMenu.adjustWeaponOffset(-0.5, 0, 0);
  }
  useKBControls("ArrowLeft", handleMovePartLeft);

  //position right arow
  function handleMovePartRight() {
    actions.servoMenu.adjustServoOffset(0.5, 0, 0);
    actions.weaponMenu.adjustWeaponOffset(0.5, 0, 0);
  }
  useKBControls("ArrowRight", handleMovePartRight);

  const handleSelecteditServoId = (id) => {
    actions.servoMenu.selectServoID(id);
    actions.weaponMenu.selectWeaponID(null);
  };

  const handleSelectEditWeaponId = (id) => {
    actions.servoMenu.selectServoID(null);
    actions.weaponMenu.selectWeaponID(id);
  };

  const handleChangeServoShape = (index, shapeIndex) => {
    actions.servoMenu.selectServoShape(index, Number(shapeIndex));
    console.log(index, Number(shapeIndex));
  };

  const handleRotateServoShape = (axis, direction) => {
    actions.servoMenu.adjustServoRotation(axis, direction);
  };

  const handleScaleServoShape = (axis, val) => {
    actions.servoMenu.adjustServoScale(axis, val);
  };

  /*
  console.log(mechBP.servoList[0].type);
  Object.keys(geoList).forEach((key) => {
    console.log("shape", key);
  });
*/
  return (
    <>
      <h3>
        Rotate Ship View:{" "}
        <button onClick={() => handleRotateShipView("y", -1)}>+</button>
        <button onClick={() => handleRotateShipView("y", 1)}>-</button>
      </h3>
      <h2>Select Servo to Position</h2>
      {mechBP.servoList.map((servo, index) => (
        <span
          key={index}
          className={
            editServoId === servo.id ? "selectedItem" : "nonSelectedItem"
          }
          style={{ display: "block", clear: "both" }}
        >
          <span>
            <button onClick={() => handleSelecteditServoId(servo.id)}>
              {servo.type}
            </button>
          </span>
          <select
            value={servo.shape}
            onChange={(e) => handleChangeServoShape(index, e.target.value)}
          >
            {Object.keys(geoList).map((key, shapeIndex) => (
              <option key={"shape" + index + key} value={shapeIndex}>
                {key}
              </option>
            ))}
          </select>
          <div>
            {mechBP.servoWeaponList(servo.id).map((weapon) => (
              <span
                key={"weapon" + index}
                className={
                  editWeaponId === weapon.id
                    ? "selectedItem"
                    : "nonSelectedItem"
                }
              >
                <button onClick={() => handleSelectEditWeaponId(weapon.id)}>
                  {weapon.data.name}
                </button>
              </span>
            ))}
          </div>
        </span>
      ))}
      <div>Position: Arrow Keys, "Q", "A"</div>
      <div>
        Scale:{" "}
        <button onClick={() => handleScaleServoShape("x", -1)}>X-</button>
        <button onClick={() => handleScaleServoShape("x", 1)}>X+</button>
        <button onClick={() => handleScaleServoShape("y", -1)}>Y-</button>
        <button onClick={() => handleScaleServoShape("y", 1)}>Y+</button>
        <button onClick={() => handleScaleServoShape("z", -1)}>Z-</button>
        <button onClick={() => handleScaleServoShape("z", 1)}>Z+</button>
        <button onClick={() => handleScaleServoShape("reset")}>Reset</button>
      </div>
      <div>
        Rotate:{" "}
        <button onClick={() => handleRotateServoShape("x", -1)}>X-</button>
        <button onClick={() => handleRotateServoShape("x", 1)}>X+</button>
        <button onClick={() => handleRotateServoShape("y", -1)}>Y-</button>
        <button onClick={() => handleRotateServoShape("y", 1)}>Y+</button>
        <button onClick={() => handleRotateServoShape("z", -1)}>Z-</button>
        <button onClick={() => handleRotateServoShape("z", 1)}>Z+</button>
        <button onClick={() => handleRotateServoShape("reset")}>Reset</button>
      </div>
    </>
  );
};

//DISPLAY LIST OF SERVOS
export const Servos = ({ heading }) => {
  const { actions } = useEquipStore((state) => state);

  const handleAddServo = () => {
    actions.servoMenu.addServo();
  };

  return (
    <>
      <h2>{heading}</h2>
      <ServoList />
      <button onClick={handleAddServo}>ADD SERVO</button>
    </>
  );
};
