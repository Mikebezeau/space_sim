import React from "react";
import useStore from "../stores/store";
import {
  CONTROLS_UNATTENDED,
  CONTROLS_PILOT,
  CONTROLS_SCAN_PLANET,
  CONTROLS_SCAN_SHIP,
  CONTROLS_SCAN_STRUCTURE,
} from "../util/gameUtil";

export default function ContextMenu() {
  //CONTEXT MENU
  const { contextMenuPos } = useEquipStore((state) => state);
  const { contextMenuSelect } = useEquipStore((state) => state.actions);

  const handleMenuSelect = (selectVal) => {
    contextMenuSelect(selectVal);
  };

  return <div className={contextMenu}>CONTEXT MENU</div>;
}
