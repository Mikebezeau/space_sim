import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useStore from "../stores/store";
import BuildMech from "./BuildMech";
import { SCALE } from "../util/gameUtil";

export default function EnemyMechs() {
  const enemies = useStore((state) => state.enemies);
  return enemies.map((enemy, i) => <Drone key={i} enemy={enemy} />);
}

const glowMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("lightblue"),
  emissive: new THREE.Color("lightblue"),
  emissiveIntensity: 0.5,
});

const Drone = ({ enemy }) => {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      //place enemy in correct position
      ref.current.position.copy(enemy.object3d.position);
      ref.current.rotation.copy(enemy.object3d.rotation);
    }
  });
  return (
    <group ref={ref} scale={[SCALE * 100, SCALE * 100, SCALE * 100]}>
      <group rotation={[0, Math.PI, 0]}>
        {/* place drone model here */}
        <BuildMech mechBP={enemy.mechBP} />

        {/* drone beam */}
        <mesh
          position={[0, 0, 0]}
          scale={enemy.mechBP.scale}
          rotation={[Math.PI / 2, 0, 0]}
          material={glowMaterial}
        >
          <cylinderBufferGeometry
            attach="geometry"
            args={[0.25, 0.25, 50, 4]}
          />
        </mesh>
        <mesh
          position={[0, 0, 0]}
          scale={enemy.mechBP.scale}
          rotation={[0, Math.PI / 2, 0]}
          material={glowMaterial}
        >
          <cylinderBufferGeometry
            attach="geometry"
            args={[0.25, 0.25, 50, 4]}
          />
        </mesh>
        <mesh
          position={[0, 0, 0]}
          scale={enemy.mechBP.scale}
          rotation={[0, 0, Math.PI / 2]}
          material={glowMaterial}
        >
          <cylinderBufferGeometry
            attach="geometry"
            args={[0.25, 0.25, 50, 4]}
          />
        </mesh>
      </group>
    </group>
  );
};
