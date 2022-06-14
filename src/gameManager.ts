import { Zombie } from "./zombie";
import { ZombieAttack } from "./zombieAttack";
import * as ui from "@dcl/ui-scene-utils";
import * as utils from "@dcl/ecs-scene-utils";
import { setTimeout } from "@dcl/ecs-scene-utils";
import { BulletMark } from './bullet'
import {Score} from "./score";
import {Weapon} from "./weapon";
import {gunShapes, WeaponsManager} from "./weaponManager";
const DELETE_TIME = 8 // In seconds
// Score
const scoreTen = new Score(
    new GLTFShape('models/scoreTen.glb'),
    new Transform()
)
const scoreTwentyFive = new Score(
    new GLTFShape('models/scoreTwentyFive.glb'),
    new Transform()
)
const scoreFifty = new Score(
    new GLTFShape('models/scoreFifty.glb'),
    new Transform()
)

type ZombieAttackMap = {
  [key: string]: ZombieAttack;
};

const bulletMarkShape = new GLTFShape('models/bulletMark.glb')
const bulletMarkCache = new BulletMark(bulletMarkShape)
bulletMarkCache.getComponent(Transform).scale.setAll(0)

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
}

const POSITIONS = [
    new Vector3(30.85,0,30.07),
    new Vector3(1.81,0,5.77),
    new Vector3(29.47,0,6.17),
    new Vector3(1.58,0,19.91),
    new Vector3(16.67,0,6.57),
];


// Weapon
let weapon = new Weapon();

// Cache weapons
for (const element of gunShapes) {
  const weaponCache = new Entity()
  const weaponShape = element
  weaponCache.addComponent(new Transform({ scale: new Vector3(0, 0, 0) }))
  weaponCache.addComponent(weaponShape)
  engine.addEntity(weaponCache)
}

type WeaponInfo = {
  colorIndex: number
  position: ReadOnlyVector3
  rotation: Quaternion
}

// Controls
const input = Input.instance
input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (e) => {
  if (e.hit && e.hit.entityId) {
    const weaponInfo: WeaponInfo = {
      colorIndex: WeaponsManager.weaponIndex,
      position: e.hit.hitPoint,
      rotation: Quaternion.FromToRotation(Vector3.Up(), e.hit.normal),
    }

  }
})

// Inputs
input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, true, (e) => {
  WeaponsManager.nextWeapon()
  weapon.switchWeaponAnim(WeaponsManager.weaponIndex)
})

input.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, true, (e) => {
  WeaponsManager.previousWeapon()
  weapon.switchWeaponAnim(WeaponsManager.weaponIndex)
})




export default class GameManager {
  private round: number = 1;
  private zombies: Zombie[] = [];
  private moveSpeed = 2;
  private rotSpeed = 1;
  private readonly camera: Camera;
  private input: Input;
  private gunShot: Entity;
  private gunShotFail: Entity;
  private _isPlayerInShootingArea: boolean;
  private zombieSystem: ZombieAttackMap = {};
  private finishedRendering: boolean;
  private points: number;
  private health: number;
  private counter: ui.UICounter;

  constructor() {
    this.camera = Camera.instance;
    this.input = Input.instance;
    this._isPlayerInShootingArea = true;
    this.points = 0;
    this.health = 100;
    this.counter = new ui.UICounter(0, -500, 600);
    this.setUpGunShot();
    this.setUpGunShotFail();

    this.setUpInputHandler();
    this.createZombiesForRound();
  }

  createZombiesForRound() {
    ui.displayAnnouncement(`round started ${this.round}`);
    this.finishedRendering = false;
    let count = 0;
    let target = Math.round(this.round * 1.2);
    for (let i = 1; i <= target; i++) {
      setTimeout(Math.round(i * 1.5) * 2000, () => {
        log('create zombie for round')
        const zombie = new Zombie(
          new GLTFShape("models/zombie.glb"),
          new Transform({
            position: POSITIONS[getRandomInt(POSITIONS.length)]?.clone(),
          })
        );
        const zombieSystem = new ZombieAttack(zombie, this.camera, {
          moveSpeed: this.moveSpeed,
          rotSpeed: this.rotSpeed,
        });

        engine.addSystem(zombieSystem);
        this.zombieSystem[zombie.uuid] = zombieSystem;

        this.zombies.push(zombie);
        count++;

        if (count === target) {
          this.finishedRendering = true;
        }
      });
    }
  }

