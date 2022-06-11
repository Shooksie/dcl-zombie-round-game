import { Zombie } from "./zombie";

// Configuration
const MOVE_SPEED = 1;
const ROT_SPEED = 1;

interface ZombieAttackConfig {
  moveSpeed?: number;
  rotSpeed?: number;
}

export class ZombieAttack implements ISystem {
  private zombie: Zombie;
  private transform: Transform;
  private player: Camera;
  private moveSpeed: number;
  private rotSpeed: number;

  constructor(
    zombie: Zombie,
    player: Camera,
    { moveSpeed = MOVE_SPEED, rotSpeed = ROT_SPEED }: ZombieAttackConfig = {}
  ) {
    this.zombie = zombie;
    this.transform = zombie.getComponent(Transform);
    this.player = player;
    this.moveSpeed = moveSpeed;
    this.rotSpeed = rotSpeed;
  }

  update(dt: number) {
    // Rotate to face the player
    const lookAtTarget = new Vector3(
      this.player.position.x,
      this.transform.position.y,
      this.player.position.z
    );
    const direction = lookAtTarget.subtract(this.transform.position);
    this.transform.rotation = Quaternion.Slerp(
      this.transform.rotation,
      Quaternion.LookRotation(direction),
      dt * this.rotSpeed
    );

    // Continue to move towards the player until it is within 2m away
    const distance = Vector3.DistanceSquared(
      this.transform.position,
      this.player.position
    ); // Check distance squared as it's more optimized
    if (distance >= 4) {
      // Note: Distance is squared so a value of 4 is when the zombie is standing 2m away
      this.zombie.walk();
      const forwardVector = Vector3.Forward().rotate(this.transform.rotation);
      const increment = forwardVector.scale(dt * this.moveSpeed);
      this.transform.translate(increment);
    } else {
      this.zombie.attack();
    }
  }
}