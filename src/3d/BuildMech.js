import React from "react";
import * as THREE from "three";
import { ServoShapes, WeaponShapes } from "../data/equipShapes";

export default function BuildMech({
  mechBP,
  servoEditId = null,
  weaponEditId = null,
  editMode = false,
  showAxisLines = true,
}) {
  //place edit axis lines

  const glowMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("lightblue"),
    emissive: new THREE.Color("lightblue"),
    emissiveIntensity: 0.5,
  });

  const redGlowMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("red"),
    emissive: new THREE.Color("red"),
    emissiveIntensity: 0.5,
  });

  return (
    <group scale={editMode ? 1 / Math.cbrt(mechBP.size()) : 1}>
      {mechBP.servoList.map((servo, index) => (
        <group
          key={index}
          position={[servo.offset.x, servo.offset.y, servo.offset.z]}
        >
          <ServoShapes
            servo={servo}
            landingBay={mechBP.landingBay}
            landingBayServoLocationId={mechBP.landingBayServoLocationId}
            landingBayPosition={mechBP.landingBayPosition}
            servoEditId={servoEditId}
          />
          {mechBP.servoWeaponList(servo.id).map((weapon, j) => (
            <group
              key={j}
              position={[weapon.offset.x, weapon.offset.y, weapon.offset.z]}
            >
              <WeaponShapes weapon={weapon} weaponEditId={weaponEditId} />
            </group>
          ))}
        </group>
      ))}
      {(showAxisLines || editMode) && (
        <group scale={mechBP.size() * 0.01}>
          <mesh
            position={[0, 0, -150]}
            rotation={[Math.PI / 2, 0, 0]}
            material={redGlowMaterial}
          >
            <cylinderBufferGeometry
              attach="geometry"
              args={[0.25, 0.25, 300, 4]}
            />
          </mesh>

          <mesh
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            material={glowMaterial}
          >
            <cylinderBufferGeometry
              attach="geometry"
              args={[0.25, 0.25, 150, 4]}
            />
          </mesh>
          <mesh
            position={[0, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
            material={glowMaterial}
          >
            <cylinderBufferGeometry
              attach="geometry"
              args={[0.25, 0.25, 150, 4]}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
