import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useStore from "../../stores/store";
import BuildMech from "../BuildMech";
import { SCALE } from "../../util/constants";

const servoHitNames = [];

const Station = React.memo(({ station }) => {
  //station rotation
  const { clock } = useStore((state) => state.mutation);
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      const r = clock.getElapsedTime() / 50;
      ref.current.rotation.set(0, r, 0);
    }
  });
  //const texture_map = useLoader(TextureLoader, ["images/maps/?.jpg"]);
  return (
    <group
      ref={ref}
      position={[station.position.x, station.position.y, station.position.z]}
      rotation={[station.rotation.x, station.rotation.y, station.rotation.z]}
      scale={SCALE}
      key={station.guid}
    >
      <BuildMech
        mechBP={station.stationBP}
        servoHitNames={servoHitNames}
        showAxisLines={0}
      />

      <pointLight
        position={[0, 5, 0]}
        distance={0}
        intensity={0.2}
        color="lightblue"
      />

      <pointLight
        position={[0, -5, 0]}
        distance={0}
        intensity={0.2}
        color="lightblue"
      />
      <pointLight
        position={[0, 0, -7]}
        distance={0}
        intensity={0.2}
        color="lightblue"
      />
    </group>
  );
});

function Stations() {
  const stations = useStore((state) => state.stations);

  return (
    <>
      {stations.map((station, index) => (
        <Station key={index} station={station} />
      ))}
    </>
  );
}

export default Stations;
