import { useMemo } from "react";
import { SCALE } from "../util/gameUtil";

export default function Stars({ count = 1000 }) {
  const positions = useMemo(() => {
    let positions = [];
    for (let i = 0; i < count; i++) {
      const r = 40000 * SCALE;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const x =
        r * Math.cos(theta) * Math.sin(phi) + (-2000 + Math.random() * 4000);
      const y =
        r * Math.sin(theta) * Math.sin(phi) + (-2000 + Math.random() * 4000);
      const z = r * Math.cos(phi) + (-1000 + Math.random() * 2000);
      positions.push(x);
      positions.push(y);
      positions.push(z);
    }
    return new Float32Array(positions);
  }, [count]);
  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        size={12.5 * SCALE}
        sizeAttenuation
        color="white"
        fog={false}
      />
    </points>
  );
}

/*

Creating a new object is generally quicker with Array than Float32Array. The gain is significant for small arrays, but is 
less (environment dependent) with larger arrays.

Accessing data from a TypedArray (eg. Float32Array) is often faster than from a normal array, which means that most array 
operations (aside from creating a new object) are faster with TypedArrays.

As also stated by @emidander, glMatrix was developed primarily for WebGL, which requires that vectors and matrices be 
passed as Float32Array. So, for a WebGL application, the potentially costly conversion from Array to Float32Array would need to be included in any performance measurement.



The best choice is application dependent:

If arrays are generally small, and/or number of operations on them is low so that the constructor time is a significant 
proportion of the array's lifespan, use Array.

If code readability is as important as performance, then use Array (i.e. use [], instead of a constructor).

If arrays are very large and/or are used for many operations, then use a TypedArray.

For WebGL applications (or other applications that would otherwise require a type conversion), use Float32Array (or other 
  TypedArray).
  
*/
