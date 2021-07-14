import React from "react";
import useStore from "../stores/store";
import Buildings from "../3d/planetExplore/Buildings";

const TestTerrian = () => {
  const { terrain, city } = useStore((state) => state);

  return (
    <>
      <Buildings buildings={city.buildings} />

      {/*
      <mesh
        position={city.terrain.mergedStreetMesh.position}
        geometry={city.terrain.mergedStreetMesh.geometry}
        material={city.terrain.mergedStreetMesh.material}
      ></mesh>

      <mesh
        position={city.terrain.mergedGroundMesh.position}
        geometry={city.terrain.mergedGroundMesh.geometry}
        material={city.terrain.mergedGroundMesh.material}
      ></mesh>
      
      <mesh
        position={city.terrain.baseMesh.position}
        geometry={city.terrain.baseMesh.geometry}
        material={city.terrain.baseMesh.material}
      ></mesh>
      <mesh
        position={city.terrain.water.position}
        geometry={city.terrain.water.geometry}
        material={city.terrain.water.material}
      ></mesh>*/}
    </>
  );
};

export default TestTerrian;
