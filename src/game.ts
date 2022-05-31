import GameManager from "./gameManager";
import { Cooldown, Rifle } from "./rifle";

new GameManager();

//Create rifle
const gun = new Rifle(new GLTFShape("models/rifle.glb"), new Transform())
gun.getComponent(Transform).position.set(0.15, -0.2, 0.4)
gun.getComponent(Transform).rotation = Quaternion.Euler(-5, 0, 0)
gun.getComponent(Transform).scale.set(.5 , .5 , .5)
gun.setParent(Attachable.FIRST_PERSON_CAMERA)

// Controls
const input = Input.instance
input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (event) => {
  if(gun.hasComponent(Cooldown)) return

  gun.playFireAnim()
})

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
  position: new Vector3(9, 0.01749774932861328, 23),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
zombiehouse.addComponentOrReplace(transform6)
const gltfShape2 = new GLTFShape("c8f1329d-2d16-4c65-ad93-733ea12aa898/Zombiehouse.glb")
gltfShape2.withCollisions = true
gltfShape2.isPointerBlocker = true
gltfShape2.visible = true
zombiehouse.addComponentOrReplace(gltfShape2)

