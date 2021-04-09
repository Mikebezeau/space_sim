import { SCALE } from "../gameHelper";
import useStore from "../store";
import SystemMap from "./SystemMap";
import { useSetPlanets } from "../hooks/usePlanets";

const seedrandom = require("seedrandom");

export default function GalaxyStarMap() {
  const galaxyStarPositions = useStore((state) => state.galaxyStarPositions);
  const selectedStar = useStore((state) => state.selectedStar);

  const planets = useSetPlanets(seedrandom(selectedStar), 2, 2);

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
        <SystemMap planets={planets} doNotScale={true} />
      </group>

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
