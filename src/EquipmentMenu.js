//import React, { useMemo, useRef, useEffect } from "react";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import useStore from "./stores/store";
import useEquipStore from "./stores/equipStore";
import Mech from "./equipment/Mech";

import { Crew, CrewAssignSpaces } from "./equipment/Crew";
import { Servos, ServoEditButtons } from "./equipment/Servos";
import ServoHydraulics from "./equipment/ServoHydraulics";
import { Weapons, WeaponsAssignSpaces } from "./equipment/Weapons";

export default function EquipmentMenu() {
  //BLUEPRINT SELECTION MENU
  const { playerMechBP, actions } = useEquipStore((state) => state);

  const [selectedBPid, setSelectedBPid] = useState(0); //top menu

  const handleNewBP = () => {
    actions.blueprintMenu.newBlueprint();
    setSelectedBPid(0);
    setSubSelection(null);
  };
  const handleSelectBlueprint = (id) => {
    actions.blueprintMenu.selectBlueprint(id);
    setSelectedBPid(id);
    setSubSelection(null);
  };
  const handleSaveBlueprint = () => {
    const id = actions.blueprintMenu.saveBlueprint(selectedBPid); //returns id of saved Blueprint
    setSelectedBPid(id);
  };
  const handleDeleteBlueprint = (id) => {
    actions.blueprintMenu.deleteBlueprint(id);
    handleNewBP();
    setSubSelection(null);
  };

  //MAIN DESIGN MENU
  const health = useStore((state) => state.health);
  const stations = useStore((state) => state.stations);
  const stationDock = useStore((state) => state.stationDock);

  const { mainMenuSelection } = useEquipStore((state) => state); //top menu

  const [subSelection, setSubSelection] = useState(null); //current sub menu

  const topMenuSelection = [
    "Design Parts",
    "Assign Part Locations",
    "Position Servo Shapes",
  ];
  const subCatagories = [
    {
      //design parts
      crew: {
        buttonLable: "Crew / Controls / Passengers",
        component: (
          <Crew
            heading={"Assign number of crew, control type, and passenger space"}
          />
        ),
      },
      servos: {
        buttonLable: "Servos",
        component: <Servos heading="Mech parts: Size and Armor" />,
      },
      hydraulics: {
        buttonLable: "Servo Hydraulics",
        component: <ServoHydraulics heading="Servo Hydraulics Power Rating" />,
      },
      /*
    propulsion: { buttonLable: "Propulsion" },
    tech: { buttonLable: "Tech" },
    parts: { buttonLable: "Parts" },
    */
      weapons: {
        buttonLable: "Weapons / Shields",
        component: <Weapons heading={"View Weapon List, add weaponry"} />,
      },
    },
    {
      //asign spaces
      crew: {
        buttonLable: "Crew / Controls / Passengers",
        component: (
          <CrewAssignSpaces heading={"Choose servo to hold compartment"} />
        ),
      },

      /*
    propulsion: { buttonLable: "Propulsion" },
    tech: { buttonLable: "Tech" },
    parts: { buttonLable: "Parts" },
    */
      weapons: {
        buttonLable: "Weapons / Shields",
        component: (
          <WeaponsAssignSpaces
            heading={"Select Servo, then select weapon to place"}
          />
        ),
      },
    },
  ];

  const topSelectionHandler = (key) => {
    actions.changeMainMenuSelection(key);
  };
  const subSelectionHandler = (key) => {
    //console.log(key);
    setSubSelection(key);
  };

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
        <div>
          <span className={selectedBPid === 0 ? "selectedItem" : "false"}>
            <button onClick={handleNewBP}>New BP</button>
          </span>
          {playerMechBP.map((value, index) => (
            <span
              key={"mechbp" + index}
              className={selectedBPid === value.id ? "selectedItem" : "false"}
            >
              <button
                key={"select" + index}
                onClick={() => handleSelectBlueprint(value.id)}
              >
                {value.name}
              </button>
              <button
                key={"delete" + index}
                onClick={() => handleDeleteBlueprint(value.id)}
              >
                X
              </button>
            </span>
          ))}
          <button onClick={handleSaveBlueprint}>Save Blueprint</button>
        </div>
        <LeftSidebar>
          <hr />
          {topMenuSelection.map((value, key) => (
            <span
              key={"topmenu" + key}
              className={mainMenuSelection === key ? "selectedItem" : "false"}
            >
              <button onClick={() => topSelectionHandler(key)}>{value}</button>
            </span>
          ))}
          <hr />
          {mainMenuSelection === 2 ? (
            <ServoEditButtons />
          ) : (
            //edit servo/weapon graphical locations
            //will also load the blueprint design 3d interface
            Object.entries(subCatagories[mainMenuSelection]).map(
              ([key, value]) => {
                return (
                  <span
                    key={"submenu" + key}
                    className={subSelection === key ? "selectedItem" : "false"}
                  >
                    <button onClick={() => subSelectionHandler(key)}>
                      {value.buttonLable}
                    </button>
                  </span>
                  //)
                );
              }
            )
          )}
        </LeftSidebar>
        <Mech />
        <hr style={{ clear: "both" }} />
        {mainMenuSelection !== 2 &&
          subCatagories[mainMenuSelection][subSelection] &&
          subCatagories[mainMenuSelection][subSelection].component}
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

const LeftSidebar = styled.div`
  float: left;
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
