import { geoList } from "./shapeGeometry";

const servoShapeData = {
  Head: [{ scale: [1, 1, 1], geometry: geoList.octahedron }],
  Wing: [{ scale: [3, 1, 1], geometry: geoList.octahedron }],
  Arm: [{ scale: [1, 3, 1], geometry: geoList.octahedron }],
  Leg: [{ scale: [1, 3, 1], geometry: geoList.octahedron }],
  Torso: [{ scale: [1, 1, 4], geometry: geoList.octahedron }],
};

const weaponShapeData = {
  beam: [
    {
      scale: [0.5, 0.5, 0.5],
      position: [0, 0, -5],
      rotation: [-Math.PI / 2, 0, 0],
      geometry: geoList.cone,
    },
  ],
};

export const servoShapes = function (servo, material = null) {
  const size = servo.SP() / 16;
  const useMaterial = material ? material : servo.material;
  return (
    <group scale={[size, size, size]}>
      <mesh
        scale={servoShapeData[servo.type][0].scale}
        geometry={servoShapeData[servo.type][0].geometry}
        material={useMaterial}
      ></mesh>
    </group>
  );
};

export const weaponShapes = function (weapon, material) {
  const size = weapon.SP() / 16;
  const useMaterial = material ? material : weapon.material;
  return (
    <group scale={[size, size, size]}>
      <mesh
        rotation={weaponShapeData[weapon.data.weaponType][0].rotation}
        position={weaponShapeData[weapon.data.weaponType][0].position}
        scale={weaponShapeData[weapon.data.weaponType][0].scale}
        geometry={weaponShapeData[weapon.data.weaponType][0].geometry}
        material={useMaterial}
      ></mesh>
    </group>
  );
};
