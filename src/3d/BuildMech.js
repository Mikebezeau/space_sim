import React from "react";
import { MeshStandardMaterial, Color } from "three";
import { ServoShapes, WeaponShapes } from "../data/equipShapes";
import { equipList } from "../data/equipData";

export default function BuildMech({
  mechBP,
  drawDistanceLevel = 0,
  servoEditId = null,
  weaponEditId = null,
  editMode = false,
  showAxisLines = false,
}) {
  //place edit axis lines

  const glowMaterial = new MeshStandardMaterial({
    color: new Color("lightblue"),
    emissive: new Color("lightblue"),
    emissiveIntensity: 0.5,
  });

  const redGlowMaterial = new MeshStandardMaterial({
    color: new Color("red"),
    emissive: new Color("red"),
    emissiveIntensity: 0.5,
  });
  //const axesHelper = new THREE.AxesHelper( 5 );
  return (
    <group scale={editMode ? 2 / equipList.scale.weightMult[mechBP.scale] : 1}>
      {mechBP.servoList.map((servo, index) => (
        <group
          key={index}
          position={[servo.offset.x, servo.offset.y, servo.offset.z]}
        >
          <ServoShapes
            servo={servo}
            drawDistanceLevel={drawDistanceLevel}
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
              <WeaponShapes
                weapon={weapon}
                drawDistanceLevel={drawDistanceLevel}
                weaponEditId={weaponEditId}
              />
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
