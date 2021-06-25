import React from "react";
import useStore from "../stores/store";
import "../css/sliderControl.css";
import "../css/toggleControl.css";

export function TestingBoidControls() {
  //testing
  const { testing, boidMod } = useStore((state) => state);

  return (
    <>
      {/*}
      <button onClick={testing.summonEnemy}>(S)ummon Enemy</button>
      <div className="toggleContainer">
        <span>Show (L)eaders</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={showLeaders}
            value={1}
            onChange={testing.showLeaders}
          />
          <span className="toggleslider"></span>
        </label>
      </div>

      
      boidMinRangeMod
    boidNeighborRangeMod
    boidSeparationMod
    boidAlignmentMod
    boidCohesionMod
    boidCenteringMod

  */}
      <div className="slidecontainer">
        BOIDS
        <br />
        <input
          onInput={(e) => testing.setBoidMod("boidMinRangeMod", e.target.value)}
          type="range"
          min={0}
          max={20}
          value={boidMod.boidMinRangeMod}
          className="slider"
        />
      </div>
      <span className="formSliderLabel">
        Min Range {boidMod.boidMinRangeMod}
      </span>
    </>
  );
}
