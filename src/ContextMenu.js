import React from "react";
import useStore from "./stores/store";
import {
  GALAXY_MAP,
  CONTROLS_UNATTENDED,
  CONTROLS_PILOT_COMBAT,
  CONTROLS_PILOT_SCAN,
} from "./util/constants";
import "./css/contextMenu.css";

export default function ContextMenu() {
  //CONTEXT MENU
  const { playerControlMode, contextMenuPos } = useStore((state) => state);
  const { contextMenuSelect, switchScreen, orbitPlanet } = useStore(
    (state) => state.actions
  );

  const handleMenuSelect = (selectVal) => {
    contextMenuSelect(selectVal);
  };
  return (
    <div
      className="contextMenu"
      style={{ top: contextMenuPos.y, left: contextMenuPos.x - 75 }}
    >
      {playerControlMode !== CONTROLS_PILOT_COMBAT && (
        <button onClick={() => handleMenuSelect(CONTROLS_PILOT_COMBAT)}>
          COMBAT MODE
        </button>
      )}
      {playerControlMode !== CONTROLS_PILOT_SCAN && (
        <button onClick={() => handleMenuSelect(CONTROLS_PILOT_SCAN)}>
          SENSOR MODE
        </button>
      )}
      {playerControlMode !== 9 && (
        <button onClick={() => handleMenuSelect(CONTROLS_UNATTENDED)}>
          ORBIT
        </button>
      )}
      {playerControlMode !== 9 && (
        <button onClick={() => handleMenuSelect(CONTROLS_UNATTENDED)}>
          DOCK
        </button>
      )}
      {playerControlMode !== CONTROLS_UNATTENDED && (
        <button onClick={() => handleMenuSelect(CONTROLS_UNATTENDED)}>
          VIEW SHIP
        </button>
      )}
      <button onClick={() => switchScreen(GALAXY_MAP)}>Galaxy Star Map</button>
    </div>
  );
}
