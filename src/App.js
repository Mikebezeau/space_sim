//https://codesandbox.io/s/react-three-fiber-untitled-game-4pp5r?file=/src/index.js

//import * as THREE from "three";
//import ReactDOM from "react-dom";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ContextMenu from "./ContextMenu";
import GalaxyMapHud from "./GalaxyMapHud";
import GalaxyStarMap from "./GalaxyStarMap";
import Stars from "./3d/Stars";
import Planets from "./3d/Planets";
import Stations from "./3d/Stations";
import Effects from "./3d/Effects";
import Particles from "./3d/Particles";
import EnemyMechs from "./3d/EnemyMechs";
import Rocks from "./3d/Rocks";
import Explosions from "./3d/Explosions";
import PlayerMech from "./3d/PlayerMech";
import ScannerReadout from "./3d/ScannerReadout";
import MechHudReadout from "./3d/MechHudReadout";
import ScanHudReadout from "./3d/ScanHudReadout";
import WeaponFire from "./3d/WeaponFire";
import SystemMap from "./3d/SystemMap";

import TouchControls from "./TouchControls";
import Hud from "./Hud";
import EquipmentMenu from "./equipmentDesign/EquipmentMenu";
import EquipmentBlueprint from "./equipmentDesign/EquipmentBlueprint";

import useStore from "./stores/store";
import useEquipStore from "./stores/equipStore";

import {
  useKBControls,
  useMouseMove,
  useMouseClick,
  useMouseRightClick,
  useMouseUp,
  useMouseDown,
} from "./controlHooks/useMouseKBControls";
import {
  IS_MOBLIE,
  FLIGHT,
  GALAXY_MAP,
  EQUIPMENT_SCREEN,
  CONTROLS_UNATTENDED,
  CONTROLS_PILOT_COMBAT,
  CONTROLS_PILOT_SCAN,
} from "./util/gameUtil";

function App() {
  const testing = useStore((state) => state.testing);
  const { actions, playerScreen, playerControlMode, displayContextMenu } =
    useStore((state) => state);
  const { basicMenu } = useEquipStore((state) => state.equipActions);

  //mouse move
  function handleMouseMove(e) {
    if (!IS_MOBLIE && playerScreen === EQUIPMENT_SCREEN)
      basicMenu.editShipMouseRotation(e);
    else if (!IS_MOBLIE && playerScreen !== EQUIPMENT_SCREEN)
      actions.updateMouse(e);
    else if (playerScreen === GALAXY_MAP) actions.updateMouse(e);
  }
  useMouseMove(handleMouseMove);

  //mouse down
  function handleMouseDown(e) {
    if (playerScreen === EQUIPMENT_SCREEN) basicMenu.editSetMouseDown(true, e);
  }
  useMouseDown(handleMouseDown);
  //mouse up
  function handleMouseUp(e) {
    if (playerScreen === EQUIPMENT_SCREEN) basicMenu.editSetMouseDown(false);
  }
  useMouseUp(handleMouseUp);

  //mouse click
  function handleMouseClick() {
    if (!IS_MOBLIE) {
      if (playerScreen === FLIGHT && !displayContextMenu) {
        if (playerControlMode === CONTROLS_PILOT_COMBAT) {
          actions.setSelectedTargetIndex(); // selects an enemy target then triggers store: actions.shoot()
        } else if (playerControlMode === CONTROLS_PILOT_SCAN) {
          testing.warpToPlanet();
        }
      } else if (playerScreen === GALAXY_MAP) {
        actions.detectTargetStar();
      }
    }
  }
  useMouseClick(handleMouseClick);

  //mouse right click
  function handleMouseRightClick(e) {
    actions.activateContextMenu(e.clientX, e.clientY);
  }
  useMouseRightClick(handleMouseRightClick);

  //SPEED UP
  function handleArrowUp() {
    if (
      playerScreen === FLIGHT &&
      (playerControlMode === CONTROLS_PILOT_COMBAT ||
        playerControlMode === CONTROLS_PILOT_SCAN)
    )
      actions.speedUp();
    else if (playerScreen === GALAXY_MAP) actions.galaxyMapZoomIn();
  }
  useKBControls("ArrowUp", handleArrowUp);

  //SPEED DOWN
  function handleArrowDown() {
    if (
      playerScreen === FLIGHT &&
      (playerControlMode === CONTROLS_PILOT_COMBAT ||
        playerControlMode === CONTROLS_PILOT_SCAN)
    )
      actions.speedDown();
    else if (playerScreen === GALAXY_MAP) actions.galaxyMapZoomOut();
  }
  useKBControls("ArrowDown", handleArrowDown);

  //changing menus
  function handleStationDock() {
    actions.stationDock();
  }
  useKBControls("KeyD", handleStationDock);

  function handleSummonEnemy() {
    //actions.stationDoc();
    testing.summonEnemy();
  }
  useKBControls("KeyS", handleSummonEnemy);

  function handleShowLeaders() {
    //actions.stationDoc();
    testing.showLeaders();
  }
  useKBControls("KeyL", handleShowLeaders);

  function handleWarpToPlanet() {
    //actions.stationDoc();
    testing.warpToPlanet();
  }
  useKBControls("KeyW", handleWarpToPlanet);

  //IS_MOBLIE: conditional controls for mobile devices
  //console.log("playerScreen", playerScreen, FLIGHT);
  return (
    <>
      <Canvas
        camera={{
          position: [0, 0, 0],
          near: 0.001,
          far: 10000,
          fov: 50,
        }}
        onCreated={({ gl, camera, scene }) => {
          actions.init();
          //gl.gammaInput = true;
          //gl.toneMapping = THREE.Uncharted2ToneMapping;
          //gl.setClearColor(new THREE.Color("#020207"));
        }}
      >
        <pointLight castShadow intensity={0.6} />
        <ambientLight intensity={0.025} />

        {playerScreen === GALAXY_MAP && <GalaxyStarMap />}
        {playerScreen === EQUIPMENT_SCREEN && <EquipmentBlueprint />}
        {playerScreen === FLIGHT && (
          <>
            <Stars />
            <Explosions />
            <Particles />
            <Suspense fallback={null}>
              <PlayerMech />
              {playerControlMode === CONTROLS_PILOT_SCAN && (
                <>
                  <SystemMap showPlayer={true} />
                  <ScannerReadout />
                  <ScanHudReadout />
                </>
              )}
              {playerControlMode === CONTROLS_PILOT_COMBAT && (
                <>
                  <ScannerReadout />
                  <MechHudReadout />
                </>
              )}
              <Rocks />
              <Planets />
              <EnemyMechs />
              <Stations />
              <WeaponFire />
            </Suspense>
          </>
        )}
        <Effects />
      </Canvas>
      {playerScreen === FLIGHT && displayContextMenu && <ContextMenu />}
      {playerScreen === FLIGHT && <Hud />}
      {playerScreen === GALAXY_MAP && <GalaxyMapHud />}
      {playerScreen === EQUIPMENT_SCREEN && <EquipmentMenu />}
      {IS_MOBLIE && playerScreen !== EQUIPMENT_SCREEN && (
        <TouchControls
          playerScreen={playerScreen}
          playerControlMode={playerControlMode}
        />
      )}
    </>
  );
}

export default App;
