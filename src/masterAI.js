import * as THREE from "three";
import { Object3D, Vector3 } from "three";
import { distance } from "./util/gameUtil";
import { SCALE } from "./util/constants";

const dummyObj = new THREE.Object3D();
const toTargetQuat = new THREE.Quaternion(),
  curQuat = new THREE.Quaternion();

export function loopAI(player, enemies, enemyBoids, clock, actionShoot) {
  enemies.forEach((enemy, index) => {
    enemyBoids[index].position.copy(enemy.object3d.position);
    const enemyLeader = enemies.find((e) => e.id === enemy.groupLeaderGuid);
    //if no leader make self leader
    if (!enemyLeader) enemy.groupLeaderGuid = enemy.id;
    const isLeader = enemy.id === enemy.groupLeaderGuid;
    //select target
    const destinationPosition = findTargetPosition(
      player,
      enemyLeader,
      enemies,
      enemy,
      isLeader
    );

    const distanceToTargetLocation = distance(
      enemy.object3d.position,
      destinationPosition
    );

    //if leader ship within attack range of player
    if (
      (isLeader || enemy.tacticOrder === 1) &&
      distanceToTargetLocation < 2000 * enemy.mechBP.scale * SCALE
      //distanceToTargetLocation < 1000 * enemy.mechBP.size * SCALE
    ) {
      //give order to attack
      enemy.tacticOrder = 1;
      //fire at player if possible
      actionShoot(enemy.mechBP, enemy, player, false, enemy.team);
    } else {
      enemy.tacticOrder = 0;
    }

    //if leader is too far away for combat change tactic order to reform formation
    if (
      isLeader &&
      distanceToTargetLocation > 2000 * enemy.mechBP.scale * SCALE
      //distanceToTargetLocation > 1000 * enemy.mechBP.size * SCALE
    ) {
      //player too far away to attack, so regroup
      enemy.tacticOrder = 0;
    }

    //set traget desitination of enemy boid
    enemyBoids[index].home.copy(destinationPosition);

    /*
    //just for fun, if a big ship, let the target be the leader capital ship if close enough to player
    if (
      enemy.mechBP.scale > 3 &&
      distanceToTargetLocation < 500 * enemy.mechBP.scale * SCALE
      //distanceToTargetLocation < 500 * enemy.mechBP.size * SCALE //size: 1.5, 50, 11000
    )
      enemyBoids[index].home.copy(enemyLeader.object3d.position);
*/
    // Run an iteration of the flock
    enemyBoids[index].step(enemyBoids, enemy, isLeader, []);
    //turn towards target
    //direction quat pointing to player location
    const MVmod =
      1 /
      (Math.abs(enemy.mechBP.MV()) === 0 ? 0.1 : Math.abs(enemy.mechBP.MV()));

    //current enemy direction quat
    curQuat.setFromEuler(enemy.object3d.rotation);
    //set dummy to aquire rotation towards target
    dummyObj.position.copy(enemy.object3d.position);
    dummyObj.lookAt(enemyBoids[index].position);
    toTargetQuat.setFromEuler(dummyObj.rotation);
    //rotate slowly towards target quaternion

    //do not exceed maximum turning angle
    /*
    if (
      curQuat.angleTo(toTargetQuat) >
      (Math.PI / 10 / enemy.mechBP.scale) * MVmod
    ) {
      // .rotateTowards for a static rotation value
      enemy.object3d.rotation.setFromQuaternion(
        curQuat.rotateTowards(
          toTargetQuat,
          (Math.PI / 10 / enemy.mechBP.scale) * MVmod
        )
      );
    } else {*/
    enemy.object3d.rotation.setFromQuaternion(
      curQuat.slerp(toTargetQuat, (Math.PI / 10 / enemy.mechBP.scale) * MVmod)
    );
    //}
    //}

    /*
    const maxWeaponRange = enemy.mechBP.maxWeaponRange();//returns units - transform to space distance??
*/

    //in combat set speed max
    enemy.speed =
      enemy.tacticOrder === 1
        ? 4 + enemyBoids[index].speed * MVmod * SCALE
        : enemy.speed;

    //if far enough away, use boid speed to get in correct position
    enemy.speed =
      distanceToTargetLocation > 2000 * enemy.mechBP.scale * SCALE
        ? enemyBoids[index].speed * 100 * SCALE //(distanceToTargetLocation * enemy.mechBP.scale) / 1000 / SCALE
        : enemy.speed;

    //reduce speed to the boid speed
    if (enemy.speed > enemyBoids[index].speed * 10) {
      // * 100 * SCALE) {
      enemy.speed = enemyBoids[index].speed * 10; // * 100 * SCALE;
    }

    //move toward target
    enemy.object3d.translateZ(enemy.speed * SCALE);

    //if (index === 0) console.log(enemyBoids[index].speed);
    //enemy.object3d.lookAt(enemyBoids[index].pointAt);
    //enemy.object3d.lookAt(enemyBoids[index].position);
    //enemy.object3d.position.copy(enemyBoids[index].position);
  });
}

