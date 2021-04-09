//https://codesandbox.io/s/react-three-fiber-untitled-game-4pp5r?file=/src/index.js

import * as THREE from "three";
//import ReactDOM from "react-dom";
import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import MainMenu from "./3d/MainMenu";
import Stars from "./3d/Stars";
import Planets from "./3d/Planets";
import Stations from "./3d/Stations";
import Effects from "./3d/Effects";
import Particles from "./3d/Particles";
import Enemies from "./3d/Enemies";
import Rocks from "./3d/Rocks";
import Explosions from "./3d/Explosions";
//import Rings from "./3d/Rings";
import Track from "./3d/Track";
import Ship from "./3d/Ship";
//import Rig from "./3d/Rig";
import TouchControls from "./TouchControls";
import Hud from "./Hud";
import StationMenu from "./StationMenu";
import useStore from "./store";
import useKBControls from "./hooks/useKBControls";
import { IS_MOBLIE } from "./gameHelper";

function App() {
  const { fov } = useStore((state) => state.mutation);
  const actions = useStore((state) => state.actions);
  const playerScreen = useStore((state) => state.playerScreen);

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
  function handleStationDoc() {
    //actions.stationDoc();
    actions.switchScreen();
  }
  useKBControls("KeyD", handleStationDoc);

  //IS_MOBLIE: conditional controls for mobile devices
  //console.log("IS_MOBLIE", IS_MOBLIE);
  return (
    <>
      <Canvas
        onPointerMove={IS_MOBLIE ? null : actions.updateMouse}
        onClick={
          IS_MOBLIE
            ? null
            : playerScreen.flight
            ? actions.shoot
            : actions.detectTargetStar
        }
        camera={{ position: [0, 0, 0], near: 0.001, far: 10000, fov }}
        onCreated={({ gl, camera, scene }) => {
          actions.init(camera, scene);
          //gl.gammaInput = true;
          //gl.toneMapping = THREE.Uncharted2ToneMapping;
          //gl.setClearColor(new THREE.Color("#020207"));
        }}
      >
        <pointLight castShadow intensity={0.6} />
        <ambientLight intensity={0.025} />

        {playerScreen.mainMenu && <MainMenu />}
        {playerScreen.flight && (
          <>
            <Stars />
            <Explosions />
            <Particles />
            <Suspense fallback={null}>
              <Rocks />
              <Planets />
              <Enemies />
              <Stations />
              <Ship />
            </Suspense>
          </>
        )}
        <Effects />
      </Canvas>
      {playerScreen.flight && <Hud />}
      {playerScreen.station && <StationMenu />}
      {IS_MOBLIE && <TouchControls />}
    </>
  );
}

export default App;
/*

function App() {
  const { fov } = useStore((state) => state.mutation);
  const actions = useStore((state) => state.actions);
  return (
    <>
      <Canvas
        onPointerMove={actions.updateMouse}
        onClick={actions.shoot}
        camera={{ position: [0, 0, 2000], near: 0.01, far: 10000, fov }}
        onCreated={({ gl, camera }) => {
          actions.init(camera);
          gl.gammaInput = true;
          gl.toneMapping = THREE.Uncharted2ToneMapping;
          gl.setClearColor(new THREE.Color("#020207"));
        }}
      >
        <fog attach="fog" args={["black", 100, 700]} />
        <ambientLight intensity={0.25} />
        <Stars />
        <Explosions />
        <Track />
        <Particles />
        <Rings />
        <Suspense fallback={null}>
          <Rocks />
          <Planets />
          <Enemies />
          <Rig>
            <Ship />
          </Rig>
        </Suspense>
        <Effects />
      </Canvas>
      <Hud />
    </>
  );
}

export default App;
*/
