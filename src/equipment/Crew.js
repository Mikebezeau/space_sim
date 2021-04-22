import useEquipStore from "../stores/equipStore";
import { equipList } from "../util/equipList";
import { mecha } from "../util/equipUtil";
//CREW / PILOT

const CrewDesign = () => {
  const { crew, passengers, crewSP, crewCP, actions } = useEquipStore(
    (state) => state
  );

  const handleCrew = (e) => {
    actions.setCrew(e.target.value);
  };

  const handlePassengers = (e) => {
    actions.setPassengers(e.target.value);
  };

  return (
    <>
      <h2>Pilot / Crew / Controls</h2>
      <h3>Cost does not scale</h3>
      <div>
        <label for="crew">CREW MEMBERS (2 CP / each additional)</label>
        <select
          name="crew"
          id="crew"
          name="passengers"
          id="passengers"
          defaultValue={crew}
          onChange={handleCrew}
        >
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

        <label for="passengers">PASSENGERS (1 CP each)</label>
        <select
          name="passengers"
          id="passengers"
          defaultValue={passengers}
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
              <td>{crewSP() + " SP"}</td>
              <td>{crewCP() + " CP"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
export default CrewDesign;

/*
<tr>
            <th>Mecha Ref. Mod.</th>
            <th>Commander Leadership</th>
            <th>Total Actions / Turn</th>
          </tr>
          <tr>
            <td>
              <input type="text" id="crewMR" class="textBox" value="0" />
            </td>
            <td>
              <input type="text" id="crewCmd" class="textBox" value="0" />
            </td>
            <td>
              <input type="text" id="crewActions" class="textBox" value="2" />
            </td>
          </tr>
        </table>
        <div class="sliderBoxHorizontal">
          <div class="sliderLable">
            <label for="controlType">Piloting Controls Type</label>
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
              <input type="text" id="controlsPool" class="textBox" value="" />
            </td>
            <td>
              <input type="text" id="controlsCM" class="textBox" value="" />
            </td>
          </tr>
        </table>

        <div class="sliderBoxHorizontal">
          <div class="sliderLable">
            <label for="cockpitType">Cockpit Type</label>
            <select name="cockpitType" id="cockpitType">
              <option value="0">Armored (fully enclosed)</option>
              <option value="1">Canopy (windows, 1/2 armor)</option>
              <option value="2">Saddle (open air, no armor)</option>
            </select>
          </div>
          </div>
          */
