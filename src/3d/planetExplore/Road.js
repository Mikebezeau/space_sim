import React from "react";

const Road = React.memo(({ road }) => {
  return (
    <mesh geometry={road.mesh.geometry} material={road.mesh.material}></mesh>
  );
});

export default Road;
