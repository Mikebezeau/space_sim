import * as THREE from "three";
import SimplexNoise from "simplex-noise";
import { distance } from "../util/gameUtil";
import { SCALE_PLANET_WALK } from "../util/constants";
//const simplex = new SimplexNoise(Math.random);
//const value2d = simplex.noise2D(x, y);

export default class Terrain {
  constructor(seed, genCities, hills = 1, elevation = 0) {
    this._hills = hills;
    this._elevation = elevation;
    this._dimension = 5000 * SCALE_PLANET_WALK;
    this._segment = 100;
    this._vertices = this._segment + 1;
    this._simplex = new SimplexNoise(seed);
    this._cityPositions = this._cityInfo(genCities);
    this._geometry = this._createGeometry();
    this.roads = this._createRoads();
    this._material = new THREE.MeshPhongMaterial({
      vertexColors: true,
      flatShading: true,
      shininess: 0,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
  }

  _cityInfo(genCities) {
    let currentCities = [];
    genCities.forEach((city) => {
      currentCities.push(this._cityPlacementPosition(city, currentCities));
    });
    console.log(currentCities);
    return currentCities;
  }

  _calculateY(vtx) {
    return Math.pow(vtx, 2.5) * 350 * this._hills;
  }

  _checkSpotTaken(currentCities, i, j, citySizeVerticesHalf = 0) {
    let isTaken = undefined;
    currentCities.forEach((city, index) => {
      if (
        i >= city.vertI - city.citySizeVerticesHalf - citySizeVerticesHalf &&
        i <= city.vertI + city.citySizeVerticesHalf + citySizeVerticesHalf &&
        j >= city.vertJ - city.citySizeVerticesHalf - citySizeVerticesHalf &&
        j <= city.vertJ + city.citySizeVerticesHalf + citySizeVerticesHalf
      ) {
        //console.log(i, j, index);
        isTaken = index;
      }
    });
    return isTaken;
  }

  _cityPlacementPosition(city, currentCities) {
    const dimension = this._dimension;
    const segment = this._segment;
    const vertices = this._vertices;

    let currentflattestVal = undefined;
    let currentHeight = undefined;
    let flattestAreaCenterPosition = {};
    //find area of map that is most level
    //calculate where to loop through on map, area that the city will fit into, add border zone at edge of map as well (4)
    const citySizeVerticesHalf = Math.ceil(
      city.size / (dimension / segment) / 2
    );
    const borderVertices = Math.floor(vertices / 10);
    const beginI = citySizeVerticesHalf + borderVertices;
    const endI = vertices - citySizeVerticesHalf - borderVertices;
    const beginJ = citySizeVerticesHalf + borderVertices;
    const endJ = vertices - citySizeVerticesHalf - borderVertices;

    //console.log(beginI, endI, beginJ, endJ);
    for (let i = beginI; i <= endI; i++) {
      for (let j = beginJ; j <= endJ; j++) {
        //checks area all around this location for any placed cities and avoids that area
        const alreadyTakenByCityIndex = this._checkSpotTaken(
          currentCities,
          i,
          j,
          citySizeVerticesHalf
        );
        if (alreadyTakenByCityIndex === undefined) {
          const zoneAverageHeight = this._checkZoneFlattness(
            i,
            j,
            citySizeVerticesHalf,
            0
          ).averageHeight;

          const cumulativeHeightVariation = this._checkZoneFlattness(
            i,
            j,
            citySizeVerticesHalf,
            zoneAverageHeight
          ).cumulativeHeightVariation;

          //if undefined
          currentflattestVal =
            currentflattestVal === undefined
              ? cumulativeHeightVariation
              : currentflattestVal;

          //console.log("totalHeight", totalHeight);
          //console.log("currentflattestVal", currentflattestVal);

          if (cumulativeHeightVariation < currentflattestVal) {
            currentHeight = JSON.parse(JSON.stringify(zoneAverageHeight));
            currentflattestVal = JSON.parse(
              JSON.stringify(cumulativeHeightVariation)
            );
            flattestAreaCenterPosition = {
              position: {
                x: j * (dimension / segment) - dimension / 2,
                y: currentHeight,
                z: i * (dimension / segment) - dimension / 2,
              },
              size: city.size,
              vertI: i,
              vertJ: j,
              citySizeVerticesHalf: citySizeVerticesHalf,
              cumulativeHeightVariation: currentflattestVal,
              elevation: currentHeight,
            };
          }
        } //end if
        else {
          //console.log("alreadyTakenByCityIndex", alreadyTakenByCityIndex);
        }
      }
    }
    //console.log("_cityPlacementPosition", flattestAreaCenterPosition);
    return flattestAreaCenterPosition;
  }

  //using this function to get average height and then height deviation on a second run
  _checkZoneFlattness(i, j, citySizeVerticesHalf, averageHeight) {
    const vertices = this._vertices;
    const simplex = this._simplex;
    let numVertices = 0;
    let totalHeight = 0;
    let cumulativeHeightVariation = 0;
    //check every verticy within the limits of city size and calc average height
    for (let k = i - citySizeVerticesHalf; k <= i + citySizeVerticesHalf; k++) {
      for (
        let l = j - citySizeVerticesHalf;
        l <= j + citySizeVerticesHalf;
        l++
      ) {
        const ni = k / vertices - 0.5;
        const nj = l / vertices - 0.5;
        const fVal = simplex.noise2D(ni, nj) + 1;
        const sVal = 0.5 * simplex.noise2D(ni * 2, nj * 2) + 1;
        const tVal = 0.25 * simplex.noise2D(ni * 4, nj * 4) + 1;
        let vtx = (fVal + sVal + tVal) / 5;

        numVertices++;
        const height = this._calculateY(vtx);
        totalHeight += height;
        cumulativeHeightVariation =
          cumulativeHeightVariation + Math.abs(height - averageHeight);
      }
    }
    averageHeight = totalHeight / numVertices;
    return { averageHeight, cumulativeHeightVariation };
  }

  _createGeometry() {
    const dimension = this._dimension;
    const segment = this._segment;
    const vertices = this._vertices;
    const simplex = this._simplex;

    const geometry = new THREE.PlaneGeometry(
      dimension,
      dimension,
      segment,
      segment
    );
    geometry.rotateX(-Math.PI / 2);

    const colors = [];
    for (let i = 0; i < vertices; i++) {
      for (let j = 0; j < vertices; j++) {
        const idx = i * vertices + j;
        const ni = i / vertices - 0.5;
        const nj = j / vertices - 0.5;
        const fVal = simplex.noise2D(ni, nj) + 1;
        const sVal = 0.5 * simplex.noise2D(ni * 2, nj * 2) + 1;
        const tVal = 0.25 * simplex.noise2D(ni * 4, nj * 4) + 1;
        let vtx = (fVal + sVal + tVal) / 5;

        //if within city limits set y to the cities elevation
        const isCitySpotIndex = this._checkSpotTaken(this._cityPositions, i, j);
        if (isCitySpotIndex !== undefined) {
          geometry.attributes.position.setY(
            idx,
            this._cityPositions[isCitySpotIndex].elevation
          );
          colors.push(0.3, 0.3, 0.3);
        } else {
          geometry.attributes.position.setY(idx, this._calculateY(vtx));

          colors.push(vtx, 0.2 + vtx / 2, 0.2 + vtx / 10);
        }
        /*
        vtx += this._elevation;
        if (vtx > 0.8) {
          colors.push(0.83, 0.73, 0.26);
        } else if (vtx < 0.8 && vtx > 0.45) {
          colors.push(0.55, 0.95, 0.35);
        } else {
          colors.push(0.35, 0.75, 0.25);
          //colors.push(0.28, 1, 0.78);
        }*/
      }
    }

    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    return geometry;
  }

  _createRaceRoad() {
    const cities = this._cityPositions;

    let roadMeshList = [];
    //big roads between cities

    if (cities.length > 1) {
      const centerCity = cities[0];

      cities.forEach((city, index) => {
        if (index !== 0) {
          //choose position in centerCity for main road to exit
          const hubOffset = new THREE.Vector3(
            centerCity.position.x - city.position.x,
            0,
            centerCity.position.z - city.position.z
          ).normalize();

          const scale = 2 * SCALE_PLANET_WALK;
          //get distance without the y
          const distanceToHub = distance(
            { x: centerCity.position.x, y: 0, z: centerCity.position.z },
            { x: city.position.x, y: 0, z: city.position.z }
          );
          const ls = Math.floor(distanceToHub * 0.05); // length segments
          const ws = 4; // width segments, tracks

          const lss = ls + 1;
          const wss = ws + 1;

          const faceCount = ls * ws * 2;
          const vertexCount = lss * wss;

          const g = new THREE.BufferGeometry();

          g.faceIndices = new Uint32Array(faceCount * 3);
          g.vertices = new Float32Array(vertexCount * 3);
          //g.normals = new Float32Array( vertexCount * 3 );
          //g.uvs = new Float32Array( vertexCount * 2 );

          g.setIndex(new THREE.BufferAttribute(g.faceIndices, 1));
          g.addAttribute(
            "position",
            new THREE.BufferAttribute(g.vertices, 3).setDynamic(true)
          );
          //g.addAttribute( 'normal', new THREE.BufferAttribute( g.normals, 3 ).setDynamic( true ) );
          //g.addAttribute( 'uv', new THREE.BufferAttribute( g.uvs, 2 ) );

          let idxCount = 0;

          for (let j = 0; j < ls; j++) {
            for (let i = 0; i < ws; i++) {
              // 2 faces / segment,  3 vertex indices
              const a = wss * j + i;
              const b1 = wss * (j + 1) + i; // right-bottom
              const c1 = wss * (j + 1) + 1 + i;
              const b2 = wss * (j + 1) + 1 + i; // left-top
              const c2 = wss * j + 1 + i;

              g.faceIndices[idxCount] = a; // right-bottom
              g.faceIndices[idxCount + 1] = b1;
              g.faceIndices[idxCount + 2] = c1;

              g.faceIndices[idxCount + 3] = a; // left-top
              g.faceIndices[idxCount + 4] = b2;
              g.faceIndices[idxCount + 5] = c2;

              g.addGroup(idxCount, 6, i); // write groups for multi material

              idxCount += 6;
            }
          }
          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(
              hubOffset.x * 20 * SCALE_PLANET_WALK,
              0,
              hubOffset.z * 20 * SCALE_PLANET_WALK
            ),
            new THREE.Vector3(
              hubOffset.x * 20 * SCALE_PLANET_WALK,
              2,
              hubOffset.z * 20 * SCALE_PLANET_WALK
            ),
            new THREE.Vector3(
              (centerCity.position.x - city.position.x) / 2,
              10,
              (centerCity.position.z - city.position.z) / 2
            ),
            new THREE.Vector3(
              centerCity.position.x -
                city.position.x -
                hubOffset.x * 20 * SCALE_PLANET_WALK,
              centerCity.position.y - city.position.y, // + 10 * SCALE_PLANET_WALK,
              centerCity.position.z -
                city.position.z -
                hubOffset.z * 20 * SCALE_PLANET_WALK
            ),
          ]);
          const points = curve.getPoints(ls);
          const curveGeometry = new THREE.BufferGeometry().setFromPoints(
            points
          );

          let tangent;
          const normal = new THREE.Vector3(0, 0, 0);
          const binormal = new THREE.Vector3(0, 1, 0);

          let x, y, z;
          let vIdx = 0; // vertex index
          let posIdx; // position  index

          for (var j = 0; j < lss; j++) {
            // length

            for (var i = 0; i < wss; i++) {
              // width

              // calculate here the coordinates according to your wishes

              tangent = curve.getTangent(j / ls); //  .. / length segments

              normal.crossVectors(tangent, binormal);

              binormal.crossVectors(normal, tangent); // new binormal

              normal.normalize().multiplyScalar(scale); //0.25);

              x = points[j].x + (i - ws / 2) * normal.x;
              y = points[j].y;
              z = points[j].z + (i - ws / 2) * normal.z;

              posIdx = vIdx * 3;
              g.vertices[posIdx] = x;
              g.vertices[posIdx + 1] = y;
              g.vertices[posIdx + 2] = z;

              vIdx++;
            }
          }

          g.attributes.position.needsUpdate = true;
          //g.attributes.normal.needsUpdate = true;

          var material = [
            new THREE.MeshBasicMaterial({
              color: 0x00ff00,
              side: THREE.DoubleSide,
              wireframe: true,
            }),
            new THREE.MeshBasicMaterial({
              color: 0xff0000,
              side: THREE.DoubleSide,
              wireframe: true,
            }),
            new THREE.MeshBasicMaterial({
              color: 0x0000ff,
              side: THREE.DoubleSide,
              wireframe: true,
            }),
            new THREE.MeshBasicMaterial({
              color: 0xff00ff,
              side: THREE.DoubleSide,
              wireframe: true,
            }),
          ];

          g.translate(city.position.x, city.position.y, city.position.z);
          var mesh = new THREE.Mesh(g, material);

          /*var curveMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
          curveGeometry.translate(
            city.position.x,
            city.position.y,
            city.position.z
          );
          var curveLine = new THREE.Line(curveGeometry, curveMaterial);
*/
          roadMeshList = roadMeshList.concat({
            endPosition: centerCity.position,
            startPosition: city.position,
            mesh: mesh,
          });
          /*
          roadMeshList = roadMeshList.concat({
            endPosition: centerCity.position,
            startPosition: city.position,
            mesh: curveLine,
          });
          */
        } //end if
      });
    }
    //console.log("roads", roadMeshList);
    return roadMeshList;
  }

