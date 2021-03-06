import * as THREE from "three";
import React, { useRef } from "react"; //useMemo
import { useThree, useFrame } from "@react-three/fiber";
import { distance } from "../../util/gameUtil";
import useStore from "../../stores/store";
import { SCALE } from "../../util/constants";

const ringGeometry = new THREE.RingBufferGeometry(1, 1.01, 32);
const ringMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("lightgreen"),
  side: THREE.DoubleSide,
});

const planetGeometry = new THREE.DodecahedronBufferGeometry(1, 0);
const shipGeometry = new THREE.DodecahedronBufferGeometry(0.2, 0); //make ships smaller then planets
const planetMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("purple"),
  //emissive: "purple",
  //emissiveIntensity: "0.5",
  wireframe: true,
});
const shipMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("lightskyblue"),
  //emissive: "lightskyblue",
  //emissiveIntensity: "0.5",
  wireframe: true,
});

const maxMapSize = 25;

export default function SystemMap({ showPlayer = false }) {
  const { player, systemScale, planetScale } = useStore((state) => state);
  const systemMap = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (!systemMap.current) return null;
    //place system map at top of screen (offset from camera location)
    systemMap.current.position.copy(camera.position);
    systemMap.current.rotation.copy(camera.rotation);
    systemMap.current.translateY(30 * SCALE);
    systemMap.current.translateZ(-80 * SCALE);

    if (showPlayer) {
      systemMap.current.rotateOnAxis(
        new THREE.Vector3(1, 0, 0),
        -Math.PI * 0.3
      );
      systemMap.current.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);
    }
    //could make the detected enemies show up on map and only update once per 5 seconds
  });

  const planets = useStore((state) => state.planets);
  //planet at end of array has largest orbit
  let maxRadius = 0;
  planets.forEach((planet) => {
    const distanceToSun = distance(planet.object3d.position, {
      x: 0,
      y: 0,
      z: 0,
    });
    maxRadius = distanceToSun > maxRadius ? distanceToSun : maxRadius;
  });
  const mapScale = showPlayer ? maxMapSize / maxRadius : 0.015;
  //console.log(mapScale, maxMapSize, maxRadius);
  return (
    <group ref={systemMap} scale={showPlayer ? SCALE : 20 / systemScale}>
      <System
        showPlayer={showPlayer}
        planets={planets}
        planetScale={planetScale}
        systemScale={systemScale}
        mapScale={mapScale}
      />
      {showPlayer && (
        <ShipPositions mapScale={mapScale} playerObj={player.object3d} />
      )}
    </group>
  );
}

const System = React.memo(
  ({ showPlayer, planets, planetScale, systemScale, mapScale }) => {
    //function System({ planets, mapScale }) {
    return planets.map((planet, index) => {
      //console.log(planet.type);
      const ringRadius =
        mapScale * distance(planet.object3d.position, { x: 0, y: 0, z: 0 });
      //console.log(mapScale, planet.object3d.position.x); // scale={[mapScale, mapScale, mapScale]}>
      return (
        <group key={index}>
          <mesh
            position={[0, 0, 0]}
            scale={[ringRadius, ringRadius, ringRadius]}
            geometry={ringGeometry}
            material={ringMaterial}
          />
          <mesh
            scale={0.2 + planet.radius * (showPlayer ? 0.01 : 0.1)}
            position={[
              planet.object3d.position.x * mapScale,
              planet.object3d.position.z * mapScale,
              0,
            ]}
            geometry={planetGeometry}
            material={planetMaterial}
          ></mesh>
        </group>
      );
    });
  }
);

function ShipPositions({ mapScale, playerObj }) {
  //, enemies }) {
  return (
    <group>
      <mesh
        position={[
          mapScale * playerObj.position.x,
          mapScale * playerObj.position.z,
          0,
        ]}
        geometry={shipGeometry}
        material={shipMaterial}
      ></mesh>
    </group>
  );
}
//NOT MOVING ALONG WITH EMENY LOCATIONS / BUT DONT NEED THIS PART ANYWAYS
//<EnemyPoints mapScale={mapScale} enemies={enemies} />
/*
function EnemyPoints({ mapScale }) {
  const { enemies } = useStore((state) => state);

  const positions = useMemo(() => {
    let positions = [];
    enemies.forEach((e) => {
      positions.push(e.object3d.position.x * mapScale);
      positions.push(e.object3d.position.z * mapScale);
      positions.push(0);
    });
    return new Float32Array(positions);
  }, [enemies]);

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        size={0.025 * mapScale}
        sizeAttenuation
        color="red"
        fog={false}
      />
    </points>
  );
}
*/
