import * as THREE from "three";
import SimplexNoise from "simplex-noise";
import { CSG } from "three-csg-ts";
import { SCALE_PLANET_WALK } from "../util/constants";
// Color hex codes
const colors = {
  WHITE: 0xffffff,
  BLACK: 0x000000,
  DARK_BROWN: 0x736b5c,
  STREET: 0x999999,
  BUILDING: 0xe8e8e8,
  GREEN: 0x81a377,
  TREE: 0x216e41,
  DARK_GREY: 0x888888,
  WATER: 0x4b95de,
};

// City attribute variables: the variables below control the properties of our generated city

let geometry = null,
  material = null,
  mesh = null,
  buildingCount = 0,
  buildingGeometryParameters = 0,
  buildingPosition = 0,
  numberOfSurroundingBuildings = 0,
  generatedBuildingBlockList = [],
  trunkMesh = 0,
  branchMesh = 0,
  tree = 0,
  noise = null;
// The number of blocks to include in our grid in dimensional format (i.e. the value of 10 will
// create a grid with 10 by 10 blocks)
//var gridSize = 15;

// City road widths. Roads seperate our city grid blocks.
var roadWidth = 7 * SCALE_PLANET_WALK;

// The maximum 'density' value to use when generating trees for our park blocks
var maximumTreeDensity = 10;

// City block size
var blockSize = 20 * SCALE_PLANET_WALK;

// City block margin
var blockMargin = 1.5 * SCALE_PLANET_WALK;

// Minimum and maximum building height values
var minBuildingHeight = 3 * SCALE_PLANET_WALK;
var maxBuildingHeight = 40 * SCALE_PLANET_WALK;

// Helper functions used to get our total city size
function getCityWidth(gridSize) {
  return blockSize * gridSize;
}

function getCityLength(gridSize) {
  return blockSize * gridSize;
}

// Maximum building height deviation allowed for buildings allocated within the same block
const maxBuildingHeightDeviation = 2 * SCALE_PLANET_WALK;

// This is a percentage cut-off we use to serve as an indicator of whether we have a 'tall'
// building or not. Generally, we use 2 canvas elements - one for tall buildings and the other
// which is reserved for smaller ones.
const tallPercentageCutoff = 20;

// Number of sub-divisions to apply to our short building blocks. As an example, a value of 2 will
// result in 2 block divisions and a total of 4 buildings assigned to each non-tall city block.
const blockSubdivisions = 2;

// This is our maximum building 'slice' deviation - i.e. whenever we have more than 1 building allocated
// in one building block, we allow the building width / depth deviation between the buildings to vary
// by this amount:
const maxBuildingSliceDeviation = 1 * SCALE_PLANET_WALK;

// These are our city base heights
const groundHeight = 0 * SCALE_PLANET_WALK;
const curbHeight = 0.05 * SCALE_PLANET_WALK;

// Tree properties
const minTreeHeight = 0.2 * SCALE_PLANET_WALK;
const maxTreeHeight = 4 * SCALE_PLANET_WALK;

// Maps used to hold boolean indicators which show whether our grid coordinates represent a
// ground or building block.
var groundMap;
var buildingMap;

// Threshold value used to assign ground blocks. Any normalized values within the [0, 1] range that are
// between [0, groundThreshold] get assigned to a ground block which can can either be a building block
// or a park / parking block
//const groundThreshold = 0.05;

// Threshold value used to assign park / parking blocks. Any normalized ground block values falling between the
// [0, parkThreshold] range are assigned to a park or parking block.
const parkThreshold = 0.01;

// Initialize the smaller building canvas dimensions and generate the canvas for these buildings:

const smallBuildingCanvasWidth = 8;
const smallBuildingCanvasHeight = 16;

var smallBuildingCanvas = generateBuildingCanvas(
  smallBuildingCanvasWidth,
  smallBuildingCanvasHeight
);

