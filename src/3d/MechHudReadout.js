import React, { useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import useStore from "../stores/store";
import BuildMech from "../3d/BuildMech";
import { SCALE } from "../util/constants";
import useWindowDimensions from "../useWindowDimensions";

//basic HTML/CSS heads up display used to show player info
const MechHudReadout = React.memo(() => {
  //export default function MechHudReadout() {
  const { height, width } = useWindowDimensions();
  //
  const { currentMechBPindex } = useStore((state) => state.player);
  const { playerMechBP } = useStore((state) => state);

  const mechDamageReadout = useRef();
  const { camera } = useThree();

  const object3dDummy = new THREE.Object3D();

  useFrame(() => {
    if (!mechDamageReadout.current) return null;
    //place readout at top of screen (offset from camera location)
    mechDamageReadout.current.position.copy(camera.position);
    mechDamageReadout.current.rotation.copy(camera.rotation);
    mechDamageReadout.current.translateX((width / 38) * SCALE);
    mechDamageReadout.current.translateY(12 * SCALE);
    mechDamageReadout.current.translateZ(-50 * SCALE);
    object3dDummy.rotation.copy(camera.rotation);
    object3dDummy.rotateY(3 - width / 3000);
    object3dDummy.rotateX(-1.5);
    mechDamageReadout.current.rotation.copy(object3dDummy.rotation);
  });

  return (
    <group ref={mechDamageReadout} scale={SCALE}>
      <BuildMech
        mechBP={playerMechBP[currentMechBPindex]}
        damageReadoutMode={true}
      />
    </group>
  );
});

export default MechHudReadout;
