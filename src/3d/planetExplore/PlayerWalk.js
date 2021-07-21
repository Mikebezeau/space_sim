import React from "react";
import * as THREE from "three";
import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
//import { useLoader } from "@react-three/fiber";
//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; //const { nodes } = useLoader(GLTFLoader, "models/arwing.glb");
import useStore from "../../stores/store";
import BuildMech from "../BuildMech";
import { flipRotation } from "../../util/gameUtil";
import {
  SCALE_PLANET_WALK,
  CONTROLS_UNATTENDED,
  CONTROLS_PILOT_COMBAT,
  CONTROLS_PILOT_SCAN,
} from "../../util/constants";
const position = new THREE.Vector3();
const direction = new THREE.Vector3();

const tempObjectDummy = new THREE.Object3D();
const rotateQuat = new THREE.Quaternion(),
  camQuat = new THREE.Quaternion(),
  curQuat = new THREE.Quaternion(),
  endQuat = new THREE.Quaternion();

const lightgreen = new THREE.Color("lightgreen");
const hotpink = new THREE.Color("hotpink");
const crossMaterial = new THREE.MeshBasicMaterial({
  color: hotpink,
  fog: false,
});

export default function Ship() {
  const { camera } = useThree();
  const mutation = useStore((state) => state.mutation);
  const { mouse } = mutation;
  const player = useStore((state) => state.player);
  const setPlayerObject = useStore((state) => state.actions.setPlayerObject);
  const { playerMechBP, playerControlMode, displayContextMenu } = useStore(
    (state) => state
  );
  const { terrain } = useStore((state) => state.planetTerrain);

  const main = useRef();
  const cross = useRef();
  const target = useRef();

  const servoHitNames = [];

  //testing
  useFrame(() => {
    if (!main.current) return null;
    //rotate ship based on mouse position
    //new rotation
    const MVmod =
      10 /
      (Math.abs(playerMechBP[0].MV()) === 0
        ? 0.1
        : Math.abs(playerMechBP[0].MV()));

    let mouseX = 0,
      mouseY = 0;
    if (
      (playerControlMode === CONTROLS_PILOT_COMBAT ||
        playerControlMode === CONTROLS_PILOT_SCAN) &&
      !displayContextMenu
    ) {
      mouseX = mouse.x;
      mouseY = mouse.y;
    }

    rotateQuat.setFromAxisAngle(
      direction.set(mouseY * 0.25, -mouseX * 0.3, mouseX * 0.4),
      (Math.PI / 10) * MVmod
    );

    endQuat.multiplyQuaternions(main.current.quaternion, rotateQuat); //why does removing this line cause fuckup
    //main.current.rotation.setFromQuaternion(endQuat.normalize());
    main.current.rotation.x = 0;
    main.current.rotation.z = 0;
    //manually setting turn totation to avoid gimbal lock
    main.current.rotation.y = main.current.rotation.y - mouseX * 0.05 * MVmod; //this is dumb

    main.current.translateZ(player.speed * 0.1 * SCALE_PLANET_WALK);

    //hit ground test
    if (terrain) {
      //check for ground, starting far above player to avoid going through ground on forward move into steep terrain
      tempObjectDummy.position.copy(main.current.position);
      tempObjectDummy.rotation.copy(main.current.rotation);
      tempObjectDummy.translateY(10000 * SCALE_PLANET_WALK);

      const raycast = new THREE.Raycaster(
        tempObjectDummy.position,
        new THREE.Vector3(0, -1, 0)
      );

      //shitty check for roads
      //console.log(terrain.roads.count);
      let onRoad = false;
      terrain.roads.forEach((road) => {
        if (!onRoad) {
          const intersectionRoad = raycast.intersectObject(road.mesh, true);
          if (intersectionRoad.length > 0) {
            main.current.position.y =
              main.current.position.y -
              (intersectionRoad[0].distance - 10000 * SCALE_PLANET_WALK) +
              0.75 * SCALE_PLANET_WALK; //this is to offset for height of vehicle, will change to reflect calculated height
            onRoad = true;
          }
        }
      });

      if (!onRoad) {
        const intersection = raycast.intersectObject(terrain.Mesh, true);
        if (intersection.length > 0) {
          main.current.position.y =
            main.current.position.y -
            (intersection[0].distance - 10000 * SCALE_PLANET_WALK) +
            0.75 * SCALE_PLANET_WALK; //this is to offset for height of vehicle, will change to reflect calculated height
        }
        //defalut to avoid going to center of planet
        else main.current.position.y = 400 * SCALE_PLANET_WALK;
      }
    }

    //save ship position / rotation to state
    setPlayerObject(main.current); //made this set to state in this way as to reflect updates to other components (SystemMap)

    //CAMERA
    //set tempObjectDummy to be behind ship
    tempObjectDummy.position.copy(main.current.position);
    tempObjectDummy.rotation.copy(main.current.rotation);

    let lerpAmount = 0;

    if (playerControlMode === CONTROLS_UNATTENDED) {
      tempObjectDummy.translateX(
        -8 * SCALE_PLANET_WALK * playerMechBP[0].scale
      );
      tempObjectDummy.translateY(8 * SCALE_PLANET_WALK * playerMechBP[0].scale);
      //tempObjectDummy.translateZ(2 * SCALE_PLANET_WALK * playerMechBP[0].scale);
      lerpAmount = 1;
    } else {
      tempObjectDummy.translateZ(
        -8 * SCALE_PLANET_WALK * playerMechBP[0].scale
      );
      tempObjectDummy.translateY(2 * SCALE_PLANET_WALK * playerMechBP[0].scale);
      lerpAmount = 0.95; //distance(state.camera.position, camDummy.position) / 0.8;
    }

    camera.position.lerp(tempObjectDummy.position, lerpAmount);

    if (playerControlMode === CONTROLS_UNATTENDED) {
      //looking at the player ship from the side
      tempObjectDummy.lookAt(main.current.position);
      endQuat.setFromEuler(tempObjectDummy.rotation);
    }
    //flip the position the camera should be facing so that the ship moves "forward" using a change in positive Z axis
    endQuat.copy(flipRotation(endQuat));

    //get end rotation angle for camera for smooth follow
    camQuat.setFromEuler(camera.rotation);
    // rotate towards target quaternion
    camera.rotation.setFromQuaternion(camQuat.slerp(endQuat, 0.2).normalize());

    main.current.getWorldPosition(position);
    main.current.getWorldDirection(direction);
    player.ray.origin.copy(position);
    player.ray.direction.copy(direction);

    player.hitBox.min.copy(position);
    player.hitBox.max.copy(position);
    player.hitBox.expandByScalar(player.size * 3);

    //update crosshair / target box switch if weapon hit possible
    crossMaterial.color = mutation.playerHits ? lightgreen : hotpink;
    cross.current.visible = !mutation.playerHits;
    target.current.visible = !!mutation.playerHits;

    servoHitNames.length = 0;
    player.shotsTesting.forEach((shot) => {
      //detect if shot is hitting any servo peices (or weapons on weapon mounts)
      const raycast = new THREE.Raycaster(shot.ray.origin, shot.ray.direction);

      const mesh = main.current.children[0];
      const intersection = raycast.intersectObject(mesh, true);
      if (intersection.length > 0) {
        //console.log(intersection[0].point);
        //console.log(shot.object3d.position);
        shot.object3d.position.copy(intersection[0].point);
        servoHitNames.push(intersection[0].object.name);
        shot.servoHitName = intersection[0].object.name;
        player.shotsHit.push(shot);
      }
    });
  });

  //console.log(player.object3d.position);
  return (
    <group
      ref={main}
      scale={SCALE_PLANET_WALK}
      position={[
        player.object3d.position.x,
        player.object3d.position.y,
        player.object3d.position.z,
      ]}
      rotation={[
        player.object3d.rotation.x,
        player.object3d.rotation.y,
        player.object3d.rotation.z,
      ]}
    >
      <BuildMech
        mechBP={playerMechBP[0]}
        servoHitNames={servoHitNames}
        showAxisLines={false}
      />
      <group ref={cross} position={[0, 0, 300]} name="cross">
        <mesh renderOrder={1000} material={crossMaterial}>
          <boxBufferGeometry attach="geometry" args={[20, 1, 1]} />
        </mesh>
        <mesh renderOrder={1000} material={crossMaterial}>
          <boxBufferGeometry attach="geometry" args={[1, 20, 1]} />
        </mesh>
      </group>
      <group ref={target} position={[0, 0, 300]} name="target">
        <mesh position={[0, 20, 0]} renderOrder={1000} material={crossMaterial}>
          <boxBufferGeometry attach="geometry" args={[40, 1, 1]} />
        </mesh>
        <mesh
          position={[0, -20, 0]}
          renderOrder={1000}
          material={crossMaterial}
        >
          <boxBufferGeometry attach="geometry" args={[40, 1, 1]} />
        </mesh>
        <mesh position={[20, 0, 0]} renderOrder={1000} material={crossMaterial}>
          <boxBufferGeometry attach="geometry" args={[1, 40, 1]} />
        </mesh>
        <mesh
          position={[-20, 0, 0]}
          renderOrder={1000}
          material={crossMaterial}
        >
          <boxBufferGeometry attach="geometry" args={[1, 40, 1]} />
        </mesh>
      </group>

      <pointLight
        position={[0, 0, 0]}
        distance={3 * SCALE_PLANET_WALK}
        intensity={0.5}
        color="lightgreen"
      />
    </group>
  );
}
