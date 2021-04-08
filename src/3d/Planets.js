import * as THREE from "three";
import useStore from "../store";
import { useLoader } from "react-three-fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

import { distance } from "../gameHelper";

function Planet({ planet }) {
  //console.log(index, planet);
  //load textures
  const textureMaps = useLoader(TextureLoader, [
    "images/maps/sunmap.jpg",
    "images/maps/earthmap1k.jpg",
    "images/maps/jupitermap.jpg",
    "images/maps/mercurymap.jpg",
    "images/maps/moonmap1k.jpg",
    "images/maps/moonmap1k.jpg",
    "images/maps/venusmap.jpg",
  ]);
  //draw planet and line ring in system to show planet orbit
  const geometry = new THREE.RingBufferGeometry(1.0, 1.01, 64);
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#adf"),
    side: THREE.DoubleSide,
    transparent: 1,
    opacity: 0.1,
  });
  const ringRadius = distance(planet.position, { x: 0, y: 0, z: 0 });
  //console.log(planet.position, ringSize);
  return (
    <>
      <mesh
        visible
        position={[planet.position.x, planet.position.y, planet.position.z]}
        rotation={[planet.rotation.x, planet.rotation.y, planet.rotation.z]}
      >
        <sphereGeometry attach="geometry" args={[planet.radius, 30, 30]} />
        <meshStandardMaterial
          map={textureMaps[planet.textureMap]}
          attach="material"
          //color={planet.color}
          emissive={planet.type === "SUN" ? planet.color : "false"}
          opacity={planet.opacity}
          transparent={planet.transparent}
          roughness={planet.roughness}
          metalness={planet.metalness}
          //wireframe
        />
      </mesh>
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[ringRadius, ringRadius, ringRadius]}
        geometry={geometry}
        material={material}
      />
    </>
  );
}

function Planets() {
  const planets = useStore((state) => state.planets);

  return (
    <>
      {planets.map((planet, index) => (
        <Planet key={index} planet={planet} />
      ))}
    </>
  );
}

export default Planets;
