import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";
//import { useLoader, useFrame } from "react-three-fiber";
//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useStore from "../store";
import { SCALE } from "../gameHelper";

export default function Enemies() {
  const enemies = useStore((state) => state.enemies);
  return enemies.map((data, i) => <Drone key={i} data={data} />);
}

const box = new THREE.Box3();
box.setFromCenterAndSize(
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(3, 3, 3)
);
const glowMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("lightblue"),
});

const Drone = React.memo(({ data }) => {
  const { clock } = useStore((state) => state.mutation);
  //const gltf = useLoader(GLTFLoader, "/gltf/drone.gltf");
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      const r = Math.cos((clock.getElapsedTime() / 2) * data.speed) * Math.PI;
      ref.current.position.copy(data.offset);
      ref.current.rotation.set(r, r, r);
    }
  });

  return (
    <group ref={ref} scale={[500 * SCALE, 500 * SCALE, 500 * SCALE]}>
      {/* place drone model here */}

      {/* drone beam */}
      <mesh
        position={[0, 0, 50]}
        rotation={[Math.PI / 2, 0, 0]}
        material={glowMaterial}
      >
        <cylinderBufferGeometry attach="geometry" args={[0.25, 0.25, 100, 4]} />
        <meshStandardMaterial attach="material" color="white" name="Body" />
      </mesh>
    </group>
  );
});
