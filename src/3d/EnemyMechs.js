import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import useStore from "../stores/store";
import BuildMech from "./BuildMech";
import { SCALE } from "../util/constants";

export default function EnemyMechs() {
  const { showLeaders, enemies } = useStore((state) => state);
  return enemies.map((enemy, i) => (
    <Enemy key={i} enemy={enemy} showLeaders={showLeaders} />
  ));
}

const position = new THREE.Vector3();
const direction = new THREE.Vector3();

const Enemy = React.memo(({ enemy, showLeaders }) => {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      //place enemy in correct position
      ref.current.position.copy(enemy.object3d.position);
      ref.current.rotation.copy(enemy.object3d.rotation);

      ref.current.getWorldPosition(position);
      ref.current.getWorldDirection(direction);
      enemy.ray.origin.copy(position);
      enemy.ray.direction.copy(direction);
      /*
      enemy.hitBox
        .copy(enemy.boxHelper.geometry.boundingBox)
        .applyMatrix4(enemy.boxHelper.matrixWorld);
        */
      enemy.hitBox.min.copy(position);
      enemy.hitBox.max.copy(position);
      enemy.hitBox.expandByScalar(enemy.size * 3);

      enemy.servoHitNames = [];
      enemy.shotsTesting.forEach((shot) => {
        //detect if shot is hitting any servo peices (or weapons on weapon mounts)
        const raycast = new THREE.Raycaster(
          shot.ray.origin,
          shot.ray.direction
        );

        const mesh = ref.current.children[0];
        const intersection = raycast.intersectObject(mesh, true);
        if (intersection.length > 0) {
          //console.log(intersection[0]);
          shot.object3d.position.copy(intersection[0].point);
          enemy.servoHitNames.push(intersection[0].object.name);
          enemy.shotsHit.push(shot);
        }
      });
    }
  });

  return (
    <group ref={ref} scale={SCALE} key={enemy.id}>
      <BuildMech
        mechBP={enemy.mechBP}
        servoHitNames={enemy.servoHitNames}
        drawDistanceLevel={enemy.drawDistanceLevel}
        showAxisLines={0}
        isLeader={enemy.id === enemy.groupLeaderGuid}
      />
      {showLeaders && enemy.id === enemy.groupLeaderGuid && (
        <mesh
          geometry={enemy.boxHelper.geometry}
          material={
            enemy.id === enemy.groupLeaderGuid
              ? enemy.greenMat
              : enemy.boxHelper.material
          }
        ></mesh>
      )}
    </group>
  );
});
/*

      
      */
