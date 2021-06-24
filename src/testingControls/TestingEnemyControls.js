import React from "react";
import useStore from "../stores/store";
import "../css/toggleControl.css";

export function TestingEnemyControls() {
  //testing
  const { testing, showLeaders } = useStore((state) => state);

  return (
    <>
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
    </>
  );
}
