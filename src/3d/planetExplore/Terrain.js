import React from "react";

const Terrain = React.memo(({ terrain }) => {
  return (
    <mesh
      geometry={terrain.Mesh.geometry}
      material={terrain.Mesh.material}
    ></mesh>
  );
});

export default Terrain;
