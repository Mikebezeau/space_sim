import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import useStore from "./stores/store";

//basic HTML/CSS heads up display used to show player info
export default function Hud() {
  const speed = useStore((state) => state.speed);
  //const points = useStore((state) => state.points);
  const health = useStore((state) => state.health);
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

  /*
  const speedVal = useMemo(
    () => (speed >= 1000 ? (speed / 1000).toFixed(1) + "K" : speed),
    [speed]
  );
  */
  return (
    <>
      <UpperLeft>
        <h2>Speed</h2>
        <h1>{speed}</h1>
      </UpperLeft>
      <UpperRight>
        <div style={{ width: health + "%" }} />
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
  left: 50px;
  transform: skew(5deg, 10deg);
  width: 20%;
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
    top: 5%;
    left: 12%;
    & > h1 {
      font-size: 3em !important;
    }
    & > h2 {
      font-size: 1em !important;
    }
  }
`;

const UpperRight = styled.div`
  ${base}
  text-align: right;
  top: 40px;
  right: 50px;
  transform: skew(-5deg, -10deg);
  font-size: 2em;
  height: 40px;
  width: 200px;
  background: black;
  & > div {
    height: 100%;
    background: lightblue;
  }

  @media only screen and (max-width: 700px) {
    bottom: 50px;
    height: 10px;
    width: 50px;
    font-size: 1.5em;
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
