import React from "react";
import { useState } from "react";
import useEquipStore from "../stores/equipStore";
import { ServoSpaceAssignButtons } from "./Servos";
//CREW / PILOT

export const CrewAssignSpaces = ({ heading }) => {
  const { mechBP, equipActions } = useEquipStore((state) => state);
  const [servoSelectedId, setServoSelectedId] = useState(0);
  /*
  const handleCrewSelect = (weaponType, id) => {
    equipActions.assignPartLocationMenu.setCrewLocation(servoSelectedId);
  };
*/
  const handleServoSelect = (id) => {
    setServoSelectedId(id);
    equipActions.assignPartLocationMenu.setCrewLocation(id);
  };

  return (
    <>
      <h2>{heading}</h2>
      <ServoSpaceAssignButtons
        mechBP={mechBP}
        servoSelectedId={servoSelectedId}
        callBack={handleServoSelect}
      />
      <hr />
      <button>
        Crew/Passengers {mechBP.crewSP()}SP{" "}
        {mechBP.getServoById(mechBP.crewLocationServoId[0]) &&
          ">>> " + mechBP.getServoById(mechBP.crewLocationServoId[0]).type}
      </button>
    </>
  );
};

export const Crew = ({ heading }) => {
  const { mechBP, equipActions } = useEquipStore((state) => state);

  const handleCrew = (e) => {
    equipActions.basicMenu.setProp("crew", e.target.value);
  };

  const handlePassengers = (e) => {
    equipActions.basicMenu.setProp("passengers", e.target.value);
  };

  return (
    <>
      <h2>{heading}</h2>
      <h3>(does not scale)</h3>
      <div>
        <label htmlFor="crew">CREW MEMBERS (2 CP / each additional)</label>
        <select name="crew" id="crew" value={mechBP.crew} onChange={handleCrew}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        <br />

        <label htmlFor="passengers">PASSENGERS (1 CP each)</label>
        <select
          name="passengers"
          id="passengers"
          defaultValue={mechBP.passengers}
          onChange={handlePassengers}
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>

        <table>
          <tbody>
            <tr>
              <th>Space Required</th>
              <th>Cost</th>
            </tr>
            <tr>
              <td>{mechBP.crewSP()} SP</td>
              <td>{mechBP.crewCP()} CP</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

/*
<tr>
            <th>Mecha Ref. Mod.</th>
            <th>Commander Leadership</th>
            <th>Total Actions / Turn</th>
          </tr>
          <tr>
            <td>
              <input type="text" id="crewMR" className="textBox" value="0" />
            </td>
            <td>
              <input type="text" id="crewCmd" className="textBox" value="0" />
            </td>
            <td>
              <input type="text" id="crewActions" className="textBox" value="2" />
            </td>
          </tr>
        </table>
        <div className="sliderBoxHorizontal">
          <div className="sliderLable">
            <label htmlFor="controlType">Piloting Controls Type</label>
            <select name="controlType" id="controlType">
              <option value="0">Manual</option>
              <option value="1">Screen</option>
              <option value="2">Virtual</option>
              <option value="3">Reflex</option>
              <option value="4">Other</option>
            </select>
          </div>
        </div>

        <table>
          <tr>
            <th>Control Pool</th>
            <th>CM</th>
          </tr>
          <tr>
            <td>
              <input type="text" id="controlsPool" className="textBox" value="" />
            </td>
            <td>
              <input type="text" id="controlsCM" className="textBox" value="" />
            </td>
          </tr>
        </table>

        <div className="sliderBoxHorizontal">
          <div className="sliderLable">
            <label htmlFor="cockpitType">Cockpit Type</label>
            <select name="cockpitType" id="cockpitType">
              <option value="0">Armored (fully enclosed)</option>
              <option value="1">Canopy (windows, 1/2 armor)</option>
              <option value="2">Saddle (open air, no armor)</option>
            </select>
          </div>
          </div>
          */
