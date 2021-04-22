import * as THREE from "three";
import useStore from "../stores/store";
import { useLoader } from "react-three-fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

//const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

//scene.add( line );
//EdgesGeometry( geometry : BufferGeometry, thresholdAngle : Integer )

//ExtrudeGeometry
//https://threejs.org/docs/?q=geomet#api/en/geometries/ExtrudeGeometry
const length = 5,
  width = 5;

const extrudeShape = new THREE.Shape();
extrudeShape.moveTo(0, 0);
extrudeShape.lineTo(0, width);
extrudeShape.lineTo(length, width);
extrudeShape.lineTo(length, 0);
extrudeShape.lineTo(0, 0);

const extrudeSettings = {
  steps: 2,
  depth: 3,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 0,
  bevelSegments: 1,
};

const geoList = {
  box: new THREE.BoxBufferGeometry(5, 5, 5),
  //BoxGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)

  extrudeBox: new THREE.ExtrudeGeometry(extrudeShape, extrudeSettings),

  circle: new THREE.CircleGeometry(5, 8),
  //CircleGeometry(radius : Float, segments : Integer, thetaStart : Float, thetaLength : Float)

  cone: new THREE.ConeGeometry(5, 20, 8),
  //ConeGeometry(radius : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)

  cylinder: new THREE.CylinderGeometry(2, 2, 30, 8),
  //CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)

  dodecahedron: new THREE.DodecahedronGeometry(5, 0),
  //DodecahedronGeometry(radius : Float, detail : Integer) //20
  /*
edges : new THREE.EdgesGeometry(geometryBox),
line : new THREE.LineSegments(
  edges,
  new THREE.LineBasicMaterial({ color: 0xffffff })
),
*/
  icosahedron: new THREE.IcosahedronGeometry(5, 0),
  //IcosahedronGeometry(radius : Float, detail : Integer) //12

  //LatheGeometry
  //https://threejs.org/docs/?q=geomet#api/en/geometries/LatheGeometry

  octahedron: new THREE.OctahedronGeometry(5, 0),
  //OctahedronGeometry(radius : Float, detail : Integer) //8

  //ParametricGeometry
  //https://threejs.org/docs/?q=geomet#api/en/geometries/ParametricGeometry

  //const geometry = new THREE.PlaneGeometry( 5, 20, 32 );
  /*
  ring: {
    geo: new THREE.RingBufferGeometry(1, 1.01, 12),
    mat: new THREE.MeshBasicMaterial({
      color: new THREE.Color("lightgreen"),
      side: THREE.DoubleSide,
    }),
  },
  */
  //RingGeometry(innerRadius : Float, outerRadius : Float, thetaSegments : Integer, phiSegments : Integer, thetaStart : Float, thetaLength : Float)

  //const geometry = new THREE.SphereGeometry( 5, 32, 32 );

  tetrahedron: new THREE.TetrahedronGeometry(5, 0),
  //TetrahedronGeometry(radius : Float, detail : Integer) //4

  torus: new THREE.TorusGeometry(5, 1, 5, 8),
  //const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 ); //3d ring

  //TorusKnotGeometry

  //TubeGeometry
};
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

function Station({ station }) {
  const material = new THREE.MeshPhongMaterial({
    color: station.color,
    emissive: station.color,
    emissiveIntensity: 0.01,
    roughness: station.roughness,
    metalness: station.metalness,
  });

  //const texture_map = useLoader(TextureLoader, ["images/maps/?.jpg"]);
  return (
    <group
      position={[station.position.x, station.position.y, station.position.z]}
      rotation={[station.rotation.x, station.rotation.y, station.rotation.z]}
      scale={[station.size, station.size, station.size]}
    >
      <pointLight
        position={[0, 5, 0]}
        distance={0}
        intensity={0.2}
        color="lightblue"
      />

      <pointLight
        position={[0, -5, 0]}
        distance={0}
        intensity={0.2}
        color="lightblue"
      />
      <pointLight
        position={[0, 0, -7]}
        distance={0}
        intensity={0.2}
        color="lightblue"
      />
      <mesh
        scale={[1, 1, 1]}
        geometry={geoList.cylinder}
        material={material}
      ></mesh>
      <mesh
        scale={[0.6, 0.6, 0.6]}
        rotation={[0, 0, Math.PI / 2]}
        position={[0, 0, 0]}
        geometry={geoList.cylinder}
        material={material}
      ></mesh>
      <mesh
        scale={[0.75, 0.75, 0.75]}
        rotation={[0, Math.PI / 2, Math.PI / 2]}
        position={[0, 0, 0]}
        geometry={geoList.cylinder}
        material={material}
      ></mesh>
      <mesh
        scale={[2, 1.5, 2]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        geometry={geoList.torus}
        material={material}
      ></mesh>
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

/*
{Object.entries(geoList).map(([key, geo]) => (
        <group
          key={key}
          position={[-25 + i++ * 5, 0, 0]}
          scale={[station.size, station.size, station.size]}
        >
          <mesh geometry={geo}>
            <meshStandardMaterial
              attach="material"
              color={station.color}
              roughness={station.roughness}
              //metalness={station.metalness}
              emissive="lightblue"
              emissiveIntensity="0.1"
              //wireframe
            />
          </mesh>
        </group>
      ))}
      */
