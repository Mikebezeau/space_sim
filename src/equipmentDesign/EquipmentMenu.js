//import React, { useMemo, useRef, useEffect } from "react";
import React, { useState } from "react";
import useStore from "../stores/store";
import useEquipStore from "../stores/equipStore";
import mechDesigns from "../data/mechDesigns";

import Mech from "../equipment/Mech";
import { Crew, CrewAssignSpaces } from "../equipment/Crew";
import { Servos } from "../equipment/Servos";
import ServoPositionButtons from "../equipmentDesign/ServoPositionButtons";
//import ServoHydraulics from "./equipment/ServoHydraulics";
import { Weapons, WeaponsAssignSpaces } from "../equipment/Weapons";
import { LandingBay, LandingBayAssignSpaces } from "../equipment/LandingBay";
import { FLIGHT } from "../util/constants";
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
  const handleSelectStationBP = (i) => {
    equipActions.blueprintMenu.importBlueprint(
      JSON.stringify(mechDesigns.station[i])
    );
    equipActions.basicMenu.editShipZoom(0);
  };
  const handleExportBP = () => {
    setImportExportText(equipActions.blueprintMenu.exportBlueprint());
  };

  //MAIN DESIGN MENU
  const { switchScreen } = useStore((state) => state.actions);

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
      <div id="equipmentMenu">
        <div>
          <button onClick={() => switchScreen(FLIGHT)}>Exit</button>
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
              <option>Select Enemy BP</option>
              {mechDesigns.enemy.map((bp, i) => (
                <option key={i} value={i}>
                  {bp.name}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => {
                handleSelectStationBP(e.target.value);
              }}
            >
              <option>Select Station BP</option>
              {mechDesigns.station.map((bp, i) => (
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
        <Mech />
        <div>
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
        </div>
        <hr style={{ clear: "both" }} />
        {mainMenuSelection !== 2 &&
          subCatagories[mainMenuSelection][subSelection] &&
          subCatagories[mainMenuSelection][subSelection].component}
      </div>
    </>
  );
}
