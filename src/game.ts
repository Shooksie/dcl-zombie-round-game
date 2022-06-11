import GameManager from "./gameManager";
import { Cooldown, Rifle } from "./rifle";
import { Weapon } from "./weapon";
import { gunShapes, WeaponsManager } from "./weaponManager";

new GameManager();

//Build scene
const _scene = new Entity('_scene')
engine.addEntity(_scene)
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
_scene.addComponentOrReplace(transform)

const entity = new Entity('entity')
engine.addEntity(entity)
entity.setParent(_scene)
const gltfShape = new GLTFShape("c9b17021-765c-4d9a-9966-ce93a9c323d1/FloorBaseGrass_01/FloorBaseGrass_01.glb")
gltfShape.withCollisions = true
gltfShape.isPointerBlocker = true
gltfShape.visible = true
entity.addComponentOrReplace(gltfShape)
const transform2 = new Transform({
  position: new Vector3(8, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
entity.addComponentOrReplace(transform2)

const entity2 = new Entity('entity2')
engine.addEntity(entity2)
entity2.setParent(_scene)
entity2.addComponentOrReplace(gltfShape)
const transform3 = new Transform({
  position: new Vector3(24, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
entity2.addComponentOrReplace(transform3)

const entity3 = new Entity('entity3')
engine.addEntity(entity3)
entity3.setParent(_scene)
entity3.addComponentOrReplace(gltfShape)
const transform4 = new Transform({
  position: new Vector3(8, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
entity3.addComponentOrReplace(transform4)

const entity4 = new Entity('entity4')
engine.addEntity(entity4)
entity4.setParent(_scene)
entity4.addComponentOrReplace(gltfShape)
const transform5 = new Transform({
  position: new Vector3(24, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
entity4.addComponentOrReplace(transform5)

const zombiehouse = new Entity('zombiehouse')
engine.addEntity(zombiehouse)
zombiehouse.setParent(_scene)
const transform6 = new Transform({
  position: new Vector3(0, 0.01749774932861328, 23),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(.9, .9, .9)
})
zombiehouse.addComponentOrReplace(transform6)
const gltfShape2 = new GLTFShape("d4ea110e-f3c2-4044-87fa-6143d6f7f67c/Zombiehouse.glb")
gltfShape2.withCollisions = true
gltfShape2.isPointerBlocker = true
gltfShape2.visible = true
zombiehouse.addComponentOrReplace(gltfShape2)

// Weapon
let weapon = new Weapon();

// Cache weapons
for (let i = 0; i < gunShapes.length; i++) {
  const weaponCache = new Entity()
  const weaponShape = gunShapes[i]
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



