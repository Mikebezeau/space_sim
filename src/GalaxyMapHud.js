import React from "react";
import useStore from "./stores/store";
import { FLIGHT } from "./util/constants";
import "./css/hudSpaceFlight.css";

//basic HTML/CSS heads up display used to show player info
export default function GalaxyMapHud() {
  const { switchScreen } = useStore((state) => state.actions);
  const { planets } = useStore((state) => state);

  return (
    <>
      <div id="upperLeft" className="hud">
        <h1 style={{ fontSize: "50px" }}>Galaxy Map</h1>
        <div className="hudData">
          <button onClick={() => switchScreen(FLIGHT)}>Exit</button>
          <p>System</p>
          {Object.entries(planets[0].data).map(([key, value]) => {
            return (
              <span key={key}>
                {key}:{" "}
                <span className="floatRight">
                  {Math.floor(value * 1000) / 1000 /*rounding off*/}
                </span>
                <br />
              </span>
            );
          })}
        </div>
      </div>
      <div id="upperRight" className="hud">
        <div className="hudData"></div>
      </div>
    </>
  );
}
