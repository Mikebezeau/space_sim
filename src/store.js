import * as THREE from "three";
import { Curves } from "three/examples/jsm/curves/CurveExtras";
import { addEffect } from "react-three-fiber";
import create from "zustand";
//import * as audio from "./audio";
import { distance, SCALE } from "./gameHelper";
import { useInitPlanets } from "./hooks/useSystemInit";

const seedrandom = require("seedrandom");

let guid = 1;

//const [useStore, api] = create((set, get) => {
const [useStore] = create((set, get) => {
  let spline = new Curves.GrannyKnot();
  let track = new THREE.TubeBufferGeometry(spline, 250, 0.15, 10, true);
  //let track = new THREE.Vector3(0, 0, 0);
  let cancelLaserTO = undefined;
  let cancelExplosionTO = undefined;
  const box = new THREE.Box3();

  return {
    sound: true,
    sytemScale: 3,
    camera: undefined,
    points: 0,
    health: 100,
    ship: initShip(),
    mainMenuCam: initMainMenuCam(),
    selectedStar: null,
    playerScreen: { mainMenu: 0, flight: 1, station: 0 },
    speed: 1,
    stationDock: { stationIndex: 0, portIndex: 0 },
    lasers: [],
    explosions: [],
    galaxyStarPositions: initGalaxyStarPositions(),
    rocks: randomData(120, track, 150, 8, () => 1 + Math.random() * 2.5),
    enemies: randomData(10, track, 20, 15, 1),
    planets: useInitPlanets(seedrandom(0), 2, 2),
    stations: [], //randomStations(seedrandom("?"), 1),
    mutation: {
      t: 0,
      position: new THREE.Vector3(),
      startTime: Date.now(),

      track,

      scale: 15,
      fov: 70,
      hits: false,
      rings: randomRings(30, track),
      particles: randomData(
        3000,
        track,
        50,
        1,
        () => 0.5 + Math.random() * 0.5
      ),
      looptime: 40 * 1000,
      binormal: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      clock: new THREE.Clock(false),
      mouse: new THREE.Vector2(0, 0),

      // Re-usable objects
      dummy: new THREE.Object3D(),
      ray: new THREE.Ray(), //THIS IS A RAY FROM SHIP
      box: new THREE.Box3(),
    },

    //------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------

    actions: {
      init(camera, scene) {
        const { mutation, actions } = get();

        set({ camera, scene });
        mutation.clock.start();
        //actions.toggleSound(get().sound);

        addEffect(() => {
          const { rocks, enemies } = get();

          const time = Date.now();
          const t = (mutation.t =
            ((time - mutation.startTime) % mutation.looptime) /
            mutation.looptime);
          mutation.position = track.parameters.path.getPointAt(t);
          mutation.position.multiplyScalar(mutation.scale);

          // test for wormhole/warp
          /*
          let warping = false;
          if (t > 0.3 && t < 0.4) {
            if (!warping) {
              warping = true;
              //playAudio(audio.warp);
            }
          } else if (t > 0.5) warping = false;
*/
          // test for hits
          const r = rocks.filter(actions.test);
          const e = enemies.filter(actions.test);
          const a = r.concat(e);
          //If hit a new object play sound
          //const previous = mutation.hits;
          mutation.hits = a.length;
          //if (previous === 0 && mutation.hits) playAudio(audio.click);
          const lasers = get().lasers;
          if (
            mutation.hits &&
            lasers.length &&
            time - lasers[lasers.length - 1] < 100
          ) {
            const updates = a.map((data) => ({ time: Date.now(), ...data }));
            set((state) => ({ explosions: [...state.explosions, ...updates] }));
            clearTimeout(cancelExplosionTO);
            cancelExplosionTO = setTimeout(
              () =>
                set((state) => ({
                  explosions: state.explosions.filter(
                    ({ time }) => Date.now() - time <= 1000
                  ),
                })),
              1000
            );
            set((state) => ({
              points: state.points + r.length * 100 + e.length * 200,
              rocks: state.rocks.filter(
                (rock) => !r.find((r) => r.guid === rock.guid)
              ),
              enemies: state.enemies.filter(
                (enemy) => !e.find((e) => e.guid === enemy.guid)
              ),
            }));
          }
          //if (a.some(data => data.distance < 15)) set(state => ({ health: state.health - 1 }))
        });
      },
      switchScreen() {
        set((state) => ({
          playerScreen: state.playerScreen.mainMenu
            ? { flight: 1 }
            : { mainMenu: 1 },
        }));
      },
      detectTargetStar() {
        //compare camera x,y position to stars x,y and determine which star is closest
        const positions = get().galaxyStarPositions;
        const mainMenuCam = get().mainMenuCam;
        let closest = 0;
        for (let i = 0; i < positions.length; i = i + 3) {
          if (
            distance(
              { x: positions[i], y: positions[i + 1], z: positions[i + 2] },
              {
                x: mainMenuCam.position.x,
                y: mainMenuCam.position.y,
                z: mainMenuCam.position.z,
              }
            ) <=
            distance(
              {
                x: positions[closest],
                y: positions[closest + 1],
                z: positions[closest + 2],
              },
              {
                x: mainMenuCam.position.x,
                y: mainMenuCam.position.y,
                z: mainMenuCam.position.z,
              }
            )
          )
            closest = i;
        }
        console.log("closest", closest);
        set(() => ({ selectedStar: closest }));
        set(() => ({ planets: useInitPlanets(seedrandom(closest), 2, 2) }));
      },
      shoot() {
        set((state) => ({ lasers: [...state.lasers, Date.now()] }));
        clearTimeout(cancelLaserTO);
        cancelLaserTO = setTimeout(
          () =>
            set((state) => ({
              lasers: state.lasers.filter((t) => Date.now() - t <= 1000),
            })),
          1000
        );
        //playAudio(audio.zap, 0.5);
      },
      speedUp() {
        set((state) => ({ speed: state.speed + 1 }));
      },
      speedDown() {
        set((state) => ({ speed: state.speed - 1 }));
      },
      stationDoc() {
        set((state) => ({
          stationDock: {
            isDocked: !state.stationDock.isDocked,
            stationIndex: 0,
            portIndex: 0,
          },
        }));
      },
      /*
      toggleSound(sound = !get().sound) {
        set({ sound });
        playAudio(audio.engine, 1, true);
        playAudio(audio.engine2, 0.3, true);
        playAudio(audio.bg, 1, true);
      },
      */
      updateMouse({ clientX: x, clientY: y }) {
        get().mutation.mouse.set(
          (x - window.innerWidth / 2) / window.innerWidth,
          (y - window.innerHeight / 2) / window.innerHeight
        );
      },
      updateMouseMobile(event) {
        //console.log(event.changedTouches[0].clientX);
        if (event) {
          var bounds = event.target.getBoundingClientRect();
          let x = event.changedTouches[0].clientX - bounds.left;
          let y = event.changedTouches[0].clientY - bounds.top;
          /*
        console.log(
          (x - bounds.width / 2) / bounds.width,
          (y - bounds.height / 2) / bounds.height,
          "bounds",
          bounds
        );
*/
          get().mutation.mouse.set(
            (x - bounds.width / 2) / bounds.width,
            (y - bounds.height / 2) / bounds.height
          );
        }
      },
      test(data) {
        box.min.copy(data.offset);
        box.max.copy(data.offset);
        box.expandByScalar(data.size * data.scale);
        data.hit.set(10000, 10000, 10000);
        const result = get().mutation.ray.intersectBox(box, data.hit);
        data.distance = get().mutation.ray.origin.distanceTo(data.hit);
        return result;
      },
    },
  };
});

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

