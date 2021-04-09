import * as THREE from "three";
import { useThree, useFrame } from "react-three-fiber";
import { useRef } from "react";
import useStore from "../store";
import { SCALE } from "../gameHelper";
import GalaxyStarMap from "./GalaxyStarMap";

const direction = new THREE.Vector3();

export default function MainMenu() {
  const { mouse } = useStore((state) => state.mutation);
  const playerScreen = useStore((state) => state.playerScreen);
  const menuCam = useStore((state) => state.menuCam);
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
      menuCam.position.x + mouse.x * 0.01,
      menuCam.position.y - mouse.y * 0.01,
      menuCam.position.z
    );
    camera.setRotationFromAxisAngle(direction, 0);
    menuCam.position.copy(camera.position);
  }
  return (
    <group ref={starMap} position={[0, 0, -700 * SCALE]} rotation={[0, 0, 0]}>
      <GalaxyStarMap />
    </group>
  );
}
