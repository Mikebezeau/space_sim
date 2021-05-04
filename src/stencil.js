var mode = "not";
var scenes = {};

function switchMode(event) {
  var name = event.target.className;
  if (scenes[name]) {
    mode = name;
  }
}

function copyMaterialSettings(from, to) {
  var settings = [
    "depthFunc",
    "depthTest",
    "depthWrite",
    "stencilWrite",
    "stencilWriteMask",
    "stencilFunc",
    "stencilRef",
    "stencilFuncMask",
    "stencilFail",
    "stencilZFail",
    "stencilZPass",
  ];
  for (var i = 0; i < settings.length; i++) {
    to[settings[i]] = from[settings[i]];
  }
}

/* https://github.com/AlexGreulich/HRTFVR/blob/master/include/glut/progs/advanced/csg.c

   Set stencil buffer to show the part of a (front or back face) that's
   inside b's volume. Requirements: GL_CULL_FACE enabled, depth func GL_LESS
   Side effects: depth test, stencil func, stencil op */

function firstInsideSecond(
  a,
  b,
  face,
  test,
  material,
  scene,
  materialSettings
) {
  // instead of immediately rendering geometries a and b
  // as in csg.c, we just add them to the scene in order

  var stencilMaterial = new THREE.MeshBasicMaterial();
  if (materialSettings) {
    copyMaterialSettings(materialSettings, stencilMaterial);
  }

  stencilMaterial.colorWrite = false; // glColorMask(GL_FALSE, GL_FALSE, GL_FALSE, GL_FALSE);
  stencilMaterial.depthTest = true; // glEnable(GL_DEPTH_TEST);
  stencilMaterial.side = face; // glCullFace(face);

  var meshA = new THREE.Mesh(a, stencilMaterial);
  scene.add(meshA); // a();

  /* use stencil plane to find parts of a in b */

  stencilMaterial = stencilMaterial.clone();
  stencilMaterial.depthWrite = false; // glDepthMask(GL_FALSE);
  stencilMaterial.stencilWrite = true; // glEnable(GL_STENCIL_TEST);
  stencilMaterial.stencilFunc = THREE.AlwaysStencilFunc; // glStencilFunc(GL_ALWAYS, 0, 0);
  stencilMaterial.stencilZPass = THREE.IncrementStencilOp; // glStencilOp(GL_KEEP, GL_KEEP, GL_INCR); // (GLenum sfail, GLenum dpfail, GLenum dppass);
  stencilMaterial.side = THREE.FrontSide; // glCullFace(GL_BACK);

  var meshB = new THREE.Mesh(b, stencilMaterial);
  scene.add(meshB); // b(); /* increment the stencil where the front face of b is drawn */

  stencilMaterial = stencilMaterial.clone();
  stencilMaterial.stencilZPass = THREE.DecrementStencilOp; // glStencilOp(GL_KEEP, GL_KEEP, GL_DECR);
  stencilMaterial.side = THREE.BackSide; // glCullFace(GL_FRONT);

  meshB = new THREE.Mesh(b, stencilMaterial);
  scene.add(meshB); // b(); /* decrement the stencil buffer where the back face of b is drawn */

  material = material.clone();
  copyMaterialSettings(stencilMaterial, material);

  material.depthWrite = true; // glDepthMask(GL_TRUE);
  material.colorWrite = true; // glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE);
  material.stencilFunc = test;
  material.stencilRef = 0;
  material.stencilFuncMask = 1; // glStencilFunc(test, 0, 1); // (GLenum func, GLint ref, GLuint mask)
  material.depthTest = false; // glDisable(GL_DEPTH_TEST);
  material.side = face; // glCullFace(face);

  scene.add(new THREE.Mesh(a, material)); // a(); /* draw the part of a that's in b */

  return material;
}

