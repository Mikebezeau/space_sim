//import React, { useMemo, useRef, useEffect } from "react";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import useStore from "../stores/store";
import useEquipStore from "../stores/equipStore";
import mechDesigns from "../data/mechDesigns";

import { equipList } from "../data/equipData";
import Mech from "../equipment/Mech";
import { Crew, CrewAssignSpaces } from "../equipment/Crew";
import { Servos } from "../equipment/Servos";
import ServoPositionButtons from "../equipmentDesign/ServoPositionButtons";
//import ServoHydraulics from "./equipment/ServoHydraulics";
import { Weapons, WeaponsAssignSpaces } from "../equipment/Weapons";
import { LandingBay, LandingBayAssignSpaces } from "../equipment/LandingBay";
import "../css/equipmentMenu.css";

export default function EquipmentMenu() {
  //BLUEPRINT SELECTION MENU
  const { playerMechBP, equipActions } = useEquipStore((state) => state);

  const [selectedBPid, setSelectedBPid] = useState(0); //top menu
  const [importExportText, setImportExportText] = useState("");

  const handleNewBP = () => {
    equipActions.blueprintMenu.newBlueprint();
    setSelectedBPid(0);
    setSubSelection(null);
    equipActions.basicMenu.editShipZoom(0);
  };
  const handleSelectBlueprint = (id) => {
    equipActions.blueprintMenu.selectBlueprint(id);
    setSelectedBPid(id);
    setSubSelection(null);
    equipActions.basicMenu.editShipZoom(0);
  };
  const handleSaveBlueprint = () => {
    const id = equipActions.blueprintMenu.saveBlueprint(selectedBPid); //returns id of saved Blueprint
    setSelectedBPid(id);
  };
  const handleDeleteBlueprint = (id) => {
    equipActions.blueprintMenu.deleteBlueprint(id);
    handleNewBP();
    setSubSelection(null);
  };
  const handleImportChange = (e) => {
    setImportExportText(e.target.value);
  };
  const handleImportBP = () => {
    setImportExportText("");
    equipActions.basicMenu.editShipZoom(0);
  };
  const handleSelectBP = (i) => {
    equipActions.blueprintMenu.importBlueprint(
      JSON.stringify(mechDesigns.enemy[i])
    );
    equipActions.basicMenu.editShipZoom(0);
  };
  const handleExportBP = () => {
    setImportExportText(equipActions.blueprintMenu.exportBlueprint());
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
      //******************************************** */
      //design parts

      servos: {
        buttonLable: "Servos",
        component: <Servos heading="Mech parts: Size and Armor" />,
      },
      /*
      hydraulics: {
        buttonLable: "Servo Hydraulics",
        component: <ServoHydraulics heading="Servo Hydraulics Power Rating" />,
      },
    propulsion: { buttonLable: "Propulsion" },
    tech: { buttonLable: "Tech" },
    parts: { buttonLable: "Parts" },
    */
      weapons: {
        buttonLable: "Weapons / Shields",
        component: <Weapons heading={"View Weapon List, add weaponry"} />,
      },
      landingBay: {
        buttonLable: "Landing Bay",
        component: <LandingBay heading={"Select Landing Bays"} />,
      },
      crew: {
        buttonLable: "Crew / Controls / Passengers",
        component: (
          <Crew
            heading={"Assign number of crew, control type, and passenger space"}
          />
        ),
      },
    },
    {
      //********************************* */
      //asign spaces

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
      landingBay: {
        buttonLable: "Landing Bay",
        component: (
          <LandingBayAssignSpaces heading={"Select Landing Bay Location"} />
        ),
      },
      crew: {
        buttonLable: "Crew / Controls / Passengers",
        component: (
          <CrewAssignSpaces heading={"Choose servo to hold compartment"} />
        ),
      },
    },
  ];

  const topSelectionHandler = (key) => {
    equipActions.changeMainMenuSelection(key);
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
      <Center id="equipmentMenu">
        <div>
          <span
            className={selectedBPid === 0 ? "selectedItem" : "nonSelectedItem"}
          >
            <button onClick={handleNewBP}>New BP</button>
          </span>
          {playerMechBP.map((value, index) => (
            <span
              key={"mechbp" + index}
              className={
                selectedBPid === value.id ? "selectedItem" : "nonSelectedItem"
              }
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

          <span style={{ float: "right" }}>
            <input
              style={{ textTransform: "none" }}
              type="textbox"
              onChange={(e) => handleImportChange(e)}
              value={importExportText}
            />
            <select
              onChange={(e) => {
                handleSelectBP(e.target.value);
              }}
            >
              <option>Select BP</option>
              {mechDesigns.enemy.map((bp, i) => (
                <option key={i} value={i}>
                  {bp.name}
                </option>
              ))}
            </select>
            <span>
              <button onClick={handleImportBP}>Import BP</button>
            </span>
            <span>
              <button onClick={handleExportBP}>Export BP</button>
            </span>
          </span>
        </div>
        <hr />
        <Mech style={{ float: "right" }} />
        <LeftSidebar>
          <hr />
          {topMenuSelection.map((value, key) => (
            <span
              key={"topmenu" + key}
              className={
                mainMenuSelection === key ? "selectedItem" : "nonSelectedItem"
              }
            >
              <button onClick={() => topSelectionHandler(key)}>{value}</button>
            </span>
          ))}
          <hr />
          {mainMenuSelection === 2 ? (
            <ServoPositionButtons />
          ) : (
            //edit servo/weapon graphical locations
            //will also load the blueprint design 3d interface
            Object.entries(subCatagories[mainMenuSelection]).map(
              ([key, value]) => {
                return (
                  <span
                    key={"submenu" + key}
                    className={
                      subSelection === key ? "selectedItem" : "nonSelectedItem"
                    }
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
  overflow-y: scroll;
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
