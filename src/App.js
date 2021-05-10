//https://codesandbox.io/s/react-three-fiber-untitled-game-4pp5r?file=/src/index.js

//import * as THREE from "three";
//import ReactDOM from "react-dom";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import MainMenu from "./MainMenu";
import Stars from "./3d/Stars";
import Planets from "./3d/Planets";
import Stations from "./3d/Stations";
import Effects from "./3d/Effects";
import Particles from "./3d/Particles";
import EnemyMechs from "./3d/EnemyMechs";
import Rocks from "./3d/Rocks";
import Explosions from "./3d/Explosions";
import Ship from "./3d/Ship";
import SystemMap from "./3d/SystemMap";

import TouchControls from "./TouchControls";
import Hud from "./Hud";
import EquipmentMenu from "./EquipmentMenu";
import EquipmentBlueprint from "./EquipmentBlueprint";

import useStore from "./stores/store";
import {
  useKBControls,
  useMouseMove,
  useMouseClick,
} from "./hooks/useMouseKBControls";
import {
  IS_MOBLIE,
  SCALE,
  FLIGHT,
  MAIN_MENU,
  EQUIPMENT_SCREEN,
} from "./util/gameUtil";
function App() {
  //const { fov } = useStore((state) => state.mutation);
  const actions = useStore((state) => state.actions);
  const playerScreen = useStore((state) => state.playerScreen);

  //mouse move
  function handleMouseMove(e) {
    if (!IS_MOBLIE) actions.updateMouse(e);
  }
  useMouseMove(handleMouseMove);

  //mouse click
  function handleMouseClick(e) {
    if (!IS_MOBLIE) {
      playerScreen === FLIGHT ? actions.shoot() : actions.detectTargetStar();
    }
  }
  useMouseClick(handleMouseClick);

  //SPEED UP
  function handleSpeedUp() {
    actions.speedUp();
  }
  useKBControls("ArrowUp", handleSpeedUp);

  //SPEED DOWN
  function handleSpeedDown() {
    actions.speedDown();
  }
  useKBControls("ArrowDown", handleSpeedDown);

  //DOCK AT STATION
  function handleSwitchScreen() {
    //actions.stationDoc();
    actions.switchScreen();
  }
  useKBControls("KeyD", handleSwitchScreen);
  //IS_MOBLIE: conditional controls for mobile devices
  //console.log("playerScreen", playerScreen, FLIGHT);
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 0], near: 0.001, far: 10000, fov: 50 }}
        onCreated={({ gl, camera, scene }) => {
          actions.init(camera);
          //gl.gammaInput = true;
          //gl.toneMapping = THREE.Uncharted2ToneMapping;
          //gl.setClearColor(new THREE.Color("#020207"));
        }}
      >
        <pointLight castShadow intensity={0.6} />
        <ambientLight intensity={0.025} />

        {playerScreen === MAIN_MENU && <MainMenu />}
        {playerScreen === EQUIPMENT_SCREEN && <EquipmentBlueprint />}
        {playerScreen === FLIGHT && (
          <>
            <Stars />
            <Explosions />
            <Particles />
            <Suspense fallback={null}>
              <Rocks />
              <Planets />
              <EnemyMechs />
              {/*<Stations />*/}
              <Ship />
              <SystemMap showPlayer={true} />
            </Suspense>
          </>
        )}
        <Effects />
      </Canvas>
      {playerScreen === FLIGHT && <Hud />}
      {playerScreen === EQUIPMENT_SCREEN && <EquipmentMenu />}
      {IS_MOBLIE && <TouchControls />}
    </>
  );
}

export default App;
