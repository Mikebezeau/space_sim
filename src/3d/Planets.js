import { useRef } from "react";
import * as THREE from "three";
import useStore from "../stores/store";
import { Canvas, useLoader } from "react-three-fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

import { distance } from "../util/gameUtil";

function Planet({ planet }) {
  //console.log(index, planet);
  //load textures
  const cloudsTexture = useLoader(
    TextureLoader,
    "images/maps/earthcloudmap.jpg"
  );
  const cloudsAlpha = useLoader(
    TextureLoader,
    "images/maps/earthcloudmaptrans.jpg"
  );

  const textureMaps = useLoader(TextureLoader, [
    "images/maps/sunmap.jpg",
    "images/maps/earthmap1k.jpg",
    "images/maps/jupitermap.jpg",
    "images/maps/mercurymap.jpg",
    "images/maps/moonmap1k.jpg",
    "images/maps/moonmap1k.jpg",
    "images/maps/venusmap.jpg",
  ]);

  //planet shape
  const geometryPlanet = new THREE.SphereGeometry(planet.radius, 32, 32);
  //planet material
  const materialPlanet = new THREE.MeshPhongMaterial({
    map: textureMaps[planet.textureMap],
    emissive: planet.type === "SUN" ? planet.color : "false",
    color: planet.color,
    opacity: planet.opacity,
    transparent: planet.transparent,
    roughness: planet.roughness,
    metalness: planet.metalness,
  });

  //cloud shape
  const geometryClouds = new THREE.SphereGeometry(planet.radius * 1.02, 32, 32);
  //cloud material
  const materialClouds = new THREE.MeshStandardMaterial({
    map: cloudsTexture,
    alphaMap: cloudsAlpha,
    opacity: 0.5,
    transparent: 1,
    depthWrite: false,
  });

  /*
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
  />;
  */
  //ring geometry and material
  const geometryRing = new THREE.RingBufferGeometry(1.0, 1.01, 64);
  const materialRing = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#adf"),
    side: THREE.DoubleSide,
    transparent: 1,
    opacity: 0.1,
  });

  const ringRadius = distance(planet.position, { x: 0, y: 0, z: 0 });

  //console.log(planet.position, ringSize);

  //draw planet and line ring in system to show planet orbit
  return (
    <>
      {/* planet and clouds */}
      <group
        position={[planet.position.x, planet.position.y, planet.position.z]}
        rotation={[planet.rotation.x, planet.rotation.y, planet.rotation.z]}
      >
        <mesh geometry={geometryPlanet} material={materialPlanet}></mesh>
        {planet.type != "SUN" && (
          <mesh geometry={geometryClouds} material={materialClouds}></mesh>
        )}
      </group>
      {/* ring */}
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[ringRadius, ringRadius, ringRadius]}
        geometry={geometryRing}
        material={materialRing}
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
