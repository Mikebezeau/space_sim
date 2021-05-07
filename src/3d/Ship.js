import * as THREE from "three";
import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
//import { useThree, useLoader, useFrame } from "@react-three/fiber";
//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { servoShapes, weaponShapes } from "../data/equipShapes";
import useStore from "../stores/store";
import useEquipStore from "../stores/equipStore";
import { SCALE } from "../util/gameUtil";
import SystemMap from "./SystemMap";

const laserGeometry = new THREE.BoxBufferGeometry(0.25, 0.25, 30);

const lightgreen = new THREE.Color("lightgreen");
const hotpink = new THREE.Color("hotpink");
const laserMaterial = new THREE.MeshBasicMaterial({ color: lightgreen });
const crossMaterial = new THREE.MeshBasicMaterial({
  color: hotpink,
  fog: false,
});
const position = new THREE.Vector3();
const direction = new THREE.Vector3();

export default function Ship() {
  //const { nodes } = useLoader(GLTFLoader, "models/arwing.glb");
  const mutation = useStore((state) => state.mutation);
  const { clock, mouse, ray } = mutation;
  const ship = useStore((state) => state.ship);
  const speed = useStore((state) => state.speed);
  const sytemScale = useStore((state) => state.sytemScale);
  const planets = useStore((state) => state.planets);
  const lasers = useStore((state) => state.lasers);

  const main = useRef();
  const systemMap = useRef();
  const laserGroup = useRef();
  const laserLight = useRef();
  const exhaust = useRef();
  const engineLight = useRef();
  const cross = useRef();
  const target = useRef();
  const { camera } = useThree();
  const tempObjectDummy = new THREE.Object3D();
  const rotateQuat = new THREE.Quaternion(),
    camQuat = new THREE.Quaternion(),
    curQuat = new THREE.Quaternion(),
    endQuat = new THREE.Quaternion();
  const { mechBP } = useEquipStore((state) => state); //for rendering ship servo shapes

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
    rotateQuat.setFromAxisAngle(
      direction.set(mouse.y * 0.25, -mouse.x * 0.3, -mouse.x * 0.4),
      Math.PI / 10
    );
    //current ship rotation
    curQuat.setFromEuler(main.current.rotation);
    //update ship rotation
    endQuat.multiplyQuaternions(curQuat, rotateQuat);
    main.current.rotation.setFromQuaternion(endQuat.normalize());
    //move ship forward
    main.current.translateZ(-speed * SCALE * sytemScale);

    //CAMERA
    //set tempObjectDummy to be behind ship
    tempObjectDummy.position.copy(main.current.position);
    tempObjectDummy.rotation.copy(main.current.rotation);
    tempObjectDummy.translateZ(8 * SCALE * mechBP.scale);
    tempObjectDummy.translateY(2 * SCALE * mechBP.scale);

    const lerpAmount = 0.95; //distance(state.camera.position, camDummy.position) / 0.8;
    camera.position.lerp(tempObjectDummy.position, lerpAmount);
    //get end rotation angle for camera for smooth follow
    camQuat.setFromEuler(camera.rotation);
    // rotate towards target quaternion
    camera.rotation.setFromQuaternion(camQuat.slerp(endQuat, 0.2).normalize());

    //place system map at top of screen (offset from camera location)
    tempObjectDummy.position.copy(camera.position);
    tempObjectDummy.rotation.copy(camera.rotation);
    tempObjectDummy.translateY(30 * SCALE);
    tempObjectDummy.translateZ(-80 * SCALE);
    systemMap.current.position.copy(tempObjectDummy.position);

    //give map opposite & inverted rotation of camera to stop it from rotating while camera rotates
    systemMap.current.rotation.setFromQuaternion(
      camQuat.conjugate().invert().normalize()
    );
    /*
    //trying to add angle to static system map
    curQuat.setFromEuler(systemMap.current.rotation);
    endQuat.setFromAxisAngle(Math.PI / 1.5, 0, 0);
    systemMap.current.rotation.setFromQuaternion(curQuat.multiply(endQuat));
*/

    //engine flicker
    let flickerVal = Math.sin(clock.getElapsedTime() * 500);
    let speedRoof = speed > 25 ? 25 : speed;
    exhaust.current.position.z = speedRoof / 8;
    exhaust.current.scale.x = speedRoof / 10 + flickerVal * 5;
    exhaust.current.scale.y = speedRoof / 10 + flickerVal * 5;
    exhaust.current.scale.z = speedRoof + 1.5 + flickerVal * 5;
    speed > 2
      ? (exhaust.current.material.visible = 1)
      : (exhaust.current.material.visible = 0);
    engineLight.current.intensity = speed > 0 ? speed * 0.05 : 0;

    //laser movement update
    for (let i = 0; i < lasers.length; i++) {
      const group = laserGroup.current.children[i];
      group.position.z -= 35000 * SCALE;
    }
    laserLight.current.intensity +=
      ((lasers.length && Date.now() - lasers[lasers.length - 1] < 100 ? 1 : 0) -
        laserLight.current.intensity) *
      0.3;

    //save ship position / rotation to state
    ship.position.copy(main.current.position);
    ship.rotation.copy(main.current.rotation);
    // Get ships orientation and save it to the stores ray (used for hit detection)
    main.current.getWorldPosition(position);
    main.current.getWorldDirection(direction);
    //ray.origin.copy(main.current.position);//this works too
    ray.origin.copy(position);
    ray.direction.copy(direction.negate()); //negate inverts the vector direction (x=-x,y=-y...)

    //update crosshair / target box switch if weapon hit possible
    crossMaterial.color = mutation.hits ? lightgreen : hotpink;
    cross.current.visible = !mutation.hits;
    target.current.visible = !!mutation.hits;
  });

  return (
    <>
      <group ref={systemMap} rotation={[Math.PI / 1.5, 0, 0]} scale={SCALE}>
        <SystemMap planets={planets} playerPos={ship.position} />
      </group>
      <group
        ref={main}
        scale={SCALE}
        position={[ship.position.x, ship.position.y, ship.position.z]}
        rotation={[ship.rotation.x, ship.rotation.y, ship.rotation.z]}
      >
        <group>
          <group ref={cross} position={[0, 0, -300]} name="cross">
            <mesh renderOrder={1000} material={crossMaterial}>
              <boxBufferGeometry attach="geometry" args={[20, 1, 1]} />
            </mesh>
            <mesh renderOrder={1000} material={crossMaterial}>
              <boxBufferGeometry attach="geometry" args={[1, 20, 1]} />
            </mesh>
          </group>
          <group ref={target} position={[0, 0, -300]} name="target">
            <mesh
              position={[0, 20, 0]}
              renderOrder={1000}
              material={crossMaterial}
            >
              <boxBufferGeometry attach="geometry" args={[40, 1, 1]} />
            </mesh>
            <mesh
              position={[0, -20, 0]}
              renderOrder={1000}
              material={crossMaterial}
            >
              <boxBufferGeometry attach="geometry" args={[40, 1, 1]} />
            </mesh>
            <mesh
              position={[20, 0, 0]}
              renderOrder={1000}
              material={crossMaterial}
            >
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
            ref={laserLight}
            position={[0, 0.5, -1]}
            distance={1}
            intensity={0}
            color="lightgreen"
          />
          <group ref={laserGroup}>
            {lasers.map((t, i) => (
              //PLACE ALL WEAPON FIRING POINTS HERE // DIFFERENT ref FOR DIFFERENT WEAPON GROUPS
              <group key={i}>
                <mesh
                  position={[-0.7, -1.5, -0.2]}
                  geometry={laserGeometry}
                  material={laserMaterial}
                  emissive="#fff"
                />
                <mesh
                  position={[0.7, -1.5, -0.2]}
                  geometry={laserGeometry}
                  material={laserMaterial}
                  emissive="#fff"
                />
              </group>
            ))}
          </group>
          {mechBP.servoList.map((servo, index) => (
            <group
              key={index}
              position={[servo.offset.x, servo.offset.y, servo.offset.z]}
            >
              {servoShapes(servo, mechBP.material)}
              {mechBP.servoWeaponList(servo.id).map((weapon, j) => (
                <group
                  key={j}
                  position={[weapon.offset.x, weapon.offset.y, weapon.offset.z]}
                >
                  {weaponShapes(weapon, mechBP.material)}
                </group>
              ))}
            </group>
          ))}
        </group>
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
          position={[0, 0.2, 0.75]}
          distance={1}
          intensity={0}
          color="lightblue"
        />
      </group>
    </>
  );
}

/*
<group rotation={[0, 0, 0]}>
            <mesh visible geometry={nodes.Default.geometry} scale={[1, 1, 1]}>
              <meshStandardMaterial
                attach="material"
                color="grey"
                roughness={1}
                metalness={0}
                emissive="#333"
              />
            </mesh>
          </group>
          */