// Generate a building canvas with the given width and height and return it
function generateBuildingCanvas(width, height) {
  // Build a small canvas we're going to use to create our window elements
  var smallCanvas = document.createElement("canvas");

  smallCanvas.width = width;
  smallCanvas.height = height;

  // Get a two-dimensional rendering context for our canvas
  var context = smallCanvas.getContext("2d");

  // Set the fill style to the same color as our building material
  context.fillStyle = getHexadecimalString(colors.BUILDING);

  // Draw a filled rectangle whose starting point is (0, 0) and whose size is specified by
  // the width and height variables.
  context.fillRect(0, 0, width, height);

  // Set the building window dimensions
  const windowWidth = 2;
  const windowHeight = 1;

  // Draw the building windows
  for (var y = 4; y < height - 2; y += 3) {
    for (var x = 0; x < width; x += 3) {
      // Here, we add slight color variations to vary the look of each window
      var colorValue = Math.floor(Math.random() * 64);
      context.fillStyle =
        "rgb(" + [colorValue, colorValue, colorValue].join(",") + ")";

      // Draw the window / rectangle at the given (x, y) position using our defined window dimensions
      context.fillRect(x, y, windowWidth, windowHeight);
    }
  }

  // Create a large canvas and copy the small one onto it. We do this to increase our original canvas
  // resolution:

  var largeCanvas = document.createElement("canvas");

  largeCanvas.width = 256;
  largeCanvas.height = 512;

  context = largeCanvas.getContext("2d");

  // Disable the smoothing in order to avoid blurring our original one
  context.imageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;

  // Copy the smaller canvas onto the larger one
  context.drawImage(smallCanvas, 0, 0, largeCanvas.width, largeCanvas.height);

  return largeCanvas;
}
// Initialize the larger building canvas dimensions and generate the canvas for these buildings:

const largeBuildingCanvasWidth = 16;
const largeBuildingCanvasHeight = 32;

var largeBuildingCanvas = generateBuildingCanvas(
  largeBuildingCanvasWidth,
  largeBuildingCanvasHeight
);
// Generate and return a hexidecimal string representation of the numeric input
// i.e. 0 will get converted to "#000000"
function getHexadecimalString(number) {
  var hexString = Number(number).toString(16);
  hexString = "#000000".substr(0, 7 - hexString.length) + hexString;
  return hexString;
}

// Return a random integer between min (inclusive) and max (exclusive)
function getRandomIntBetween(rng, min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(rng * (max - min + 1)) + min;
}

// Generate a random building height deviation value and return it. We use this to vary the
// building dimensions within the same block element.
function generateBuildingHeightDeviation(rng) {
  return getRandomIntBetween(rng(), 0, maxBuildingHeightDeviation);
}

// Return a normalized version of the input array which maps the array elements to a range between 0 and 1
function normalizeArray(array) {
  var minValue = Math.min.apply(Math, array);
  var maxValue = Math.max.apply(Math, array);

  // Apply the function below to each array element (to generate a normalized value between 0 and 1)
  return array.map(function (value) {
    return (value - minValue) / (maxValue - minValue);
  });
}

// Split a 1-D array into a 2-D array containing the specified number of columns in each sub-array.
function generate2DArray(array, numberOfColumns) {
  var temp = array.slice(0);
  var results = [];

  while (temp.length) {
    results.push(temp.splice(0, numberOfColumns));
  }

  return results;
}

// Helper functions which can be used to transform our 1-D index -> 2-D coordinates

function getXCoordinateFromIndex(index, gridSize) {
  return parseInt(index / gridSize);
}

function getZCoordinateFromIndex(index, gridSize) {
  return index % gridSize;
}

// Fetch a value from our 2D perlin noise map and return it
function getNoiseValue(x, y, frequency) {
  return Math.abs(noise.noise2D(x / frequency, y / frequency));
}

// Generate the ground / building maps we're going to use to assign blocks to the city
function generatePreceduralMaps(rng, gridSize, density) {
  noise = new SimplexNoise(rng());

  // Noise frequency values we're using to generate our block distribution. The higher the value, the smoother the
  // distribution:

  // This is the general noise distribution used for the ground / water block assignments
  var generalNoiseFrequency = 15;

  // This is the ground noise distribution used for the building / park / parking block assignments
  var groundNoiseFrequency = 8;

  // Arrays to use in order to hold our generated noise values
  var generalNoiseDistribution = [];
  var groundNoiseDistribution = [];

  // Generate the ground / general noise arrays holding the perlin noise distribution
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      generalNoiseDistribution.push(getNoiseValue(i, j, generalNoiseFrequency));
      groundNoiseDistribution.push(getNoiseValue(i, j, groundNoiseFrequency));
    }
  }

  // Generate a normalized noise array which holds a range of values between [0, 1]
  var normalizedDistribution = normalizeArray(generalNoiseDistribution);

  // Map our noises to an binary array which serves as an indicator showing whether the array element is a
  // ground block or a water block
  var groundDistributionMap = normalizedDistribution.map(function (arrayValue) {
    //return arrayValue <= groundThreshold ? true : false;
    return arrayValue <= density ? true : false;
  });

  // Transform the 1-D ground mapping into a 2-D array with (x, z) coordinates
  groundMap = generate2DArray(groundDistributionMap, gridSize);

  // Generate a normalized array for our ground distribution
  var normalizedGroundDistribution = normalizeArray(groundNoiseDistribution);

  // Map our noises to an array holding binary values which indicate whether it's a building or a park block
  var buildingDistributionMap = normalizedGroundDistribution.map(function (
    arrayValue,
    index
  ) {
    return groundDistributionMap[index] && arrayValue > parkThreshold
      ? true
      : false;
  });

  // Transform the 1-D building mapping into a 2-D array with (x, z) coordinates
  buildingMap = generate2DArray(buildingDistributionMap, gridSize);
}

