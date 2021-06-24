import * as THREE from "three";
import React from "react";
import useStore from "../stores/store";

const ringGeometry = new THREE.RingBufferGeometry(1, 1.01, 32);
const ringMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("lightgreen"),
  side: THREE.DoubleSide,
});

const planetGeometry = new THREE.DodecahedronBufferGeometry(0.25, 0);
const planetMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("purple"),
  //emissive: "purple",
  //emissiveIntensity: "0.5",
  wireframe: true,
});

export default function SystemMap() {
  const { sytemScale, planetScale } = useStore((state) => state);

  const mapScale = 0.015;
  //console.log(mapScale, maxMapSize, maxRadius);
  return (
    <group scale={20 / sytemScale}>
      <System planetScale={planetScale} mapScale={mapScale} />
    </group>
  );
}

const System = React.memo(({ planets, planetScale, mapScale }) => {
  const ringRadius = mapScale * 10000;
  return (
    <group>
      <mesh
        position={[0, 0, 0]}
        scale={[ringRadius, ringRadius, ringRadius]}
        geometry={ringGeometry}
        material={ringMaterial}
      />
      <mesh
        scale={1 + 0.25 * 10000 * planetScale}
        position={[0, 0, 0]}
        geometry={planetGeometry}
        material={planetMaterial}
      ></mesh>
    </group>
  );
});
