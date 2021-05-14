import React from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";
import { geoList } from "./shapeGeometry";

export const servoShapeData = {
  Pod: [
    { scale: [2, 1, 2], geometry: geoList.box },
    { scale: [2, 1, 2], geometry: geoList.extrudeBox },
    { scale: [2, 1, 2], geometry: geoList.circle },
    { scale: [2, 1, 2], geometry: geoList.cone },
    { scale: [2, 1, 2], geometry: geoList.cylinder },
    { scale: [2, 1, 2], geometry: geoList.dodecahedron },
    { scale: [2, 1, 2], geometry: geoList.icosahedron },
    { scale: [2, 1, 2], geometry: geoList.octahedron },
    { scale: [4, 1, 1], geometry: geoList.plane },
    { scale: [2, 1, 2], geometry: geoList.sphere },
    { scale: [2, 1, 2], geometry: geoList.tetrahedron },
    { scale: [1, 1, 4], geometry: geoList.torus },
  ],
  Wing: [
    { scale: [3, 1, 1], geometry: geoList.box },
    { scale: [3, 1, 1], geometry: geoList.extrudeBox },
    { scale: [3, 1, 1], geometry: geoList.circle },
    { scale: [3, 1, 1], geometry: geoList.cone },
    { scale: [3, 1, 1], geometry: geoList.cylinder },
    { scale: [3, 1, 1], geometry: geoList.dodecahedron },
    { scale: [3, 1, 1], geometry: geoList.icosahedron },
    { scale: [3, 1, 1], geometry: geoList.octahedron },
    { scale: [4, 1, 1], geometry: geoList.plane },
    { scale: [3, 1, 1], geometry: geoList.sphere },
    { scale: [3, 1, 1], geometry: geoList.tetrahedron },
    { scale: [1, 1, 4], geometry: geoList.torus },
  ],
  Arm: [
    { scale: [1, 3, 1], geometry: geoList.box },
    { scale: [1, 3, 1], geometry: geoList.extrudeBox },
    { scale: [1, 3, 1], geometry: geoList.circle },
    { scale: [1, 3, 1], geometry: geoList.cone },
    { scale: [1, 3, 1], geometry: geoList.cylinder },
    { scale: [1, 3, 1], geometry: geoList.dodecahedron },
    { scale: [1, 3, 1], geometry: geoList.icosahedron },
    { scale: [1, 3, 1], geometry: geoList.octahedron },
    { scale: [4, 1, 1], geometry: geoList.plane },
    { scale: [1, 3, 1], geometry: geoList.sphere },
    { scale: [1, 3, 1], geometry: geoList.tetrahedron },
    { scale: [1, 1, 4], geometry: geoList.torus },
  ],
  Leg: [
    { scale: [1, 3, 1], geometry: geoList.box },
    { scale: [1, 3, 1], geometry: geoList.extrudeBox },
    { scale: [1, 3, 1], geometry: geoList.circle },
    { scale: [1, 3, 1], geometry: geoList.cone },
    { scale: [1, 3, 1], geometry: geoList.cylinder },
    { scale: [1, 3, 1], geometry: geoList.dodecahedron },
    { scale: [1, 3, 1], geometry: geoList.icosahedron },
    { scale: [1, 3, 1], geometry: geoList.octahedron },
    { scale: [4, 1, 1], geometry: geoList.plane },
    { scale: [1, 3, 1], geometry: geoList.sphere },
    { scale: [1, 3, 1], geometry: geoList.tetrahedron },
    { scale: [1, 1, 4], geometry: geoList.torus },
  ],
  Torso: [
    { scale: [1, 1, 3], geometry: geoList.box },
    { scale: [0.6, 0.6, 4], geometry: geoList.extrudeBox },
    { scale: [1, 1, 3], geometry: geoList.circle },
    { scale: [1, 1, 3], geometry: geoList.cone },
    { scale: [1, 1, 3], geometry: geoList.cylinder },
    { scale: [1, 1, 3], geometry: geoList.dodecahedron },
    { scale: [1, 1, 3], geometry: geoList.icosahedron },
    { scale: [1, 1, 3], geometry: geoList.octahedron },
    { scale: [2, 8, 2], geometry: geoList.plane },
    { scale: [1, 1, 3], geometry: geoList.sphere },
    { scale: [1, 1, 3], geometry: geoList.tetrahedron },
    { scale: [0.8, 0.8, 2], geometry: geoList.torus },
  ],
};

