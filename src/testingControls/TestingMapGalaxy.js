import React from "react";
import useStore from "../stores/store";
import "../css/toggleControl.css";

export function TestingMapGalaxy() {
  //testing
  const { testing, galaxyMapDataOutput } = useStore((state) => state);

  return (
    <>
      <button onClick={testing.mapGalaxy}>(M)ap Galaxy</button>
      <input
        type="textbox"
        placeholder="Map output"
        value={galaxyMapDataOutput}
      />
    </>
  );
}
