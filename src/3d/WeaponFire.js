import React from "react";
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useStore from "../stores/store";
import { SCALE } from "../util/gameUtil";

const lightgreen = new THREE.Color("lightgreen");

const weaponFireGeometry = {
  beam: new THREE.BoxBufferGeometry(0.1 * SCALE, 0.1 * SCALE, 200 * SCALE),
  proj: new THREE.BoxBufferGeometry(0.2 * SCALE, 0.2 * SCALE, 50 * SCALE),
  missile: new THREE.BoxBufferGeometry(0.5 * SCALE, 0.5 * SCALE, 5 * SCALE),
};

const weaponFireMaterial = {
  beam: new THREE.MeshStandardMaterial({
    color: lightgreen,
    emissive: lightgreen,
    emissiveIntensity: 1,
  }),
};

export default function WeaponFire() {
  const weaponFireList = useStore((state) => state.weaponFireList);
  const removeWeaponFire = useStore((state) => state.actions.removeWeaponFire);
  const weaponFireGroup = useRef();

  //const { clock } = useStore((state) => state.mutation);

  useFrame(() => {
    if (!weaponFireGroup.current) return null;
    //weaponFire movement update

    weaponFireList.forEach((weaponFire, i) => {
      const group = weaponFireGroup.current.children[i];
      if (weaponFire.firstFrameSpeed !== false) {
        //show the weapons firing out of the guns before moving the bullets the first time
        //move them up to where the ship is now
        weaponFire.object3d.translateZ(weaponFire.firstFrameSpeed * SCALE);
        weaponFire.firstFrameSpeed = false;
        //move the bullet to it's position on the weapon to to show accuratly what weapon its coming from
      } else weaponFire.object3d.translateZ(weaponFire.velocity * SCALE);

      group.position.copy(weaponFire.object3d.position);
      group.rotation.copy(weaponFire.object3d.rotation);
    });

    removeWeaponFire();
    /*
    if (
      //weaponFireGroup.current.children[weaponFireGroup.current.children.length - 1] &&
      weaponFireGroup.current.children[0] &&
      Math.abs(Math.sin(clock.getElapsedTime())) < 0.03
    )
      console.log(weaponFireGroup.current.children[0].position);*/
  });
  return (
    <>
      <group ref={weaponFireGroup}>
        {weaponFireList.map((weaponFire) => (
          //PLACE ALL WEAPON FIRING POINTS HERE // DIFFERENT ref FOR DIFFERENT WEAPON GROUPS
          <group key={weaponFire.id}>
            <mesh
              geometry={weaponFireGeometry[weaponFire.weaponType]}
              material={weaponFireMaterial.beam}
            />
          </group>
        ))}
      </group>
    </>
  );
}