function fixDepth(a, scene, materialSettings) {
  var stencilMaterial = new THREE.MeshBasicMaterial();
  copyMaterialSettings(materialSettings, stencilMaterial);
  stencilMaterial.colorWrite = false; // glColorMask(GL_FALSE, GL_FALSE, GL_FALSE, GL_FALSE);
  stencilMaterial.depthTest = true; // glEnable(GL_DEPTH_TEST);
  stencilMaterial.stencilWrite = false; // glDisable(GL_STENCIL_TEST);
  stencilMaterial.depthFunc = THREE.AlwaysDepth; // glDepthFunc(GL_ALWAYS);

  var meshA = new THREE.Mesh(a, stencilMaterial);
  scene.add(meshA); // a(); /* draw the front face of a, fixing the depth buffer */

  materialSettings = stencilMaterial.clone();
  materialSettings.depthFunc = THREE.LessEqualDepth; // glDepthFunc(GL_LESS); but THREE.LessEqualDepth is 3js default

  return materialSettings;
}

/* "and" two objects together */
function and(a, b, materialA, materialB) {
  var scene = new THREE.Scene();

  var materialSettings = firstInsideSecond(
    a,
    b,
    THREE.FrontSide,
    THREE.NotEqualStencilFunc,
    materialA,
    scene
  );

  materialSettings = fixDepth(b, scene, materialSettings);

  firstInsideSecond(
    b,
    a,
    THREE.FrontSide,
    THREE.NotEqualStencilFunc,
    materialB,
    scene,
    materialSettings
  );

  return scene;
}

/* subtract b from a */
function sub(a, b, materialA, materialB) {
  var scene = new THREE.Scene();

  var materialSettings = firstInsideSecond(
    a,
    b,
    THREE.BackSide,
    THREE.NotEqualStencilFunc,
    materialA,
    scene
  );

  materialSettings = fixDepth(b, scene, materialSettings);

  firstInsideSecond(
    b,
    a,
    THREE.FrontSide,
    THREE.EqualStencilFunc,
    materialB,
    scene,
    materialSettings
  );

  return scene;
}

function orderScene(scene) {
  for (var i = 0; i < scene.children.length; i++) {
    scene.children[i].renderOrder = i + 1;
  }
}

var loader = new THREE.TextureLoader();
loader.crossOrigin = "anonymous";
loader.load("https://i.imgur.com/28m2hlS.jpg", function (texture) {
  var materialA = new THREE.MeshNormalMaterial();
  var materialB = new THREE.MeshBasicMaterial({ map: texture });

  var geometryA = new THREE.BoxGeometry(0.5, 0.65, 0.5);
  var geometryB = new THREE.SphereGeometry(0.36, 32, 16);

  scenes["or"] = new THREE.Scene();
  scenes["or"].add(new THREE.Mesh(geometryA, materialA));
  scenes["or"].add(new THREE.Mesh(geometryB, materialB));

  scenes["not"] = sub(geometryA, geometryB, materialA, materialB);
  scenes["not"].add(
    new THREE.Mesh(
      geometryA,
      new THREE.MeshBasicMaterial({ color: "cyan", wireframe: true })
    )
  );
  orderScene(scenes["not"]);

  scenes["and"] = and(geometryA, geometryB, materialA, materialB);
  scenes["and"].add(
    new THREE.Mesh(
      geometryA,
      new THREE.MeshBasicMaterial({ color: "cyan", wireframe: true })
    )
  );
  orderScene(scenes["and"]);

  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    sortObjects: false,
  });
  renderer.setClearColor("white");
  renderer.setSize(400, 300);

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(70, 4 / 3, 0.01, 10);
  camera.position.z = 1;

  function animate() {
    var scene = scenes[mode];

    for (var name in scenes)
      scenes[name].traverse(function (object) {
        if (object.geometry) {
          if (object.geometry === geometryA) {
            object.rotation.x += 0.01;
            object.rotation.z += 0.03;
            object.position.z = 0.15 * Math.sin(object.rotation.x);
          }
          if (object.geometry === geometryB) {
            object.rotation.y += 0.02;
          }
        }
      });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
});
