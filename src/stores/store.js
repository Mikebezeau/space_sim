import create from "zustand";
import * as THREE from "three";

import Terrain from "../terrainGen/terrainGen";
import GenerateCity from "../terrainGen/cityGen";

import { Curves } from "three/examples/jsm/curves/CurveExtras";
import { addEffect } from "@react-three/fiber";

//import * as audio from "./audio";
import { loopAI } from "../masterAI";

import { servoUtil } from "../util/mechServoUtil";
import {
  guid,
  initPlayerMechBP,
  initStationBP,
  initEnemyMechBP,
} from "../util/initEquipUtil";
import { getRandomArbitrary, distance } from "../util/gameUtil";
import {
  SCALE,
  SCALE_PLANET_WALK,
  FLIGHT,
  GALAXY_MAP,
  EQUIPMENT_SCREEN,
  CONTROLS_UNATTENDED,
  CONTROLS_PILOT_COMBAT,
  CONTROLS_PILOT_SCAN,
} from "../util/constants";

import { setupFlock } from "../util/boidController";

import StarSystem from "../starSysGen/StarSystem"; //ACCRETE

let guidCounter = 1; //global unique ID
let explosionGuidCounter = 1; //global unique ID

const seedrandom = require("seedrandom");
const starsInGalaxy = 15000;
const systemScale = 200, //,
  planetScale = 0.05; //;

const numEnemies = 0;

const weaponFireSpeed = {
  beam: 100,
  proj: 40,
  missile: 20,
  eMelee: 0,
  melee: 0,
};

const playerStart = {
  system: 345,
  mechBPindex: 0,
  x: 0,
  y: 1, //300000 * SCALE * planetScale, //15000
  z: -3, //-50000 * SCALE * planetScale,
};

