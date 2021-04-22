import { SCALE } from "../util/gameUtil";

const Loading = () => {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry
        attach="geometry"
        args={[1 * SCALE, 16 * SCALE, 16 * SCALE]}
      />
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        opacity={0.6}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
};

export default Loading;