  removeZombie(zombie: Zombie | Entity | IEntity) {
    engine.removeEntity(zombie);
    this.zombies = this.zombies.filter((zom) => zom.uuid !== zombie.uuid);

    if (this.zombieSystem[zombie.uuid]) {
      engine.removeSystem(this.zombieSystem[zombie.uuid]);
    }
    if (this.zombies.length === 0 && this.finishedRendering) {
      this.round++;
      utils.setTimeout(2000, () => {
        this.createZombiesForRound()
      });
    }
  }

  setUpGunShot() {
    this.gunShot = new Entity();
    this.gunShot.addComponent(
      new AudioSource(new AudioClip("sounds/shot.mp3"))
    );
    this.gunShot.addComponent(new Transform());
    engine.addEntity(this.gunShot);
    this.gunShot.setParent(Attachable.AVATAR);
  }

  setUpGunShotFail() {
    this.gunShotFail = new Entity();
    this.gunShotFail.addComponent(
      new AudioSource(new AudioClip("sounds/shotFail.mp3"))
    );
    this.gunShotFail.addComponent(new Transform());
    engine.addEntity(this.gunShotFail);
    this.gunShotFail.setParent(Attachable.AVATAR);
  }

  setUpInputHandler() {
    this.input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (e) => {
      if (this._isPlayerInShootingArea && this.gunShot) {
        this.gunShot.getComponent(AudioSource).playOnce();
        const [zombie] = this.zombies.filter((zombie) => zombie.uuid === engine.entities[e.hit.entityId]?.uuid);

        if (e.hit.entityId !== undefined && zombie) {
          zombie.hit(weapon.getDamage());
          if (zombie.health <= 0) {
            log(e.hit.meshName)
            this.score(50, e.hit.hitPoint) // Play score animation
            this.removeZombie(zombie);
            this.points += 50;
          } else {
            this.score(10, e.hit.hitPoint) // Play score animation
            this.points += 10;
          }
          this.counter.set(this.points)
        } else if (engine.entities[e.hit.entityId] !== undefined) {
          // Calculate the position of where the bullet hits relative to the target
          const targetPosition =
              engine.entities[e.hit.entityId].getComponent(Transform).position
          const relativePosition = e.hit.hitPoint.subtract(targetPosition)
          const bulletMark = new BulletMark(bulletMarkShape, DELETE_TIME)
          bulletMark.setParent(engine.entities[e.hit.entityId]) // Make the bullet mark the child of the target so that it remains on the target
          bulletMark.getComponent(Transform).position = relativePosition
        }
      } else if (this.gunShotFail) {
        this.gunShotFail.getComponent(AudioSource).playOnce();
      }
    })
  }

  get isPlayerInShootingArea(): boolean {
    return this._isPlayerInShootingArea;
  }

  set isPlayerInShootingArea(value: boolean) {
    this._isPlayerInShootingArea = value;
  }

  score(targetHit: number, targetPosition: Vector3): void {
    switch (targetHit) {
      case 10:
        scoreTen.getComponent(Transform).position = targetPosition
        scoreTen.getComponent(Transform).position.z -= 0.5
        scoreTen.playAnimation()
        break
      case 25:
        scoreTwentyFive.getComponent(Transform).position = targetPosition
        scoreTwentyFive.getComponent(Transform).position.z -= 0.5
        scoreTwentyFive.playAnimation()
        break
      case 50:
        scoreFifty.getComponent(Transform).position = targetPosition
        scoreFifty.getComponent(Transform).position.z -= 0.5
        scoreFifty.playAnimation()
        break
    }
  }
}
