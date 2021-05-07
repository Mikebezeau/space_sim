import React, { useRef } from "react";
import * as THREE from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import useStore from "../stores/store";

import { distance } from "../util/gameUtil";

const Planet = React.memo(({ planet }) => {
  //planet rotation
  const { clock } = useStore((state) => state.mutation);
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      const r = clock.getElapsedTime() / 60;
      ref.current.rotation.set(0, r, 0);
    }
  });

  //load textures
  /*
  const cloudsTexture = useLoader(
    TextureLoader,
    "images/maps/earthcloudmap.jpg"
  );
  const cloudsAlpha = useLoader(
    TextureLoader,
    "images/maps/earthcloudmaptrans.jpg"
  );
*/
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
  const geometryPlanet = new THREE.SphereGeometry(planet.radius, 64, 64);
  //planet material
  const materialPlanet = new THREE.MeshLambertMaterial({
    map: textureMaps[planet.textureMap],
    emissive: planet.type === "SUN" ? planet.color : "false",
    color: planet.color,
    opacity: planet.opacity,
    transparent: planet.transparent,
    //depthWrite: false, //fixes flickering cloud mesh, but can see shapes through planet
  });
  /*//too much flickering
  //cloud shape
  const geometryClouds = new THREE.SphereGeometry(planet.radius * 1.01, 64, 64);
  //cloud material
  const materialClouds = new THREE.MeshLambertMaterial({
    map: cloudsTexture,
    alphaMap: cloudsAlpha,
    opacity: 0.1,
    transparent: true,
  });


        {planet.type !== "SUN" && (
          <mesh
            position={[0, 0.001, 0]} //apparently helps flickering issue
            geometry={geometryClouds}
            material={materialClouds}
          ></mesh>
        )}
  */
  //ring geometry and material
  const geometrySystemOrbitRing = new THREE.RingBufferGeometry(1.0, 1.01, 128);
  const materialRing = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#adf"),
    side: THREE.DoubleSide,
    transparent: 1,
    opacity: 0.1,
  });

  const ringRadius = distance(planet.position, { x: 0, y: 0, z: 0 });
  //draw planet and line ring in system to show planet orbit
  return (
    <>
      {/* planet and clouds */}
      <group
        ref={ref}
        position={[planet.position.x, planet.position.y, planet.position.z]}
        rotation={[planet.rotation.x, planet.rotation.y, planet.rotation.z]}
      >
        <mesh geometry={geometryPlanet} material={materialPlanet}></mesh>
      </group>
      {/* solar system orbit ring */}
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[ringRadius, ringRadius, ringRadius]}
        geometry={geometrySystemOrbitRing}
        material={materialRing}
      />
    </>
  );
});

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
