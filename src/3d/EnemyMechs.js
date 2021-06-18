import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import useStore from "../stores/store";
import BuildMech from "./BuildMech";
import { SCALE } from "../util/gameUtil";

export default function EnemyMechs() {
  const enemies = useStore((state) => state.enemies);
  return enemies.map((enemy, i) => <Enemy key={i} index={i} enemy={enemy} />);
}

const position = new THREE.Vector3();
const direction = new THREE.Vector3();

const Enemy = React.memo(({ enemy, index }) => {
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

      //testing
      /*
      if (index === 0) {
        ref.current.position.copy(
          new Vector3(0, 25000 * SCALE, 150000 * SCALE - 1)
        );
      }*/
    }
  });

  return (
    <group ref={ref} scale={SCALE} key={enemy.id}>
      <BuildMech
        mechBP={enemy.mechBP}
        drawDistanceLevel={enemy.drawDistanceLevel}
        showAxisLines={0}
        isLeader={enemy.id === enemy.groupLeaderGuid}
      />
      {enemy.id === enemy.groupLeaderGuid && (
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
