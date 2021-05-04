import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useStore from "../stores/store";
import { geoList } from "../data/shapeGeometry";
//import { useLoader } from "@react-three/fiber";
//import { TextureLoader } from "three/src/loaders/TextureLoader.js";

const Station = React.memo(({ station }) => {
  //station rotation
  const { clock } = useStore((state) => state.mutation);
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      const r = clock.getElapsedTime() / 10;
      ref.current.rotation.set(0, r, 0);
    }
  });
  //const texture_map = useLoader(TextureLoader, ["images/maps/?.jpg"]);
  return (
    <group
      ref={ref}
      position={[station.position.x, station.position.y, station.position.z]}
      rotation={[station.rotation.x, station.rotation.y, station.rotation.z]}
      scale={[station.size, station.size, station.size]}
    >
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
      <mesh
        scale={[2, 2, 2]}
        geometry={geoList.cylinder}
        material={station.material}
      ></mesh>
      <mesh
        scale={[0.6, 0.6, 0.6]}
        rotation={[0, 0, Math.PI / 2]}
        position={[0, 0, 0]}
        geometry={geoList.cylinder}
        material={station.material}
      ></mesh>
      <mesh
        scale={[0.75, 0.75, 0.75]}
        rotation={[0, Math.PI / 2, Math.PI / 2]}
        position={[0, 0, 0]}
        geometry={geoList.cylinder}
        material={station.material}
      ></mesh>
      <mesh
        scale={[1.7, 1.7, 1.2]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        geometry={geoList.torus}
        material={station.material}
      ></mesh>
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
