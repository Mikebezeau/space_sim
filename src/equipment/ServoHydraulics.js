import useEquipStore from "../stores/equipStore";
import ServoList from "./ServoList";

//DISPLAY LIST OF SERVOS
const ServoHydraulics = () => {
  const { servoList, hydraulicsType, hydrRefObj } = useEquipStore(
    (state) => state
  );

  const handleHydraulics = (e) => {
    //actions.setHydraulics(e.target.value);
  };

  return (
    <>
      <ServoList />
      <h3>Servo Hydraulics</h3>
      <table>
        <tr>
          <th>Servo Hydraulics</th>
          <th colspan="3">
            <div class="sliderLable">
              <select
                name="hydraulics"
                id="hydraulics"
                defalutValue={hydraulicsType}
              >
                {hydrRefObj.type.map((value, key) => (
                  <option value={key}>{value}</option>
                ))}
              </select>
            </div>
          </th>
        </tr>
        <tr>
          <th>Cost Mult.</th>
          <th>Spaces</th>
          <th></th>
        </tr>
        <tr>
          <th>
            <input type="text" id="hydrCM" class="textBox" value="1" />
          </th>
          <th>
            <input type="text" id="hydrSP" class="textBox" value="0" />
          </th>
          <th></th>
        </tr>
        <tr>
          <th>Melee Damage</th>
          <th>Lifting Mult.</th>
          <th>Lifting Ability</th>
        </tr>
        <tr>
          <th>
            <input type="text" id="hydrMelee" class="textBox" value="+0" />
          </th>
          <th>
            <input type="text" id="hydrLift" class="textBox" value="x1" />
          </th>
          <th>
            <input type="text" id="hydrLiftVal" class="textBox" value="" />
          </th>
        </tr>
      </table>
    </>
  );
};

export default ServoHydraulics;
