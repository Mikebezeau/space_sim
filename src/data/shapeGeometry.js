import * as THREE from "three";

//const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

//scene.add( line );
//EdgesGeometry( geometry : BufferGeometry, thresholdAngle : Integer )

//ExtrudeGeometry
//https://threejs.org/docs/?q=geomet#api/en/geometries/ExtrudeGeometry
const length = 0.75,
  width = 0.75;
/*
  const extrudeShape = new THREE.Shape();
  extrudeShape.moveTo(0, 0);
  extrudeShape.lineTo(0, width);
  extrudeShape.lineTo(length, width);
  extrudeShape.lineTo(length, 0);
  extrudeShape.lineTo(0, 0);*/

const extrudeShape = new THREE.Shape();
extrudeShape.moveTo(-length, -width);
extrudeShape.lineTo(-length, width);
extrudeShape.lineTo(length, width);
extrudeShape.lineTo(length, -width);
extrudeShape.lineTo(-length, -width);

const extrudeSettings = {
  steps: 2,
  depth: 0.3,
  bevelEnabled: true,
  bevelThickness: 0.2,
  bevelSize: 0.2,
  bevelOffset: 0,
  bevelSegments: 1,
};

export const geoList = {
  box: [new THREE.BoxBufferGeometry(1, 1, 1)],
  //BoxGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)

  extrudeBox: [new THREE.ExtrudeGeometry(extrudeShape, extrudeSettings)],

  circle: [new THREE.CircleGeometry(1, 8)],
  //CircleGeometry(radius : Float, segments : Integer, thetaStart : Float, thetaLength : Float)

  cone: [new THREE.ConeGeometry(1, 1, 8)],
  //ConeGeometry(radius : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)

  cylinder: [new THREE.CylinderGeometry(1, 1, 1, 8)],
  //CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)

  dodecahedron: [new THREE.DodecahedronGeometry(1, 0)],
  //DodecahedronGeometry(radius : Float, detail : Integer) //20
  /*
  edges : new THREE.EdgesGeometry(geometryBox),
  line : new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  ),
  */
  icosahedron: [new THREE.IcosahedronGeometry(1, 0)],
  //IcosahedronGeometry(radius : Float, detail : Integer) //12

  //LatheGeometry
  //https://threejs.org/docs/?q=geomet#api/en/geometries/LatheGeometry

  octahedron: [new THREE.OctahedronGeometry(1, 0)],
  //OctahedronGeometry(radius : Float, detail : Integer) //8

  //ParametricGeometry
  //https://threejs.org/docs/?q=geomet#api/en/geometries/ParametricGeometry

  plane: [new THREE.PlaneGeometry(1, 1, 1)],
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

  sphere: [new THREE.SphereGeometry(1, 32, 32)],

  tetrahedron: [new THREE.TetrahedronGeometry(1, 0)],
  //TetrahedronGeometry(radius : Float, detail : Integer) //4

  torus: [
    new THREE.TorusGeometry(1, 0.2, 4, 16),
    new THREE.TorusGeometry(1, 0.2, 0, 0),
  ],
  //const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 ); //3d ring
  //TorusGeometry(radius : Float, tube : Float, radialSegments : Integer, tubularSegments : Integer, arc : Float)

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
