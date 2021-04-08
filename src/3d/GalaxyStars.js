import React from "react";
import * as THREE from "three";
import { SCALE } from "../gameHelper";
import useStore from "../store";
import SystemMap from "./SystemMap";
import { useInitPlanets } from "../hooks/useSystemInit";

const seedrandom = require("seedrandom");

export default function GalaxyStars({ count = 10000 }) {
  const galaxyStarPositions = useStore((state) => state.galaxyStarPositions);
  const selectedStar = useStore((state) => state.selectedStar);

  const planets = useInitPlanets(seedrandom(selectedStar), 2, 2);

  const geometry = new THREE.RingBufferGeometry(1.0, 1.01, 64);
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#adf"),
    side: THREE.DoubleSide,
    transparent: 0,
    opacity: 1,
  });

  //get star positions from store
  return (
    <>
      <mesh
        position={[
          galaxyStarPositions[selectedStar],
          galaxyStarPositions[selectedStar + 1],
          galaxyStarPositions[selectedStar + 2],
        ]}
        rotation={[-Math.PI, 0, 0]}
        scale={[15 * SCALE, 15 * SCALE, 15 * SCALE]}
        geometry={geometry}
        material={material}
      />
      <group
        rotation={[Math.PI, 0, 0]}
        position={[
          galaxyStarPositions[selectedStar],
          galaxyStarPositions[selectedStar + 1],
          galaxyStarPositions[selectedStar + 2],
        ]}
        scale={[SCALE, SCALE, SCALE]}
      >
        <SystemMap planets={planets} />
      </group>

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

/*
const int numArms = 5;
const float armSeparationDistance = 2 * PI / numArms;
const float armOffsetMax = 0.5f;
const float rotationFactor = 5;
const float randomOffsetXY = 0.02f;

void InitializeStars() {
    for(int i = 0; i < LengthOf(starPositions); i++) {
        // Choose a distance from the center of the galaxy.
        float distance = RandFloat();
        distance = pow(distance, 2);

        // Choose an angle between 0 and 2 * PI.
        float angle = RandFloat() * 2 * PI;
        float armOffset = RandFloat() * armOffsetMax;
        armOffset = armOffset - armOffsetMax / 2;
        armOffset = armOffset * (1 / distance);

        float squaredArmOffset = pow(armOffset, 2);
        if(armOffset < 0)
            squaredArmOffset = squaredArmOffset * -1;
        armOffset = squaredArmOffset;

        float rotation = distance * rotationFactor;

        angle = (int)(angle / armSeparationDistance) * armSeparationDistance + armOffset + rotation;

        // Convert polar coordinates to 2D cartesian coordinates.
        float starX = cos(angle) * distance;
        float starY = sin(angle) * distance;

        float randomOffsetX = RandFloat() * randomOffsetXY;
        float randomOffsetY = RandFloat() * randomOffsetXY;

        starX += randomOffsetX;
        starY += randomOffsetY;

        // Now we can assign xy coords.
        starPositions[i].x = starX;
        starPositions[i].y = starY;
    }
}
*/
