import * as THREE from "three";
import useStore from "../store";
import { useLoader } from "react-three-fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

const geometryBox = new THREE.BoxBufferGeometry(1, 1, 1);
//BoxGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)

const geometryCircle = new THREE.CircleGeometry(5, 32);
//CircleGeometry(radius : Float, segments : Integer, thetaStart : Float, thetaLength : Float)

const geometryCone = new THREE.ConeGeometry(5, 20, 32);
//ConeGeometry(radius : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)

const geometryCylinder = new THREE.CylinderGeometry(5, 5, 20, 32);
//CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)

//DodecahedronGeometry(radius : Float, detail : Integer) //20

const edges = new THREE.EdgesGeometry(geometryBox);
const line = new THREE.LineSegments(
  edges,
  new THREE.LineBasicMaterial({ color: 0xffffff })
);
//scene.add( line );
//EdgesGeometry( geometry : BufferGeometry, thresholdAngle : Integer )

//ExtrudeGeometry
//https://threejs.org/docs/?q=geomet#api/en/geometries/ExtrudeGeometry

//IcosahedronGeometry(radius : Float, detail : Integer) //12

//LatheGeometry
//https://threejs.org/docs/?q=geomet#api/en/geometries/LatheGeometry

//OctahedronGeometry(radius : Float, detail : Integer) //8

//ParametricGeometry
//https://threejs.org/docs/?q=geomet#api/en/geometries/ParametricGeometry

//const geometry = new THREE.PlaneGeometry( 5, 20, 32 );

const geometryRing = new THREE.RingBufferGeometry(1, 1.01, 12);
const materialRing = new THREE.MeshBasicMaterial({
  color: new THREE.Color("lightgreen"),
  side: THREE.DoubleSide,
});
//RingGeometry(innerRadius : Float, outerRadius : Float, thetaSegments : Integer, phiSegments : Integer, thetaStart : Float, thetaLength : Float)

//const geometry = new THREE.SphereGeometry( 5, 32, 32 );

//TetrahedronGeometry(radius : Float, detail : Integer) //4

/*
//TextGeometry
const loader = new THREE.FontLoader();

loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

	const geometry = new THREE.TextGeometry( 'Hello three.js!', {
		font: font,
		size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	} );
} );
*/

//const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 ); //3d ring

//TorusKnotGeometry

//TubeGeometry

/*
//BufferGeometryLoader
// instantiate a loader
const loader = new THREE.BufferGeometryLoader();

// load a resource
loader.load(
	// resource URL
	'models/json/pressure.json',

	// onLoad callback
	function ( geometry ) {
		const material = new THREE.MeshLambertMaterial( { color: 0xF5F5F5 } );
		const object = new THREE.Mesh( geometry, material );
		scene.add( object );
	},

	// onProgress callback
	function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},

	// onError callback
	function ( err ) {
		console.log( 'An error happened' );
	}
);
*/

const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

function Station({ station }) {
  const texture_maps = useLoader(TextureLoader, ["images/maps/sunmap.jpg"]);
  return (
    <group
      position={[station.position.x, station.position.y, station.position.z]}
      rotation={[station.rotation.x, station.rotation.y, station.rotation.z]}
    >
      <mesh>
        <boxGeometry attach="geometry" args={[station.size, 1]} />
        <meshStandardMaterial
          attach="material"
          color={station.color}
          roughness={station.roughness}
          metalness={station.metalness}
          emissive="lightblue"
          emissiveIntensity="0.4"
          //wireframe
        />
      </mesh>
      <group>
        {station.ports.map((port, index) => (
          <mesh key={index} position={[port.x, port.y, port.z]}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            <meshStandardMaterial
              attach="material"
              color={station.color}
              emissive="lightblue"
              emissiveIntensity="0.2"
              //wireframe
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Stations() {
  const stations = useStore((state) => state.stations);

  return (
    <>
      {stations.map((station, index) => (
        <Station key={index} station={station} />
      ))}
    </>
  );
}

export default Stations;
