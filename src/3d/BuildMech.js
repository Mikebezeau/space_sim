import * as THREE from "three";
import { ServoShapes, WeaponShapes } from "../data/equipShapes";

export default function BuildMech({
  mechBP,
  servoEditId = null,
  weaponEditId = null,
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
    <>
      {mechBP.servoList.map((servo, index) => (
        <group
          key={index}
          position={[servo.offset.x, servo.offset.y, servo.offset.z]}
        >
          <ServoShapes servo={servo} servoEditId={servoEditId} />
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
      {showAxisLines && (
        <group scale={mechBP.scale * 0.1}>
          <mesh
            position={[0, 0, -500]}
            scale={1}
            rotation={[Math.PI / 2, 0, 0]}
            material={redGlowMaterial}
          >
            <cylinderBufferGeometry
              attach="geometry"
              args={[0.25, 0.25, 1000, 4]}
            />
          </mesh>

          <mesh
            position={[0, 0, 0]}
            scale={mechBP.scale}
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
            scale={mechBP.scale}
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
    </>
  );
}