// Create a mesh we're going to use to model our water elements
function getWaterMesh(boxGeometryParameters, position) {
  // Check if the position was provided. If not, initialize it to (0, 0, 0)
  if (typeof position === "undefined")
    position = {
      x: 0,
      y: 0,
      z: 0,
    };

  // Use a mesh phong meterial, which can be used for shiny surfaces with specular highlights
  material = new THREE.MeshPhongMaterial({
    color: colors.WATER,
    transparent: true,
    opacity: 0.6,
  });

  // Create a box geometry ( made for rectangular shapes ) with the appropriate dimensions
  geometry = new THREE.BoxGeometry(
    boxGeometryParameters.width,
    boxGeometryParameters.height,
    boxGeometryParameters.depth
  );

  // Generate and return the mesh

  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(position.x, position.y, position.z);

  mesh.receiveShadow = false;
  mesh.castShadow = false;

  return mesh;
}

// Create a box mesh with the given geometry, material and color. The cast shadow parameter is a
// boolean flag which controls whether we want our mesh to cast a shadow.
function getBoxMesh(boxGeometryParameters, position, color, castShadow) {
  // Check if the shadow parameter was provided. If not, initialize it to true
  if (typeof castShadow === "undefined") castShadow = true;

  // Use lambert mesh material which is made for non-shiny surfaces / is generally great for performance
  material = new THREE.MeshLambertMaterial({
    color: color,
  });

  // Create a box geometry ( made for rectangular shapes ) with the given width, height, and depth parameters
  geometry = new THREE.BoxGeometry(
    boxGeometryParameters.width,
    boxGeometryParameters.height,
    boxGeometryParameters.depth
  );

  // Generate the mesh and return it

  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(position.x, position.y, position.z);

  mesh.receiveShadow = true;
  mesh.castShadow = castShadow;

  return mesh;
}

// Take a list of meshes, merge their geometries into a single one and return it
function getMergedMesh(meshList, material) {
  // Check if the mesh material was provided, and if not, initialize it contain the same material as the
  // first item in our list of meshes we want to merge
  if (typeof material === "undefined") material = meshList[0].material;

  /*
  // Create a geometry object to hold our combined geometries
  var geometry = new THREE.BufferGeometry();
  // Merge all of the meshes into one geometry:
  for (let i = 0; i < meshList.length; i++) {
    meshList[i].updateMatrix();
    geometry.merge(meshList[i].geometry, meshList[i].matrix);
  }
  // Once we have our merged geometry, create a mesh from it
  var mergedMesh = new THREE.Mesh(geometry, material);
  // We want our merged mesh to cast and receive shadows
  mergedMesh.castShadow = true;
  mergedMesh.receiveShadow = true;
  return mergedMesh;
  */

  let mergedMesh = new THREE.Mesh(meshList[0].geometry, material);
  mergedMesh.updateMatrix();
  meshList[1].updateMatrix();
  mergedMesh = CSG.union(mergedMesh, meshList[1]);
  mergedMesh.position.set(
    meshList[0].position.x,
    meshList[0].position.y,
    meshList[0].position.z
  );
  return mergedMesh;

  // Merge all of the meshes into one geometry:
  /*for (let i = 0; i < meshList.length - 1; i++) {
    mergedMesh.updateMatrix();
    meshList[i + 1].updateMatrix();
    //geometry.merge(meshList[i].geometry, meshList[i].matrix);
    mergedMesh = CSG.union(mergedMesh, meshList[i + 1]);
  }*/

  // Once we have our merged geometry, create a mesh from it
  //var mergedMesh = new THREE.Mesh(geometry, material);

  // We want our merged mesh to cast and receive shadows
  /*
  mergedMesh.castShadow = true;
  mergedMesh.receiveShadow = true;
  mergedMesh.position.set(
    meshList[0].position.x,
    meshList[0].position.y,
    meshList[0].position.z
  );
  */
  //console.log(mergedMesh);
  //return mergedMesh;
}

