import React from "react";
import * as THREE from "three";
import { SCALE } from "../../util/constants";
import useStore from "../../stores/store";
import SystemMap from "./SystemMap";
//import GalaxyMapDestination from "./GalaxyMapDestination";
import { galaxyMapData } from "../../data/galaxtMapData";

const yellow = new THREE.Color("yellow");
const green = new THREE.Color("green");
const blue = new THREE.Color("lightblue");

const ringGeometry = new THREE.RingBufferGeometry(5 * SCALE, 8 * SCALE, 4);
const materialRingGreen = new THREE.MeshBasicMaterial({
  color: green,
  side: THREE.DoubleSide,
  transparent: 1,
  opacity: 0.3,
  receiveShadow: false,
});
const materialRingBlue = new THREE.MeshBasicMaterial({
  color: blue,
  side: THREE.DoubleSide,
  transparent: 1,
  opacity: 0.3,
  receiveShadow: false,
});

export default function GalaxyStars() {
  const galaxyStarPositions = useStore((state) => state.galaxyStarPositions);
  const selectedStar = useStore((state) => state.selectedStar);
  //get star positions from store
  return (
    <>
      {/* this group shows the system map for selected star system */}
      <group
        rotation={[Math.PI, 0, 0]}
        position={[
          galaxyStarPositions[selectedStar],
          galaxyStarPositions[selectedStar + 1],
          galaxyStarPositions[selectedStar + 2],
        ]}
        //increase size of system map to make more visible
        scale={[SCALE * 15, SCALE * 15, SCALE * 15]}
      >
        <SystemMap />
      </group>

      {/* galaxyMapData shows special star systems */}
      {/* <GalaxyMapDestination star={star} />*/}
      {galaxyMapData.map((systemData, i) => (
        <mesh
          key={i}
          position={systemData.position}
          rotation={[Math.PI, 0, 0]}
          geometry={ringGeometry}
          material={
            systemData.breathable === "YES"
              ? materialRingGreen
              : materialRingBlue
          }
        ></mesh>
      ))}

      {/* points shows the galaxy map (all stars) */}
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attachObject={["attributes", "position"]}
            count={galaxyStarPositions.length / 3}
            array={galaxyStarPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          attach="material"
          size={5 * SCALE}
          sizeAttenuation
          color="white"
          fog={false}
        />
      </points>
    </>
  );
}
