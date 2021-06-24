import * as THREE from "three";
//import React, { useRef, useMemo, useEffect } from "react";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import useStore from "../stores/store";
//import useStore, { audio, playAudio } from "../store";
import { SCALE } from "../util/gameUtil";

function make(color, speed) {
  return {
    //ref: React.createRef(),
    color,
    //data: new Array(20)
    data: new Array(10)
      .fill()
      .map(() => [
        new THREE.Vector3(),
        new THREE.Vector3(
          -1 + Math.random() * 2,
          -1 + Math.random() * 2,
          -1 + Math.random() * 2
        )
          .normalize()
          .multiplyScalar(speed * 2),
      ]),
  };
}

export default function Explosions() {
  const explosions = useStore((state) => state.explosions);
  return explosions.map(({ id, object3d }) => (
    <Explosion key={id} position={object3d.position} />
  ));
}

const Explosion = React.memo(({ position, scale }) => {
  //function Explosion({ position, scale }) {
  const group = useRef();
  const { dummy } = useStore((state) => state.mutation);
  const particles = useMemo(
    () => [make("white", 800 * SCALE), make("white", 600 * SCALE)], //make("orange", 0.6)],
    []
  );

  //useEffect(() => void playAudio(new Audio(audio.mp3.explosion), 0.5), []);

  useFrame(() => {
    particles.forEach(({ data }, type) => {
      try {
        const mesh = group.current.children[type];
        data.forEach(([vec, normal], i) => {
          vec.add(normal);
          dummy.position.copy(vec);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        });
        mesh.material.opacity -= 0.1;
        mesh.instanceMatrix.needsUpdate = true;
      } catch (e) {
        //console.log(e, particles);
      }
    });
  });
  /*instancedMesh frustumCulled={false}*/
  return (
    <group ref={group} position={position} scale={SCALE}>
      {particles.map(({ color, data }, index) => (
        <instancedMesh key={Math.random()} args={[null, null, data.length]}>
          <dodecahedronBufferGeometry
            attach="geometry"
            args={[100 * SCALE, 0]}
          />
          <meshBasicMaterial
            attach="material"
            color={color}
            transparent
            opacity={1}
            fog={false}
            receiveShadow={false}
            precision={"lowp"}
            toneMapped={false}
          />
        </instancedMesh>
      ))}
    </group>
  );
});
