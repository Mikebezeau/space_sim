import * as THREE from "three";
import React from "react";
import { distance } from "../util/gameUtil";
import useStore from "../stores/store";

const ringGeometry = new THREE.RingBufferGeometry(1, 1.01, 32);
const ringMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("lightgreen"),
  side: THREE.DoubleSide,
});
const planetGeometry = new THREE.DodecahedronBufferGeometry(0.5, 0);
const shipGeometry = new THREE.DodecahedronBufferGeometry(0.2, 0);
const maxMapSize = 15;

export default function SystemMap({ planets, playerPos = false }) {
  //planet at end of array has largest orbit
  const maxRadius = distance(planets[planets.length - 1].position, {
    x: 0,
    y: 0,
    z: 0,
  });
  const mapScale = maxMapSize / maxRadius;

  return (
    <group>
      <System planets={planets} mapScale={mapScale} />
      {playerPos ? (
        <ShipPositions mapScale={mapScale} playerPos={playerPos} />
      ) : null}
    </group>
  );
}

function System({ planets, mapScale }) {
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
          position={[
            mapScale * planet.position.x,
            mapScale * planet.position.z,
            0,
          ]}
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

function ShipPositions({ mapScale, playerPos }) {
  const enemies = useStore((state) => state.enemies);
  return (
    <group>
      <mesh
        position={[mapScale * playerPos.x, mapScale * playerPos.z, 0]}
        geometry={shipGeometry}
      >
        <meshStandardMaterial
          attach="material"
          color="green"
          emissive="green"
          emissiveIntensity="0.5"
          wireframe
        />
      </mesh>
      {enemies.map((e, i) => (
        <mesh
          position={[
            mapScale * e.object3d.position.x,
            mapScale * e.object3d.position.z,
            0,
          ]}
          geometry={shipGeometry}
        >
          <meshStandardMaterial
            attach="material"
            color="red"
            emissive="red"
            emissiveIntensity="0.5"
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}
