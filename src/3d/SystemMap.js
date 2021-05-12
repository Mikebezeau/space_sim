import * as THREE from "three";
import React, { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { distance } from "../util/gameUtil";
import useStore from "../stores/store";
import { SCALE } from "../util/gameUtil";

const ringGeometry = new THREE.RingBufferGeometry(1, 1.01, 32);
const ringMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("lightgreen"),
  side: THREE.DoubleSide,
});
const planetGeometry = new THREE.DodecahedronBufferGeometry(0.5, 0);
const shipGeometry = new THREE.DodecahedronBufferGeometry(0.2, 0);
const maxMapSize = 15;

export default function SystemMap({ showPlayer = false }) {
  const systemMap = useRef();
  const { camera } = useThree();
  const camQuat = new THREE.Quaternion();

  useFrame(() => {
    if (!systemMap.current) return null;
    //place system map at top of screen (offset from camera location)
    systemMap.current.position.copy(camera.position);
    systemMap.current.rotation.copy(camera.rotation);
    systemMap.current.translateY(30 * SCALE);
    systemMap.current.translateZ(-80 * SCALE);
    //give map opposite & inverted rotation of camera to stop it from rotating while camera rotates
    camQuat.setFromEuler(camera.rotation);

    systemMap.current.rotation.setFromQuaternion(
      camQuat.conjugate().invert().normalize()
    );

    systemMap.current.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI * 0.7);
    //systemMap.current.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);
    /*
    //trying to add angle to static system map
    curQuat.setFromEuler(systemMap.current.rotation);
    endQuat.setFromAxisAngle(Math.PI / 1.5, 0, 0);
    systemMap.current.rotation.setFromQuaternion(curQuat.multiply(endQuat));
    
      <group ref={systemMap} rotation={[Math.PI / 1.5, 0, 0]} scale={SCALE}>
        <SystemMap planets={planets} playerPos={ship.position} />
      </group>
*/
  });

  const planets = useStore((state) => state.planets);
  //planet at end of array has largest orbit
  const maxRadius = distance(planets[planets.length - 1].position, {
    x: 0,
    y: 0,
    z: 0,
  });
  const mapScale = maxMapSize / maxRadius;

  return (
    <group ref={systemMap} scale={showPlayer ? SCALE : 1}>
      <System planets={planets} mapScale={mapScale} />
      {showPlayer && <ShipPositions mapScale={mapScale} />}
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

function ShipPositions({ mapScale }) {
  const { ship, enemies } = useStore((state) => state);

  return (
    <group>
      <mesh
        position={[mapScale * ship.position.x, mapScale * ship.position.z, 0]}
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
          key={i}
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
