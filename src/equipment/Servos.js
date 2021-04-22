import useEquipStore from "../stores/equipStore";
import ServoList from "./ServoList";

//DISPLAY LIST OF SERVOS
const Servos = () => {
  const { servoList } = useEquipStore((state) => state);

  const handleCrew = (e) => {
    //actions.setCrew(e.target.value);
  };

  return (
    <>
      <ServoList />
      <div>ADD SERVO</div>
    </>
  );
};

export default Servos;
