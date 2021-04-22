import useEquipStore from "../stores/equipStore";
import { equipList } from "../util/equipList";

const Mecha = () => {
  const {
    name,
    scale,
    totalCP,
    totalScaledCP,
    totalWeight,
    totalKGWeight,
    groundMA,
    groundKMpH,
    MV,
    actions,
  } = useEquipStore((state) => state);

  const handleName = (e) => {
    actions.setName(e.target.value);
  };

  const handleScale = (e) => {
    actions.setScale(e.target.value);
  };

  return (
    <>
      <table>
        <tr>
          <th>Mech Name</th>
          <th colspan="3">
            <input
              id="nameMecha"
              class="greenHighlight"
              type="text"
              defaultValue={name}
              onChange={handleName}
            />
          </th>
        </tr>
        <tr class="borderTop">
          <th>Scale</th>
          <th colspan="3">
            <div class="sliderLable">
              <select
                name="mechaScale"
                id="mechaScale"
                value={scale}
                onChange={handleScale}
              >
                {equipList.scale.type.map((value, key) => (
                  <option value={key}>{value}</option>
                ))}
              </select>
            </div>
          </th>
        </tr>
        <tr></tr>
        <tr class="borderTop">
          <th>Cost</th>
          <th>Scale Cost Mult.</th>
          <th>Scaled Cost</th>
        </tr>
        <tr>
          <th>{totalCP()}</th>
          <th>{equipList.scale.costMult[scale]}</th>
          <th>{totalScaledCP()}</th>
        </tr>
        <tr class="borderTop">
          <th>Relative Weight</th>
          <th>Scale Multiplier</th>
          <th>Scaled Weight</th>
        </tr>
        <tr>
          <th>{totalWeight()}</th>
          <th>{equipList.scale.weightMult[scale]}</th>
          <th>{totalKGWeight()}</th>
        </tr>
        <tr class="borderTop">
          <th>Ground Move</th>
          <th>KMpH</th>
          <th>Manuever</th>
        </tr>
        <tr>
          <th>{groundMA()}</th>
          <th>{groundKMpH()}</th>
          <th>{MV()}</th>
          <th></th>
        </tr>
      </table>
    </>
  );
};

export default Mecha;
