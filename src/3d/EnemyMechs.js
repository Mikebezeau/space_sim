import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useStore from "../stores/store";
import BuildMech from "./BuildMech";
import { SCALE } from "../util/gameUtil";

export default function EnemyMechs() {
  const enemies = useStore((state) => state.enemies);
  return enemies.map((enemy, i) => <Enemy key={i} index={i} enemy={enemy} />);
}

const Enemy = React.memo(({ enemy, index }) => {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      //place enemy in correct position
      ref.current.position.copy(enemy.object3d.position);
      ref.current.rotation.copy(enemy.object3d.rotation);

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
    <group ref={ref} scale={SCALE}>
      <group rotation={[0, Math.PI, 0]}>
        <BuildMech
          mechBP={enemy.mechBP}
          drawDistanceLevel={enemy.drawDistanceLevel}
        />
      </group>
    </group>
  );
});
