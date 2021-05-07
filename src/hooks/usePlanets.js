import * as THREE from "three";
import { SCALE } from "../util/gameUtil";

export function useSetPlanets(rng, systemScale = 1, planetScale = 1) {
  let numPlanets = Math.floor(rng() * 7) + 4;
  let temp = [];
  //create sun
  temp.push({
    type: "SUN",
    roughness: 0,
    metalness: 1,
    color: new THREE.Color(0xffffff),
    radius:
      (1000 + 10 * numPlanets) * SCALE * systemScale * planetScale * numPlanets,
    opacity: 1,
    textureMap: 0,
    transparent: false,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    /*
    Sun
    age: millions - billions
    mass: 
      low (average)
        13 jupiter = 1 sol

    types:
      cloud: hydrogen / helium
      few million years gererate yellow/red main sequense star last billions using almost all hydrogen
      rest of hyrdogen used star expands becomes red giant a few billion years
      helium flash occurs start pulsats becaomes smaller and bluer
      white dwarf
      

    */
  });

  //add moons around planets
  for (let i = 1; i <= numPlanets; i++) {
    const colors = [
      new THREE.Color(0x173f5f),
      new THREE.Color(0x173f5f),
      new THREE.Color(0x20639b),
      new THREE.Color(0x3caea3),
      new THREE.Color(0xf6d55c),
      new THREE.Color(0xed553b),
    ];
    const radius =
      SCALE *
      i *
      20 *
      (Math.floor(rng() * 5) + i * 2) *
      systemScale *
      planetScale;
    const a = 1 * systemScale;
    //const b = (getRandomInt(250) + 875) * SCALE * systemScale;
    const b = (Math.floor(rng() * 250) + 875) * SCALE * systemScale;
    const angle = 20 * i * systemScale;
    const x = (a + b * angle) * Math.cos(angle);
    const z = (a + b * angle) * Math.sin(angle);
    temp.push({
      type: "PLANET",
      roughness: 1,
      metalness: 0,
      //color: colors[getRandomInt(4) + 1],
      color: colors[Math.floor(rng() * 4) + 1],
      radius: radius,
      opacity: 1,
      textureMap: Math.floor(rng() * 6) + 1,
      transparent: false,
      position: { x, y: 0, z },
      rotation: { x: 0, y: 0, z: 0 },
    });
  }
  return temp;
}