// Translate the grid x coordinate into a THREE.js scene x coordinate and return it
function getSceneXCoordinate(x, gridSize) {
  return x * blockSize + blockSize / 2 - getCityWidth(gridSize) / 2;
}

// Translate the grid z coordinate into a THREE.js scene z coordinate and return it
function getSceneZCoordinate(z, gridSize) {
  return z * blockSize + blockSize / 2 - getCityLength(gridSize) / 2;
}

// Return true if the grid block located at (x, z) is a ground block; and false if
// it's a water block
function isGroundBlock(x, z) {
  return groundMap[x][z];
}

// Return true if the grid block located at (x, z) is a building block; and false if
// it's a block allocated for park / parking blocks.
function isBuildingBlock(x, z) {
  return buildingMap[x][z];
}

// Return the total amount of building blocks surrounding the block located at (x, z)
// on our grid. This is used to heuristically determine whether to build a park or
// parking in our city. We want parking to be located closer to our buildings, so we
// check to see the surrounding building count prior to deciding what to build.
function getSurroundingBuildingNumber(x, z, gridSize) {
  buildingCount = 0;

  for (let i = Math.max(0, x - 1); i <= Math.min(x + 1, gridSize - 1); i++) {
    for (let j = Math.max(0, z - 1); j <= Math.min(z + 1, gridSize - 1); j++) {
      if (isBuildingBlock(i, j)) buildingCount = buildingCount + 1;
    }
  }

  return buildingCount;
}

// Generate the scene / city terrain
function generateCityTerrain(gridSize, elevation) {
  var streetHeight = 2 * curbHeight;

  // Initialize the base mesh parameters and create the base mesh

  var baseColor = colors.DARK_BROWN;

  var baseGeometryParams = {
    width: getCityWidth(gridSize),
    height: groundHeight,
    depth: getCityLength(gridSize),
  };

  var basePosition = {
    x: 0,
    y: -(groundHeight / 2) - streetHeight,
    z: 0,
  };

  var baseMesh = getBoxMesh(baseGeometryParams, basePosition, baseColor);

  // Initialize the water mesh parameters and create the water mesh

  var waterGeometryParams = {
    width: getCityWidth(gridSize) - 2,
    height: 0,
    depth: getCityLength(gridSize) - 2,
  };

  var waterPosition = {
    x: 0,
    y: -streetHeight,
    z: 0,
  };

  var water = getWaterMesh(waterGeometryParams, waterPosition);

  // Create the ground level / street level meshes and add them to a list

  var groundMeshList = [];
  var streetMeshList = [];

  for (let i = 0; i < groundMap.length; i++) {
    for (let j = 0; j < groundMap[0].length; j++) {
      if (isGroundBlock(i, j)) {
        var x = getSceneXCoordinate(i, gridSize);
        var z = getSceneZCoordinate(j, gridSize);

        groundMeshList.push(
          getBoxMesh(
            // Geometry parameters
            {
              width: blockSize,
              height: 0,
              depth: blockSize,
            },
            // Positional parameters
            {
              x: x,
              y: -streetHeight,
              z: z,
            }, // Mesh color
            colors.DARK_BROWN
          )
        );

        streetMeshList.push(
          getBoxMesh(
            // Geometry parameters
            {
              width: blockSize,
              height: streetHeight,
              depth: blockSize,
            },
            // Positional parameters
            {
              x: x,
              y: -streetHeight / 2,
              z: z,
            }, // Mesh color
            colors.STREET
          )
        );
      }
    }
  }

  // Merge the street / ground level meshes and add them to the scene

  //if (streetMeshList.length) scene.add(getMergedMesh(streetMeshList));
  //if (groundMeshList.length) scene.add(getMergedMesh(groundMeshList));

  // Finally, add in the base and water meshes to finish off the terrain
  //scene.add(baseMesh, water);
  //const mergedStreetMesh = getMergedMesh(streetMeshList);
  //const mergedGroundMesh = getMergedMesh(groundMeshList);
  return { streetMeshList, groundMeshList, baseMesh, water };
}

