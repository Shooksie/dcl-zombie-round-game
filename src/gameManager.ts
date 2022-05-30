import {Zombie} from "./zombie";
import {ZombieAttack} from "./zombieAttack";
import * as ui from '@dcl/ui-scene-utils'
import * as utils from '@dcl/ecs-scene-utils'
import {setTimeout} from "@dcl/ecs-scene-utils";

type ZombieAttackMap = {
    [key: string]: ZombieAttack;
}


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

    constructor() {
        this.camera = Camera.instance;
        this.input = Input.instance;
        this._isPlayerInShootingArea = true;

        this.setUpGunShot();
        this.setUpGunShotFail();

        this.setUpInputHandler();
        this.createZombiesForRound();
    }


    createZombiesForRound() {
        ui.displayAnnouncement(`round started ${this.round}`)
        this.finishedRendering = false;
        let count = 0;
        let target = Math.round(this.round * 1.2);
        for (let i = 1; i <= target; i++) {
            setTimeout(Math.round(i * 1.5) * 2000, () => {
                const zombie = new Zombie(
                    new GLTFShape('models/zombie.glb'),
                    new Transform({
                        position: new Vector3(i % 16, 0.933, 16)
                    })
                )
                const zombieSystem = new ZombieAttack(zombie, this.camera, {
                    moveSpeed: this.moveSpeed,
                    rotSpeed: this.rotSpeed
                });

                engine.addSystem(zombieSystem);
                this.zombieSystem[zombie.uuid] = zombieSystem;


                this.zombies.push(zombie);
                count++;

                if (count === target) {
                    this.finishedRendering = true;
                }
            })
        }
    }

    removeZombie(zombie: Zombie | Entity | IEntity) {
        engine.removeEntity(zombie);
        this.zombies = this.zombies.filter((zom) => zom.uuid !== zombie.uuid);

        if (this.zombieSystem[zombie.uuid]) {
            engine.removeSystem(this.zombieSystem[zombie.uuid])
        }
        if (this.zombies.length === 0 && this.finishedRendering) {
            this.round++;
            utils.setTimeout(2000, () => {
                this.createZombiesForRound();
            })
        }
    }

    setUpGunShot() {
        this.gunShot = new Entity()
        this.gunShot.addComponent(new AudioSource(new AudioClip('sounds/shot.mp3')));
        this.gunShot.addComponent(new Transform());
        engine.addEntity(this.gunShot);
        this.gunShot.setParent(Attachable.AVATAR);
    }

    setUpGunShotFail() {
        this.gunShotFail = new Entity()
        this.gunShotFail.addComponent(new AudioSource(new AudioClip('sounds/shotFail.mp3')));
        this.gunShotFail.addComponent(new Transform());
        engine.addEntity(this.gunShotFail);
        this.gunShotFail.setParent(Attachable.AVATAR);
    }

    setUpInputHandler() {
        this.input.subscribe('BUTTON_DOWN', ActionButton.POINTER, true, (e) => {
            if (this._isPlayerInShootingArea && this.gunShot) {
                this.gunShot.getComponent(AudioSource).playOnce()
                if (engine.entities[e.hit.entityId] !== undefined) {
                    const zombie = engine.entities[e.hit.entityId]
                    this.removeZombie(zombie);
                }
            } else if (this.gunShotFail) {
                this.gunShotFail.getComponent(AudioSource).playOnce()
            }
        })
    }

    get isPlayerInShootingArea(): boolean {
        return this._isPlayerInShootingArea;
    }

    set isPlayerInShootingArea(value: boolean) {
        this._isPlayerInShootingArea = value;
    }

}
