// BUG: Issue with having all combining all the animations contained within the bucket...
// Only able to play through each animation once only so am now using a workaround where the
// paint animations are separated and the child of the bucket (might be to do with the way animation is setup)

import { Rifle } from "./rifle"

// Paint shapes
const weaponShapes: GLTFShape[] = [
  new GLTFShape("models/pistol.glb"),
  new GLTFShape("models/rifle.glb"),
  new GLTFShape("models/shotgun.glb"),
]


const weapons: Entity[] = []

export class Weapon {

  gun?: Rifle
  currentIdx?: number;
  constructor() {
    this.currentIdx = 0;
    this.gun = new Rifle(weaponShapes[this.currentIdx], new Transform())
    engine.addEntity(this.gun);
    this.gun.getComponent(Transform).position.set(0.15, -0.2, 0.4)
    this.gun.getComponent(Transform).rotation = Quaternion.Euler(-3, 0, 0)
    this.gun.getComponent(Transform).scale.set(.5, .5, .5)
    this.gun.setParent(Attachable.FIRST_PERSON_CAMERA)

  }

  //Switching weapons
  switchWeaponAnim(weaponIndex: number) {
    this.currentIdx = weaponIndex;

    //Create rifle
    if(this.gun){
      engine.removeEntity(this.gun);
    }
    this.gun = new Rifle(weaponShapes[this.currentIdx], new Transform())
    engine.addEntity(this.gun);
    this.gun.getComponent(Transform).position.set(0.15, -0.2, 0.4)
    this.gun.getComponent(Transform).rotation = Quaternion.Euler(-3, 0, 0)
    this.gun.getComponent(Transform).scale.set(.5, .5, .5)
    this.gun.setParent(Attachable.FIRST_PERSON_CAMERA)
  }

  getDamage() {
    switch (this.currentIdx) {
      case 0:
        return 10
      case 1:
        return 25
      case 2:
        return 50
    }
  }
}
