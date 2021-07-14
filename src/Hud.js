import React from "react";
import useStore from "./stores/store";
import {
  CONTROLS_UNATTENDED,
  CONTROLS_PILOT_COMBAT,
  CONTROLS_PILOT_SCAN,
  EQUIPMENT_SCREEN,
} from "./util/constants";
import { ToggleTestControls } from "./testingControls/ToggleTestControls";
import { TestingMapGalaxy } from "./testingControls/TestingMapGalaxy";
import { TestingEnemyControls } from "./testingControls/TestingEnemyControls";
import { TestingPlayerLocationControls } from "./testingControls/TestingPlayerLocationControls";
import { TestingBoidControls } from "./testingControls/TestingBoidControls";
import "./css/hud.css";
import "./css/hudSpaceFlight.css";
import "./css/toggleControl.css";

//basic HTML/CSS heads up display used to show player info
export default function Hud() {
  const { toggleTestControls } = useStore((state) => state);
  const { switchScreen } = useStore((state) => state.actions);
  const { speed, shield, currentMechBPindex } = useStore(
    (state) => state.player
  );
  const { playerControlMode, playerMechBP, planets, focusPlanetIndex } =
    useStore((state) => state);

  const weaponList = playerMechBP[currentMechBPindex].weaponList;

  //const sound = useStore((state) => state.sound);
  //const toggle = useStore((state) => state.actions.toggleSound);
  //const speedVal = useMemo(() => speed + "Km/s", [speed]);

  return (
    <>
      <div id="upperLeft" className="hud">
        {playerControlMode !== CONTROLS_UNATTENDED && (
          <>
            <h2>Speed</h2>
            <h1>{speed}</h1>
          </>
        )}
        <div className="hudData">
          <ToggleTestControls />
          {!toggleTestControls && (
            <>
              {playerControlMode === CONTROLS_PILOT_COMBAT && (
                <>
                  {weaponList.beam.map((weapon, i) => (
                    <p key={i}>{weapon.data.name}</p>
                  ))}
                  {weaponList.proj.map((weapon, i) => (
                    <p key={i}>{weapon.data.name} / AMMO</p>
                  ))}
                  {weaponList.missile.map((weapon, i) => (
                    <p key={i}>{weapon.data.name} / #</p>
                  ))}
                </>
              )}

              {playerControlMode === CONTROLS_PILOT_SCAN && (
                <>
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
            </>
          )}
          {toggleTestControls && (
            <>
              <TestingMapGalaxy />
              <button onClick={() => switchScreen(EQUIPMENT_SCREEN)}>
                Equipment
              </button>
              <TestingEnemyControls />
              <TestingPlayerLocationControls />
            </>
          )}
        </div>
      </div>
      <div id="upperRight" className="hud">
        {playerControlMode === CONTROLS_PILOT_COMBAT && shield.max > 0 && (
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
        <div className="hudData">
          {!toggleTestControls &&
            playerControlMode === CONTROLS_PILOT_SCAN &&
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
      </div>
    </>
  );
}
