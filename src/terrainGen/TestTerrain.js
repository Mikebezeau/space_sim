import React from "react";
import * as THREE from "three";
import useStore from "../stores/store";
import Buildings from "../3d/planetExplore/Buildings";
import Road from "../3d/planetExplore/Road";
import Terrain from "../3d/planetExplore/Terrain";
const TestTerrian = () => {
  const { planetTerrain } = useStore((state) => state);
  //<group position={[city.position.x, city.position.y, city.position.z]}></group>
  return (
    <>
      <Terrain terrain={planetTerrain.terrain} />
      {planetTerrain.terrain.roads.map((road, index) => (
        <>
          <mesh
            position={[
              road.startPosition.x,
              road.startPosition.y + 20,
              road.startPosition.z,
            ]}
            geometry={new THREE.SphereGeometry(2, 8, 8)}
            material={
              new THREE.MeshBasicMaterial({
                color: new THREE.Color("green"),
              })
            }
          ></mesh>
          <mesh
            position={[
              road.endPosition.x,
              road.endPosition.y + 20,
              road.endPosition.z,
            ]}
            geometry={new THREE.SphereGeometry(2, 8, 8)}
            material={
              new THREE.MeshBasicMaterial({
                color: new THREE.Color("red"),
              })
            }
          ></mesh>
          <Road key={index} road={road} />
        </>
      ))}
      {planetTerrain.terrain.cities.map((city, index) => (
        <group
          key={index}
          position={[city.position.x, city.position.y, city.position.z]}
        >
          <mesh
            position={[0, 500, 0]}
            geometry={new THREE.SphereGeometry(25, 8, 8)}
            material={
              new THREE.MeshBasicMaterial({
                color: new THREE.Color("purple"),
              })
            }
          ></mesh>
          {planetTerrain.cities[index].buildings && (
            <Buildings buildings={planetTerrain.cities[index].buildings} />
          )}
        </group>
      ))}
    </>
  );
};

export default TestTerrian;
