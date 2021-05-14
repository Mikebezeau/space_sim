import React from "react";
import { useRef, useEffect } from "react";
import useStore from "../stores/store";
import { SCALE } from "../util/gameUtil";

export default function Particles() {
  const instancedMesh = useRef();
  const { particles, dummy } = useStore((state) => state.mutation);

  useEffect(() => {
    particles.forEach((particle, i) => {
      const { offset, size, scale } = particle;
      dummy.position.copy(offset);
      dummy.scale.set(
        size * scale * SCALE,
        size * scale * SCALE,
        size * scale * SCALE
      );

      dummy.rotation.set(
        Math.sin(Math.random()) * Math.PI,
        Math.sin(Math.random()) * Math.PI,
        Math.cos(Math.random()) * Math.PI
      );
      dummy.updateMatrix();
      instancedMesh.current.setMatrixAt(i, dummy.matrix);
    });
    instancedMesh.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh
      ref={instancedMesh}
      args={[null, null, particles.length]}
      frustumCulled={false}
    >
      <coneBufferGeometry attach="geometry" args={[1, 1, 3]} />
      <meshStandardMaterial attach="material" color="#606060" />
    </instancedMesh>
  );
}
