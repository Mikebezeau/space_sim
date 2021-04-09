import * as THREE from "three";
import React from "react";
import { distance } from "../gameHelper";

const ringGeometry = new THREE.RingBufferGeometry(1, 1.01, 32);
const ringMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("lightgreen"),
  side: THREE.DoubleSide,
});
const planetGeometry = new THREE.DodecahedronBufferGeometry(0.5, 0);

export default function SystemMap({ planets }) {
  return (
    <group>
      <System planets={planets} />
    </group>
  );
}

function System({ planets, doNotScale = false }) {
  //planet at end of array has largest orbit
  const maxRadius = distance(planets[planets.length - 1].position, {
    x: 0,
    y: 0,
    z: 0,
  });
  const maxMapSize = 15;
  const mapScale = doNotScale ? 1 : maxMapSize / maxRadius;

  return planets.map((planet, index) => {
    //console.log(planet.type);
    const ringRadius =
      mapScale * distance(planet.position, { x: 0, y: 0, z: 0 });
    //console.log(mapScale, planet.position.x); // scale={[mapScale, mapScale, mapScale]}>
    return (
      <group key={index}>
        <mesh
          position={[0, 0, 0]}
          scale={[ringRadius, ringRadius, ringRadius]}
          geometry={ringGeometry}
          material={ringMaterial}
        />
        <mesh
          position={
            planet.type === "SUN"
              ? [0, 0, 0]
              : [mapScale * planet.position.x, mapScale * planet.position.z, 0]
          }
          geometry={planetGeometry}
        >
          <meshStandardMaterial
            attach="material"
            emissive={planet.type === "SUN" ? "white" : "lightgreen"}
            emissiveIntensity="0.5"
            wireframe
          />
        </mesh>
      </group>
    );
  });
}
