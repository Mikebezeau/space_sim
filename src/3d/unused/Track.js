//NOT USED

import React from "react";
import useStore from "../stores/store";

export default function Track() {
  const { scale, track } = useStore((state) => state.mutation);
  return (
    <mesh scale={[scale, scale, scale]} geometry={track}>
      <meshBasicMaterial attach="material" color="indianred" />
    </mesh>
  );
}
