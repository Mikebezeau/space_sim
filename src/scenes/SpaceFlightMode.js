import React, { Suspense } from "react";

import useStore from "../stores/store";

import Stars from "../3d/spaceFlight/Stars";
import Planets from "../3d/spaceFlight/Planets";
import Stations from "../3d/spaceFlight/Stations";
import Particles from "../3d/spaceFlight/Particles";
import EnemyMechs from "../3d/EnemyMechs";
import Rocks from "../3d/spaceFlight/Rocks";
import Explosions from "../3d/Explosions";
import PlayerMech from "../3d/spaceFlight/PlayerMech";
import ScannerReadout from "../3d/spaceFlight/ScannerReadout";
import MechHudReadout from "../3d/MechHudReadout";
import ScanHudReadout from "../3d/spaceFlight/ScanHudReadout";
import WeaponFire from "../3d/WeaponFire";
import SystemMap from "../3d/spaceFlight/SystemMap";

import GalaxyStarMap from "../GalaxyStarMap";

import {
  SCALE,
  FLIGHT,
  GALAXY_MAP,
  EQUIPMENT_SCREEN,
  CONTROLS_UNATTENDED,
  CONTROLS_PILOT_COMBAT,
  CONTROLS_PILOT_SCAN,
} from "../util/constants";

export default function SpaceFlightMode() {
  const { playerScreen, playerControlMode } = useStore((state) => state);

  return (
    <>
      <pointLight castShadow intensity={0.6} />
      <ambientLight intensity={0.025} />

      {playerScreen === GALAXY_MAP && <GalaxyStarMap />}

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
          </Suspense>
          <WeaponFire scale={SCALE} sceneScale={SCALE} />
        </>
      )}
    </>
  );
}
