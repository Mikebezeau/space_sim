import * as THREE from "three";
import { Object3D, Vector3 } from "three";
import { distance, SCALE } from "./util/gameUtil";

export function loopAI(playerShip, enemies, clock) {
  //const gltf = useLoader(GLTFLoader, "/gltf/drone.gltf");
  const dummyObj = new THREE.Object3D();
  const toTargetQuat = new THREE.Quaternion(),
    curQuat = new THREE.Quaternion();

  /*
fleet / ship groups
    group large ships together based on distance to form fleets
    each large ship will be assigned nearby smaller ships to form a support sub group
    remaining small ships that have not been assigned will for rogue attack groups
    each group of smaller ships will be divided into further sub groups according to max # of ships / group

enemy ship properties:
    guid //global ship id
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
  enemies.forEach((enemy, i) => {
    //select target
    //make sure the group leader is alive
    enemy.groupLeaderGuid = enemies.find(
      (e) => e.guid === enemy.groupLeaderGuid
    )
      ? enemy.groupLeaderGuid //leader is alive
      : enemy.guid; //if not set group leader to itself - now has no leader

    const enemyLeader = enemies.find((e) => e.guid === enemy.groupLeaderGuid);

    let destinationPosition = new Vector3();

    //if ship is the leader
    if (enemy.guid === enemy.groupLeaderGuid)
      destinationPosition = leaderDestinationPosition(playerShip);
    //if ship is part of group
    else {
      destinationPosition = groupFollowPosition(
        enemy,
        enemyLeader.object3d,
        enemies,
        clock
      );
    }
    //turn towards target
    //set dummy to aquire rotation towards target
    dummyObj.position.copy(enemy.object3d.position);
    //current enemy direction quat
    curQuat.setFromEuler(enemy.object3d.rotation);
    //direction quat pointing to player location
    dummyObj.lookAt(destinationPosition);
    toTargetQuat.setFromEuler(dummyObj.rotation);

    //rotate slowly towards target quaternion
    enemy.object3d.rotation.setFromQuaternion(
      curQuat.slerp(toTargetQuat, 0.3).normalize()
    );

    //speed equals same speed as leader
    //??speed depending on distance away
    enemy.speed =
      enemy.guid === enemy.groupLeaderGuid
        ? //if ship is the leader
          enemy.speed
        : //else if ship is far away from target destination go faster
        distance(enemy.object3d.position, destinationPosition) > 1000 * SCALE
        ? enemyLeader.speed * 2
        : enemyLeader.speed;

    //move toward target
    enemy.object3d.translateZ(enemy.speed * SCALE); //at this point a positive z moves toward player ship

    /*if (enemy.guid === 150 && clock.getElapsedTime() % 1 < 0.05) {
      console.log(enemy.formation);
    } */

    /*
        enemy.guid,
        enemy.groupLeaderGuid,
        enemy.object3d.position,
        enemyLeader.object3d.position
        //toTargetQuat,
        //destinationPosition
      );
    }
*/
  });
}

//function leaderDestinationPosition(enemy, playerShip, enemies) {
function leaderDestinationPosition(playerShip) {
  //leader heads toward player for now
  let destinationPosition = playerShip.position;
  return destinationPosition;
}

function groupFollowPosition(enemy, enemyLeaderObj, enemies, clock) {
  let destinationObject = new Object3D();
  //console.log(destinationObject.position, enemyLeaderObj);

  destinationObject.position.copy(enemyLeaderObj.position);
  destinationObject.rotation.copy(enemyLeaderObj.rotation);

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
      eGroup.formationPosition.x = (group.length * 250 - i * 500) * SCALE;
      eGroup.formationPosition.y = 0;
      eGroup.formationPosition.z = -500 * SCALE;
    });
  }
  /*
  if (enemy.guid === 150 && clock.getElapsedTime() % 1 < 0.05)
    console.log(enemy.formationPosition);
    */
  //destination location is the leaders position offset by this ships formation coordinates position/offset values
  destinationObject.translateX(enemy.formationPosition.x);
  destinationObject.translateY(enemy.formationPosition.y);
  destinationObject.translateZ(enemy.formationPosition.z);

  return destinationObject.position;
}
