import React from "react";
import * as THREE from "three";
import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
//import { useLoader } from "@react-three/fiber";
//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; //const { nodes } = useLoader(GLTFLoader, "models/arwing.glb");
import useStore from "../stores/store";
import BuildMech from "./BuildMech";
import {
  SCALE,
  flipRotation,
  CONTROLS_UNATTENDED,
  CONTROLS_PILOT_COMBAT,
  CONTROLS_PILOT_SCAN,
} from "../util/gameUtil";
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
  const { clock, mouse } = mutation;
  const player = useStore((state) => state.player);
  const setPlayerObject = useStore((state) => state.actions.setPlayerObject);
  const {
    playerMechBP,
    playerControlMode,
    displayContextMenu,
    weaponFireLightTimer,
  } = useStore((state) => state);

  const main = useRef();
  const weaponFireLight = useRef();
  const exhaust = useRef();
  const engineLight = useRef();
  const cross = useRef();
  const target = useRef();

  const servoHitNames = [];
  /*
  //not working
  //on first render have camera look at ship to avoid the camera shift after leaving a menu
  useEffect(() => {
    camera.position.copy(main.current.position);
    camera.translateZ(8 * SCALE);
    camera.translateY(3 * SCALE);
    //camera.lookAt(main.current.position);
    //CAMERA IS SHIFTED A MILLISECOND AFTER FROM PREVIOUS USEFRAME?
    camera.lookAt(0, 0, 0);
  }, []);
  */

  //moving camer, ship, altering crosshairs, engine and weapon lights (activates only while flying)
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
      playerControlMode === CONTROLS_PILOT_COMBAT ||
      (playerControlMode === CONTROLS_PILOT_SCAN && !displayContextMenu)
    ) {
      mouseX = mouse.x;
      mouseY = mouse.y;
    }
    rotateQuat.setFromAxisAngle(
      direction.set(-mouseY * 0.25, -mouseX * 0.3, mouseX * 0.4),
      (Math.PI / 10) * MVmod
    );
    //console.log(-mouse.y * 0.25, -mouse.x * 0.3, mouse.x * 0.4);
    //console.log(direction.angleTo(new THREE.Vector3(0, 0, 0)));//1.57
    //current ship rotation
    curQuat.setFromEuler(main.current.rotation);
    //update ship rotation
    endQuat.multiplyQuaternions(curQuat, rotateQuat);
    //console.log(curQuat.angleTo(endQuat));
    main.current.rotation.setFromQuaternion(endQuat.normalize());
    //move ship forward
    main.current.translateZ(player.speed * SCALE);
    //save ship position / rotation to state
    //ship.position.copy(main.current.position);
    setPlayerObject(main.current); //made this set to state in this way as to reflect updates to other components (SystemMap)

    //CAMERA
    //set tempObjectDummy to be behind ship
    tempObjectDummy.position.copy(main.current.position);
    tempObjectDummy.rotation.copy(main.current.rotation);

    let lerpAmount = 0;

    if (playerControlMode === CONTROLS_UNATTENDED) {
      tempObjectDummy.translateX(-8 * SCALE * playerMechBP[0].scale);
      tempObjectDummy.translateY(8 * SCALE * playerMechBP[0].scale);
      //tempObjectDummy.translateZ(2 * SCALE * playerMechBP[0].scale);
      lerpAmount = 1;
    } else {
      tempObjectDummy.translateZ(-8 * SCALE * playerMechBP[0].scale);
      tempObjectDummy.translateY(2 * SCALE * playerMechBP[0].scale);
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

    //engine flicker
    let flickerVal = Math.sin(clock.getElapsedTime() * 500);
    let speedRoof = player.speed > 25 ? 25 : player.speed;
    exhaust.current.position.z = speedRoof / -8;
    exhaust.current.scale.x = speedRoof / 10 + flickerVal * 5;
    exhaust.current.scale.y = speedRoof / 10 + flickerVal * 5;
    exhaust.current.scale.z = speedRoof + 1.5 + flickerVal * 5;
    player.speed > 2
      ? (exhaust.current.material.visible = 1)
      : (exhaust.current.material.visible = 0);
    engineLight.current.intensity = player.speed > 0 ? player.speed * 0.05 : 0;

    //weapon firing light blast
    weaponFireLight.current.intensity +=
      ((weaponFireLightTimer && Date.now() - weaponFireLightTimer < 100
        ? 1
        : 0) -
        weaponFireLight.current.intensity) *
      0.3;

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
  /*
const pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
pointLight.position.set( 10, 10, 10 );
scene.add( pointLight );

const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
scene.add( pointLightHelper );
*/

  return (
    <group
      ref={main}
      scale={SCALE}
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
      {/*player.boxHelper && (
          <mesh
            geometry={player.boxHelper.geometry}
            material={player.boxHelper.material}
          ></mesh>
        )*/}
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
        ref={weaponFireLight}
        position={[0, 0, 0.2]}
        distance={3 * SCALE}
        intensity={0}
        color="lightgreen"
      />
      <mesh ref={exhaust} position={[0, 0.2, 0]}>
        <dodecahedronBufferGeometry attach="geometry" args={[0.05, 0]} />
        <meshStandardMaterial
          attach="material"
          color="lightblue"
          transparent
          opacity={0.3}
          emissive="lightblue"
          emissiveIntensity="0.3"
        />
      </mesh>
      <pointLight
        ref={engineLight}
        position={[0, 0.2, -0.75]}
        distance={3 * SCALE}
        intensity={0}
        color="lightblue"
      />
    </group>
  );
}
