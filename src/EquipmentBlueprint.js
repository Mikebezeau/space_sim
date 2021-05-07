import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
//import { useThree, useLoader, useFrame } from "@react-three/fiber";
//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useRef } from "react";
import useStore from "./stores/store";
import useEquipStore from "./stores/equipStore";
import { servoShapes, weaponShapes } from "./data/equipShapes";
import { equipList } from "./data/equipData";

//const direction = new THREE.Vector3();

const material = new THREE.MeshPhongMaterial({
  color: 0x666666,
  emissive: 0x666666,
  emissiveIntensity: 0.1,
  //roughness: station.roughness,
  //metalness: station.metalness,
});
const selectMaterial = new THREE.MeshPhongMaterial({
  color: 0x666699,
  emissive: 0x666699,
  emissiveIntensity: 0.1,
  //roughness: station.roughness,
  //metalness: station.metalness,
});

function ServoBuild({ servo, editServoId }) {
  return servoShapes(
    servo,
    servo.id === editServoId ? selectMaterial : material
  );
}

function WeaponBuild({ weapon, editWeaponID }) {
  return weaponShapes(
    weapon,
    weapon.id === editWeaponID ? selectMaterial : material
  );
}

export default function MainMenu() {
  const {
    mainMenuSelection,
    editServoId,
    editWeaponId,
    mechBP,
  } = useEquipStore((state) => state);
  const { camera } = useThree();
  const { clock } = useStore((state) => state.mutation);
  const ref = useRef();

  useFrame(() => {
    //move camera away to look at larger mech
    camera.position.set(0, 0, 5 * equipList.scale.weightMult[mechBP.scale]);
    camera.lookAt(0, 0, 0);

    //ship rotating in menu while not being modified
    if (ref.current) {
      if (mainMenuSelection !== 2) {
        //change to mainMenuSelection !== SOME_CONST

        const r = clock.getElapsedTime() / 2;
        ref.current.rotation.set(Math.PI / 4, r, 0);
      } else {
        //point ship in certain direction for editing of part location
        ref.current.rotation.set(Math.PI / 4, 0, 0);
      }
    }
  });

  return (
    <group ref={ref} position={[0, 0, -10]} rotation={[Math.PI / 4, 0, 0]}>
      {mechBP.servoList.map((servo, index) => (
        <group
          key={"servo" + index}
          position={[servo.offset.x, servo.offset.y, servo.offset.z]}
        >
          <ServoBuild servo={servo} editServoId={editServoId} />
          {mechBP.servoWeaponList(servo.id).map((weapon, j) => (
            <group
              key={"weapon" + j}
              position={[weapon.offset.x, weapon.offset.y, weapon.offset.z]}
            >
              <WeaponBuild weapon={weapon} editWeaponId={editWeaponId} />
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}
