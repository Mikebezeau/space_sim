import React from "react";
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useStore from "../stores/store";
import { SCALE } from "../util/gameUtil";

const lightgreen = new THREE.Color("lightgreen");
const laserGeometry = new THREE.BoxBufferGeometry(
  50 * SCALE,
  50 * SCALE,
  5000 * SCALE
);
const laserMaterial = new THREE.MeshStandardMaterial({
  color: lightgreen,
  emissive: lightgreen,
  emissiveIntensity: 1,
});

export default function WeaponFire() {
  const lasers = useStore((state) => state.lasers);
  const setLasers = useStore((state) => state.actions.setLasers);
  const laserGroup = useRef();

  //const { clock } = useStore((state) => state.mutation);

  useFrame(() => {
    if (!laserGroup.current) return null;

    //laser movement update
    for (let i = 0; i < lasers.length; i++) {
      const group = laserGroup.current.children[i];
      lasers[i].object3d.translateZ(-5000 * SCALE);
      group.position.copy(lasers[i].object3d.position);
      group.rotation.copy(lasers[i].object3d.rotation);
    }

    setLasers(lasers);

    /*
      if (
        //laserGroup.current.children[laserGroup.current.children.length - 1] &&
        laserGroup.current.children[0] &&
        Math.abs(Math.sin(clock.getElapsedTime())) < 0.01
      )
        console.log(
          laserGroup.current.children[0].position,
          ship.position
        );
*/
  });
  return (
    <>
      <group ref={laserGroup}>
        {lasers.map((laser, i) => (
          //PLACE ALL WEAPON FIRING POINTS HERE // DIFFERENT ref FOR DIFFERENT WEAPON GROUPS
          <group key={i}>
            <mesh
              geometry={laserGeometry}
              material={laserMaterial}
              emissive="#fff"
            />
          </group>
        ))}
      </group>
    </>
  );
}
