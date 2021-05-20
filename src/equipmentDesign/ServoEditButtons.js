import React from "react";
import useEquipStore from "../stores/equipStore";
import { geoList } from "../data/shapeGeometry";

import {
  useKBControls,
  useMouseDown,
  useMouseMove,
  //useMouseClick,
} from "../controlHooks/useMouseKBControls";

const ServoEditButtons = ({ heading }) => {
  //lust of servos, player clicks one of the buttons to select that servo, and then will be able to edit size/location
  const { mechBP, equipActions, editServoId, editWeaponId, editLandingBayId } =
    useEquipStore((state) => state);

  const partMoveOffsetVal = mechBP.size() / 20;

  const handleRotateShipView = (axis, direction) => {
    equipActions.basicMenu.editShipRotation(axis, direction);
  };

  const handleZoomShipView = (direction) => {
    equipActions.basicMenu.editShipZoom(direction * 5);
  };

  //position up arow
  function handleMovePartUp() {
    if (editLandingBayId) {
      let bayPosition = mechBP.landingBayPosition;
      bayPosition = {
        x: mechBP.landingBayPosition.x,
        y: mechBP.landingBayPosition.y + partMoveOffsetVal,
        z: mechBP.landingBayPosition.z,
      };
      equipActions.basicMenu.setProp("landingBayPosition", bayPosition);
    }
    equipActions.servoMenu.adjustServoOffset(0, partMoveOffsetVal, 0);
    equipActions.weaponMenu.adjustWeaponOffset(0, partMoveOffsetVal, 0);
  }
  useKBControls("KeyQ", handleMovePartUp);

  //position down arow
  function handleMovePartDown() {
    if (editLandingBayId) {
      let bayPosition = mechBP.landingBayPosition;
      bayPosition = {
        x: mechBP.landingBayPosition.x,
        y: mechBP.landingBayPosition.y - partMoveOffsetVal,
        z: mechBP.landingBayPosition.z,
      };
      equipActions.basicMenu.setProp("landingBayPosition", bayPosition);
    }
    equipActions.servoMenu.adjustServoOffset(0, -partMoveOffsetVal, 0);
    equipActions.weaponMenu.adjustWeaponOffset(0, -partMoveOffsetVal, 0);
  }
  useKBControls("KeyA", handleMovePartDown);

  //position up arow
  function handleMovePartForward() {
    if (editLandingBayId) {
      let bayPosition = mechBP.landingBayPosition;
      bayPosition = {
        x: mechBP.landingBayPosition.x,
        y: mechBP.landingBayPosition.y,
        z: mechBP.landingBayPosition.z - partMoveOffsetVal,
      };
      equipActions.basicMenu.setProp("landingBayPosition", bayPosition);
    }
    equipActions.servoMenu.adjustServoOffset(0, 0, -partMoveOffsetVal);
    equipActions.weaponMenu.adjustWeaponOffset(0, 0, -partMoveOffsetVal);
  }
  useKBControls("ArrowUp", handleMovePartForward);

  //position down arow
  function handleMovePartBackward() {
    if (editLandingBayId) {
      let bayPosition = mechBP.landingBayPosition;
      bayPosition = {
        x: mechBP.landingBayPosition.x,
        y: mechBP.landingBayPosition.y,
        z: mechBP.landingBayPosition.z + partMoveOffsetVal,
      };
      equipActions.basicMenu.setProp("landingBayPosition", bayPosition);
    }
    equipActions.servoMenu.adjustServoOffset(0, 0, partMoveOffsetVal);
    equipActions.weaponMenu.adjustWeaponOffset(0, 0, partMoveOffsetVal);
  }
  useKBControls("ArrowDown", handleMovePartBackward);

  //position left arow
  function handleMovePartLeft() {
    if (editLandingBayId) {
      let bayPosition = mechBP.landingBayPosition;
      bayPosition = {
        x: mechBP.landingBayPosition.x - partMoveOffsetVal,
        y: mechBP.landingBayPosition.y,
        z: mechBP.landingBayPosition.z,
      };
      equipActions.basicMenu.setProp("landingBayPosition", bayPosition);
    }
    equipActions.servoMenu.adjustServoOffset(-partMoveOffsetVal, 0, 0);
    equipActions.weaponMenu.adjustWeaponOffset(-partMoveOffsetVal, 0, 0);
  }
  useKBControls("ArrowLeft", handleMovePartLeft);

  //position right arow
  function handleMovePartRight() {
    if (editLandingBayId) {
      let bayPosition = mechBP.landingBayPosition;
      bayPosition = {
        x: mechBP.landingBayPosition.x + partMoveOffsetVal,
        y: mechBP.landingBayPosition.y,
        z: mechBP.landingBayPosition.z,
      };
      equipActions.basicMenu.setProp("landingBayPosition", bayPosition);
    }
    equipActions.servoMenu.adjustServoOffset(partMoveOffsetVal, 0, 0);
    equipActions.weaponMenu.adjustWeaponOffset(partMoveOffsetVal, 0, 0);
  }
  useKBControls("ArrowRight", handleMovePartRight);

  const handleSelecteditServoId = (id) => {
    equipActions.servoMenu.selectServoID(id);
    equipActions.weaponMenu.selectWeaponID(null);
    equipActions.servoMenu.selectLandingBayID(null);
  };

  const handleSelectEditWeaponId = (id) => {
    equipActions.servoMenu.selectServoID(null);
    equipActions.weaponMenu.selectWeaponID(id);
    equipActions.servoMenu.selectLandingBayID(null);
  };

  const handleSelectEditLandingBay = () => {
    equipActions.servoMenu.selectServoID(null);
    equipActions.weaponMenu.selectWeaponID(null);
    equipActions.servoMenu.selectLandingBayID(1);
  };

  const handleChangeServoShape = (index, shapeIndex) => {
    equipActions.servoMenu.selectServoShape(index, Number(shapeIndex));
  };

  const handleRotateServoShape = (axis, direction) => {
    equipActions.servoMenu.adjustServoRotation(axis, direction);
  };

  const handleScaleServoShape = (axis, val) => {
    equipActions.servoMenu.adjustServoScale(axis, val);
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
      <h3>
        Zoom Level: <button onClick={() => handleZoomShipView(-1)}>+</button>
        <button onClick={() => handleZoomShipView(1)}>-</button>
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
          <div>
            {mechBP.landingBayServoLocationId === servo.id && (
              <span
                key={"bay"} // + index}
                className={
                  editLandingBayId ? "selectedItem" : "nonSelectedItem"
                }
              >
                <button onClick={() => handleSelectEditLandingBay()}>
                  Landing Bay
                </button>
              </span>
            )}
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

export default ServoEditButtons;
