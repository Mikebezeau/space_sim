import useEquipStore from "../stores/equipStore";

export const WeaponProjList = () => {
  const { mechBP } = useEquipStore((state) => state);
  return (
    <>
      {mechBP.weaponList.proj.map((value, index) => (
        <WeaponProjItem key={"projBP" + index} projBP={value} />
      ))}
    </>
  );
};

export const WeaponProjItem = ({ projBP }) => {
  const { actions } = useEquipStore((state) => state);
  const handleChangeData = (weaponType, id, propName, val) => {
    actions.weaponMenu.setDataValue(weaponType, id, propName, val);
  };

  return (
    <>
      <table>
        <tbody>
          <tr class="tableHeaders">
            <th>Name</th>
            <th>Damage</th>
            <th>Structure</th>
            <th>Range</th>
            <th>Acc.</th>
            <th>BV</th>
            <th>SP Eff.</th>
            <th>SP</th>
            <th>Weight Eff.</th>
            <th>Weight</th>
            <th>Scaled Wgt.</th>
            <th>Scaled Cost</th>
          </tr>
          <tr>
            <td>
              <input
                onChange={(e) =>
                  handleChangeData("proj", projBP.id, "name", e.target.value)
                }
                value={projBP.data.name}
              />
            </td>
            <td>{projBP.damage()}</td>
            <td>{projBP.structure()}</td>
            <td>{projBP.range()}</td>
            <td>{projBP.accuracy()}</td>
            <td>{projBP.burstValue()}</td>
            <td>
              <input
                onChange={(e) =>
                  handleChangeData("proj", projBP.id, "SPeff", e.target.value)
                }
                value={projBP.data.SPeff}
              />
            </td>
            <td>{projBP.SP()}</td>
            <td>
              <input
                onChange={(e) =>
                  handleChangeData("proj", projBP.id, "wEff", e.target.value)
                }
                value={projBP.data.wEff}
              />
            </td>
            <td>{projBP.weight()}</td>
            <td>{"?" /*getKGWeight(this.getWeight())*/}</td>
            <td>{projBP.scaledCP()}</td>
          </tr>
          <tr>
            <td colSpan="100%">
              <span>Special:</span>
              {/*this.special
        ? "|
          projWeapRefObj.special.val[this.special] +
          (this.variable ? ", Variable|" : "|")
        : ""*/}
              {/*this.multiFeed
        ? "|Multi-Feed:  projWeapRefObj.multiFeed.val[this.multiFeed] + "|"
        : ""*/}
              {/*this.longRange ? "|Long Range: -2 Accuracy|" : ""*/}
              {/*this.hyperVelocity ? "|Hyper Velocity|" : ""*/}
            </td>
          </tr>
          {/*
    for (var i = 0; i < this.ammoList.length; i++) {
      string += '<tr><td colspan="2">Ammunition</td><td colspan="7">';
      for (var j = 0; j < this.ammoList[i].typeList.length; j++) {
        string += "| projAmmoRefObj.val[this.ammoList[i].typeList[j]] + "|";
      }
      string +=
        '</td><td colspan="1">' + this.ammoList[i].numAmmo + " Shots</td>";
      //string += '</td><td>'+this.getAmmoCP()+'</td>';
      string +=
        "</td><td> mecha.getScaledCost(this.getAmmoCP()) + "</td></tr>";
    }
  */}
        </tbody>
      </table>
    </>
  );
};

export const WeaponProjCreate = () => {
  const { projBP, actions } = useEquipStore((state) => state);

  const handleAddWeapon = () => {
    actions.weaponMenu.addProjWeapon();
    alert("weapon added");
  };
  return (
    <>
      <h2>Create Projectile Weapon</h2>
      <WeaponProjItem projBP={projBP} />
      <button onClick={handleAddWeapon}>Add Weapon</button>
    </>
  );
};
