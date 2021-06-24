import React from "react";
import styled, { css } from "styled-components";
import useStore from "./stores/store";
import { GALAXY_MAP, EQUIPMENT_SCREEN } from "./util/gameUtil";
import { ToggleTestControls } from "./testingControls/ToggleTestControls";
import { TestingMapGalaxy } from "./testingControls/TestingMapGalaxy";
import { TestingEnemyControls } from "./testingControls/TestingEnemyControls";
import { TestingBoidControls } from "./testingControls/TestingBoidControls";
import "./css/hud.css";
import "./css/toggleControl.css";

//basic HTML/CSS heads up display used to show player info
export default function Hud() {
  //testing
  const { testing, toggleTestControls } = useStore((state) => state);
  const { switchScreen } = useStore((state) => state.actions);
  //
  const { speed, shield } = useStore((state) => state.player);
  const { planets, focusPlanetIndex } = useStore((state) => state);

  //const sound = useStore((state) => state.sound);
  //const toggle = useStore((state) => state.actions.toggleSound);
  /*
  const toggle = () => {
    return null;
  };
  //const seconds = useRef();
  
  useEffect(() => {
    const t = Date.now();
    const i = setInterval(
      () => (seconds.current.innerText = ((Date.now() - t) / 1000).toFixed(1)),
      100
    );
    return () => clearInterval(i);
  }, []);
*/

  //const speedVal = useMemo(() => speed + "Km/s", [speed]);

  return (
    <>
      <UpperLeft>
        <h2>Speed</h2>
        <h1>{speed}</h1>
        <div className="scanData">
          <ToggleTestControls />
          {!toggleTestControls && (
            <>
              <button onClick={() => switchScreen(GALAXY_MAP)}>
                (G)alaxy Star Map
              </button>
              <button onClick={() => switchScreen(EQUIPMENT_SCREEN)}>
                (E)quipment
              </button>

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
            </>
          )}
          {toggleTestControls && (
            <>
              <TestingMapGalaxy />

              <button onClick={testing.warpToPlanet}>(W)arp to Planet</button>
              <TestingEnemyControls />
            </>
          )}
        </div>
      </UpperLeft>
      <UpperRight>
        {shield.max > 0 && (
          <div className="shieldsBarContainer">
            <div
              className="shieldsBar"
              style={{
                width: ((shield.max - shield.damage) / shield.max) * 100 + "%",
              }}
            >
              <span>SHIELDS</span>
            </div>
          </div>
        )}
        <br />
        <div className="scanData">
          {!toggleTestControls &&
            focusPlanetIndex !== null &&
            planets[focusPlanetIndex] && (
              <>
                <p>Planet Scan</p>
                {Object.entries(planets[focusPlanetIndex].data).map(
                  ([key, value]) => {
                    return (
                      <span key={key}>
                        <span className="floatLeft">{key}:</span> {value}
                        <br />
                      </span>
                    );
                  }
                )}
              </>
            )}
          {toggleTestControls && (
            <>
              <TestingBoidControls />
            </>
          )}
        </div>
      </UpperRight>
    </>
  );
}

const base = css`
  font-family: "Teko", sans-serif;
  position: absolute;
  text-transform: uppercase;
  font-weight: 900;
  font-variant-numeric: slashed-zero tabular-nums;
  line-height: 1em;
  pointer-events: none;
  color: lightblue;
`;

const UpperLeft = styled.div`
  ${base}
  top: 40px;
  left: 2vw;
  transform: skew(5deg, 5deg);
  width: 18vw;
  & > h1 {
    margin: 0;
    font-size: 10vw;
    line-height: 1em;
  }
  & > h2 {
    margin: 0;
    font-size: 2vw;
    line-height: 1em;
  }

  @media only screen and (min-width: 500px) {
    width: 180px;
  }
`;

const UpperRight = styled.div`
  ${base}
  text-align: right;
  top: 250px;
  right: 2vw;
  transform: skew(-5deg, -5deg);
  font-size: 1.5vw;
  width: 18vw;

  @media only screen and (min-width: 500px) {
    width: 180px;
  }
`;

/*
const LowerLeft = styled.div`
  ${base}
  bottom: 40px;
  left: 50px;
  transform: skew(-5deg, -10deg);
  width: 200px;
  & > h1 {
    margin: 0;
    font-size: 10em;
    line-height: 1em;
  }
  & > h2 {
    margin: 0;
    font-size: 2em;
    line-height: 1em;
  }
  @media only screen and (max-width: 700px) {
    & > h1 {
      font-size: 6em !important;
    }
    & > h2 {
      font-size: 3em !important;
    }
  }
`;

const LowerRight = styled.div`
  ${base}
  bottom: 70px;
  right: 50px;
  transform: skew(5deg, 10deg);
  height: 40px;
  width: 200px;
  background: black;
  & > div {
    height: 100%;
    background: lightblue;
  }

  @media only screen and (max-width: 700px) {
    bottom: 50px;
    height: 30px;
    width: 150px;
  }
`;
*/
