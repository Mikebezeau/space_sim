import * as THREE from "three";
import SimplexNoise from "simplex-noise";
import { SCALE_PLANET_WALK } from "../util/constants";
//const simplex = new SimplexNoise(Math.random);
//const value2d = simplex.noise2D(x, y);

export default class Terrain {
  constructor(seed, hills = 1, elevation = 1) {
    this._seed = seed;
    this._hills = hills;
    this._elevation = elevation;
    this._geometry = this._createGeometry();
    this._material = new THREE.MeshPhongMaterial({
      vertexColors: true,
      flatShading: true,
      shininess: 0,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
  }

  _createGeometry() {
    const dimension = 10000 * SCALE_PLANET_WALK;
    const segment = 250;
    const vertices = segment + 1;

    const simplex = new SimplexNoise(this._seed);
    //console.log(simplex);

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

        geometry.attributes.position.setY(
          idx,
          Math.pow(vtx, 2.5) * 350 * this._hills
        );

        vtx += this._elevation;
        if (vtx > 0.8) {
          colors.push(0.83, 0.73, 0.26);
        } else if (vtx < 0.8 && vtx > 0.45) {
          colors.push(0.55, 0.95, 0.35);
        } else {
          colors.push(0.28, 1, 0.78);
        }
      }
    }

    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    return geometry;
  }

  get Mesh() {
    return this._mesh;
  }
}
