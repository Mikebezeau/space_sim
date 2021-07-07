import React, { useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import useStore from "../../stores/store";
import { SCALE } from "../../util/constants";
import useWindowDimensions from "../../useWindowDimensions";
/*import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

export const textureMaps = useLoader(TextureLoader, [
  "images/maps/sunmap.jpg",
  "images/maps/earthmap1k.jpg",
  "images/maps/jupitermap.jpg",
  "images/maps/jupiter2_1k.jpg",
  "images/maps/mercurymap.jpg",
  "images/maps/moonmap1k.jpg",
  "images/maps/venusmap.jpg",
  "images/maps/earthcloudmaptrans.jpg",
  "images/maps/earthcloudmap.jpg",
]);*/

//basic HTML/CSS heads up display used to show player info
const ScanHudReadout = React.memo(() => {
  //export default function MechHudReadout() {
  const { height, width } = useWindowDimensions();
  //
  const { planets, focusPlanetIndex } = useStore((state) => state);
  //planet shape
  const geometryPlanet = new THREE.SphereGeometry(5, 12, 12);
  //planet material
  const materialPlanet = new THREE.MeshBasicMaterial({
    color: focusPlanetIndex ? planets[focusPlanetIndex].color : 0,
    /*map: focusPlanetIndex
      ? textureMaps[planets[focusPlanetIndex].textureMap]
      : 0,*/
    wireframe: true,
  });

  const scanReadout = useRef();
  const { camera } = useThree();

  //const object3dDummy = new THREE.Object3D();

  useFrame(() => {
    if (!scanReadout.current) return null;
    //place readout at top of screen (offset from camera location)
    scanReadout.current.position.copy(camera.position);
    scanReadout.current.rotation.copy(camera.rotation);
    scanReadout.current.translateX((width / 38) * SCALE);
    scanReadout.current.translateY(12 * SCALE);
    scanReadout.current.translateZ(-50 * SCALE);
    //object3dDummy.rotation.copy(camera.rotation);
    //object3dDummy.rotateY(3 - width / 3000);
    //object3dDummy.rotateX(-1.5);
    //scanReadout.current.rotation.copy(object3dDummy.rotation);
  });

  return (
    <group ref={scanReadout} scale={SCALE}>
      {focusPlanetIndex && (
        <mesh geometry={geometryPlanet} material={materialPlanet}></mesh>
      )}
    </group>
  );
});

export default ScanHudReadout;
