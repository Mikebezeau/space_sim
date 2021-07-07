import React from "react";
import styled, { css } from "styled-components";
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
      <LowerLeft>
        <div id="btn-ship-move"></div>
      </LowerLeft>
      <LowerRight>
        <span id="btn-speed-up">+</span>
        <span id="btn-speed-down">-</span>
        <span id="btn-shoot">x</span>
        <span id="btn-sys">sys</span>
      </LowerRight>
    </>
  );
}
const base = css`
  font-family: "Teko", sans-serif;
  position: absolute;
  text-transform: uppercase;
  font-weight: 900;
  font-variant-numeric: slashed-zero tabular-nums;
  line-height: 1em;
  pointer-events: none;
  color: lightblue;
`;

const LowerLeft = styled.div`
  ${base}
  display:none;
  bottom: 20px;
  left: 50px;
  width: 200px;
  height: 200px;

  & > div {
    pointer-events: all;
    height: 100%;
    width: 100%;
    background: gray;
    border-radius: 500px;
  }

  @media only screen and (max-width: 700px) {
    display: block;
    height: 120px;
    width: 120px;
    left: 5%;
  }
`;

const LowerRight = styled.div`
  ${base}
  display:block;
  bottom: 10px;
  right: 20px;
  transform: skew(-5deg, -10deg);
  height: 100px;
  width: 200px;

  & > span {
    display: block;
    margin-left: 5%;
    float: right;
    height: 80px;
    width: 30px;
    pointer-events: all;
    background: gray;
    border-radius: 20px 5px;
  }
`;
/*
 */
