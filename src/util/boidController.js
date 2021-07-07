import * as THREE from "three";
import { MaxEquation } from "three";
import { SCALE } from "../util/constants";

export function setupFlock(num) {
  const boids = [];
  // Popoulate Boids
  var i = 0;
  while (i < num) {
    boids[i] = new Boid(i);
    i++;
  }
  return boids;
}

// Boid Definition
export function Boid(index) {
  function rrand(min, max) {
    return Math.random() * (max - min) + min;
  }

  this.index = index;
  this.groupLeaderGuid = 0;

  this.minRange = 0;
  this.neighborRange = 0;

  this.distanceHome = 0;
  this.speed = 0;

  // Initial movement vectors
  this.position = new THREE.Vector3();
  this.velocity = new THREE.Vector3();

  this.acceleration = new THREE.Vector3(0, 0, 0);
  this.pointAt = new THREE.Vector3(0, 0, 0);
  this.mass = 0;

  this.home = new THREE.Vector3();
}

// Run an iteration of the flock
Boid.prototype.step = function (flock, boidInfo, isLeader, obstacles) {
  this.groupLeaderGuid = boidInfo.groupLeaderGuid;
  this.minRange = boidInfo.size * 2.5 * 25;
  this.neighborRange = boidInfo.size * 2.5 * 55;
  //this.mass = boidInfo.mechBP.scale; //boidInfo.size / 100 / SCALE;
  this.accumulate(flock, isLeader, obstacles);
  this.update();
  //this.obj.mesh.position.set(this.position.x, this.position.y, this.position.z);
};

// Apply Forces
Boid.prototype.accumulate = function (flock, isLeader, obstacles) {
  var separation, alignment, cohesion, centering;
  separation = this.separate(flock).multiplyScalar(15); // 0.2 * this.mass);
  alignment = this.align(flock).multiplyScalar(isLeader ? 0.5 : 0.8); //0.5
  cohesion = this.cohesion(flock).multiplyScalar(isLeader ? 0.01 : 0.01); //(0.01);
  centering = this.steer(this.home).multiplyScalar(isLeader ? 0.2 : 0.1); //(0.0001);
  //centering.multiplyScalar(this.position.distanceTo(this.home) * this.mass); // stronger centering if farther away
  this.acceleration.add(separation);
  this.acceleration.add(alignment);
  this.acceleration.add(cohesion);
  this.acceleration.add(centering);
  //this.acceleration.divideScalar(this.mass);
};

// Update Movement Vectors
Boid.prototype.update = function () {
  this.velocity.add(this.acceleration);
  this.speed = this.velocity.length() / SCALE;
  //console.log(this.speed);

  this.position.add(this.velocity);

  this.acceleration.set(0, 0, 0); // reset each iteration
  this.pointAt = this.position.clone();
};

// Separation Function (personal space)
Boid.prototype.separate = function (flock) {
  var currBoid;
  var total = new THREE.Vector3(0, 0, 0);
  var count = 0;
  // Find total weight of separation
  for (var i = 0; i < flock.length; i++) {
    currBoid = flock[i];
    var dist = this.position.distanceTo(currBoid.position);
    // Apply weight if too close neighborRange
    //if (dist < this.minRange && dist > 0) {
    //using minRange of other ship, this way little ships can avoid bigger ships
    if (dist < currBoid.minRange && dist > 0) {
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
  var currBoid;
  var total = new THREE.Vector3(0, 0, 0);
  var count = 0;
  // Find total weight for alignment
  for (var i = 0; i < flock.length; i++) {
    currBoid = flock[i];
    if (this.groupLeaderGuid === currBoid.groupLeaderGuid) {
      var dist = this.position.distanceTo(currBoid.position);
      // Apply force if near enough
      //if (dist < this.neighborRange && dist > 0) {
      if (dist < currBoid.neighborRange && dist > 0) {
        total.add(currBoid.velocity);
        count++;
      }
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
  var currBoid;
  var total = new THREE.Vector3(0, 0, 0);
  var count = 0;
  // Find total weight for cohesion
  for (var i = 0; i < flock.length; i++) {
    currBoid = flock[i];
    if (this.groupLeaderGuid === currBoid.groupLeaderGuid) {
      var dist = this.position.distanceTo(currBoid.position);
      // Apply weight if near enough
      //if (dist < this.neighborRange && dist > 0) {
      if (dist < currBoid.neighborRange && dist > 0) {
        total.add(currBoid.position);
        count++;
      }
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
