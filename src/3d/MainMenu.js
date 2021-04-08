import * as THREE from "three";
import { useThree, useFrame } from "react-three-fiber";
import React, { useRef } from "react";
import useStore from "../store";
import { SCALE } from "../gameHelper";
import GalaxyStars from "./GalaxyStars";

const direction = new THREE.Vector3();
const rotateQuat = new THREE.Quaternion(),
  camQuat = new THREE.Quaternion(),
  endQuat = new THREE.Quaternion();

export default function MainMenu() {
  const { mouse } = useStore((state) => state.mutation);
  const playerScreen = useStore((state) => state.playerScreen);
  const mainMenuCam = useStore((state) => state.mainMenuCam);
  const starMap = useRef();
  const { camera } = useThree();

  useFrame(() => {
    //if in main menu
    //if (playerScreen.mainMenu && starMap.current) navStarMap();
    if (playerScreen.mainMenu) navStarMap();
  });

  function navStarMap() {
    //move based on mouse position
    camera.position.set(
      mainMenuCam.position.x + mouse.x * 0.01,
      mainMenuCam.position.y - mouse.y * 0.01,
      mainMenuCam.position.z
    );
    camera.setRotationFromAxisAngle(direction, 0);
    mainMenuCam.position.copy(camera.position);
  }
  return (
    <group ref={starMap} position={[0, 0, -70 * SCALE]} rotation={[0, 0, 0]}>
      <GalaxyStars />
    </group>
  );
}
