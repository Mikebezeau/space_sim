import React from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import useStore from "../stores/store";
import { SCALE } from "../util/gameUtil";

const direction = new THREE.Vector3();

export default function TestTerrian() {
  const { mouse } = useStore((state) => state.mutation);
  const { terrain, menuCam, galaxyMapZoom } = useStore((state) => state);
  const { camera } = useThree();
  /*
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
*/
  return (
    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {terrain && (
        <mesh
          geometry={terrain.Mesh.geometry}
          material={terrain.Mesh.material}
        ></mesh>
      )}
    </group>
  );
}
