//import React, { useMemo, useRef, useEffect } from "react";
import React from "react";
import styled, { css, createGlobalStyle } from "styled-components";
import useStore from "./store";
import useKBControls from "./hooks/useKBControls";

export default function StationMenu() {
  const actions = useStore((state) => state.actions);
  const health = useStore((state) => state.health);
  const stationDock = useStore((state) => state.stationDock);
  const stations = useStore((state) => state.stations);

  //
  function handle() {
    //actions.?();
  }
  useKBControls("btn-1", handle);

  return (
    <>
      <UpperLeft>
        <h2>Station</h2>
        <h1>{stations[stationDock.stationIndex].name}</h1>
        <h1>{stations[stationDock.stationIndex].type}</h1>
      </UpperLeft>
      <UpperRight>
        <div style={{ width: health + "%" }} />
      </UpperRight>
      <LowerLeft></LowerLeft>
      <Global />
      <LowerRight>
        <div id="btn-1"></div>
        <div id="btn-2"></div>
        <div id="btn-3"></div>
      </LowerRight>
    </>
  );
}
/*

      <LowerLeft>
        <h2 ref={seconds}>0.0</h2>
        <h1>{score}</h1>
      </LowerLeft>
      
      <LowerRight>
        <div style={{ width: health + "%" }} />
      </LowerRight>
      */
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

/*
const UpperLeft = styled.div`
  ${base}
  top: 40px;
  left: 50px;
  font-size: 2em;
  transform: skew(5deg, 10deg);
  pointer-events: all;
  cursor: pointer;
  @media only screen and (max-width: 700px) {
    font-size: 1.5em;
  }
`;
*/

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

/*
const UpperRight = styled.div`
  ${base}
  text-align: right;
  top: 40px;
  right: 50px;
  font-size: 2em;
  transform: skew(-5deg, -10deg);
  pointer-events: all;
  cursor: pointer;
  & > a {
    color: lightblue;
    text-decoration: none;
  }
  @media only screen and (max-width: 700px) {
    font-size: 1.5em;
  }
`;
*/

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
*/

const LowerLeft = styled.div`
  ${base}
  display:none;
  bottom: 40px;
  left: 50px;
  width: 200px;
  height: 200px;

  & > div {
    pointer-events: all;
    height: 100%;
    width: 100%;
    background: gray;
    border-radius: 500px;
  }

  @media only screen and (max-width: 700px) {
    display: block;
    height: 120px;
    width: 120px;
    left: 5%;
  }
`;

/*
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

const LowerRight = styled.div`
  ${base}
  display:none;
  bottom: 120px;
  right: 50px;
  transform: skew(-5deg, -10deg);
  height: 240px;
  width: 200px;

  & > div {
    margin-top: 10%;
    float: right;
    clear: both;
    height: 40%;
    width: 40%;
    pointer-events: all;
    background: gray;
    border-radius: 30px 20px;
  }

  @media only screen and (max-width: 700px) {
    display: block;
    height: 30%;
    width: 20%;
    right: 5%;
    bottom: 15%;
  }
`;

const Global = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    user-select: none;
    overflow: hidden;
  }

  #root {
    overflow: auto;
    padding: 0px;
  }

  body {
    position: fixed;
    overflow: hidden;
    overscroll-behavior-y: none;
    font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif;
    color: black;
    background: white;
    cursor: none;
  }
`;
