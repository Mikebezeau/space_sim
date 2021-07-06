import React, { useState, Suspense } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import useStore from "../stores/store";

import TestTerrain from "../terrainGen/TestTerrain";
import PlayerWalk from "../3d/PlayerWalk";

import {
  FLIGHT,
  GALAXY_MAP,
  EQUIPMENT_SCREEN,
  CONTROLS_UNATTENDED,
  CONTROLS_PILOT_COMBAT,
  CONTROLS_PILOT_SCAN,
} from "../util/gameUtil";

export default function PlanetWalkMode() {
  const { playerScreen, playerControlMode } = useStore((state) => state);

  return (
    <>
      <pointLight castShadow intensity={0.15} />
      <ambientLight intensity={0.05} />
      <PlayerWalk />
      <TestTerrain />
    </>
  );
}