// Generate the ground / city blocks composed of buildings / parks / parking and add them
// to the scene
function generateGroundBlocks(rng, gridSize, elevation) {
  let buildingMeshList = [],
    buildingCurbList = [],
    parkMeshList = [],
    treesMeshList = [],
    parkingMeshList = [];

  //add a fun little building in the center of big cities
  if (gridSize > 8) {
    const pyramidMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#111"),
      side: THREE.DoubleSide,
      castShadow: 1,
      receiveShadow: 1,
      //wireframe: true,
    });
    const pyramidGeometry = new THREE.ConeGeometry(
      (blockSize * gridSize) / 3,
      (blockSize * gridSize) / 3,
      4,
      1,
      true
    );
    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
    pyramid.position.set(0, 0, 0);
    pyramid.rotation.set(0, Math.PI / 8, 0);
    pyramid.receiveShadow = true;
    pyramid.castShadow = true;
    buildingMeshList = buildingMeshList.concat(pyramid);
  }
  // Go through each one of our grid blocks
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // Check if we have a ground block located on this grid (i, j) position
      if (isGroundBlock(i, j)) {
        // Translate our grid coordinates to the scene (x, z) coordinates

        var x = getSceneXCoordinate(i, gridSize);
        var z = getSceneZCoordinate(j, gridSize);

        // Calculate the total block curb width
        var curbWidth = blockSize - roadWidth;

        // Check if we have a building block allocated in on our grid (i, j) coordinates
        if (isBuildingBlock(i, j)) {
          // Generate the building curb mesh and add it to the scene

          var buildingCurbMesh = getBoxMesh(
            // Geometry parameters
            {
              width: curbWidth,
              height: curbHeight,
              depth: curbWidth,
            },
            // Positional parameters
            {
              x: x,
              y: curbHeight / 2,
              z: z,
            }, // Mesh color
            colors.DARK_GREY
          );

          //scene.add(buildingCurbMesh);
          if (buildingCurbMesh) buildingCurbList.push(buildingCurbMesh);

          // Generate a building / buildings with a random height parameter and add it / them to the scene:

          var buildingHeight = getRandomIntBetween(
            rng(),
            minBuildingHeight,
            maxBuildingHeight
          );

          var buildingWidth = curbWidth - blockMargin * 2;

          buildingGeometryParameters = {
            width: buildingWidth,
            height: buildingHeight,
            depth: buildingWidth,
          };

          buildingPosition = {
            x: x,
            z: z,
          };

          generatedBuildingBlockList = [];
          generateBuildingBlock(
            rng,
            buildingGeometryParameters,
            buildingPosition,
            blockSubdivisions
          );

          if (generatedBuildingBlockList.length > 0)
            buildingMeshList = buildingMeshList.concat(
              generatedBuildingBlockList
            );
        } else {
          // Otherwise, we don't have a building block, so we use a heuristic approach to deciding whether to
          // use the block to either construct a park or parking. If the block is surrounded by less than 5
          // buildings, we build a park. Otherwise, we build an empty 'parking' lot / block.

          numberOfSurroundingBuildings = getSurroundingBuildingNumber(
            i,
            j,
            gridSize
          );

          // If the building block is surrounded by less than 5 buildings, we allocate it to a park:
          if (numberOfSurroundingBuildings < 5) {
            // Generate the green park mesh and add it to the scene:

            var parkMesh = getBoxMesh(
              // Geometry parameters
              {
                width: curbWidth,
                height: curbHeight,
                depth: curbWidth,
              },
              // Positional parameters
              {
                x: x,
                y: curbHeight / 2,
                z: z,
              }, // Mesh color
              colors.GREEN
            );

            if (parkMesh) parkMeshList.push(parkMesh);

            // Generate the trees to add to our park mesh

            var buildingWidth = curbWidth - blockMargin * 2;

            let trees = generateTrees(rng, x, z, buildingWidth);

            if (trees) treesMeshList = treesMeshList.concat(trees);
          } else {
            // Otherwise, we assign the block to hold parking, which is essentially an empty curb we add
            // to our scene

            var parkingMesh = getBoxMesh(
              // Geometry parameters
              {
                width: curbWidth,
                height: curbHeight,
                depth: curbWidth,
              },
              // Positional parameters
              {
                x: x,
                y: curbHeight / 2,
                z: z,
              }, // Mesh color
              colors.DARK_GREY
            );

            //scene.add(parkingMesh);

            if (parkingMesh) parkingMeshList.push(parkingMesh);
          }
        }
      }
    }
  }
  return {
    buildingMeshList,
    buildingCurbList,
    parkMeshList,
    treesMeshList,
    parkingMeshList,
  };
}

