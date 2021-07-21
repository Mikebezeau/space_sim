import React from "react";

const Buildings = React.memo(({ buildings }) => {
  console.log("treesMeshList", buildings.treesMeshList);
  return (
    <group>
      {Object.entries(buildings.buildingMeshList).map(([key, mesh]) => (
        <mesh
          key={key}
          position={mesh.position}
          geometry={mesh.geometry}
          material={mesh.material}
        ></mesh>
      ))}
      {Object.entries(buildings.buildingCurbList).map(([key, mesh]) => (
        <mesh
          key={key}
          position={mesh.position}
          geometry={mesh.geometry}
          material={mesh.material}
        ></mesh>
      ))}
      {Object.entries(buildings.parkMeshList).map(([key, mesh]) => (
        <mesh
          key={key}
          position={mesh.position}
          geometry={mesh.geometry}
          material={mesh.material}
        ></mesh>
      ))}
      {Object.entries(buildings.treesMeshList).map(([key, mesh]) => (
        <mesh
          key={key}
          position={mesh.position}
          geometry={mesh.geometry}
          material={mesh.material}
        ></mesh>
      ))}

      {/*Object.entries(buildings.streetMeshList).map(([key, mesh]) => (
        <mesh
          key={key}
          position={mesh.position}
          geometry={mesh.geometry}
          material={mesh.material}
        ></mesh>
      ))*/}
      {/*
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
    </group>
  );
});

export default Buildings;