let cancelExplosionTO = undefined;

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
    //testing
    toggleTestControls: false,
    showLeaders: false,
    galaxyMapDataOutput: "",
    boidMod: {
      boidMinRangeMod: 0,
      boidNeighborRangeMod: 0,
      boidSeparationMod: 0,
      boidAlignmentMod: 0,
      boidCohesionMod: 0,
      boidCenteringMod: 0,
    },
    //
    camera: undefined,
    sound: false,
    systemScale: systemScale,
    planetScale: planetScale,
    //galaxy map
    menuCam: initCamMainMenu(),
    currentStar: playerStart.system,
    selectedStar: null,
    galaxyStarPositions: initGalaxyStarPositions(),
    galaxyMapZoom: 0,
    //blueprint design
    blueprintCam: initCamMainMenu(),
    playerScreen: FLIGHT,
    playerControlMode: CONTROLS_PILOT_COMBAT, //CONTROLS_PILOT_SCAN,
    displayContextMenu: false, //right click menu
    contextMenuPos: { x: 0, y: 0 },
    //flying
    player: initPlayer(),
    playerMechBP: initPlayerMechBP(),
    selectedTargetIndex: null,
    focusPlanetIndex: null,
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
    planets: initSolarSystem(
      seedrandom(playerStart.system),
      systemScale,
      planetScale
    ),
    stations: randomStations(seedrandom(playerStart.system), 1),
    terrain: initTerrain(2, 2), //undefined//initTerrain(get().player.locationInfo),
    city: GenerateCity(),
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

    testing: {
      toggleTestControls() {
        set((state) => ({
          toggleTestControls: !state.toggleTestControls,
        }));
      },
      mapGalaxy() {
        const positions = get().galaxyStarPositions;
        let galaxyMapData = [];
        for (let i = 0; i < positions.length; i = i + 3) {
          const systemSeed = i;
          const planets = initSolarSystem(seedrandom(systemSeed), 1, 1, true);
          let hasTerrestrial = false;
          planets.forEach((planet) => {
            if (planet.data.type === "Terrestrial") hasTerrestrial = true;
            if (hasTerrestrial) {
              const systemData = {
                position: [positions[i], positions[i + 1], positions[i + 2]],
                hasTerran: true,
                breathable: planet.data.breathable,
              };
              galaxyMapData.push(systemData);
            }
          });
        }
        console.log(
          galaxyMapData.find((systemData) => systemData.breathable === "YES")
        );
        set(() => ({
          galaxyMapDataOutput: JSON.stringify(galaxyMapData),
        }));
      },
      summonEnemy() {
        let enemies = get().enemies;
        let playerPos = get().player.object3d.position;
        enemies.forEach((enemie) => {
          enemie.object3d.position.setX(playerPos.x);
          enemie.object3d.position.setY(playerPos.y);
          enemie.object3d.position.setZ(playerPos.z);
          enemie.object3d.translateZ(-2000 * SCALE);
        });
        set(() => ({ enemies: enemies }));
      },
      showLeaders() {
        set((state) => ({
          showLeaders: !state.showLeaders,
        }));
      },
      changeLocationSpace() {
        //set player location
        let locationInfo = get().player.locationInfo;
        locationInfo.isInSpace = 1;
        locationInfo.isLandedPlanet = 0;
        set((state) => ({
          player: { ...state.player, locationInfo: locationInfo },
        }));
      },
      changeLocationPlanet() {
        //set player location
        let locationInfo = get().player.locationInfo;
        locationInfo.isInSpace = 0;
        locationInfo.isLandedPlanet = 1;
        set((state) => ({
          player: { ...state.player, locationInfo: locationInfo },
        }));
      },
      warpToPlanet() {
        let player = get().player;
        if (get().focusPlanetIndex) {
          const targetPlanet = get().planets[get().focusPlanetIndex];
          player.object3d.position.copy(targetPlanet.object3d.position);
          player.object3d.translateZ(-targetPlanet.radius * 5);
          set(() => ({ player: player }));
        }
      },
      setBoidMod(prop, val) {
        set((state) => ({
          boidMod: { ...state.boidMod, [prop]: val },
        }));
      },
    },

    actions: {
      init() {
        const { mutation, actions } = get();
        //set({ camera });//set in App canvas
        //clock used in auto rotations
        mutation.clock.start();
        //actions.toggleSound(get().sound);

        //set player mech info
        actions.initPlayerMech(playerStart.mechBPindex);

        //addEffect will add the following code to what gets run per frame
        //removes exploded emenies and rocks from store data, removes explosions once they have timed out
        addEffect(() => {
          const {
            player,
            playerScreen,
            selectedTargetIndex,
            playerMechBP,
            weaponFireList,
            rocks,
            enemies,
            enemyBoids,
            planets,
            mutation,
            actions,
          } = get();

          if (playerScreen !== FLIGHT) return;

          //run enemy AI routine
          //find enemies in area of player
          const localEnemies = enemies;
          loopAI(
            player,
            localEnemies,
            enemyBoids,
            mutation.clock,
            actions.shoot
          );

          const timeNow = Date.now();
          get().weaponFireList.forEach((weaponFire) => {
            //MISSILE FIRE course direction
            if (
              weaponFire.weapon.data.weaponType === "missile" &&
              selectedTargetIndex !== null
            ) {
              const dummyObj = new THREE.Object3D(),
                targetQuat = new THREE.Quaternion();
              dummyObj.position.copy(weaponFire.object3d.position);
              dummyObj.lookAt(enemies[selectedTargetIndex].object3d.position);
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

          let newExplosions = [];
          let weaponFireUpdate = get().weaponFireList;
          //ENEMIES
          enemies.forEach((enemy) => {
            enemy.shotsTesting = weaponFireList.filter((shot) =>
              actions.testBox(enemy, shot)
            );

            if (enemy.shotsHit.length > 0) {
              //set explosion at shots location
              newExplosions = newExplosions.concat(
                enemy.shotsHit.map((data) => ({
                  ...data,
                  time: timeNow,
                  id: explosionGuidCounter++,
                }))
              );
              //remove shots that hit target
              weaponFireUpdate = weaponFireUpdate.filter(
                (weaponFire) =>
                  !enemy.shotsHit.find((s) => s.id === weaponFire.id)
              );
              enemy.shotsHit = [];
            }
          });

          //PLAYER *** DUPLICATED FROM ENEMIES TEST - FIX
          player.shotsTesting = weaponFireList.filter((shot) =>
            actions.testBox(player, shot)
          );
          if (player.shotsHit.length > 0) {
            //set explosion at shots location
            newExplosions = newExplosions.concat(
              player.shotsHit.map((data) => ({
                ...data,
                time: timeNow,
                id: explosionGuidCounter++,
              }))
            );
            //remove shots that hit target
            weaponFireUpdate = weaponFireUpdate.filter(
              (weaponFire) =>
                !player.shotsHit.find((s) => s.id === weaponFire.id)
            );

            //apply damage to servos
            player.shotsHit.forEach((shotHit) => {
              const shieldRemaining =
                player.shield.max - player.shield.damage > 0
                  ? player.shield.max - player.shield.damage
                  : 0;
              const damageThroughShield =
                shotHit.weapon.damage() - shieldRemaining > 0
                  ? shotHit.weapon.damage() - shieldRemaining
                  : 0;
              //const hitLocation = shotHit.servoHitName.split("_");
              //const hitServoOrWeapon = hitLocation[1];
              //if(hitServoOrWeapon==='servo')
              const servoHit = playerMechBP[
                player.currentMechBPindex
              ].getServoById(parseInt(shotHit.servoHitName));

              servoHit.structureDamage =
                servoHit.structureDamage + damageThroughShield;

              player.shield.damage =
                player.shield.damage + shotHit.weapon.damage();
            });
            player.shotsHit = [];
          }
          //heal player shield
          if (player.shield.damage > player.shield.max)
            player.shield.damage = player.shield.max;
          else if (player.shield.damage > 0) {
            player.shield.damage = player.shield.damage - 0.5;
            if (player.shield.damage < 0) player.shield.damage = 0;
          }

          //remove shots
          set((state) => ({
            weaponFireList: weaponFireUpdate,
          }));
          //remove old explosions
          let explosionRemaining = get().explosions.filter(
            (explosion) => timeNow - explosion.time < 500
          );
          let explosionUpdate = explosionRemaining.concat(newExplosions);
          //update explosions
          set((state) => ({
            explosions: explosionUpdate,
          }));
          if (explosionUpdate.length === 0) explosionGuidCounter = 0;
          //remove old timed out weaponfire
          actions.removeWeaponFire();

          // test if player is pointing at targets (used for changing the crosshairs)
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

      initPlayerMech(playerMechBPindex) {
        const { player, playerMechBP } = get();
        player.currentMechBPindex = playerMechBPindex;
        console.log(
          "initPlayerMech: playerCurrentMechBPindex",
          player.currentMechBPindex
        );
        player.size = playerMechBP[player.currentMechBPindex].size() * SCALE;
        //const playerObj = player.object3d;
        //playerObj.position.setZ(-15000 * SCALE - get().planets[0].radius);
        //console.log(playerObj.position.z, -get().planets[0].radius);
        //get().actions.setPlayerObject(playerObj);

        //set player hitbox size
        const box = new THREE.BoxGeometry(
          player.size * 5000,
          player.size * 5000,
          player.size * 5000
        );
        const yellow = new THREE.Color("yellow");
        const mesh = new THREE.MeshStandardMaterial({
          color: yellow,
          emissive: yellow,
          emissiveIntensity: 1,
          wireframe: true,
        });
        player.boxHelper = new THREE.Mesh(box, mesh); //visible bounding box, geometry of which is used to calculate hit detection box
        player.boxHelper.geometry.computeBoundingBox();
        player.hitBox.copy(player.boxHelper.geometry.boundingBox);
      },

      activateContextMenu(xPos, yPos) {
        //if options up arleady, hide menu
        set((state) => ({ displayContextMenu: !state.displayContextMenu }));
        set(() => ({ contextMenuPos: { x: xPos, y: yPos } }));
      },
      contextMenuSelect(selectVal) {
        /*player selection of control options:
        CONTROLS_UNATTENDED = 1,
        CONTROLS_PILOT_COMBAT = 2,
        CONTROLS_PILOT_SCAN = 3
        */
        set(() => ({ playerControlMode: selectVal }));
        //hide menu
        set(() => ({ displayContextMenu: false }));
      },
      galaxyMapZoomIn() {
        set((state) => ({
          galaxyMapZoom:
            state.galaxyMapZoom < 6
              ? state.galaxyMapZoom + 1
              : state.galaxyMapZoom,
        }));
      },
      galaxyMapZoomOut() {
        set((state) => ({ galaxyMapZoom: state.galaxyMapZoom - 1 }));
      },
      setFocusPlanetIndex(focusPlanetIndex) {
        set(() => ({ focusPlanetIndex: focusPlanetIndex }));
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

        get().actions.shoot(
          get().playerMechBP[0],
          get().player,
          targetIndex === null ? null : get().enemies[targetIndex],
          targetIndex === null ? false : true, // true //player autofire
          false, // auto aim
          true // isPlayer
        );
      },
      //shoot each weapon if ready
      shoot(
        mechBP,
        shooter,
        target,
        autoFire = false,
        autoAim = true,
        isPlayer = false
      ) {
        if (get().selectedTargetIndex === null && autoFire && autoAim) {
          return null;
        }
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
                autoAim: autoAim,
                isPlayer: isPlayer,
              };
              get().actions.shootWeapon(args);
            }
          });
        });
        //if player play shooting sound
        //playAudio(audio.zap, 0.5);
      },
      shootWeapon({
        mechBP,
        shooter,
        target,
        autoFire,
        weapon,
        team,
        autoAim,
        isPlayer,
      }) {
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
          autoAim: autoAim,
          isPlayer: isPlayer,
        };
        const reloadSpeed = weapon.burstValue()
          ? 1000 / weapon.burstValue()
          : 1000;
        //console.log(weapon.data);
        clearTimeout(weapon.shootWeaponTO);
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
        //copy position of weapon (offset from base mech)
        // weapon
        weaponFireObj.position.copy(shooter.object3d.position);
        weaponFireObj.rotation.copy(shooter.object3d.rotation);
        const fireSpeed = weaponFireSpeed[weapon.data.weaponType];
        const weaponFireOffsetZ = fireSpeed / 2;
        weapon.servoOffset = servoUtil.servoLocation(
          weapon.locationServoId,
          mechBP.servoList
        ).offset;
        const currentScale = get().player.locationInfo.isLandedPlanet
          ? SCALE_PLANET_WALK
          : SCALE;
        weaponFireObj.translateX(
          (weapon.offset.x + weapon.servoOffset.x) * currentScale
        );
        weaponFireObj.translateY(
          (weapon.offset.y + weapon.servoOffset.y) * currentScale
        );
        weaponFireObj.translateZ(
          (weapon.offset.z + weapon.servoOffset.z) * currentScale
        );

        //if a missile fire straight ahead
        if (weapon.data.weaponType === "missile" || autoAim === false) {
          weaponFireObj.rotation.copy(shooter.object3d.rotation);
        }
        //by default other weapon type fire out of front of ship toward enemies
        else {
          weaponFireObj.lookAt(target.object3d.position);
        }
        //move forward so bullet isnt 1/2 way through ship... >.< - change
        weaponFireObj.translateZ(weaponFireOffsetZ * currentScale);

        //autofire target provided, if not a missile, only fire if within certain angle in front of ship
        //if (autoFire && weapon.data.weaponType !== "missile") {
        if (weapon.data.weaponType !== "missile" || autoAim === true) {
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
        else if (!autoFire) angleDiff = 1; //!isPlayer?

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

        //ADD BULLET TO BULLET LIST
        let weaponFire = {
          //id: guid(weaponFireUpdate),
          id: guid(get().weaponFireList),
          shooterId: shooter.id,
          weapon: weapon,
          object3d: weaponFireObj,
          hitBox: new THREE.Box3(), //used for hit detection
          //targetIndex: get().selectedTargetIndex,
          time: Date.now(),
          firstFrameSpeed: isPlayer
            ? get().player.speed
            : JSON.parse(JSON.stringify(shooter.speed)),
          //offset: { x: 0, y: 0, z: 0 },
          fireSpeed: fireSpeed,
          velocity: fireSpeed + JSON.parse(JSON.stringify(shooter.speed)),
          ray: new THREE.Ray(),
        };

        const box = new THREE.BoxGeometry(
          0.1 * currentScale,
          0.1 * currentScale,
          200 * currentScale
        );
        const mesh = new THREE.MeshStandardMaterial({
          color: new THREE.Color("yellow"),
          emissive: new THREE.Color("yellow"),
          emissiveIntensity: 1,
          wireframe: true,
        });
        const boxHelper = new THREE.Mesh(box, mesh); //visible bounding box, geometry of which is used to calculate hit detection box
        boxHelper.geometry.computeBoundingBox();
        weaponFire.hitBox.copy(boxHelper.geometry.boundingBox);
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
          if (Date.now() - weaponFire.time < 200 * weaponFire.weapon.range())
            updateWeaponFire.push(weaponFire);
        });
        set((state) => ({
          weaponFireList: updateWeaponFire,
        }));
        //console.log(get().weaponFireList.length);
      },

      //test for weaponFire hits using ray (ray from spaceship)
      test(data) {
        box.min.copy(data.object3d.position);
        box.max.copy(data.object3d.position);
        box.expandByScalar(data.size * 3);
        //data.hit.set(1000, 1000, 10000);
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
            shooter.ray.intersectsBox(target.hitBox)
          ) {
            hit = 1;
            return;
          }
        });

        return hit;
      },

      //
      testBox(target, shot) {
        //will update to stop from shooting if will hit self in more detailed check
        if (target.id === shot.shooterId) return false;
        //use ray from front bullet to detect coming hit
        let result = false;
        result = shot.ray.intersectBox(target.hitBox, target.hit);
        //console.log(result);
        if (result) {
          const distance = shot.ray.origin.distanceTo(target.hit);
          result = distance < shot.velocity * SCALE ? true : false;
        }
        return result;
      },

      setEnemyBP(index, mechBP) {
        let enemies = get().enemies;
        enemies[index].mechBP = mechBP;
        set((state) => ({
          enemies: enemies,
        }));
      },

      //changing player screen
      switchScreen(screenNum) {
        set(() => ({
          playerScreen: screenNum,
        }));
        console.log(get().playerScreen, screenNum);
      },
      //main menu slecting star in galaxy map
      detectTargetStar() {
        //clear targets
        set(() => ({
          selectedTargetIndex: null,
        }));
        set(() => ({
          focusTargetIndex: null,
        }));
        set(() => ({
          focusPlanetIndex: null,
        }));
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
        console.log(closest);
        //const playerObj = get().player.object3d;
        //playerObj.position.setZ(-15000 * SCALE - get().planets[0].radius);
        //get().actions.setPlayerObject(playerObj);
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
      stationDock() {
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
  count = starsInGalaxy
) {
  const numArms = 2;
  const armSeparationDistance = (2 * Math.PI) / numArms;
  const armOffsetMax = 1;
  const rotationFactor = 6;
  const randomOffsetX = 0.3;
  const randomOffsetY = 0.2;

  let positions = [];
  for (let i = 0; i < count; i++) {
    // Choose a distance from the center of the galaxy.
    let distance = 0.1 + rng();
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
    id: 0,
    team: 0,
    isInMech: true,
    currentMechBPindex: playerStart.mechBPindex,
    locationInfo: {
      isInSpace: false, //true,
      //starSystemId: playerStart.system,
      isOrbitingPlanet: false,
      orbitPlanetId: 0,
      isLandedPlanet: true, //false,
      landedPlanetId: 0,
      isDockedStation: false,
      dockedStationId: 0,
      isDockedShip: false,
      dockedShipId: 0,
    },
    object3d: obj,
    speed: 0,
    shield: { max: 50, damage: 0 }, //will be placed in mechBP once shields are completed

    ray: new THREE.Ray(),
    hitBox: new THREE.Box3(),
    hit: new THREE.Vector3(),
    shotsTesting: [],
    shotsHit: [],
    //servoHitNames: [],
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
    //if (index === 0) {
    //  enemy.object3d.position.set(playerStart.x, playerStart.y, playerStart.z);
    //}
    enemy.id = guid(enemies);
    enemy.team = index < 40 ? 1 : 2;

    enemy.groupLeaderGuid = 0;
    //enemy.groupLeaderGuid = index < 10 ? enemies[0].id : enemies[10].id;

    enemy.groupId = 0;
    enemy.tacticOrder = 0; //0 = follow leader, 1 = attack player
    //enemy.prevAngleToTargetLocation = 0;
    //enemy.prevAngleToLeaderLocation = 0;
    enemy.formation = null;
    enemy.formationPosition = new THREE.Vector3();
    enemy.speed = 300 + Math.floor(Math.random() * 3);
    enemy.mechBP = initEnemyMechBP(
      index === 0
        ? 1
        : //index < numEnemies / 20 ? 1 : 0
          //Math.random() < 0.05 ? 1 : 0
          0
    );
    enemy.size = enemy.mechBP.size() * SCALE;
    enemy.drawDistanceLevel = 0;

    const box = new THREE.BoxGeometry(
      enemy.size * 5000,
      enemy.size * 5000,
      enemy.size * 5000
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

    enemy.ray = new THREE.Ray(); //USED FOR RAY FROM SHIP to  test friendly fire hit detection
    enemy.hitBox = new THREE.Box3(); //used with rays for hit detection
    enemy.hitBox.copy(enemy.boxHelper.geometry.boundingBox);
    enemy.shotsTesting = []; //registers shots that have hit the bounding hitbox, then tested if hit actual servos
    enemy.shotsHit = []; //registers shots that have hit the mech, to remove shots from space
    enemy.servoHitNames = []; //names of servos hit stored and will flash red on 1 frame of animation
    // in the animation loop, compute the current bounding box with the world matrix
    //hitBox.applyMatrix4( enemy.boxHelper.matrixWorld );
  });

  //group enemies into squads
  enemies.forEach((enemy, i) => {
    let groupCount = 0;
    //enemy with no group: make group leader and select all nearby enemies to join group
    if (!enemy.groupLeaderGuid) {
      enemies
        .filter(
          (e) =>
            !e.groupLeaderGuid &&
            //distance(enemy.object3d.position, e.object3d.position) <
            //  20000 * SCALE &&
            enemy.mechBP.scale >= e.mechBP.scale
        )
        .forEach((eGroup) => {
          //this will apply to leader as well as all those nearby
          if (groupCount <= enemy.mechBP.scale * enemy.mechBP.scale) {
            eGroup.groupLeaderGuid = enemy.id;
            //console.log(eGroup.groupLeaderGuid);
          }
          groupCount++;
        });
    }
  });
  return enemies;
}

function randomStations(rng, num) {
  let temp = [];
  //create station
  temp.push({
    id: 1, //id(),
    type: "EQUIPMENT",
    name: "X-22",
    roughness: 1,
    metalness: 5,
    ports: [{ x: 0.5, y: 0.5, z: 0.5 }],
    position: {
      x: 0,
      y: 0,
      z: -14500 * SCALE * systemScale,
    },

    rotation: { x: 0, y: 0.5, z: 0 },

    stationBP: initStationBP(0),
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

function initTerrain(playerLocationInfo) {
  const rng = seedrandom(
    playerLocationInfo.starSystemId + "-" + playerLocationInfo.landedPlanetId
  );
  return new Terrain(rng(), 5, 0);
}

function initSolarSystem(
  rng,
  systemScale = 1,
  planetScale = 1,
  noConsoleLog = false
) {
  //Only one in about five hundred thousand stars has more than twenty times the mass of the Sun.
  let solarMass = rng(0.8) + 0.6; //getRandomArbitrary(0.6, 1.4);
  solarMass = solarMass < 0.7 ? rng(0.6) + 0.1 : solarMass; //getRandomArbitrary(0.1, 0.7) : solarMass;
  solarMass = solarMass > 1.3 ? rng(8.7) + 1.3 : solarMass; //getRandomArbitrary(1.3, 10) : solarMass;
  //15% of stars have a system like earths (with gas giants)
  //ACCRETE
  const system = new StarSystem(
    {
      //A: getRandomArbitrary(0.00125, 0.0015) * solarMass,
      //B: getRandomArbitrary(0.000005, 0.000012) * solarMass,
      //K: getRandomArbitrary(50, 100),
      //N: 3,
      //Q: 0.77,
      //W: getRandomArbitrary(0.15, 0.25),
      //ALPHA: 5, //getRandomArbitrary(2, 7),
      mass: solarMass,
    },
    rng
  ); //ACCRETE
  const newSystem = system.create();
  const solarRadius = newSystem.radius * SCALE * planetScale;

  if (!noConsoleLog) console.log(newSystem);

  //-------
  let temp = [];
  //create sun
  temp.push({
    type: "SUN",
    data: {
      age: newSystem.age,
      mass: newSystem.mass,
      radius: newSystem.radius,
      luminosity: newSystem.luminosity,
      ecosphereRadius: newSystem.ecosphereRadius,
      greenhouseRadius: newSystem.greenhouseRadius,
    },
    roughness: 0,
    metalness: 1,
    color: new THREE.Color(0xffffff),
    radius: solarRadius,
    opacity: 1,
    textureMap: 0,
    drawDistanceLevel: 10,
    transparent: false,
    object3d: new THREE.Object3D(),
    //position: { x: 0, y: 0, z: 0 },
    //rotation: { x: 0, y: 0, z: 0 },
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

  newSystem.planets.forEach((p) => {
    if (!noConsoleLog) console.log(p.radius, p.planetType);
    //p.radius = p.radius * SCALE * planetScale;
    /*
    Rocky

    Gas
      Gas Dwarf
      Jovian
    
    temperature.max > this.boilingPoint
      Venusian

    temperature.day < FREEZING_POINT_OF_WATER
      Ice
    iceCover >= 0.95
      Ice

    surfacePressure <= 250.0
      Martian

    waterCover >= 0.95
      Water

    waterCover > 0.05
      Terrestrial
    */

    // 1 AU = 150 million kilometres
    const x = 0; //(a + b * angle) * Math.sin(angle) + temp[0].radius / 3;
    const y = 0;
    const z = solarRadius * 2 + p.a * 1500 * SCALE * systemScale; //(a + b * angle) * Math.cos(angle) + temp[0].radius / 3;
    const object3d = new THREE.Object3D();
    object3d.position.set(x, y, z);
    object3d.rotation.set(p.axialTilt * (Math.PI / 180), 0, 0); //radian = degree x (M_PI / 180.0);
    let color = undefined;
    let textureMap = undefined;
    switch (p.planetType) {
      case "Rocky":
        color = new THREE.Color(0x6b6b47);
        textureMap = 4;
        break;
      case "Gas":
        color = new THREE.Color(0xffe6b3);
        textureMap = 3;
        break;
      case "Gas Dwarf":
        color = new THREE.Color(0xd5ff80);
        textureMap = 2;
        break;
      case "Gas Giant":
        color = new THREE.Color(0xbf8040);
        textureMap = 3;
        break;
      case "Venusian":
        color = new THREE.Color(0xd2a679);
        textureMap = 6;
        break;
      case "Ice":
        color = new THREE.Color(0xb3ccff);
        textureMap = 7;
        break;
      case "Martian":
        color = new THREE.Color(0xb30000);
        textureMap = 4;
        break;
      case "Water":
        color = new THREE.Color(0x3399ff);
        textureMap = 8;
        break;
      case "Terrestrial":
        color = new THREE.Color(0x3399ff);
        textureMap = 1;
        break;
      default:
    }
    temp.push({
      type: "PLANET",
      data: p.toJSONforHud(),
      roughness: 1,
      metalness: 0,
      //color: colors[getRandomInt(4) + 1],
      color: color,
      radius: p.radius * SCALE * planetScale * 10,
      opacity: 1,
      drawDistanceLevel: 0,
      textureMap: textureMap,
      transparent: false,
      object3d: object3d,
      //position: { x, y: 0, z },
      //rotation: { x: 0, y: 0, z: 0 },
    });
  });

  /*
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
  */
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
