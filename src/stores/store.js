import create from "zustand";
import * as THREE from "three";

import { Curves } from "three/examples/jsm/curves/CurveExtras";
import { addEffect } from "@react-three/fiber";

//import * as audio from "./audio";
import { loopAI } from "../masterAI";

import { servoUtil } from "../util/equipUtil";
import { guid, initPlayerMechBP, initEnemyMechBP } from "../util/initEquipUtil";
import { distance, SCALE, FLIGHT, NUM_SCREEN_OPTIONS } from "../util/gameUtil";
import { setupFlock } from "../util/boidController";

let guidCounter = 1; //global unique ID

const seedrandom = require("seedrandom");
const systemScale = 3, //5,
  planetScale = 2; //8;

const numEnemies = 50;

const weaponFireSpeed = {
  beam: 200,
  proj: 40,
  missile: 20,
  eMelee: 0,
  melee: 0,
};

const playerStart = {
  x: 0,
  y: 15000 * SCALE * systemScale,
  z: -50000 * SCALE * systemScale,
};

//const [useStore, api] = create((set, get) => {
const [useStore] = create((set, get) => {
  //change curve and track to change where the space debrie and asteroids are located
  let curve = new Curves.GrannyKnot(); //GrannyKnot
  // Create a sine-like wave
  /*
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-10000 * SCALE * systemScale, 0, 0),
    new THREE.Vector3(
      -5000 * SCALE * systemScale,
      15000 * SCALE * systemScale,
      -5000
    ),
    new THREE.Vector3(
      5000 * SCALE * systemScale,
      -15000 * SCALE * systemScale,
      5000
    ),
    new THREE.Vector3(10000 * SCALE * systemScale, 0, 0)
  );
  */
  let track = new THREE.TubeBufferGeometry(curve, 128, 100 * SCALE, 8, false);
  //these used for weaponFire hits
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
    player: initPlayer(),
    playerMechBP: initPlayerMechBP(),
    playerScreen: FLIGHT,
    selectedTargetIndex: null,
    focusTargetIndex: null,
    weaponFireLightTimer: 0,
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
    enemyBoids: setupFlock(numEnemies),
    planets: initSolarSystem(seedrandom(0), systemScale, planetScale),
    stations: randomStations(seedrandom(0), 1),
    mutation: {
      t: 0,
      //position: new THREE.Vector3(),
      //startTime: Date.now(),

      track, //only used for placing random object, change this later

      //scale: 15,
      //fov: 70,//set directly in camera declaration
      playerHits: false,
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
        const { enemies, enemyBoids } = get();
        enemyBoids.forEach((boid, index) => {
          boid.position.copy(get().player.object3d.position);
        });

        const { mutation, actions } = get();
        //set({ camera });//set in App canvas
        //clock used in auto rotations
        mutation.clock.start();
        //actions.toggleSound(get().sound);

        //addEffect will add the following code to what gets run per frame
        //removes exploded emenies and rocks from store data, removes explosions once they have timed out
        addEffect(() => {
          if (get().playerScreen !== FLIGHT) return;

          const { player, weaponFireList, rocks, enemies, planets } = get();
          //run enemy AI routine
          loopAI(
            player,
            enemies,
            get().enemyBoids,
            get().mutation.clock,
            get().actions.shoot
          );

          const timeNow = Date.now();
          get().weaponFireList.forEach((weaponFire) => {
            //MISSILE FIRE course direction
            if (
              weaponFire.weaponData.weaponType === "missile" &&
              get().selectedTargetIndex !== null
            ) {
              const dummyObj = new THREE.Object3D(),
                targetQuat = new THREE.Quaternion();
              dummyObj.position.copy(weaponFire.object3d.position);
              dummyObj.lookAt(
                enemies[get().selectedTargetIndex].object3d.position
              );
              dummyObj.getWorldQuaternion(targetQuat);
              weaponFire.object3d.rotation.setFromQuaternion(
                weaponFire.object3d.quaternion.slerp(
                  targetQuat.normalize(),
                  0.2
                )
              ); // .rotateTowards for a static rotation value
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
          enemies.forEach((enemy) => {
            enemy.shotsHit = weaponFireList.filter((shot) =>
              actions.testBox(enemy, shot)
            );
            if (enemy.shotsHit.length > 0)
              set((state) => ({
                weaponFireList: state.weaponFireList.filter(
                  (shot) => !enemy.shotsHit.find((s) => s.id === shot.id)
                ),
              }));
            enemy.shotsHit = [];
          });
          // test for hits
          const r = rocks.filter(actions.test);
          const e = enemies.filter(actions.test);
          const a = r.concat(e);
          //If hit a new object play sound
          //edited out audio for now
          //const previous = mutation.playerHits;
          mutation.playerHits = a.length;
          //if (previous === 0 && mutation.playerHits) playAudio(audio.click);

          /* //OLD STUFF
          if (mutation.playerHits && weaponFireList.length) {
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
*/
          //if (a.some(data => data.distance < 15)) set(state => ({ health: state.health - 1 }))
        });
      },

      setFocusTargetIndex(focusTargetIndex) {
        set(() => ({ focusTargetIndex: focusTargetIndex }));
      },

      setSelectedTargetIndex() {
        //make work for enemies as well
        //set new target for current shooter

        //triggered onClick
        //select target, or cancel selection if clicked again
        let targetIndex = null;
        if (get().selectedTargetIndex !== get().focusTargetIndex) {
          targetIndex = get().focusTargetIndex;
        } else {
          //clearTimeout(shootTO);
          //shootTO = null;
          get().actions.cancelWeaponFire(get().playerMechBP[0]);
        }
        set(() => ({
          selectedTargetIndex: targetIndex,
        }));
        //if not currently shooting, begin shooting immediately
        //if (shootTO === null) get().actions.shoot(true); //true = auto aim
        if (targetIndex !== null)
          get().actions.shoot(
            get().playerMechBP[0],
            get().player,
            get().enemies[targetIndex],
            true //player autofire
          );
      },
      //shoot all mechs weapons
      shoot(mechBP, shooter, target, autoFire = false) {
        if (get().selectedTargetIndex === null && autoFire) return null;
        //for each weapon on the ship, find location and create a weaponFire to be shot from there
        Object.values(mechBP.weaponList).forEach((weapons) => {
          weapons.forEach((weapon) => {
            //set weapon to fireing mode
            weapon.active = 1;
            //shooter will hold target info - player, set variables - enemies, varaibles within the enemy array entry
            //if weapon not ready to fire do not shoot again at new target
            //will wait for the next shot to be ready before fires at new target
            if (weapon.ready) {
              //clear previous weapon autofire timer
              clearInterval(weapon.shootWeaponTO);
              //set weapon autofire timer
              const args = {
                mechBP: mechBP,
                shooter: shooter,
                target: target,
                autoFire: autoFire,
                weapon: weapon,
                team: 0,
              };
              get().actions.shootWeapon(args);
            }
          });
        });
        //if player play shooting sound
        //playAudio(audio.zap, 0.5);
      },
      shootWeapon({ mechBP, shooter, target, autoFire, weapon, team }) {
        //PREPARE FOR FIRING
        const { actions, enemies } = get();

        //weapon loaded
        weapon.ready = 1;

        //if weapon fire mode is false, stop firing - but weapon is still now loaded
        if (!weapon.active) return null;

        //if not autoFire (i.e. enemies) set weapon to inactive now
        //so when timer fires will only reload weapon and not shoot / set another timer
        if (!autoFire) weapon.active = false;

        //set timeout for reload / autofire (if active will automatically shoot again)
        const args = {
          mechBP: mechBP,
          shooter: shooter,
          target: target,
          autoFire: autoFire,
          weapon: weapon,
        };
        const reloadSpeed = weapon.burstValue()
          ? 1000 / weapon.burstValue()
          : 1000;
        //console.log(weapon.data);
        weapon.shootWeaponTO = setTimeout(
          () => actions.shootWeapon(args),
          reloadSpeed,
          args
        );

        //FIRE WEAPON IF APPROPRIATE
        //test for friendly fire of team mates
        if (actions.friendlyFireTest(shooter)) return null;

        //autofire angle of tolerance for shots to be fired
        let angleDiff = 0; //angleDiff set to 0 if not using

        const weaponFireObj = new THREE.Object3D();
        weaponFireObj.position.copy(shooter.object3d.position);

        //if a missile fire straight ahead
        if (weapon.data.weaponType === "missile") {
          weaponFireObj.rotation.copy(shooter.object3d.rotation);
        }
        //by default other weapon type fire out of front of ship toward enemies
        else {
          weaponFireObj.lookAt(target.object3d.position);
        }

        //autofire target provided, if not a missile, only fire if within certain angle in front of ship
        //if (autoFire && weapon.data.weaponType !== "missile") {
        if (weapon.data.weaponType !== "missile") {
          const weaponRotation = new THREE.Quaternion();
          weaponFireObj.getWorldQuaternion(weaponRotation);
          //optional setting z angle to match roll of ship
          weaponFireObj.rotation.set(
            weaponFireObj.rotation.x,
            weaponFireObj.rotation.y,
            get().player.object3d.rotation.z
          );
          weaponFireObj.getWorldQuaternion(weaponRotation);
          angleDiff = weaponRotation.angleTo(shooter.object3d.quaternion);
        }
        //dumb way of asking if not a player firing (dont shoot enemy missiles)
        else if (!autoFire) angleDiff = 1;

        //this sucks
        if (get().playerScreen !== FLIGHT) return null;

        //checking if angle is not within limit for player firing
        if (autoFire && angleDiff > 0.3) return null;
        //enemies having a hard time pointing at player
        //letting big ships shoot from any angle
        if (mechBP.scale < 4 && angleDiff > 0.5) return null;

        //FIRE WEAPON

        //weapon is now firing the bullet
        weapon.ready = 0;

        const fireSpeed = weaponFireSpeed[weapon.data.weaponType];

        const weaponFireOffsetZ = fireSpeed / 2;

        weapon.servoOffset = servoUtil.servoLocation(
          weapon.locationServoId,
          mechBP.servoList
        ).offset;

        weaponFireObj.translateX(
          (weapon.offset.x + weapon.servoOffset.x) * SCALE
        );
        weaponFireObj.translateY(
          (weapon.offset.y + weapon.servoOffset.y) * SCALE
        );
        weaponFireObj.translateZ(
          (weapon.offset.z + weapon.servoOffset.z + weaponFireOffsetZ) * SCALE
        );

        //ADD BULLET TO BULLET LIST
        let weaponFire = {
          //id: guid(weaponFireUpdate),
          id: guid(get().weaponFireList),
          shooterId: shooter.id,
          weaponData: weapon.data,
          range: weapon.range(),
          object3d: weaponFireObj,
          //targetIndex: get().selectedTargetIndex,
          time: Date.now(),
          firstFrameSpeed: JSON.parse(JSON.stringify(shooter.speed)),
          //offset: { x: 0, y: 0, z: 0 },
          velocity: fireSpeed + JSON.parse(JSON.stringify(shooter.speed)),
        };
        //add bullet to list
        set((state) => ({
          weaponFireList: [...state.weaponFireList, weaponFire],
          weaponFireLightTimer: Date.now(),
        }));
      },
      cancelWeaponFire(mechBP) {
        Object.values(mechBP.weaponList).forEach((weapons) => {
          weapons.forEach((weapon) => {
            weapon.active = false;
          });
        });
      },
      //
      removeWeaponFire() {
        //this was not working in a normal way
        //would remove most elements and I don't know why
        let updateWeaponFire = [];
        get().weaponFireList.forEach((weaponFire) => {
          if (Date.now() - weaponFire.time < 200 * weaponFire.range)
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
        box.min.copy(data.object3d.position);
        box.max.copy(data.object3d.position);
        box.expandByScalar(data.size * SCALE * 3000);
        data.hit.set(1000, 1000, 10000);
        const result = get().player.ray.intersectBox(box, data.hit);
        //data.distance = get().player.ray.origin.distanceTo(data.hit);
        return result;
      },

      friendlyFireTest(shooter) {
        const shooterTeam = get().enemies.filter(
          (enemy) => enemy.team === shooter.team
        );
        let hit = 0;
        shooterTeam.some((target) => {
          if (
            shooter.id !== target.id &&
            shooter.ray.intersectBox(target.hitBox, target.hit) !== null
          ) {
            hit = 1;
            return;
          }
        });

        return hit;
      },

      //
      testBox(target, shot) {
        return 0;
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
      setPlayerObject(obj) {
        set((state) => ({
          player: { ...state.player, object3d: obj },
        }));
      },
      //player ship speed up
      speedUp() {
        set((state) => ({
          player: {
            ...state.player,
            speed:
              state.player.speed < 0
                ? 0
                : state.player.speed < 5
                ? state.player.speed + 1
                : state.player.speed + 10,
          },
        }));
      },
      //player ship speed down
      speedDown() {
        set((state) => ({
          player: {
            ...state.player,
            speed:
              state.player.speed > 0
                ? 0
                : state.player.speed > -5
                ? state.player.speed - 1
                : state.player.speed - 10,
          },
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

function initPlayer() {
  let obj = new THREE.Object3D();
  obj.position.setX(playerStart.x);
  obj.position.setY(playerStart.y);
  obj.position.setZ(playerStart.z);
  return {
    team: 0,
    speed: 1,
    object3d: obj,
    ray: new THREE.Ray(),
    hitBox: new THREE.Box3(),
  }; //USED FOR RAY FROM SHIP for weaponFire hit detection };
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
    const object3d = new THREE.Object3D();
    object3d.position.copy(offset);
    return {
      guid: guidCounter++,
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
  let enemies = randomData(numEnemies, track, 5 * SCALE, 0, 1);

  enemies.forEach((enemy, index) => {
    /*
    enemy.object3d.position.set(
      (Math.random() * 100000 - 50000) * SCALE,
      (Math.random() * 100000 - 50000) * SCALE,
      10000 * SCALE
    );
    */
    enemy.id = guid(enemies);
    enemy.team = index < 40 ? 1 : 2;

    //enemy.groupLeaderGuid = 0;
    enemy.groupLeaderGuid = index < 10 ? enemies[0].guid : enemies[10].guid;

    enemy.groupId = 0;
    enemy.tacticOrder = 0; //0 = follow leader, 1 = attack player
    //enemy.prevAngleToTargetLocation = 0;
    //enemy.prevAngleToLeaderLocation = 0;
    enemy.formation = null;
    enemy.formationPosition = new THREE.Vector3();
    enemy.speed = 300 + Math.floor(Math.random() * 3);
    enemy.mechBP = initEnemyMechBP(
      //index === 0 ? 3 :
      index < numEnemies / 20 ? 1 : 0 //Math.floor(Math.random() * 2)
    );
    enemy.size = enemy.mechBP.size() * SCALE;
    enemy.drawDistanceLevel = 0;

    const box = new THREE.BoxGeometry(
      enemy.size * 3000,
      enemy.size * 3000,
      enemy.size * 3000
    );
    const yellow = new THREE.Color("yellow");
    const green = new THREE.Color("green");
    const mesh = new THREE.MeshStandardMaterial({
      color: yellow,
      emissive: yellow,
      emissiveIntensity: 1,
      wireframe: true,
    });
    enemy.boxHelper = new THREE.Mesh(box, mesh); //visible bounding box, geometry of which is used to calculate hit detection box
    enemy.boxHelper.geometry.computeBoundingBox();
    enemy.greenMat = new THREE.MeshStandardMaterial({
      color: green,
      emissive: green,
      emissiveIntensity: 1,
      wireframe: true,
    });

    enemy.ray = new THREE.Ray(); //USED FOR RAY FROM SHIP for testing friendly fire hit detection
    enemy.hitBox = new THREE.Box3(); //used with rays for hit detection
    enemy.hitBox.copy(enemy.boxHelper.geometry.boundingBox);
    enemy.shotsHit = []; //registers shots that have hit the mech, to remove shots from space
    // in the animation loop, compute the current bounding box with the world matrix
    //hitBox.applyMatrix4( enemy.boxHelper.matrixWorld );
  });

  //group enemies into squads
  enemies.forEach((enemy, i) => {
    //enemy with no group: make group leader and select all nearby enemies to join group
    if (!enemy.groupLeaderGuid) {
      enemies
        .filter(
          (e) =>
            distance(enemy.object3d.position, e.object3d.position) <
              200000 * SCALE && enemy.mechBP.scale >= e.mechBP.scale
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