function findTargetPosition(player, enemyLeader, enemies, enemy, isLeader) {
  let destinationPosition = undefined;

  //if ship is the leader
  if (isLeader)
    destinationPosition = leaderDestinationPosition(player.object3d);
  //if ship is part of group
  else {
    //follow leaders order
    enemy.tacticOrder = enemyLeader.tacticOrder;
    if (enemy.tacticOrder === 1) {
      //attack player
      destinationPosition = player.object3d.position;
    } else {
      //find group position
      destinationPosition = enemyLeader.object3d.position; // groupFollowPosition(enemy, enemyLeader, enemies);
    }
  }
  return destinationPosition;
}
//function leaderDestinationPosition(enemy, playerObj, enemies) {
function leaderDestinationPosition(playerObj) {
  //leader heads toward player for now
  let destinationPosition = playerObj.position;
  return destinationPosition;
}

function groupFollowPosition(enemy, enemyLeader, enemies) {
  let destinationObject = new Object3D();

  destinationObject.position.copy(enemyLeader.object3d.position);
  destinationObject.rotation.copy(enemyLeader.object3d.rotation);

  //find position to follow leader in formation
  //if no group formation selected chose one
  if (!enemy.formation) {
    enemy.formation = 1;
    //select positions for all ships in this group
    const group = enemies.filter(
      (e) => enemy.groupLeaderGuid === e.groupLeaderGuid
    );
    group.forEach((eGroup, i) => {
      //assign a position to each group member
      eGroup.formationPosition.x =
        (group.length * 50 - i * 50) *
        Math.pow(enemy.mechBP.scale + enemyLeader.mechBP.scale, 1.5) *
        SCALE;
      eGroup.formationPosition.y = 0;
      eGroup.formationPosition.z =
        -50 *
        Math.pow(enemy.mechBP.scale + enemyLeader.mechBP.scale, 1.5) *
        SCALE;
    });
  }
  /*
  if (enemy.id === 150 && clock.getElapsedTime() % 1 < 0.05)
    console.log(enemy.formationPosition);
    */
  //destination location is the leaders position offset by this ships formation coordinates position/offset values
  destinationObject.translateX(enemy.formationPosition.x);
  destinationObject.translateY(enemy.formationPosition.y);
  destinationObject.translateZ(enemy.formationPosition.z);

  return destinationObject.position;
}

/*
fleet / ship groups
    group large ships together based on distance to form fleets
    each large ship will be assigned nearby smaller ships to form a support sub group
    remaining small ships that have not been assigned will for rogue attack groups
    each group of smaller ships will be divided into further sub groups according to max # of ships / group

enemy ship properties:
    id // ship id
    groupLeaderGuid //global ship id of who is the group leader (or this ships own id if it is the group leader)
    groupId // id of group this ship is assigned to

methods:
    detect targets (scanning)
    choose target / protect:self, group, leader
    select desitation
    turn to target
    select speed
    attack
    run away / hide

choose target:
    coordinate attacks with allies
    power level of target, effect whether should attack / run

select desitation:
    leader patrol
    depending if target, move around blocking objects
    stay within certain distance of leader
    move to turn weapons toward target if attacking
*/
