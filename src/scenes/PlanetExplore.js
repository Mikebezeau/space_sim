import React, { Suspense } from "react";

import useStore from "../stores/store";

import TestTerrain from "../terrainGen/TestTerrain";
import PlayerWalk from "../3d/planetExplore/PlayerWalk";
import WeaponFire from "../3d/WeaponFire";

import {
  SCALE_PLANET_WALK,
  FLIGHT,
  GALAXY_MAP,
  EQUIPMENT_SCREEN,
  CONTROLS_UNATTENDED,
  CONTROLS_PILOT_COMBAT,
  CONTROLS_PILOT_SCAN,
} from "../util/constants";

export default function PlanetWalkMode() {
  const { playerScreen, playerControlMode } = useStore((state) => state);
  //<ambientLight intensity={0.05} />
  return (
    <>
      <pointLight position={[1500, 5000, 0]} castShadow intensity={0.1} />
      <ambientLight intensity={0.2} />
      <Suspense fallback={null}>
        <PlayerWalk />
      </Suspense>
      <WeaponFire scale={SCALE_PLANET_WALK} sceneScale={SCALE_PLANET_WALK} />
      <TestTerrain />
    </>
  );
}
