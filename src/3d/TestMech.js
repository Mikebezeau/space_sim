import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import useStore from "../stores/store";
import useEquipStore from "../stores/equipStore";
import BuildMech from "./BuildMech";
import { SCALE } from "../util/gameUtil";

export default function TestMech() {
  const playerMechBP = useEquipStore((state) => state.playerMechBP); //for rendering ship servo shapes
  const ship = useStore((state) => state.ship);
  const ref = useRef();
  /*
ship.position.setX(0);
  ship.position.setY(25000 * SCALE * systemScale);
  ship.position.setZ(150000 * SCALE * systemScale);
  */
  /*
  useEffect(() => {
    console.log(ship.position, [0, 25000 * SCALE, 150000 * SCALE - 10]);
  }, []);
*/
  return (
    <group
      ref={ref}
      scale={SCALE}
      position={[0, 25000 * SCALE, 150000 * SCALE - 2]}
    >
      <group rotation={[0, Math.PI, 0]}>
        {/* place drone model here */}
        <BuildMech mechBP={playerMechBP[0]} />
      </group>
    </group>
  );
}