function initGalaxyStarPositions(
  rng = seedrandom("galaxy_stars"),
  count = 100
) {
  const numArms = 4;
  const armSeparationDistance = (2 * Math.PI) / numArms;
  const armOffsetMax = 2;
  const rotationFactor = 3;
  const randomOffsetX = 0.03;
  const randomOffsetY = 0.02;

  let positions = [];
  for (let i = 0; i < count; i++) {
    // Choose a distance from the center of the galaxy.
    let distance = rng();
    distance = Math.pow(distance, 2);

    // Choose an angle between 0 and 2 * PI.
    let angle = rng() * 2 * Math.PI;
    let armOffset = rng() * armOffsetMax;
    armOffset = armOffset - armOffsetMax / 2;
    armOffset = armOffset * (1 / distance);

    let squaredArmOffset = Math.pow(armOffset, 2);
    if (armOffset < 0) squaredArmOffset = squaredArmOffset * -1;
    armOffset = squaredArmOffset;

    let rotation = distance * rotationFactor;

    angle =
      Math.floor(angle / armSeparationDistance) * armSeparationDistance +
      armOffset +
      rotation;

    // Convert polar coordinates to 2D cartesian coordinates.
    let starX = Math.cos(angle) * distance;
    let starY = Math.sin(angle) * distance;
    let starZ = 0;

    starX += rng() * randomOffsetX;
    starY += rng() * randomOffsetY;

    // Now we can assign coords.

    positions.push(starX);
    positions.push(starY);
    positions.push(starZ);
  }
  return new Float32Array(positions);
}

function initShip() {
  let ship = new THREE.Object3D();
  ship.position.setX(0);
  ship.position.setY(5000 * SCALE);
  ship.position.setZ(40000 * SCALE);
  //ship.rotateX(-Math.PI / 2);
  return ship;
}

