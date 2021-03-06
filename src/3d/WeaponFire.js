import React from "react";
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useStore from "../stores/store";

const red = new THREE.Color("red");
const purple = new THREE.Color("purple");
//const yellow = new THREE.Color("yellow");
const lightgrey = new THREE.Color("lightgrey");

const weaponFireGeometry = {
  beam: new THREE.BoxBufferGeometry(0.1, 0.1, 100),
  proj: new THREE.BoxBufferGeometry(0.2, 0.2, 50),
  missile: new THREE.BoxBufferGeometry(0.5, 0.5, 5),
};

const weaponFireMaterial = {
  beam: new THREE.MeshBasicMaterial({
    color: purple,
  }),
  proj: new THREE.MeshBasicMaterial({
    color: red,
  }),
  missile: new THREE.MeshBasicMaterial({
    color: lightgrey,
  }),
};

const position = new THREE.Vector3();
const direction = new THREE.Vector3();

const WeaponFire = React.memo(({ sceneScale }) => {
  //export default function WeaponFire() {
  const weaponFireList = useStore((state) => state.weaponFireList);
  //const removeWeaponFire = useStore((state) => state.actions.removeWeaponFire);
  const weaponFireGroup = useRef();

  //const { clock } = useStore((state) => state.mutation);

  useFrame(() => {
    if (!weaponFireGroup.current) return null;
    //weaponFire movement update

    weaponFireList.forEach((weaponFire, i) => {
      const bullet = weaponFireGroup.current.children[i];
      if (weaponFire.firstFrameSpeed !== false) {
        //show the weapons firing out of the guns before moving the bullets the first time
        //move them up to where the ship is now
        weaponFire.object3d.translateZ(weaponFire.firstFrameSpeed * sceneScale);
        weaponFire.firstFrameSpeed = false;
        //move the bullet to it's position on the weapon to to show accuratly what weapon its coming from
      } else weaponFire.object3d.translateZ(weaponFire.velocity * sceneScale);

      bullet.position.copy(weaponFire.object3d.position);
      bullet.rotation.copy(weaponFire.object3d.rotation);

      bullet.getWorldPosition(position);
      bullet.getWorldDirection(direction);

      weaponFire.ray.origin.copy(position);
      weaponFire.ray.direction.copy(direction);

      weaponFire.hitBox.min.copy(position);
      weaponFire.hitBox.max.copy(position);
      weaponFire.hitBox.expandByScalar(sceneScale);
    });
    //removeWeaponFire();
  });
  return (
    <>
      <group ref={weaponFireGroup}>
        {weaponFireList.map((weaponFire) => (
          <mesh
            key={weaponFire.id}
            geometry={weaponFireGeometry[weaponFire.weapon.data.weaponType]}
            material={weaponFireMaterial[weaponFire.weapon.data.weaponType]}
          />
        ))}
      </group>
    </>
  );
});

export default WeaponFire;
