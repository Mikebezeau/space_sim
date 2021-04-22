import * as THREE from "three";
import { useRef } from "react";
import { useThree, useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useStore from "../stores/store";
import { SCALE, FLIGHT, MAIN_MENU, EQUIPMENT_SCREEN } from "../util/gameUtil";
import SystemMap from "./SystemMap";

const geometry = new THREE.BoxBufferGeometry(0.25, 0.25, 30);
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
  const { nodes } = useLoader(GLTFLoader, "models/arwing.glb");
  const mutation = useStore((state) => state.mutation);
  const { clock, mouse, ray } = mutation;
  const ship = useStore((state) => state.ship);
  const speed = useStore((state) => state.speed);
  const sytemScale = useStore((state) => state.sytemScale);
  const playerScreen = useStore((state) => state.playerScreen);
  const planets = useStore((state) => state.planets);
  const lasers = useStore((state) => state.lasers);
  const main = useRef();
  const map = useRef();
  const laserGroup = useRef();
  const laserLight = useRef();
  const exhaust = useRef();
  const engineLight = useRef();
  const cross = useRef();
  const target = useRef();
  const { camera } = useThree();
  const cameraDummy = new THREE.Object3D();
  const rotateQuat = new THREE.Quaternion(),
    camQuat = new THREE.Quaternion(),
    curQuat = new THREE.Quaternion(),
    endQuat = new THREE.Quaternion();

  useFrame(() => {
    if (playerScreen === FLIGHT && main.current) flyingShip();
  });

  function flyingShip() {
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
    //set cameraDummy to be behind ship
    cameraDummy.position.copy(main.current.position);
    cameraDummy.rotation.copy(main.current.rotation);
    cameraDummy.translateZ(8 * SCALE);
    cameraDummy.translateY(3 * SCALE);

    const lerpAmount = 0.95; //distance(state.camera.position, camDummy.position) / 0.8;
    camera.position.lerp(cameraDummy.position, lerpAmount);
    //get end rotation angle for camera for smooth follow
    camQuat.setFromEuler(camera.rotation);
    // rotate towards target quaternion
    camera.rotation.setFromQuaternion(camQuat.slerp(endQuat, 0.2).normalize());

    //set system map rotation to match ship rotation
    cameraDummy.position.copy(camera.position);
    cameraDummy.rotation.copy(camera.rotation);
    cameraDummy.translateY(50 * SCALE);
    cameraDummy.translateZ(-80 * SCALE);
    map.current.position.copy(cameraDummy.position);
    //map.current.rotation.copy();

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
      group.position.z -= 20;
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
    ray.direction.copy(direction.negate());

    //update crosshair / target box switch if weapon hit possible
    crossMaterial.color = mutation.hits ? lightgreen : hotpink;
    cross.current.visible = !mutation.hits;
    target.current.visible = !!mutation.hits;
  }

  return (
    <>
      <group
        ref={map}
        rotation={[Math.PI / 1.5, 0, 0]}
        scale={[SCALE, SCALE, SCALE]}
      >
        <SystemMap planets={planets} />
      </group>
      <group
        ref={main}
        scale={[SCALE, SCALE, SCALE]}
        position={[ship.position.x, ship.position.y, ship.position.z]}
        rotation={[ship.rotation.x, ship.rotation.y, ship.rotation.z]}
      >
        <group>
          <group ref={cross} position={[0, 0, -300]} name="cross">
            <mesh renderOrder={1000} material={crossMaterial}>
              <boxBufferGeometry attach="geometry" args={[20, 2, 2]} />
            </mesh>
            <mesh renderOrder={1000} material={crossMaterial}>
              <boxBufferGeometry attach="geometry" args={[2, 20, 2]} />
            </mesh>
          </group>
          <group ref={target} position={[0, 0, -300]} name="target">
            <mesh
              position={[0, 20, 0]}
              renderOrder={1000}
              material={crossMaterial}
            >
              <boxBufferGeometry attach="geometry" args={[40, 2, 2]} />
            </mesh>
            <mesh
              position={[0, -20, 0]}
              renderOrder={1000}
              material={crossMaterial}
            >
              <boxBufferGeometry attach="geometry" args={[40, 2, 2]} />
            </mesh>
            <mesh
              position={[20, 0, 0]}
              renderOrder={1000}
              material={crossMaterial}
            >
              <boxBufferGeometry attach="geometry" args={[2, 40, 2]} />
            </mesh>
            <mesh
              position={[-20, 0, 0]}
              renderOrder={1000}
              material={crossMaterial}
            >
              <boxBufferGeometry attach="geometry" args={[2, 40, 2]} />
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
              <group key={i}>
                <mesh
                  position={[-0.7, -1.5, -0.2]}
                  geometry={geometry}
                  material={laserMaterial}
                  emissive="#fff"
                />
                <mesh
                  position={[0.7, -1.5, -0.2]}
                  geometry={geometry}
                  material={laserMaterial}
                  emissive="#fff"
                />
              </group>
            ))}
          </group>
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
