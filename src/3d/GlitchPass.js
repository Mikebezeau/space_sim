/**
 * @author felixturner / http://airtight.cc/
 *
 * RGB Shift Shader
 * Shifts red and blue channels from center in opposite directions
 * Ported from http://kriss.cx/tom/2009/05/rgb-shift/
 * by Tom Butterworth / http://kriss.cx/tom/
 */

import {
  Mesh,
  OrthographicCamera,
  PlaneBufferGeometry,
  Scene,
  ShaderMaterial,
  UniformsUtils,
} from "three";
import { Pass } from "three/examples/jsm/postprocessing/Pass.js";

var DigitalGlitch = {
  uniforms: {
    tDiffuse: { value: null },
    factor: { value: 0.0 },
  },

  vertexShader: `varying vec2 vUv;
     void main() {
       vUv = uv;
       gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
     }`,

  fragmentShader: `uniform sampler2D tDiffuse;
     uniform float factor;
     varying vec2 vUv;
     void main() {
       if (factor>0.0) {
         vec2 p = vUv;
         vec2 offset = (0.02 * factor) * vec2( cos(1.0), sin(1.0));
         vec4 cr = texture2D(tDiffuse, p + offset);
         vec4 cga = texture2D(tDiffuse, p);
         vec4 cb = texture2D(tDiffuse, p - offset);
         gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
       }
       else gl_FragColor=texture2D (tDiffuse, vUv);
     }`,
};

var GlitchPass = function (dt_size) {
  Pass.call(this);
  if (DigitalGlitch === undefined)
    console.error("THREE.GlitchPass relies on THREE.DigitalGlitch");
  var shader = DigitalGlitch;
  this.uniforms = UniformsUtils.clone(shader.uniforms);
  this.material = new ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
  });
  this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  this.scene = new Scene();
  this.quad = new Mesh(new PlaneBufferGeometry(2, 2), null);
  this.quad.frustumCulled = false; // Avoid getting clipped
  this.scene.add(this.quad);
  this.factor = 0;
};

GlitchPass.prototype = Object.assign(Object.create(Pass.prototype), {
  constructor: GlitchPass,

  render: function (renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
    this.uniforms["tDiffuse"].value = readBuffer.texture;
    this.uniforms["factor"].value = this.factor;
    this.quad.material = this.material;
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      renderer.render(this.scene, this.camera);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      renderer.render(this.scene, this.camera);
    }
  },
});

export { GlitchPass };
