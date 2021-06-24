import React from "react";
import * as THREE from "three";
import { MeshStandardMaterial, Color } from "three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { ServoShapes, WeaponShapes } from "../data/equipShapes";
import { equipList } from "../data/equipData";

export default function BuildMech({
  mechBP,
  damageReadoutMode,
  servoHitNames = [],
  drawDistanceLevel = 0,
  servoEditId = null,
  weaponEditId = null,
  editMode = false,
  showAxisLines = false,
  isLeader = false,
}) {
  //place edit axis lines

  const glowMaterial = new MeshStandardMaterial({
    color: new Color("lightblue"),
    emissive: new Color("lightblue"),
    emissiveIntensity: 0.5,
  });

  const directoinGlowMaterial = isLeader
    ? new MeshStandardMaterial({
        color: new Color("green"),
        emissive: new Color("green"),
        emissiveIntensity: 0.5,
      })
    : new MeshStandardMaterial({
        color: new Color("red"),
        emissive: new Color("red"),
        emissiveIntensity: 0.5,
      });
  //const axesHelper = new THREE.AxesHelper( 5 );

  /*
  const bmap = useLoader(TextureLoader, "images/maps/mechBumpMap.jpg");
  bmap.repeat.set(1, 1);
  bmap.wrapS = THREE.RepeatWrapping;
  bmap.wrapT = THREE.RepeatWrapping;
  */
  //bmap={mechBP.scale > 3 ? bmap : undefined}
  return (
    <group scale={editMode ? 2 / equipList.scale.weightMult[mechBP.scale] : 1}>
      {mechBP.servoList.map((servo, index) => (
        <group
          key={index}
          position={[servo.offset.x, servo.offset.y, servo.offset.z]}
        >
          <ServoShapes
            name={servo.id + "_servo"}
            damageReadoutMode={damageReadoutMode}
            isHit={servoHitNames.find((name) => name === servo.id + "_servo")}
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
                name={weapon.id + "_weapon"}
                damageReadoutMode={damageReadoutMode}
                isHit={servoHitNames.find(
                  (name) => name === weapon.id + "_weapon"
                )}
                weapon={weapon}
                drawDistanceLevel={drawDistanceLevel}
                weaponEditId={weaponEditId}
              />
            </group>
          ))}
        </group>
      ))}
      {(showAxisLines || editMode) && (
        <group scale={mechBP.size() * 0.1}>
          <mesh
            position={[0, 0, 150]}
            rotation={[Math.PI / 2, 0, 0]}
            material={directoinGlowMaterial}
          >
            <cylinderBufferGeometry
              attach="geometry"
              args={[0.25, 0.25, 300, 4]}
            />
          </mesh>
          {editMode && (
            <>
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
            </>
          )}
        </group>
      )}
    </group>
  );
}
