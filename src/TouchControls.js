import React from "react";
import styled, { css } from "styled-components";
import useStore from "./stores/store";
import {
  useTouchStartControls,
  useTouchMoveControls,
  useTouchEndControls,
} from "./controlHooks/useTouchControls";
import {
  IS_MOBLIE,
  FLIGHT,
  MAIN_MENU,
  EQUIPMENT_SCREEN,
  CONTROLS_UNATTENDED,
  CONTROLS_PILOT,
  CONTROLS_SCAN_PLANET,
  CONTROLS_SCAN_SHIP,
  CONTROLS_SCAN_STRUCTURE,
} from "./util/gameUtil";

export default function TouchControls({ playerScreen, playerControlMode }) {
  const actions = useStore((state) => state.actions);

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
      if (playerControlMode === CONTROLS_PILOT) {
        actions.setSelectedTargetIndex(); // selects an enemy target then triggers store: actions.shoot()
      } else {
        //show left click menu
      }
    } else {
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
  function handleMoveShipEnd(event) {
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
        <div id="btn-speed-up"></div>
        <div id="btn-speed-down"></div>
        <div id="btn-shoot"></div>
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
  bottom: 40px;
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
  display:none;
  bottom: 120px;
  right: 50px;
  transform: skew(-5deg, -10deg);
  height: 240px;
  width: 200px;

  & > div {
    margin-top: 10%;
    float: right;
    clear: both;
    height: 40%;
    width: 40%;
    pointer-events: all;
    background: gray;
    border-radius: 30px 20px;
  }

  @media only screen and (max-width: 700px) {
    display: block;
    height: 30%;
    width: 20%;
    right: 5%;
    bottom: 15%;
  }
`;
