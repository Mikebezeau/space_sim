import create from "zustand";
import * as THREE from "three";

import { Object3D, Vector3 } from "three";
import { Curves } from "three/examples/jsm/curves/CurveExtras";
import { addEffect } from "@react-three/fiber";

//import * as audio from "./audio";
import { loopAI } from "../masterAI";

import { mech } from "../util/equipUtil";
import { guid, initPlayerMechBP, initEnemyMechBP } from "../util/initEquipUtil";
import { distance, SCALE, FLIGHT, NUM_SCREEN_OPTIONS } from "../util/gameUtil";

const seedrandom = require("seedrandom");
const systemScale = 4, //5,
  planetScale = 1; //8;

let guidCounter = 1; //global unique ID

//const [useStore, api] = create((set, get) => {
const [useStore] = create((set, get) => {
  //change spline and track to change where the space debrie and asteroids are located
  let spline = new Curves.GrannyKnot();
  let track = new THREE.TubeBufferGeometry(spline, 250, 15 * SCALE, 10, true);
  //these used for weaponFire hits
  let cancelExplosionTO = undefined;
  let shootTO = null;
  const box = new THREE.Box3();

  //globally available variables
  return {
    sound: false,
    sytemScale: systemScale,
    //galaxy map
    menuCam: initCamMainMenu(),
    selectedStar: null,
    galaxyStarPositions: initGalaxyStarPositions(),
    //blueprint design
    blueprintCam: initCamMainMenu(),
    //flying
    camera: undefined,
    points: 0,
    health: 100,
    ship: initShip(),
    playerMechBP: initPlayerMechBP(),
    playerScreen: FLIGHT,
    selectedTargetIndex: null,
    focusTargetIndex: null,
    weaponFireLightTimer: 0,
    speed: 1,
    stationDock: { stationIndex: 0, portIndex: 0 },
    weaponFireList: [], //
    explosions: [],
    rocks: randomData(
      120,
      track,
      50 * SCALE,
      50 * SCALE,
      () => 1 + Math.random() * 2.5
    ),
    enemies: randomEnemies(track),
    planets: initSolarSystem(seedrandom(0), systemScale, planetScale),
    stations: randomStations(seedrandom(0), 1),
    mutation: {
      t: 0,
      //position: new THREE.Vector3(),
      //startTime: Date.now(),

      track, //only used for placing random object, change this later

      //scale: 15,
      //fov: 70,//set directly in camera declaration
      hits: false,
      //rings: randomRings(30, track),
      particles: randomData(
        3000,
        track,
        50,
        1000,
        () => 0.5 + Math.random() * 0.5
      ),
      //looptime: 40 * 1000,//don't need this
      //binormal: new THREE.Vector3(),//only used in track
      //normal: new THREE.Vector3(), //not used
      clock: new THREE.Clock(false), //used to make enemies rotate
      mouse: new THREE.Vector2(0, 0),

      // Re-usable objects
      dummy: new THREE.Object3D(),
      ray: new THREE.Ray(), //USED FOR RAY FROM SHIP for weaponFire hit detection
      box: new THREE.Box3(), //also used for ray hit detection
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
      init() {
        const { mutation, actions } = get();
        //set({ camera });//set in App canvas
        //clock used in auto rotations
        mutation.clock.start();
        //actions.toggleSound(get().sound);

        //addEffect will add the following code to what gets run per frame
        //removes exploded emenies and rocks from store data, removes explosions once they have timed out
        addEffect(() => {
          if (get().playerScreen !== FLIGHT) return;

          const { ship, weaponFireList, rocks, enemies, planets } = get();
          //run enemy AI routine
          loopAI(ship, enemies, get().mutation.clock);

          const timeNow = Date.now();

          if (shootTO === null && get().selectedTargetIndex !== null) {
            //if no enemy in that index will error
            //fire once per second
            shootTO = setTimeout(() => {
              //true: is auto-aiming
              get().actions.shoot(true);
              shootTO = null;
            }, 500);
          }

          get().weaponFireList.forEach((weaponFire) => {
            //MISSILE FIRE course direction
            if (
              weaponFire.weaponType === "missile" &&
              get().selectedTargetIndex !== null
            ) {
              const dummyObj = new THREE.Object3D(),
                flipRotation = new THREE.Quaternion(),
                targetQuat = new THREE.Quaternion();
              dummyObj.position.copy(weaponFire.object3d.position);
              dummyObj.lookAt(
                enemies[get().selectedTargetIndex].object3d.position
              );
              dummyObj.getWorldQuaternion(targetQuat);
              //flip the opposite direction
              flipRotation.setFromAxisAngle(
                new THREE.Vector3(0, 1, 0),
                Math.PI
              );
              targetQuat.multiplyQuaternions(targetQuat, flipRotation);

              weaponFire.object3d.rotation.setFromQuaternion(
                weaponFire.object3d.quaternion.slerp(
                  targetQuat.normalize(),
                  0.2
                )
              ); // .rotateTowards for a static rotation value
              //
              //weaponFire.object3d.rotation.setFromQuaternion(targetQuat);
            }
          });
          /*
          //interseting code for moving along a geometric path
          const t = (mutation.t =
            ((time - mutation.startTime) % mutation.looptime) /
            mutation.looptime);
          mutation.position = track.parameters.path.getPointAt(t);
          mutation.position.multiplyScalar(mutation.scale);
*/

          //THIS TAKES WAY TO LONG TO RUN ON LOAD UP
          // test for distance to planets and enemies, set drawDistanceLevel accordingly
          //drawDistanceLevel will be updated when an appropriate distance is reached to reduce quality of enemy render model
          /*
          planets.forEach((planet, index) => {
            const drawDistanceLevel = Math.floor(
              (distance(planet.position, ship.position) - planet.radius) /
                (25000 * SCALE)
            );

            if (
              planet.drawDistanceLevel !== drawDistanceLevel &&
              drawDistanceLevel < 2
            ) {
              

              set((state) => ({
                planets: state.planets.map((p, i) =>
                  i === index
                    ? { ...p, drawDistanceLevel: drawDistanceLevel }
                    : p
                ),
              }));
            }
          });
*/
          //drawDistanceLevel will be updated when an appropriate distance is reached to reduce quality of enemy render model
          /*
          enemies.forEach((enemy, index) => {
            const drawDistanceLevel =
              distance(enemy.object3d.position, ship.position) < 300000 * SCALE
                ? 0
                : 1;

            if (enemy.drawDistanceLevel !== drawDistanceLevel) {
              set((state) => ({
                enemies: state.enemies.map((e, i) =>
                  i === index
                    ? { ...e, drawDistanceLevel: drawDistanceLevel }
                    : e
                ),
              }));
            }
          });
*/
          // test for hits
          const r = rocks.filter(actions.test);
          const e = enemies.filter(actions.test);
          const a = r.concat(e);
          //If hit a new object play sound
          //edited out audio for now
          //const previous = mutation.hits;
          mutation.hits = a.length;
          //if (previous === 0 && mutation.hits) playAudio(audio.click);
          if (mutation.hits && weaponFireList.length) {
            const updates = a.map((data) => ({ time: timeNow, ...data }));
            set((state) => ({ explosions: [...state.explosions, ...updates] }));
            clearTimeout(cancelExplosionTO);
            cancelExplosionTO = setTimeout(
              () =>
                set((state) => ({
                  explosions: state.explosions.filter(
                    ({ time }) => timeNow - time <= 1000
                  ),
                })),
              1000
            );
            set((state) => ({
              //points: state.points + r.length * 100 + e.length * 200,
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

      setFocusTargetIndex(focusTargetIndex) {
        set(() => ({ focusTargetIndex: focusTargetIndex }));
      },
      setSelectedTargetIndex() {
        //triggered onClick
        //select target, or cancel selection if clicked again
        let targetIndex = null;
        if (get().selectedTargetIndex !== get().focusTargetIndex) {
          targetIndex = get().focusTargetIndex;
        } else {
          clearTimeout(shootTO);
          shootTO = null;
        }
        set(() => ({
          selectedTargetIndex: targetIndex,
        }));
        //if not currently shooting, begin shooting immediately
        if (shootTO === null) get().actions.shoot(true); //true = auto aim
        //console.log(get().selectedTargetIndex);
      },
      //player ship shoot weapons
      shoot(autoAim = false) {
        if (get().selectedTargetIndex === null && autoAim) return null;
        //testing automated shooting
        const weaponListWithServoOffset = mech.WeaponListWithServoOffset(
          get().playerMechBP[0].servoList,
          get().playerMechBP[0].weaponList
        );
        let weaponFireUpdate = get().weaponFireList;
        let angleDiff = 0;

        //for each weapon on the ship, find location and create a weaponFire to be shot from there
        weaponListWithServoOffset.forEach((weapon) => {
          const weaponFireObj = new Object3D();
          weaponFireObj.position.copy(get().ship.position);
          //autofire target provided, get rotation direction towards target
          if (autoAim && weapon.data.weaponType !== "missile") {
            weaponFireObj.lookAt(
              get().enemies[get().selectedTargetIndex].object3d.position
            );

            const weaponRotation = new THREE.Quaternion(),
              flipRotation = new THREE.Quaternion();
            weaponFireObj.getWorldQuaternion(weaponRotation);
            //flip the opposite direction
            flipRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
            weaponRotation.multiplyQuaternions(weaponRotation, flipRotation);
            //
            weaponFireObj.rotation.setFromQuaternion(weaponRotation);
            //optional setting z angle to match roll of ship
            weaponFireObj.rotation.set(
              weaponFireObj.rotation.x,
              weaponFireObj.rotation.y,
              get().ship.rotation.z
            );
            weaponFireObj.getWorldQuaternion(weaponRotation);
            //only fire if within certain angle, missile will always fire straight and then follow target as it flies
            //const shipRotation = new THREE.Quaternion();
            //get().ship.getWorldQuaternion(shipRotation);
            angleDiff = weaponRotation.angleTo(get().ship.quaternion);
            //console.log(angleDiff);
            //weaponFireObj.rotation
          }
          //fire straight ahead
          else {
            angleDiff = 0;
            weaponFireObj.rotation.copy(get().ship.rotation);
          }

          if (angleDiff > 0.15) return null;

          let weaponFireSpeed = 0;
          let weaponFireOffsetZ = 0;
          switch (weapon.data.weaponType) {
            case "beam":
              weaponFireSpeed = -200;
              weaponFireOffsetZ = -100;
              break;
            case "proj":
              weaponFireSpeed = -40;
              weaponFireOffsetZ = -25;
              break;
            case "missile":
              weaponFireSpeed = -20;
              weaponFireOffsetZ = -2;
              break;
            default:
              console.log("invalid weapon type");
          }

          weaponFireObj.translateX(
            (weapon.offset.x + weapon.servoOffset.x) * SCALE
          );
          weaponFireObj.translateY(
            (weapon.offset.y + weapon.servoOffset.y) * SCALE
          );

          weaponFireObj.translateZ(
            (weapon.offset.z + weapon.servoOffset.z + weaponFireOffsetZ) * SCALE
          );

          let weaponFire = {
            id: guid(weaponFireUpdate),
            weaponType: weapon.data.weaponType,
            object3d: weaponFireObj,
            time: Date.now(),
            firstFrameSpeed: -JSON.parse(JSON.stringify(get().speed)),
            offset: { x: 0, y: 0, z: 0 },
            velocity: weaponFireSpeed - JSON.parse(JSON.stringify(get().speed)),
          };
          weaponFireUpdate.push(weaponFire);
        });
        //console.log(weaponFireUpdate);
        set((state) => ({
          weaponFireList: weaponFireUpdate,
          weaponFireLightTimer: Date.now(),
        }));
        //playAudio(audio.zap, 0.5);
      },
      //
      removeWeaponFire() {
        //this was not working in a normal way
        //would remove most elements and I don't know why
        let updateWeaponFire = [];
        get().weaponFireList.forEach((weaponFire) => {
          if (Date.now() - weaponFire.time < 1000)
            updateWeaponFire.push(weaponFire);
        });
        set((state) => ({
          weaponFireList: updateWeaponFire,
          //weaponFireList: weaponFireList.filter((weaponFire) => Date.now() - weaponFire.time <= 1000),
        }));
        //console.log(get().weaponFireList.length);
      },

      //testing for weaponFire hits using ray (ray from spaceship)
      test(data) {
        //will have to check ray for each shot fired in weaponFireList
        box.min.copy(data.object3d.position);
        box.max.copy(data.object3d.position);
        box.expandByScalar(data.size * SCALE * 10);
        data.hit.set(1000, 1000, 10000);
        const result = get().mutation.ray.intersectBox(box, data.hit);
        data.distance = get().mutation.ray.origin.distanceTo(data.hit);
        return result;
      },

      setEnemyBP(index, mechBP) {
        let enemies = get().enemies;
        enemies[index].mechBP = mechBP;
        set((state) => ({
          enemies: enemies,
        }));
      },

      //changing player screen (main menu, flight)
      switchScreen() {
        //console.log("playerScreen", get().playerScreen, NUM_SCREEN_OPTIONS);
        set((state) => ({
          playerScreen:
            state.playerScreen + 1 > NUM_SCREEN_OPTIONS
              ? 1
              : state.playerScreen + 1,
        }));
      },
      //main menu slecting star in galaxy map
      detectTargetStar() {
        //compare camera x,y position to stars x,y and determine which star is closest
        const positions = get().galaxyStarPositions;
        const menuCam = get().menuCam;
        let closest = 0;
        for (let i = 0; i < positions.length; i = i + 3) {
          if (
            distance(
              { x: positions[i], y: positions[i + 1], z: positions[i + 2] },
              {
                x: menuCam.position.x,
                y: menuCam.position.y,
                z: menuCam.position.z,
              }
            ) <=
            distance(
              {
                x: positions[closest],
                y: positions[closest + 1],
                z: positions[closest + 2],
              },
              {
                x: menuCam.position.x,
                y: menuCam.position.y,
                z: menuCam.position.z,
              }
            )
          )
            closest = i;
        }
        set(() => ({ selectedStar: closest }));
        set(() => ({
          planets: initSolarSystem(
            seedrandom(closest),
            systemScale,
            planetScale
          ),
        }));
      },

      //player ship
      setShipPosition(position) {
        set((state) => ({
          ship: { ...state.ship, position: position },
        }));
      },
      //player ship speed up
      speedUp() {
        set((state) => ({
          speed:
            state.speed < 0
              ? 0
              : state.speed < 5
              ? state.speed + 1
              : state.speed + 10,
        }));
      },
      //player ship speed down
      speedDown() {
        set((state) => ({
          speed:
            state.speed > 0
              ? 0
              : state.speed > -5
              ? state.speed - 1
              : state.speed - 10,
        }));
      },
      //dock at spacestation
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
      //save mouse position (-1 to 1) based on location on screen
      updateMouse({ clientX: x, clientY: y }) {
        get().mutation.mouse.set(
          (x - window.innerWidth / 2) / window.innerWidth,
          (y - window.innerHeight / 2) / window.innerHeight
        );
      },
      //save screen touch position (-1 to 1) relative to touch movement control
      updateMouseMobile(event) {
        if (event) {
          var bounds = event.target.getBoundingClientRect();
          let x = event.changedTouches[0].clientX - bounds.left;
          let y = event.changedTouches[0].clientY - bounds.top;

          get().mutation.mouse.set(
            (x - bounds.width / 2) / bounds.width,
            (y - bounds.height / 2) / bounds.height
          );
        }
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

//creating galaxy like the milky way
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

    //placae positions in array
    positions.push(starX);
    positions.push(starY);
    positions.push(starZ);
  }
  return new Float32Array(positions);
}

function initShip() {
  let ship = new THREE.Object3D();
  ship.position.setX(0);
  ship.position.setY(25000 * SCALE * systemScale);
  ship.position.setZ(150000 * SCALE * systemScale);
  return ship;
}
//set camera to view galaxy in main menu
function initCamMainMenu() {
  let cam = new THREE.Object3D();
  cam.position.setX(0);
  cam.position.setY(0);
  cam.position.setZ(0);
  cam.setRotationFromAxisAngle(new THREE.Vector3(), 0);
  return cam;
}

//used to create space dedrie and asteroids
function randomData(count, track, radius, size, randomScale) {
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
    //get rid of offset completely
    const object3d = new Object3D();
    object3d.position.copy(offset);
    return {
      guid: guidCounter++,
      groupLeaderGuid: 0,
      groupId: 0,
      scale: typeof randomScale === "function" ? randomScale() : randomScale,
      size,
      offset,
      object3d,
      pos,
      speed: 0,
      radius,
      t,
      hit: new THREE.Vector3(),
      distance: 1000,
    };
  });
}

function randomEnemies(track) {
  let enemies = randomData(20, track, 5 * SCALE, 0, 1);
  enemies.forEach((enemy, index) => {
    enemy.groupLeaderGuid = 0;
    enemy.formation = null;
    enemy.formationPosition = new Vector3();
    enemy.speed = 3 + Math.floor(Math.random() * 3);
    enemy.mechBP = initEnemyMechBP(
      index === 0 ? 3 : Math.floor(Math.random() * 2)
    );
    enemy.size = enemy.mechBP.size() * SCALE;
    enemy.drawDistanceLevel = 0;
  });

  //group enemies into squads
  enemies.forEach((enemy, i) => {
    //enemy with no group: make group leader and select all nearby enemies to join group
    if (!enemy.groupLeaderGuid) {
      enemies
        .filter(
          (e) =>
            distance(enemy.object3d.position, e.object3d.position) <
            200000 * SCALE
        )
        .forEach((eGroup) => {
          //this will apply to leader as well as all those nearby
          eGroup.groupLeaderGuid = enemy.guid;
          //console.log(eGroup.groupLeaderGuid);
        });
    }
  });
  return enemies;
}

function randomStations(rng, num) {
  let temp = [];
  //create station
  temp.push({
    type: "EQUIPMENT",
    name: "X-22",
    roughness: 1,
    metalness: 5,
    //color: new THREE.Color("rgb(255, 0, 0)"),//THREE.Color used for effects
    size: 500 * SCALE,
    ports: [{ x: 0.5, y: 0.5, z: 0.5 }],
    position: {
      x: 0,
      y: 25000 * SCALE * systemScale,
      z: 145000 * SCALE * systemScale,
    },

    rotation: { x: 0, y: 0.5, z: 0 },

    material: new THREE.MeshPhongMaterial({
      color: 0x222222,
      emissive: 0x222222,
      emissiveIntensity: 0.01,
      //roughness: station.roughness,
      //metalness: station.metalness,
    }),
  });
  return temp;
}

function initSolarSystem(rng, systemScale = 1, planetScale = 1) {
  let numPlanets = Math.floor(rng() * 7) + 4;
  let temp = [];
  //create sun
  temp.push({
    type: "SUN",
    roughness: 0,
    metalness: 1,
    color: new THREE.Color(0xffffff),
    radius: (600 + 10 * numPlanets) * SCALE * planetScale * numPlanets,
    opacity: 1,
    textureMap: 0,
    drawDistanceLevel: 10,
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
      SCALE * i * 20 * (Math.floor(rng() * 5) + i * 2) * planetScale;
    const a = 1 * systemScale;
    //const b = (Math.floor(rng() * 250) + 875) * SCALE * systemScale;
    const b = Math.floor(rng() * 500) * SCALE * systemScale;
    const angle = 20 * i * systemScale;
    const x = (a + b * angle) * Math.cos(angle) + temp[0].radius / 3;
    const z = (a + b * angle) * Math.sin(angle) + temp[0].radius / 3;
    temp.push({
      type: "PLANET",
      roughness: 1,
      metalness: 0,
      //color: colors[getRandomInt(4) + 1],
      color: colors[Math.floor(rng() * 4) + 1],
      radius: radius,
      opacity: 1,
      drawDistanceLevel: 0,
      textureMap: Math.floor(rng() * 6) + 1,
      transparent: false,
      position: { x, y: 0, z },
      rotation: { x: 0, y: 0, z: 0 },
    });
    console.log(x, z);
  }
  return temp;
}

/*
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
*/

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
