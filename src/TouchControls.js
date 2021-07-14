import React from "react";
import useStore from "./stores/store";
import {
  useTouchStartControls,
  useTouchMoveControls,
  useTouchEndControls,
} from "./controlHooks/useTouchControls";
import {
  FLIGHT,
  GALAXY_MAP,
  EQUIPMENT_SCREEN,
  CONTROLS_UNATTENDED,
  CONTROLS_PILOT_COMBAT,
  CONTROLS_PILOT_SCAN,
} from "./util/constants";
import "./css/hud.css";
import "./css/hudTouchControls.css";

export default function TouchControls({ playerScreen, playerControlMode }) {
  const testing = useStore((state) => state.testing);
  const { actions, displayContextMenu } = useStore((state) => state);

  //menu
  function handleContextMenu() {
    actions.activateContextMenu(window.innerWidth / 2, window.innerHeight / 2);
  }
  useTouchStartControls("btn-sys", handleContextMenu);

  //SPEED UP
  function handleSpeedUp() {
    actions.speedUp();
  }
  useTouchStartControls("btn-speed-up", handleSpeedUp);

  //SPEED DOWN
  function handleSpeedDown() {
    actions.speedDown();
  }
  useTouchStartControls("btn-speed-down", handleSpeedDown);

  //SHOOT LASERS
  function handleShoot() {
    if (playerScreen === FLIGHT) {
      if (playerControlMode === CONTROLS_PILOT_COMBAT && !displayContextMenu) {
        actions.setSelectedTargetIndex(); // selects an enemy target then triggers store: actions.shoot()
      } else if (
        playerControlMode === CONTROLS_PILOT_SCAN &&
        !displayContextMenu
      ) {
        testing.warpToPlanet();
      }
    } else if (playerScreen === GALAXY_MAP) {
      actions.detectTargetStar();
    }
  }
  useTouchStartControls("btn-shoot", handleShoot);

  //MOVE SHIP
  function handleMoveShipStart(event) {
    actions.updateMouseMobile(event);
  }
  useTouchStartControls("btn-ship-move", handleMoveShipStart);

  function handleMoveShip(event) {
    actions.updateMouseMobile(event);
  }
  useTouchMoveControls("btn-ship-move", handleMoveShip);

  //END MOVE SHIP (to recenter control)
  function handleMoveShipEnd() {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    actions.updateMouse({ clientX: x, clientY: y });
  }
  useTouchEndControls("btn-ship-move", handleMoveShipEnd);

  return (
    <>
      <div id="lowerLeft" className="hud">
        <div id="btn-ship-move"></div>
      </div>
      <div id="lowerRight" className="hud">
        <span id="btn-speed-up">+</span>
        <span id="btn-speed-down">-</span>
        <span id="btn-shoot">x</span>
        <span id="btn-sys">sys</span>
      </div>
    </>
  );
}
