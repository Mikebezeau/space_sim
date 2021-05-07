import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import useStore from "./stores/store";
import { SCALE } from "./util/gameUtil";

import GalaxyStarMap from "./3d/GalaxyStarMap";

const direction = new THREE.Vector3();

export default function MainMenu() {
  const { mouse } = useStore((state) => state.mutation);
  const menuCam = useStore((state) => state.menuCam);
  const starMap = useRef();
  const { camera } = useThree();

  useFrame(() => {
    //move based on mouse position
    camera.position.set(
      menuCam.position.x + mouse.x * 0.01,
      menuCam.position.y - mouse.y * 0.01,
      menuCam.position.z
    );
    camera.setRotationFromAxisAngle(direction, 0);
    menuCam.position.copy(camera.position);
  });
  return (
    <group ref={starMap} position={[0, 0, -700 * SCALE]} rotation={[0, 0, 0]}>
      <GalaxyStarMap />
    </group>
  );
}
