import React from "react";

const Buildings = React.memo(({ buildings }) => {
  return (
    <>
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
    </>
  );
});

export default Buildings;
