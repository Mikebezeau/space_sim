//import { Box3, Vector3 } from "three";
import React, { useRef, useMemo } from "react";
//import { useFrame, useLoader } from "react-three-fiber";
//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useStore from "../stores/store";
import { SCALE } from "../util/gameUtil";

export default function Rocks() {
  //const gltf = useLoader(GLTFLoader, "/gltf/rock.gltf");
  const rocks = useStore((state) => state.rocks);
  return rocks.map((data) => <Rock key={data.guid} data={data} />);
}

//const Rock = React.memo(({ gltf, data }) => {
const Rock = React.memo(({ data }) => {
  const ref = useRef();
  //const { clock, ray } = useStore((state) => state.mutation);
  //const { clock } = useStore((state) => state.mutation);
  /*
  const box = useMemo(
    () =>
      new Box3().setFromCenterAndSize(
        data.offset,
        new Vector3(
          data.size * data.scale,
          data.size * data.scale,
          data.size * data.scale
        )
      ),
    []
  );
  */
  //useFrame(() => {
  // todo, get t, see if close by, check bounds
  //const r = Math.cos((clock.getElapsedTime() / 2) * data.speed) * Math.PI;
  //ref.current.rotation.set(r, r, r);
  /* box.min.copy(data.offset)
    box.max.copy(data.offset)
    box.expandByScalar(data.size * data.scale)*/
  //if (ray.intersectsBox(box)) {
  //});
  return (
    <mesh ref={ref} position={data.offset} scale={[SCALE, SCALE, SCALE]}>
      <dodecahedronBufferGeometry attach="geometry" args={[500, 0]} />
      <meshStandardMaterial attach="material" color="gray" />
    </mesh>
  );
});
