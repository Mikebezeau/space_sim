import React from "react";
import useStore from "../stores/store";
import "../css/toggleControl.css";

export function ToggleTestControls() {
  //testing
  const { testing, toggleTestControls } = useStore((state) => state);

  return (
    <>
      <div className="toggleContainer">
        <span>Testing</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={toggleTestControls}
            value={1}
            onChange={testing.toggleTestControls}
          />
          <span className="toggleslider"></span>
        </label>
      </div>
    </>
  );
}
