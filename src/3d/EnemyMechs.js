import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
//import { useLoader, useFrame } from "react-three-fiber";
//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useStore from "../stores/store";
import useEquipStore from "../stores/equipStore";
import { servoShapes, weaponShapes } from "../data/equipShapes";
import { SCALE } from "../util/gameUtil";

export default function EnemyMechs() {
  const enemies = useStore((state) => state.enemies);
  const enemyMechBP = useEquipStore((state) => state.enemyMechBP); //for rendering ship servo shapes

  return enemies.map((enemy, i) => (
    <Drone key={i} enemy={enemy} enemyMechBP={enemyMechBP} />
  ));
}

const box = new THREE.Box3();
box.setFromCenterAndSize(
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(3, 3, 3)
);
const glowMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color("lightblue"),
  emissive: 0.5,
});

const Drone = ({ enemy, enemyMechBP }) => {
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
      {/* place drone model here */}
      {enemyMechBP.servoList.map((servo, index) => (
        <group
          key={index}
          position={[servo.offset.x, servo.offset.y, servo.offset.z]}
        >
          {servoShapes(servo, enemyMechBP.material)}
          {enemyMechBP.servoWeaponList(servo.id).map((weapon, j) => (
            <group
              key={j}
              position={[weapon.offset.x, weapon.offset.y, weapon.offset.z]}
            >
              {weaponShapes(weapon, enemyMechBP.material)}
            </group>
          ))}
        </group>
      ))}
      {/* drone beam */}
      <mesh
        position={[0, 0, 0]}
        scale={[1, 1, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        material={glowMaterial}
      >
        <cylinderBufferGeometry attach="geometry" args={[0.25, 0.25, 50, 4]} />
        <meshStandardMaterial attach="material" color="white" name="Body" />
      </mesh>
      <mesh
        position={[0, 0, 0]}
        scale={[1, 1, 1]}
        rotation={[0, Math.PI / 2, 0]}
        material={glowMaterial}
      >
        <cylinderBufferGeometry attach="geometry" args={[0.25, 0.25, 50, 4]} />
        <meshStandardMaterial attach="material" color="white" name="Body" />
      </mesh>
      <mesh
        position={[0, 0, 0]}
        scale={[1, 1, 1]}
        rotation={[0, 0, Math.PI / 2]}
        material={glowMaterial}
      >
        <cylinderBufferGeometry attach="geometry" args={[0.25, 0.25, 50, 4]} />
        <meshStandardMaterial attach="material" color="white" name="Body" />
      </mesh>
    </group>
  );
};
