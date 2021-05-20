import React from "react";
import * as THREE from "three";
import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import useStore from "../stores/store";
import { SCALE } from "../util/gameUtil";

const dummyObj = new THREE.Object3D();
const targetQuat = new THREE.Quaternion(),
  toTargetQuat = new THREE.Quaternion(),
  curQuat = new THREE.Quaternion();

const lightgreen = new THREE.Color("lightgreen");
const red = new THREE.Color("red");

const detectRingGeometry = new THREE.RingBufferGeometry(
  0.3 * SCALE,
  0.32 * SCALE,
  4
);
const arrowIndicatorGeometry = new THREE.ConeGeometry(
  0.1 * SCALE,
  0.4 * SCALE,
  4
);
const materialRing = new THREE.MeshStandardMaterial({
  color: lightgreen,
  side: THREE.DoubleSide,
  //transparent: 1,
  //opacity: 0.4,
  emissive: "lightblue",
  emissiveIntensity: 1,
  //depthWrite: false,
});
const materialArrowIndicator = new THREE.MeshStandardMaterial({
  color: red,
  side: THREE.DoubleSide,
  //transparent: 1,
  //opacity: 0.4,
  emissive: "red",
  emissiveIntensity: 1,
  //depthWrite: false,
  wireframe: true,
});

export default function ScannerReadout() {
  //const clock = useStore((state) => state.mutation.clock);
  const { camera } = useThree();
  const { planets, enemies } = useStore((state) => state);
  //const { ship, planets, enemies } = useStore((state) => state);
  const scannerOutput = useRef();
  //const { clock } = useStore((state) => state.mutation);

  useFrame(() => {
    if (!scannerOutput.current) return null;
    //weaponFire movement update
    enemies.forEach((enemy, i) => {
      dummyObj.position.copy(camera.position);
      dummyObj.lookAt(enemy.object3d.position);
      /*console.log(
        Math.abs(Math.floor(dummyObj.rotation.x - camera.rotation.x) * 100) /
          10,
        Math.abs(Math.floor(dummyObj.rotation.y - camera.rotation.y) * 100) /
          10,
        Math.abs(Math.floor(dummyObj.rotation.z - camera.rotation.z) * 100) / 10
      );*/
      dummyObj.getWorldQuaternion(targetQuat);
      camera.getWorldQuaternion(curQuat);
      /*
      const testQuat = new THREE.Quaternion();
      testQuat.multiplyQuaternions(curQuat, dummyObj);
      const test = new THREE.Euler();
      console.log(test.setFromQuaternion(testQuat));
      */
      /*
      const testV1 = new THREE.Vector3();
      const testV2 = new THREE.Vector3();
      const testV3 = new THREE.Vector3();
      dummyObj.rotation.toVector3(testV1);
      camera.rotation.toVector3(testV2);
      testV3.angleTo(testV1, testV2);
      console.log(testV3);
      */

      //console.log(test.setFromQuaternion(targetQuat));

      const angleDiff = curQuat.angleTo(targetQuat);
      //if angleDiff < 3 place an arrow pointing towards target on edge of max angle
      const mesh = scannerOutput.current.children[i];
      if (angleDiff < 3) {
        dummyObj.rotation.copy(camera.rotation);
        dummyObj.translateZ(-10 * SCALE);
        dummyObj.lookAt(enemy.object3d.position);
        dummyObj.translateZ(3 * SCALE);
        //flip arrow so it's pointing right way
        dummyObj.getWorldQuaternion(curQuat);
        targetQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        curQuat.multiplyQuaternions(curQuat, targetQuat);
        dummyObj.rotation.setFromQuaternion(curQuat);
        //dummyObj.rotation;
        mesh.geometry = arrowIndicatorGeometry;
        mesh.material = materialArrowIndicator;
      } else {
        dummyObj.translateZ(10 * SCALE);
        mesh.geometry = detectRingGeometry;
        mesh.material = materialRing;
      }
      mesh.position.copy(dummyObj.position);
      mesh.rotation.copy(dummyObj.rotation);
    });
  });
  return (
    <>
      <group ref={scannerOutput}>
        {enemies.map((enemy, i) => (
          <mesh
            key={"e" + i}
            geometry={detectRingGeometry}
            material={materialRing}
          />
        ))}
      </group>
    </>
  );
}
