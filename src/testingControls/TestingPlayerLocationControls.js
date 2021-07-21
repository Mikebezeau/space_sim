import React from "react";
import useStore from "../stores/store";
import "../css/toggleControl.css";

export function TestingPlayerLocationControls() {
  //testing
  const { testing } = useStore((state) => state);

  return (
    <>
      <button onClick={testing.changeLocationSpace}>SpaceFlight</button>
      <button onClick={testing.changeLocationPlanet}>PlanetWalk</button>
      <button onClick={testing.changeLocationCity}>ToCity</button>
    </>
  );
}