function initMainMenuCam() {
  let mainMenuCam = new THREE.Object3D();
  mainMenuCam.position.setX(0);
  mainMenuCam.position.setY(-30 * SCALE);
  mainMenuCam.position.setZ(80 * SCALE);
  mainMenuCam.setRotationFromAxisAngle(new THREE.Vector3(), 0);
  return mainMenuCam;
}

function randomData(count, track, radius, size, scale) {
  return new Array(count).fill().map(() => {
    const t = Math.random();
    //new pos will be translateZ
    const pos = track.parameters.path.getPointAt(t);
    pos.multiplyScalar(15);
    //const pos = track.position;

    const offset = pos
      .clone()
      .add(
        new THREE.Vector3(
          -radius + Math.random() * radius * 2,
          -radius + Math.random() * radius * 2,
          -radius + Math.random() * radius * 2
        )
      );
    const speed = 0.1 + Math.random();
    return {
      guid: guid++,
      scale: typeof scale === "function" ? scale() : scale,
      size,
      offset,
      pos,
      speed,
      radius,
      t,
      hit: new THREE.Vector3(),
      distance: 1000,
    };
  });
}

function randomRings(count, track) {
  let temp = [];
  let t = 0.4;
  for (let i = 0; i < count; i++) {
    t += 0.003;
    const pos = track.parameters.path.getPointAt(t);
    pos.multiplyScalar(15);
    const segments = track.tangents.length;
    const pickt = t * segments;
    const pick = Math.floor(pickt);
    const lookAt = track.parameters.path
      .getPointAt((t + 1 / track.parameters.path.getLength()) % 1)
      .multiplyScalar(15);
    const matrix = new THREE.Matrix4().lookAt(
      pos,
      lookAt,
      track.binormals[pick]
    );
    temp.push([pos.toArray(), matrix]);
  }
  return temp;
}

function randomStations(rng, num) {
  let temp = [];
  //create sun
  temp.push({
    type: "EQUIPMENT",
    name: "X-22",
    roughness: 1,
    metalness: 5,
    color: "#ddd",
    size: 500 * SCALE,
    ports: [{ x: 0.5, y: 0.5, z: 0.5 }],
    position: { x: 0, y: 5000 * SCALE, z: 35000 * SCALE },
    rotation: { x: 0, y: 0, z: 0 },
  });
  return temp;
}

/*
//dirty function to try to make asteroids
function handleAddAsteroidRing(num) {
  //Any point (x,y) on the path of the circle is x = rsin(θ), y = rcos(θ)
  //angle 115, radius 12: (x,y) = (12*sin(115), 12*cos(115))
  for (let i = 0; i < num; i++) {
    const colors = ["#999", "#aaa", "#bbb", "#ccc", "#ddd"];
    const radius = SCALE * 2;
    const ringRadius = SCALE * 300;
    const angle = (360 / num) * i;
    const x = ringRadius * Math.sin(angle);
    const z = ringRadius * Math.cos(angle);
    //console.log("xz", x, z);
    //console.log("r s", ringRadius, Math.sin(angle));
    setPlanets((prev) => [
      ...prev,
      {
        name: "asteroid",
        roughness: 1,
        metalness: 1,
        color: colors[getRandomInt(6)],
        texture_map: null,
        radius: radius,
        opacity: 1,
        transparent: false,
        position: { x, y: 0, z },
        rotation: {
          x: getRandomInt(100) / 1000,
          y: getRandomInt(100) / 1000,
          z: getRandomInt(100) / 1000,
        }, //getRandomInt(100)/1000
      },
    ]);
  }
}
*/

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//   ___  _   _______ _____ _____
//  / _ \| | | |  _  \_   _|  _  |
// / /_\ \ | | | | | | | | | | | |
// |  _  | | | | | | | | | | | | |
// | | | | |_| | |/ / _| |_\ \_/ /
// \_| |_/\___/|___/  \___/ \___/
// http://patorjk.com/software/taag/
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

/*
function playAudio(audio, volume = 1, loop = false) {
  if (api.getState().sound) {
    audio.currentTime = 0;
    audio.volume = volume;
    audio.loop = loop;
    audio.play();
  } else audio.pause();
}
*/
export default useStore;
//export { audio, playAudio };

/*
SEED RANDOM
// Local PRNG: does not affect Math.random.
var seedrandom = require('seedrandom');
var rng = seedrandom('hello.');
console.log(rng());                  // Always 0.9282578795792454
 
// Global PRNG: set Math.random.
seedrandom('hello.', { global: true });
console.log(Math.random());          // Always 0.9282578795792454
 
// Autoseeded ARC4-based PRNG.
rng = seedrandom();
console.log(rng());                  // Reasonably unpredictable.
 
// Mixing accumulated entropy.
rng = seedrandom('added entropy.', { entropy: true });
console.log(rng());                  // As unpredictable as added entropy.
 
// Using alternate algorithms, as listed above.
var rng2 = seedrandom.xor4096('hello.')
console.log(rng2());
*/