// Create a cylinder mesh and return it
function getCylinderMesh(color, cylinderGeometryParameters, position) {
  // We set default values to some of our cylinder geometry parameters if they're undefined

  if (cylinderGeometryParameters.radialSegments === "undefined")
    cylinderGeometryParameters.radialSegments = 4;
  if (cylinderGeometryParameters.heightSegments === "undefined")
    cylinderGeometryParameters.heightSegments = 1;

  // Use lambert mesh material which is made for non-shiny surfaces / great for performance
  material = new THREE.MeshLambertMaterial({
    color: color,
  });

  // Create a box geometry ( made for rectangular shapes ) with the given width, height, and depth parameters
  geometry = new THREE.CylinderGeometry(
    cylinderGeometryParameters.radiusTop,
    cylinderGeometryParameters.radiusBottom,
    cylinderGeometryParameters.height,
    cylinderGeometryParameters.radialSegments,
    cylinderGeometryParameters.heightSegments
  );

  // Generate the new mesh and return it

  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(position.x, position.y, position.z);

  mesh.rotation.y = Math.PI / 4;

  mesh.receiveShadow = true;
  mesh.castShadow = true;

  return mesh;
}

// Generate a tree on the scene (x, y) coordinate
var Tree = function (rng, x, z) {
  // Array we use to hold the components which compose the tree
  this.components = [];

  // Generate a random height for our tree
  var treeHeight = getRandomIntBetween(rng(), minTreeHeight, maxTreeHeight);

  trunkMesh = getBoxMesh(
    // Geometry parameters
    {
      width: treeHeight / 4,
      height: treeHeight,
      depth: treeHeight / 4,
    },
    // Positional parameters
    {
      x: x,
      y: treeHeight / 2 + curbHeight,
      z: z,
    }, // Mesh color
    colors.DARK_BROWN
  );

  branchMesh = getCylinderMesh(
    // Mesh color
    colors.TREE,
    // Geometry parameters
    {
      radiusTop: 0,
      radiusBottom: treeHeight / 2,
      height: treeHeight,
    },
    // Positional parameters
    {
      x: x,
      y: treeHeight * 1.2 + curbHeight,
      z: z,
    }
  );

  // Rotate the tree in a random direction
  //branchMesh.rotation.y = rng(); //Math.random();

  // Add the branch / trunk to the tree components list
  this.components.push(branchMesh, trunkMesh);

  // Function which merges the tree branch and trunk components and returns them
  this.getMergedMesh = function () {
    return getMergedMesh(this.components);
  };
  /*
  trunkMesh.updateMatrix(); // as needed
  var singleGeometry = new THREE.BufferGeometry();
  singleGeometry.merge(trunkMesh.geometry, trunkMesh.matrix);

  branchMesh.updateMatrix(); // as needed
  singleGeometry.merge(branchMesh.geometry, branchMesh.matrix);
  var singleMeshTree = new THREE.Mesh(singleGeometry, branchMesh.material);
  
  return [singleMeshTree];
  */
  return this.components;
};

// Generate trees centered within our scene (x, z) coordiante and laying within the given
// park size parameter
function generateTrees(rng, x, z, parkSize) {
  var trees = [];

  // Generate a random number from [0 -> maximum tree density] to allocate to this park block
  var numberOfTrees = getRandomIntBetween(rng(), 0, maximumTreeDensity);

  // Generate the park tree elements
  for (let i = 0; i < numberOfTrees; i++) {
    // Generate a random (x, z) coordinate for our tree and generate the tree

    var tree_x_coord = getRandomIntBetween(
      rng(),
      x - parkSize / 2,
      x + parkSize / 2
    );
    var tree_z_coord = getRandomIntBetween(
      rng(),
      z - parkSize / 2,
      z + parkSize / 2
    );

    // Generate a tree at the generated (x, z) coordiante and it to our array of trees
    tree = new Tree(rng, tree_x_coord, tree_z_coord);
    if (tree) {
      trees = trees.concat(tree);
    }
  }

  // Merge the generated tree meshes and add them to the scene
  //if (trees.length) scene.add(getMergedMesh(trees));
  if (trees.length) return trees; //getMergedMesh(trees);
}

