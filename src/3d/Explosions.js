import * as THREE from "three";
//import React, { useRef, useMemo, useEffect } from "react";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import useStore from "../stores/store";
//import useStore, { audio, playAudio } from "../store";
import { SCALE } from "../util/gameUtil";

function make(color, speed) {
  return {
    ref: React.createRef(),
    color,
    //data: new Array(20)
    data: new Array(2)
      .fill()
      .map(() => [
        new THREE.Vector3(),
        new THREE.Vector3(
          -1 + Math.random() * 2,
          -1 + Math.random() * 2,
          -1 + Math.random() * 2
        )
          .normalize()
          .multiplyScalar(speed * 0.75 * SCALE),
      ]),
  };
}

export default function Explosions() {
  //test shape
  const geometry = new THREE.SphereGeometry(10, 8, 8);
  //test material
  const material = new THREE.MeshLambertMaterial({
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.5,
    color: new THREE.Color(0xffffff),
    opacity: 1,
    depthWrite: false,
  });
  //<Explosion key={id} position={object3d.position} scale={SCALE} />
  const explosions = useStore((state) => state.explosions);
  //if (explosions.length > 0) console.log(explosions[0]);
  return explosions.map(({ id, object3d }) => (
    <group key={id}>
      <mesh
        geometry={geometry}
        material={material}
        position={object3d.position}
        scale={SCALE}
      ></mesh>
    </group>
  ));
}

function Explosion({ position, scale }) {
  const group = useRef();
  const { dummy } = useStore((state) => state.mutation);
  const particles = useMemo(
    () => [make("white", 0.8), make("orange", 0.6)],
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
        mesh.material.opacity -= 0.025;
        mesh.instanceMatrix.needsUpdate = true;
      } catch (e) {
        //console.log(e, particles);
      }
    });
  });

  return (
    <group ref={group} position={position}>
      {particles.map(({ color, data }, index) => (
        <instancedMesh
          key={Math.random()}
          args={[null, null, data.length]}
          frustumCulled={false}
        >
          <dodecahedronBufferGeometry attach="geometry" args={[10, 0]} />
          <meshBasicMaterial
            attach="material"
            color={color}
            transparent
            opacity={1}
            fog={false}
          />
        </instancedMesh>
      ))}
    </group>
  );
}
