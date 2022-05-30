import GameManager from "./gameManager";

// Base
const base = new Entity()
base.addComponent(new GLTFShape('models/baseLight.glb'))
base.addComponent(
  new Transform({
    scale: new Vector3(2, 1, 2)
  })
)
engine.addEntity(base)

new GameManager();