// Create a mesh we're going to use for our buildings
function getBuildingMesh(boxGeometryParameters, position, color) {
  // Use lambert mesh material which is made for non-shiny surfaces / is generally great for performance
  var sideBuildingMaterial = new THREE.MeshLambertMaterial({
    color: color,
    // Check if our building qualifies as being tall, and if it does, use the large building canvas,
    // otherwise, we use the small one
    map: new THREE.Texture(
      isTall(boxGeometryParameters.height)
        ? largeBuildingCanvas
        : smallBuildingCanvas
    ),
  });

  // We need to flag our side textures as needing an update, since we're using different canvas elements
  // for this material
  sideBuildingMaterial.map.needsUpdate = true;

  // We use a regular non-textured lambert mesh for our top / bottom faces
  var topBottomMaterial = new THREE.MeshLambertMaterial({
    color: color,
  });

  // Set the materials we're going to use for each building side separately
  var materials = [
    sideBuildingMaterial, // Left side
    sideBuildingMaterial, // Right side
    topBottomMaterial, // Top side
    topBottomMaterial, // Bottom side
    sideBuildingMaterial, // From side
    sideBuildingMaterial, // Back side
  ];

  // Create a box geometry ( made for rectangular shapes ) with the given width, height, and depth parameters
  const geometry = new THREE.BoxGeometry(
    boxGeometryParameters.width,
    boxGeometryParameters.height,
    boxGeometryParameters.depth
  );

  // Create the building mesh and return it

  const mesh = new THREE.Mesh(geometry, materials);

  mesh.position.set(position.x, position.y, position.z);
  //mesh.position.copy(position);
  mesh.receiveShadow = true;
  mesh.castShadow = true;

  return mesh;
}

// Create a new building element with the specified geometry / position parameters
var Building = function (geometryParameters, position) {
  // Array used to hold the building components
  //let components = [];

  // Generate a new mesh for out building and add it to our components array
  const buildingMesh = getBuildingMesh(
    geometryParameters,
    position,
    colors.BUILDING
  );

  //console.log(buildingMesh.position);
  //components.push(buildingMesh);

  // Function which merges the building components and returns them
  return buildingMesh; //getMergedMesh(components);
};

// Returns true if the input height parameter qualifies a scructure or building as being 'tall' and
// false otherwise. To generate this value, we generally use a 'tall percentage cutoff' thershold which
// uses our maximum building height in order to make the proper assignment.
function isTall(height) {
  return Math.round((height / maxBuildingHeight) * 100) >= tallPercentageCutoff;
}