export const weaponShapeData = {
  beam: [
    {
      scale: [0.15, 1, 0.15],
      position: [0, 0, -0.5],
      rotation: [-Math.PI / 2, 0, 0],
      geometry: geoList.cone,
    },
  ],
  proj: [
    {
      scale: [0.15, 0.7, 0.15],
      position: [0, 0, -0.35],
      rotation: [-Math.PI / 2, 0, 0],
      geometry: geoList.cone,
    },
  ],
  missile: [
    {
      scale: [0.15, 0.2, 0.15],
      position: [0, 0, -0.1],
      rotation: [-Math.PI / 2, 0, 0],
      geometry: geoList.cone,
    },
  ],
  eMelee: [
    {
      scale: [0.15, 1, 0.15],
      position: [0, 0, -0.5],
      rotation: [-Math.PI / 2, 0, 0],
      geometry: geoList.cone,
    },
  ],
  melee: [
    {
      scale: [0.15, 1, 0.15],
      position: [0, 0, -0.5],
      rotation: [-Math.PI / 2, 0, 0],
      geometry: geoList.cone,
    },
  ],
};

const constructionMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#666"),
  emissive: new THREE.Color("#666"),
  emissiveIntensity: 0.1,
});

const selectMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#669"),
  emissive: new THREE.Color("#669"),
  emissiveIntensity: 0.2,
});

export const ServoShapes = function ({
  servo,
  servoEditId,
  landingBay,
  landingBayServoLocationId,
  landingBayPosition,
}) {
  const editing = servo.id === servoEditId ? true : false;
  const size = servo.size();
  const useMaterial = editing ? selectMaterial : constructionMaterial; //servo.material;
  /*
  const visibilityMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#669"),
    emissive: new THREE.Color("#669"),
    emissiveIntensity: 0.8,
  });
  const useMaterial = visibilityMaterial;
  */
  const scaleX =
    servo.scaleAdjust.x + servoShapeData[servo.type][servo.shape].scale[0]; //scale[0] is the scale of x axis
  const scaleY =
    servo.scaleAdjust.y + servoShapeData[servo.type][servo.shape].scale[1];
  const scaleZ =
    servo.scaleAdjust.z + servoShapeData[servo.type][servo.shape].scale[2];

  const servoGeometry = servoShapeData[servo.type][servo.shape].geometry;

  let ServoMesh = new THREE.Mesh(servoGeometry, useMaterial);

  if (landingBayServoLocationId === servo.id) {
    // shape to cut from servo shape
    const landingBayHole = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    // Offset box by half its width
    landingBayHole.position.set(
      landingBayPosition.x,
      landingBayPosition.y,
      landingBayPosition.z
    );

    // Make sure the .matrix of each mesh is current
    ServoMesh.updateMatrix();
    landingBayHole.updateMatrix();

    // Subtract landingBayHole from ServoMesh
    ServoMesh = CSG.subtract(ServoMesh, landingBayHole);

    //add a translucent forcefield type shape on hole
    const landingBayGlowMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#669"),
      emissive: new THREE.Color("#669"),
      emissiveIntensity: 0.8,
      opacity: 0.8,
      transparent: true,
    });
    const landingBayHoleForceField = new THREE.Mesh(
      landingBayHole.geometry,
      landingBayGlowMaterial
    );

    // Add landingBayHoleForceField to ServoMesh
    //ServoMesh = CSG.union(ServoMesh, landingBayHoleForceField);
  }

  return (
    <group scale={[size, size, size]}>
      <mesh
        rotation={[
          Math.sign(servo.rotation.x) *
            (Math.PI / 1 + Math.abs(servo.rotation.x)),
          Math.sign(servo.rotation.y) *
            (Math.PI / 1 + Math.abs(servo.rotation.y)),
          Math.sign(servo.rotation.z) *
            (Math.PI / 1 + Math.abs(servo.rotation.z)),
        ]}
        scale={[scaleX, scaleY, scaleZ]}
        geometry={ServoMesh.geometry}
        material={ServoMesh.material}
      ></mesh>
    </group>
  );
};

export const WeaponShapes = function ({ weapon, weaponEditId }) {
  const editing = weapon.id === weaponEditId ? true : false;
  const size = Math.cbrt(weapon.SP());
  const useMaterial = editing ? selectMaterial : constructionMaterial; //weapon.material;
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
