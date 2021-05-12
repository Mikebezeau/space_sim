import { ServoShapes, WeaponShapes } from "../data/equipShapes";

export default function BuildMech({
  mechBP,
  servoEditId = null,
  weaponEditId = null,
}) {
  return (
    <>
      {mechBP.servoList.map((servo, index) => (
        <group
          key={index}
          position={[servo.offset.x, servo.offset.y, servo.offset.z]}
        >
          <ServoShapes servo={servo} servoEditId={servoEditId} />
          {mechBP.servoWeaponList(servo.id).map((weapon, j) => (
            <group
              key={j}
              position={[weapon.offset.x, weapon.offset.y, weapon.offset.z]}
            >
              <WeaponShapes weapon={weapon} weaponEditId={weaponEditId} />
            </group>
          ))}
        </group>
      ))}
    </>
  );
}