  _createRoads() {
    const cities = this._cityPositions;
    const groundGeometry = this._geometry;

    const roadMaterial =
      /*new THREE.MeshBasicMaterial({
      color: new THREE.Color("#222"),
    });*/
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
        wireframe: true,
      });

    let roadMeshList = [];
    //big roads between cities

    if (cities.length > 1) {
      const centerCity = cities[0];

      cities.forEach((city, index) => {
        if (index !== 0) {
          //choose position in centerCity for main road to exit
          let direction = new THREE.Vector3();
          const hubOffset = new THREE.Vector3(
            centerCity.position.x - city.position.x,
            0,
            centerCity.position.z - city.position.z
          ).normalize();

          const scale = 8 * SCALE_PLANET_WALK;
          /*
          if (hubOffset.x > 0) {
            direction.setX(1);
            hubOffset.setX(
              (centerCity.position.x + centerCity.size) / scale,
              0,
              centerCity.position.z / scale
            );
          }
          */
          //get distance without the y
          const distanceToHub = distance(
            { x: centerCity.position.x, y: 0, z: centerCity.position.z },
            { x: city.position.x, y: 0, z: city.position.z }
          );
          const ls = Math.floor(distanceToHub * 0.05); // length segments
          const ws = 1; //4; // width segments, tracks

          const lss = ls + 1;
          const wss = ws + 1;

          const faceCount = ls * ws * 2;
          const vertexCount = lss * wss;

          const g = new THREE.BufferGeometry();

          g.faceIndices = new Uint32Array(faceCount * 3);
          g.vertices = new Float32Array(vertexCount * 3);
          //g.normals = new Float32Array( vertexCount * 3 );
          //g.uvs = new Float32Array( vertexCount * 2 );

          g.setIndex(new THREE.BufferAttribute(g.faceIndices, 1));
          g.addAttribute(
            "position",
            new THREE.BufferAttribute(g.vertices, 3).setDynamic(true)
          );
          //g.addAttribute( 'normal', new THREE.BufferAttribute( g.normals, 3 ).setDynamic( true ) );
          //g.addAttribute( 'uv', new THREE.BufferAttribute( g.uvs, 2 ) );

          let idxCount = 0;

          for (let j = 0; j < ls; j++) {
            for (let i = 0; i < ws; i++) {
              // 2 faces / segment,  3 vertex indices
              const a = wss * j + i;
              const b1 = wss * (j + 1) + i; // right-bottom
              const c1 = wss * (j + 1) + 1 + i;
              const b2 = wss * (j + 1) + 1 + i; // left-top
              const c2 = wss * j + 1 + i;

              g.faceIndices[idxCount] = a; // right-bottom
              g.faceIndices[idxCount + 1] = b1;
              g.faceIndices[idxCount + 2] = c1;

              g.faceIndices[idxCount + 3] = a; // left-top
              g.faceIndices[idxCount + 4] = b2;
              g.faceIndices[idxCount + 5] = c2;

              g.addGroup(idxCount, 6, i); // write groups for multi material

              idxCount += 6;
            }
          }
          const intPosition = new THREE.Vector3(
            hubOffset.x * 20 * SCALE_PLANET_WALK,
            0,
            hubOffset.z * 20 * SCALE_PLANET_WALK
          );
          //var secondPosition = intPosition.clone().add(direction);
          //define path of line curve
          const curve = new THREE.CatmullRomCurve3([
            //intPosition,
            //secondPosition,
            new THREE.Vector3(
              0, //hubOffset.x * 20 * SCALE_PLANET_WALK,
              0,
              0 //hubOffset.z * 20 * SCALE_PLANET_WALK
            ),
            new THREE.Vector3(
              (centerCity.position.x - city.position.x) * 0.2,
              20 * SCALE_PLANET_WALK,
              (centerCity.position.z - city.position.z) * 0.2
            ),
            new THREE.Vector3(
              (centerCity.position.x - city.position.x) * 0.5,
              centerCity.position.y - city.position.y + 50 * SCALE_PLANET_WALK,
              (centerCity.position.z - city.position.z) * 0.5
            ),
            new THREE.Vector3(
              centerCity.position.x -
                city.position.x -
                hubOffset.x * 20 * SCALE_PLANET_WALK,
              centerCity.position.y - city.position.y + 50 * SCALE_PLANET_WALK,
              centerCity.position.z -
                city.position.z -
                hubOffset.z * 20 * SCALE_PLANET_WALK
            ),
          ]);
          const points = curve.getPoints(ls);
          let tangent;
          const normal = new THREE.Vector3(0, 0, 0);
          const binormal = new THREE.Vector3(0, 1, 0);

          let x, y, z;
          let vIdx = 0; // vertex index
          let posIdx; // position  index

          for (var j = 0; j < lss; j++) {
            // length

            for (var i = 0; i < wss; i++) {
              // width

              // calculate here the coordinates according to your wishes

              tangent = curve.getTangent(j / ls); //  .. / length segments

              normal.crossVectors(tangent, binormal);

              binormal.crossVectors(normal, tangent); // new binormal

              normal.normalize().multiplyScalar(scale); //0.25);

              x = points[j].x + (i - ws / 2) * normal.x;
              y = points[j].y;
              z = points[j].z + (i - ws / 2) * normal.z;

              posIdx = vIdx * 3;
              g.vertices[posIdx] = x;
              g.vertices[posIdx + 1] = y;
              g.vertices[posIdx + 2] = z;

              vIdx++;
            }
          }

          g.attributes.position.needsUpdate = true;
          //g.attributes.normal.needsUpdate = true;

          g.translate(city.position.x, city.position.y, city.position.z);
          var mesh = new THREE.Mesh(g, roadMaterial);

          /*var curveMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
          curveGeometry.translate(
            city.position.x,
            city.position.y,
            city.position.z
          );
          var curveLine = new THREE.Line(curveGeometry, curveMaterial);
*/
          roadMeshList = roadMeshList.concat({
            endPosition: centerCity.position,
            startPosition: city.position,
            mesh: mesh,
          });
          /*
          roadMeshList = roadMeshList.concat({
            endPosition: centerCity.position,
            startPosition: city.position,
            mesh: curveLine,
          });
          */
        } //end if
      });
    }
    //console.log("roads", roadMeshList);
    return roadMeshList;
  }

  get Mesh() {
    return this._mesh;
  }

  get CityPositions() {
    return this._cityPositions;
  }

  get CityPlacementPosition() {
    return this._cityPlacementPosition;
  }
}
