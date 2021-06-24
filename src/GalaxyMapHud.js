import React from "react";
import styled, { css } from "styled-components";
import useStore from "./stores/store";
import { FLIGHT } from "./util/gameUtil";
import "./css/hud.css";

//basic HTML/CSS heads up display used to show player info
export default function GalaxyMapHud() {
  const { switchScreen } = useStore((state) => state.actions);
  const { planets } = useStore((state) => state);

  return (
    <>
      <UpperLeft>
        <h2>Galaxy Map</h2>
        <h1> </h1>
        <div className="scanData">
          <button onClick={() => switchScreen(FLIGHT)}>(E)xit</button>
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
      </UpperLeft>
      <UpperRight>
        <div className="scanData">
          <p>Other</p>
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
