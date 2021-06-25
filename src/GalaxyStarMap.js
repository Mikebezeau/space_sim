import React from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import useStore from "./stores/store";
import { SCALE } from "./util/gameUtil";

import GalaxyStars from "./3d/GalaxyStars";

const direction = new THREE.Vector3();

export default function MainMenu() {
  const { mouse } = useStore((state) => state.mutation);
  const { menuCam, galaxyMapZoom } = useStore((state) => state);
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
    <group
      ref={starMap}
      position={[0, 0, (-1400 + galaxyMapZoom * 200) * SCALE]}
      rotation={[0, 0, 0]}
    >
      <GalaxyStars />
    </group>
  );
}
