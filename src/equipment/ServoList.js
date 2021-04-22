import useEquipStore from "../stores/equipStore";

//DISPLAY LIST OF SERVOS
const ServoList = () => {
  const { servoList } = useEquipStore((state) => state);

  const handleServo = (e) => {
    //actions.setServo();
  };

  console.log(servoList);

  return (
    <>
      <h3>Servos</h3>
    </>
  );
};

export default ServoList;