// Generate a building block which holds the input geometry / position parameters and sub-divide
// it by the 'numOfDivisions' assigned. The last buildings parameter is an array holding the
// generated buildings created and assigned to this block.
function generateBuildingBlock(
  rng,
  geometryParameters,
  position,
  numOfDivisions
) {
  // If the building is tall or if we have less than 1 sub-division to generate, create a building
  if (isTall(geometryParameters.height) || numOfDivisions < 1) {
    // Generate a randomized maximum height deviation to use for our building
    var maxHeightDeviation = generateBuildingHeightDeviation(rng);

    // Generate a random building height falling within our generated deviation
    var buildingHeight = getRandomIntBetween(
      rng(),
      geometryParameters.height - maxHeightDeviation,
      geometryParameters.height + maxHeightDeviation
    );

    // Generate the geometry and position maps to use when constructing our building

    var buildingGeometryParameters = {
      width: geometryParameters.width,
      height: buildingHeight,
      depth: geometryParameters.depth,
    };

    var buildingPosition = {
      x: position.x,
      y: buildingGeometryParameters.height / 2 + curbHeight,
      z: position.z,
    };

    // Generate a new building with the assigned position and geometry and add it to our
    // array of buildings
    var building = Building(buildingGeometryParameters, buildingPosition);
    if (building) generatedBuildingBlockList.push(building);

    /*
    // Calculate the amount of buildings we've already generated
    var totalBuildingsBuilt = generatedBuildingBlockList.length;

    // Calculate the total number of buildings we're targeting to build (according to the amount of
    // sub-divisions assigned to our block)
    var totalBuildingsToBuild = Math.pow(2, blockSubdivisions);

    // If our block has no more buildings which need to be built, or if our building qualifies as
    // being a tall structure, we're done and we can merge the building mesh and add it to the scene
    if (
      totalBuildingsBuilt >= totalBuildingsToBuild ||
      isTall(buildingGeometryParameters.height)
    )
      return;
      */
  } else {
    // Otherwise, we sub-divide our block into different components and generate a building whithin
    // each sub component block
    // Generate a randomized block 'slice' deviation to use
    var sliceDeviation = Math.abs(
      getRandomIntBetween(rng(), 0, maxBuildingSliceDeviation)
    );

    // If our geometry depth is larger than our width, we slice the depth dimension in 2 and generate
    // 2 sub-divisions / building elements spread across our depth dimension
    if (geometryParameters.width <= geometryParameters.depth) {
      // Calculate the new depth geometry parameters we need to use to sub-divide this block
      var depth1 =
        Math.abs(geometryParameters.depth / 2 - sliceDeviation) -
        blockMargin / 2;
      var depth2 =
        Math.abs(-(geometryParameters.depth / 2) - sliceDeviation) -
        blockMargin / 2;

      // Calculate the new z coordinates we're going to use for our sub-division
      var z1 =
        position.z +
        sliceDeviation / 2 +
        geometryParameters.depth / 4 +
        blockMargin / 4;
      var z2 =
        position.z +
        sliceDeviation / 2 -
        geometryParameters.depth / 4 -
        blockMargin / 4;

      // Recursively generate the new sub-divided block elements and add them to the scene

      generateBuildingBlock(
        // seeded random
        rng,
        // Building geometry parameters
        {
          width: geometryParameters.width,
          height: geometryParameters.height,
          depth: depth1,
        },
        // Building position
        {
          x: position.x,
          z: z1,
        },
        // Decrement the total number of sub-divisions we need to perform
        numOfDivisions - 1
      );

      generateBuildingBlock(
        rng,
        // Building geometry parameters
        {
          width: geometryParameters.width,
          height: geometryParameters.height,
          depth: depth2,
        },
        // Building position
        {
          x: position.x,
          z: z2,
        },
        // Decrement the total number of sub-divisions we need to perform
        numOfDivisions - 1
      );
    } else {
      // Slice the width dimension in 2 and generate 2 sub-divisions / building elements spread across our
      // width dimension

      // Calculate the new width geometry parameters we need to use to sub-divide this block
      var width1 =
        Math.abs(geometryParameters.width / 2 - sliceDeviation) -
        blockMargin / 2;
      var width2 =
        Math.abs(-(geometryParameters.width / 2) - sliceDeviation) -
        blockMargin / 2;

      // Calculate the new x coordinates to use as part of our positional parameters
      var x1 =
        position.x +
        sliceDeviation / 2 +
        geometryParameters.width / 4 +
        blockMargin / 4;
      var x2 =
        position.x +
        sliceDeviation / 2 -
        geometryParameters.width / 4 -
        blockMargin / 4;

      // Recursively generate the new sub-divided block elements and add them to the scene

      generateBuildingBlock(
        rng,
        // Building geometry parameters
        {
          width: width1,
          height: geometryParameters.height,
          depth: geometryParameters.depth,
        },
        // Building position
        {
          x: x1,
          z: position.z,
        },
        // Decrement the total number of sub-divisions we need to perform
        numOfDivisions - 1
      );

      generateBuildingBlock(
        rng,
        // Building geometry parameters
        {
          width: width2,
          height: geometryParameters.height,
          depth: geometryParameters.depth,
        },
        // Building position
        {
          x: x2,
          z: position.z,
        },
        // Decrement the total number of sub-divisions we need to perform
        numOfDivisions - 1
      );
    }
  }
}

// Function which initializes all of our city / scene elements
function generateCity(rng, gridSize, density) {
  //console.log(rng());
  generatePreceduralMaps(rng, gridSize, density);
  const buildings = generateGroundBlocks(rng, gridSize);
  const terrain = null; //generateCityTerrain(gridSize, elevation);
  //console.log(buildings, terrain);
  return {
    size: gridSize * blockSize, //(20 + 1.5 + 7 / 2)
    buildings: buildings,
    terrain: terrain,
  };
}

export default generateCity;
