import React from "react";
import { useThree, useFrame } from "@react-three/fiber";
//import { useThree, useLoader, useFrame } from "@react-three/fiber";
//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useRef } from "react";
import useStore from "./stores/store";
import useEquipStore from "./stores/equipStore";
import BuildMech from "./3d/BuildMech";
import { equipList } from "./data/equipData";

export default function MainMenu() {
  const {
    mainMenuSelection,
    editServoId,
    editWeaponId,
    editShipRotation,
    editShipZoom,
    mechBP,
  } = useEquipStore((state) => state);
  const { camera } = useThree();
  const { clock } = useStore((state) => state.mutation);
  const ref = useRef();
  const light = useRef();
  //console.log(mechBP.size());
  useFrame(() => {
    //move camera away to look at larger mech
    camera.position.set(0, 0, mechBP.size() / 2 + editShipZoom); // design build is at smaller size, so as able to display largest mech size without flicker
    camera.lookAt(0, 0, 0);
    //set light position at camera
    //light.current.position.copy(camera.position);

    //ship rotating in menu while not being modified
    if (ref.current) {
      if (mainMenuSelection !== 2) {
        //change to mainMenuSelection !== SOME_CONST

        const r = clock.getElapsedTime() / 2;
        ref.current.rotation.set(Math.PI / 4, r, 0);
      } else {
        //point ship in certain direction for editing of part location
        //modify by player selected rotation

        const rotation = {
          x: Math.PI / 4,
          y:
            Math.sign(editShipRotation.y) *
            (Math.PI / 1 + Math.abs(editShipRotation.y)),
          z: 0,
        };

        ref.current.rotation.set(rotation.x, rotation.y, rotation.z);
      }
    }
  });
  //<pointLight ref={light} intensity={0.6} />

  return (
    <>
      <group ref={ref} position={[0, 0, -10]} rotation={[Math.PI / 4, 0, 0]}>
        <BuildMech
          mechBP={mechBP}
          servoEditId={editServoId}
          weaponEditId={editWeaponId}
          editMode={true}
        />
      </group>
    </>
  );
}
