import * as THREE from "three";
import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
//import { useLoader } from "@react-three/fiber";
//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; //const { nodes } = useLoader(GLTFLoader, "models/arwing.glb");
import useStore from "../stores/store";
import useEquipStore from "../stores/equipStore";
import BuildMech from "./BuildMech";
import { SCALE } from "../util/gameUtil";

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
  const { clock, mouse, ray } = mutation;
  const ship = useStore((state) => state.ship);
  const speed = useStore((state) => state.speed);
  const lasers = useStore((state) => state.lasers);
  const setShipPosition = useStore((state) => state.actions.setShipPosition);
  const playerMechBP = useEquipStore((state) => state.playerMechBP); //for rendering ship servo shapes

  const main = useRef();
  const laserLight = useRef();
  const exhaust = useRef();
  const engineLight = useRef();
  const cross = useRef();
  const target = useRef();

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
    main.current.translateZ(-speed * SCALE);
    //save ship position / rotation to state
    //ship.position.copy(main.current.position);
    setShipPosition(main.current.position); //made this set to state in this way as to reflect updates to other components (SystemMap)
    ship.rotation.copy(main.current.rotation);

    //CAMERA
    //set tempObjectDummy to be behind ship
    tempObjectDummy.position.copy(main.current.position);
    tempObjectDummy.rotation.copy(main.current.rotation);
    tempObjectDummy.translateZ(8 * SCALE * playerMechBP[0].scale);
    tempObjectDummy.translateY(2 * SCALE * playerMechBP[0].scale);

    const lerpAmount = 0.95; //distance(state.camera.position, camDummy.position) / 0.8;
    camera.position.lerp(tempObjectDummy.position, lerpAmount);
    //get end rotation angle for camera for smooth follow
    camQuat.setFromEuler(camera.rotation);
    // rotate towards target quaternion
    camera.rotation.setFromQuaternion(camQuat.slerp(endQuat, 0.2).normalize());

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

    //weapon firing light blast
    laserLight.current.intensity +=
      ((lasers.length && Date.now() - lasers[lasers.length - 1].time < 100
        ? 1
        : 0) -
        laserLight.current.intensity) *
      0.3;

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
      <group
        ref={main}
        scale={SCALE}
        position={[ship.position.x, ship.position.y, ship.position.z]}
        rotation={[ship.rotation.x, ship.rotation.y, ship.rotation.z]}
      >
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

        <BuildMech mechBP={playerMechBP[0]} />

        <pointLight
          ref={laserLight}
          position={[0, 0, -0.2]}
          distance={1}
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
