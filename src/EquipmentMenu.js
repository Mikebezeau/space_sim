//import React, { useMemo, useRef, useEffect } from "react";
import React, { useState } from "react";
import styled, { css, createGlobalStyle } from "styled-components";
import useStore from "./stores/store";
import useEquipStore from "./stores/equipStore";
import Mecha from "./equipment/Mecha";

import CrewDesign from "./equipment/Crew";
import Servos from "./equipment/Servos";
import ServoHydraulics from "./equipment/ServoHydraulics";

import AssignSpaces from "./equipment/AssignSpaces";

export default function EquipmentMenu() {
  const SELECT_DESIGN = "design";
  const SELECT_ASSIGN = "assign";

  const health = useStore((state) => state.health);
  const stations = useStore((state) => state.stations);
  const stationDock = useStore((state) => state.stationDock);

  const [selection, setSelection] = useState(SELECT_DESIGN); //top menu
  const [subSelection, setSubSelection] = useState(null); //current sub menu

  const topMenuSelection = {
    design: "Ship Design",
    assign: "Assign Equipment",
  };
  const equipCatagories = {
    crew: {
      title: "Pilot / Crew / Controls",
      designComponent: <CrewDesign />,
      //assignComponent: <AssignSpaces type="crew" />,
    },
    servos: { title: "Servos", designComponent: <Servos /> },
    hydraulics: {
      title: "Servo Hydraulics",
      designComponent: <ServoHydraulics />,
    },
    propulsion: { title: "Propulsion" },
    tech: { title: "Tech" },
    parts: { title: "Parts" },
    weapons: { title: "Weapons / Shields" },
  };

  //
  function topSelectionHandler(key) {
    console.log(key);
    setSelection(key);
  }
  function subSelectionHandler(key) {
    console.log(key);
    setSubSelection(key);
  }

  Object.entries(equipCatagories).map(([key, value]) => {
    //console.log(value.title);
  });

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
      <Center>
        <Mecha />
        <CenterList>
          <ul>
            {Object.entries(topMenuSelection).map(([key, value]) => (
              <li key={key} onClick={() => topSelectionHandler(key)}>
                {value}
              </li>
            ))}
          </ul>
          <hr />
          <ul>
            {Object.entries(equipCatagories).map(([key, value]) => (
              <li key={key} onClick={() => subSelectionHandler(key)}>
                {value.title}
              </li>
            ))}
          </ul>
        </CenterList>
        <EquipBox>
          {selection === SELECT_DESIGN &&
            subSelection &&
            equipCatagories[subSelection].designComponent}
        </EquipBox>
      </Center>
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

const Center = styled.div`
  ${base}
  top: 15%;
  left: 10%;
  pointer-events: all;
  cursor: pointer;
  width: 80%;
  height: 80%;
  border: 1px solid #fff;
  @media only screen and (max-width: 700px) {
    font-size: 1.5em;
  }
  li {
    list-style-type: none;
    margin-bottom:5%;
    &:hover {
      color: white;
    }
`;

const CenterList = styled.div`
  position: absolute;
  margin-top: 5%;
  margin-left: 5%;
  width: 30%;
  height: 90%;
  border: 1px solid #fff;
`;

const EquipBox = styled.div`
  position: absolute;
  margin-top: 5%;
  margin-left: 40%;
  width: 55%;
  height: 90%;
  border: 1px solid #fff;
`;

const UpperLeft = styled.div`
  ${base}
  top: 40px;
  left: 50px;
  transform: skew(5deg, 10deg);
  width: 20%;
  & > h1 {
    margin: 0;
    font-size: 1em;
    line-height: 1em;
  }
  & > h2 {
    margin: 0;
    font-size: 0.8em;
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
