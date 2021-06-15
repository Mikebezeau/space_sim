import * as THREE from "three";
import { SCALE } from "../util/gameUtil";

export function setupFlock(numA, numB) {
  const boids = [];
  // Popoulate X-Boid ships
  var i = 0;
  while (i < numA) {
    boids[i] = new Boid(1, i);
    i++;
  }
  // Populate O-Boid ships
  while (i < numA + numB) {
    boids[i] = new Boid(0, i);
    i++;
  }
  return boids;
}

// Boid Definition
export function Boid(type, index) {
  function rrand(min, max) {
    return Math.random() * (max - min) + min;
  }

  this.type = type;
  this.index = index;

  this.minRange = this.type === 0 ? 200 * SCALE : 600 * SCALE;
  this.neighborRange = this.type === 0 ? 200 * SCALE : 600 * SCALE;

  this.distanceHome = 0;

  // Initial movement vectors
  //this.position = new THREE.Vector3(0, 0, 0);
  // Initial movement vectors
  this.position = type
    ? new THREE.Vector3(rrand(8, 10), rrand(-1, 1), 8)
    : new THREE.Vector3(rrand(-8, -10), rrand(-1, 1), 8);
  this.velocity = new THREE.Vector3(
    rrand(-0.1, 0.1),
    rrand(-0.1, 0.1),
    rrand(-0.1, 0.1)
  );
  this.acceleration = new THREE.Vector3(0, 0, 0);
  this.pointAt = new THREE.Vector3(0, 0, 0);
  this.mass = type ? 1 : 2;
  // Type determines boid geometry, home location, and starting position
  //this.obj = type ? new XShip() : new OShip();
  //this.home = new THREE.Vector3();
  this.home = type
    ? new THREE.Vector3(-10, 0, 10)
    : new THREE.Vector3(10, 0, 10);
  //scene.add(this.obj.mesh);
}

// Run an iteration of the flock
Boid.prototype.step = function (flock) {
  this.accumulate(flock);
  this.update();
  //this.obj.mesh.position.set(this.position.x, this.position.y, this.position.z);
};

// Apply Forces
Boid.prototype.accumulate = function (flock) {
  var separation, alignment, cohesion, centering;
  separation = this.separate(flock).multiplyScalar(20 * this.mass * SCALE);
  alignment = this.align(flock).multiplyScalar(50 * SCALE);
  cohesion = this.cohesion(flock).multiplyScalar(10 * SCALE);
  centering = this.steer(this.home).multiplyScalar(0.1 * SCALE);
  this.distanceHome = this.position.distanceTo(this.home) / 5;
  const maxDis = this.distanceHome * SCALE;
  //this.distanceHome * SCALE > 50 ? 50 * SCALE : this.distanceHome;
  centering.multiplyScalar(maxDis * this.mass * SCALE); // stronger centering if farther away
  this.acceleration.add(separation);
  this.acceleration.add(alignment);
  this.acceleration.add(cohesion);
  this.acceleration.add(centering);
  this.acceleration.divideScalar(this.mass * SCALE);
};

// Update Movement Vectors
Boid.prototype.update = function () {
  const maxA = this.type === 0 ? 50 * SCALE : 0 * SCALE;
  // Limit max forces
  if (this.acceleration.length() > maxA) {
    this.acceleration.normalize();
    this.acceleration.multiplyScalar(maxA);
  }
  this.velocity.add(this.acceleration);
  const maxV = this.type === 0 ? 100 * SCALE : 50 * SCALE;
  // Limit max forces
  if (this.velocity.length() > maxV) {
    this.velocity.normalize();
    this.velocity.multiplyScalar(maxV);
  }
  //if (this.index === 0) console.log(this.velocity.length());
  this.position.add(this.velocity);
  this.acceleration.set(0, 0, 0); // reset each iteration
  // X-Boids point in their direction of travel, O-Boids point in their direction of acceleration
  //this.pointAt = this.type ? this.position.clone() : this.velocity.clone();
  this.pointAt = this.position.clone();
  //this.obj.mesh.lookAt(pointAt);
};

// Separation Function (personal space)
Boid.prototype.separate = function (flock) {
  //var minRange = 60;
  var currBoid;
  var total = new THREE.Vector3(0, 0, 0);
  var count = 0;
  // Find total weight of separation
  for (var i = 0; i < flock.length; i++) {
    currBoid = flock[i];
    var dist = this.position.distanceTo(currBoid.position);
    // Apply weight if too close
    if (dist < this.minRange && dist > 0) {
      var force = this.position.clone();
      force.sub(currBoid.position);
      force.normalize();
      force.divideScalar(dist);
      total.add(force);
      count++;
    }
  }
  // Average out total weight
  if (count > 0) {
    total.divideScalar(count);
    total.normalize();
  }
  return total;
};

// Alignment Function (follow neighbours)
Boid.prototype.align = function (flock) {
  //var neighborRange = 100;
  var currBoid;
  var total = new THREE.Vector3(0, 0, 0);
  var count = 0;
  // Find total weight for alignment
  for (var i = 0; i < flock.length; i++) {
    currBoid = flock[i];
    var dist = this.position.distanceTo(currBoid.position);
    // Apply force if near enough
    if (dist < this.neighborRange && dist > 0) {
      total.add(currBoid.velocity);
      count++;
    }
  }
  // Average out total weight
  if (count > 0) {
    total.divideScalar(count);
    //total.limit(1);
    const max = 1;
    // Limit max forces
    if (total.length() > max) {
      total.normalize();
      total.multiplyScalar(max);
    }
  }
  return total;
};

// Cohesion Function (follow whole flock)
Boid.prototype.cohesion = function (flock) {
  //var neighborRange = 100;
  var currBoid;
  var total = new THREE.Vector3(0, 0, 0);
  var count = 0;
  // Find total weight for cohesion
  for (var i = 0; i < flock.length; i++) {
    currBoid = flock[i];
    var dist = this.position.distanceTo(currBoid.position);
    // Apply weight if near enough
    if (dist < this.neighborRange && dist > 0) {
      total.add(currBoid.position);
      count++;
    }
  }
  // Average out total weight
  if (count > 0) {
    total.divideScalar(count);
    // Find direction to steer with
    return this.steer(total);
  } else {
    return total;
  }
};

Boid.prototype.steer = function (target) {
  var steer = new THREE.Vector3(0, 0, 0);
  var des = new THREE.Vector3().subVectors(target, this.position);
  var dist = des.length();
  if (dist > 0) {
    des.normalize();
    steer.subVectors(des, this.velocity);
  }
  return steer;
};
