//import * as THREE from "three";
import useStore from "../store";
import { useLoader } from "react-three-fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { getRandomInt } from "../gameHelper";

//const geometry = new THREE.BoxBufferGeometry(1, 1, 1);

function Station({ station }) {
  const texture_maps = useLoader(TextureLoader, ["images/maps/sunmap.jpg"]);
  return (
    <group
      position={[station.position.x, station.position.y, station.position.z]}
      rotation={[station.rotation.x, station.rotation.y, station.rotation.z]}
    >
      <mesh>
        <boxGeometry attach="geometry" args={[station.size, 1]} />
        <meshStandardMaterial
          attach="material"
          color={station.color}
          roughness={station.roughness}
          metalness={station.metalness}
          emissive="lightblue"
          emissiveIntensity="0.4"
          //wireframe
        />
      </mesh>
      <group>
        {station.ports.map((port, index) => (
          <mesh key={index} position={[port.x, port.y, port.z]}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            <meshStandardMaterial
              attach="material"
              color={station.color}
              emissive="lightblue"
              emissiveIntensity="0.2"
              //wireframe
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

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
