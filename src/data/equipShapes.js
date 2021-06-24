import React from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";
import { geoList } from "./shapeGeometry";
import { SCALE } from "../util/gameUtil";

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
      position: [0, 0, 0.5],
      rotation: [Math.PI / 2, 0, 0],
      geometry: geoList.cone,
    },
  ],
  proj: [
    {
      scale: [0.15, 0.7, 0.15],
      position: [0, 0, 0.35],
      rotation: [Math.PI / 2, 0, 0],
      geometry: geoList.cone,
    },
  ],
  missile: [
    {
      scale: [0.15, 0.2, 0.15],
      position: [0, 0, 0.1],
      rotation: [Math.PI / 2, 0, 0],
      geometry: geoList.cone,
    },
  ],
  eMelee: [
    {
      scale: [0.15, 1, 0.15],
      position: [0, 0, 0.5],
      rotation: [Math.PI / 2, 0, 0],
      geometry: geoList.cone,
    },
  ],
  melee: [
    {
      scale: [0.15, 1, 0.15],
      position: [0, 0, 0.5],
      rotation: [Math.PI / 2, 0, 0],
      geometry: geoList.cone,
    },
  ],
};

const constructionMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#666"),
  emissive: new THREE.Color("#666"),
  emissiveIntensity: 0.1,
});

const hitMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#006"),
  emissive: new THREE.Color("#006"),
  emissiveIntensity: 0.1,
});

const selectMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#669"),
  emissive: new THREE.Color("#669"),
  emissiveIntensity: 0.2,
});

const readoutMaterial_0 = new THREE.MeshBasicMaterial({
  color: new THREE.Color("#669"),
});

const readoutMaterial_25 = new THREE.MeshBasicMaterial({
  color: new THREE.Color("#966"),
});

const readoutMaterial_75 = new THREE.MeshBasicMaterial({
  color: new THREE.Color("#900"),
});

const readoutMaterial_100 = new THREE.MeshBasicMaterial({
  color: new THREE.Color("#000"),
});

export const ServoShapes = function ({
  name,
  damageReadoutMode = false,
  isHit,
  servo,
  drawDistanceLevel,
  servoEditId,
  //landingBay,
  landingBayServoLocationId,
  landingBayPosition,
  bmap,
}) {
  //constructionMaterial.bumpMap = bmap;
  //constructionMaterial.bumpScale = 0.3;
  //if (isHit !== undefined) console.log("hit");
  const editing = servo.id === servoEditId ? true : false;
  const size = servo.size();
  let readoutMaterial;
  if (damageReadoutMode) {
    const servoPercent =
      ((servo.structure() - servo.structureDamage) / servo.structure()) * 100;
    if (servoPercent < 0) {
      readoutMaterial = readoutMaterial_100;
    } else if (servoPercent < 25) {
      readoutMaterial = readoutMaterial_25;
    } else if (servoPercent < 75) {
      readoutMaterial = readoutMaterial_75;
    } else if (servoPercent < 100) {
      readoutMaterial = readoutMaterial_100;
    }
  }
  const useMaterial = damageReadoutMode
    ? readoutMaterial
    : editing
    ? selectMaterial
    : constructionMaterial; //servo.material;

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

  //if there is a simpler version of this shape created to be shown at further distance brackets, show that version instead of detailed version
  let servoGeometry = servoShapeData[servo.type][servo.shape].geometry[0]; /*
  servoGeometry = servoGeometry[drawDistanceLevel]
    ? servoGeometry[drawDistanceLevel]
    : servoGeometry[0];*/

  let ServoMesh = new THREE.Mesh(servoGeometry, useMaterial);

  //only draw landing bay if within a certain distance
  if (
    drawDistanceLevel === 0 &&
    !damageReadoutMode &&
    landingBayServoLocationId === servo.id
  ) {
    // shape to cut from servo shape
    const landingBayHole = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1));
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
    /*
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
*/
    // Add landingBayHoleForceField to ServoMesh
    //ServoMesh = CSG.union(ServoMesh, landingBayHoleForceField);
  }

  return (
    <group scale={size}>
      <mesh
        name={name}
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

export const WeaponShapes = function ({
  name,
  damageReadoutMode = false,
  isHit,
  weapon,
  weaponEditId,
}) {
  const editing = weapon.id === weaponEditId ? true : false;
  const size = Math.cbrt(weapon.SP());

  let readoutMaterial;
  if (damageReadoutMode) {
    const weaponPercent =
      ((weapon.structure - weapon.structureDamage) / weapon.structure) * 100;
    switch (weaponPercent) {
      case weaponPercent >= 100:
        readoutMaterial = readoutMaterial_100;
      case weaponPercent > 75:
        readoutMaterial = readoutMaterial_75;
      case weaponPercent > 25:
        readoutMaterial = readoutMaterial_25;
      default:
        readoutMaterial = readoutMaterial_0;
    }
  }

  const useMaterial = damageReadoutMode
    ? readoutMaterial
    : editing
    ? selectMaterial
    : constructionMaterial; //weapon.material;

  return (
    <group scale={[size, size, size]}>
      <mesh
        name={name}
        rotation={weaponShapeData[weapon.data.weaponType][0].rotation}
        position={weaponShapeData[weapon.data.weaponType][0].position}
        scale={weaponShapeData[weapon.data.weaponType][0].scale}
        geometry={weaponShapeData[weapon.data.weaponType][0].geometry[0]}
        material={useMaterial}
      ></mesh>
    </group>
  );
};
