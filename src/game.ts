import { setTimeout } from "@dcl/ecs-scene-utils";
import GameManager, { weapon } from "./gameManager";
import * as ui from "@dcl/ui-scene-utils";

const manager = new GameManager();

// #1
const myVideoClip = new VideoClip(
  "https://player.vimeo.com/external/720437869.m3u8?s=d45f684310460260112e2a177e0ef129b4ca1243"
);

// #2
const myVideoTexture = new VideoTexture(myVideoClip);
myVideoTexture.play();
myVideoTexture.loop = true;

// #3

const myMaterial = new Material();
myMaterial.albedoTexture = myVideoTexture;
myMaterial.emissiveTexture = myVideoTexture;
myMaterial.emissiveColor = Color3.White();
myMaterial.emissiveIntensity = 0.7;
myMaterial.roughness = 1.0;

// #4
const screen = new Entity();
screen.addComponent(new PlaneShape());
screen.addComponent(
  new Transform({
    position: new Vector3(19.17,0.90,11.62),
    rotation: new Quaternion(2.806811489129799e-16, 0.7033095216751099, -8.5629160651024e-8, 0.6957237720489502),
    scale: new Vector3(.0001, .0001, .0001)
  })
);
screen.addComponent(myMaterial);

engine.addEntity(screen);

let Inventory = new ui.CenterImage('images/UI.png', 3, true, 0, 0, 750, 750, {
  sourceHeight: 750,
  sourceWidth: 750,
  sourceLeft: 0,
  sourceTop: 0
})
 Inventory.show()

 const modArea = new Entity()
 modArea.addComponent(
   new CameraModeArea({
     area: { box: new Vector3(32, 6, 32) },
     cameraMode: CameraMode.FirstPerson,
   })
 )
 modArea.addComponent(
   new Transform({
     position: new Vector3(16, 3, 16),
   })
 )
 engine.addEntity(modArea)

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
  position: new Vector3(8, 0.010, 13.2),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
zombiehouse.addComponentOrReplace(transform6)
const gltfShape2 = new GLTFShape("d4ea110e-f3c2-4044-87fa-6143d6f7f67c/Zombiehouse.glb")
gltfShape2.withCollisions = true
gltfShape2.isPointerBlocker = true
gltfShape2.visible = true
zombiehouse.addComponentOrReplace(gltfShape2)

function shotgunBox(){
  const weaponBox = new Entity('weaponBox')
  engine.addEntity(weaponBox)
  weaponBox.setParent(_scene)
  const transform60 = new Transform({
    position: new Vector3(15.60,1.9,23.81),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(.5, .5, .5)
  })
  weaponBox.addComponentOrReplace(transform60)
  const gltfShape20 = new GLTFShape("models/ShotgunB.glb")
  gltfShape20.withCollisions = true
  gltfShape20.isPointerBlocker = true
  gltfShape20.visible = true
  weaponBox.addComponentOrReplace(gltfShape20)
  weaponBox.addComponent(
    new OnPointerDown(
      (e) => {
          const points = manager.getPoints();
          if (points >= 1000) {
            clipOpen2.play()
            purchase.playOnce()
            weapon.addGun({
              type: 'shotgun',
              ammo: 10,
              shape: new GLTFShape("models/Shotgun.glb"),
              damage: 50
            })
            setTimeout(3 * 1000, () => {
              clipClose2.play()
              //give shotgun
            });
            manager.deductPoints(1000)
          } else {
            ui.displayAnnouncement("Need more points to buy Shot gun")
          }

      },
      {
        hoverText: "1000 points for a shotgun",
        distance: 5
      }
    ))
    let d2animator = new Animator()

  // Add animator component to the entity
  weaponBox.addComponent(d2animator)

  // Instance animation clip object
  const clipOpen2 = new AnimationState("open", { looping: false });
  const clipClose2 = new AnimationState("closed", { looping: false });
  const idleClip2 = new AnimationState("idle", { looping: false });

  // Add animation clip to Animator component
  d2animator.addClip(clipOpen2)
  d2animator.addClip(clipClose2)
  d2animator.addClip(idleClip2)

  // Add entity to engine
  engine.addEntity(weaponBox)

  //Default Animation
  idleClip2.play();

  //add sound
  let clip = new AudioClip("sounds/sale.mp3");
  let purchase = new AudioSource(clip);
  weaponBox.addComponent(purchase)
}

function machinegunBox(){
  const weaponBox = new Entity('weaponBox')
  engine.addEntity(weaponBox)

  weaponBox.setParent(_scene)
  const transform60 = new Transform({
    position: new Vector3(31.5,1.90,23.39),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(.5, .5, .5)
  })
  weaponBox.addComponentOrReplace(transform60)
  const gltfShape20 = new GLTFShape("models/RifleB.glb")
  gltfShape20.withCollisions = true
  gltfShape20.isPointerBlocker = true
  gltfShape20.visible = true
  weaponBox.addComponentOrReplace(gltfShape20)
  weaponBox.addComponent(
    new OnPointerDown(
      (e) => {
        const points = manager.getPoints();
        const pointsNeeded = 1000
        if (points >= pointsNeeded) {
          clipOpen2.play()
          purchase.playOnce()
          weapon.addGun({
            type: 'Machine gun',
            ammo: 60,
            shape: new GLTFShape("models/Rifle.glb"),
            damage: 30
          })
          setTimeout(3 * 1000, () => {
            clipClose2.play()
            //give shotgun
          });
          manager.deductPoints(pointsNeeded)
        } else {
          ui.displayAnnouncement("Need more points to buy Machine gun")
        }
      },
      {
        hoverText: "1000 points for a machinegun",
        distance: 5
      }
    ))
    let d2animator = new Animator()

  // Add animator component to the entity
  weaponBox.addComponent(d2animator)

  // Instance animation clip object
  const clipOpen2 = new AnimationState("open", { looping: false });
  const clipClose2 = new AnimationState("closed", { looping: false });
  const idleClip2 = new AnimationState("idle", { looping: false });

  // Add animation clip to Animator component
  d2animator.addClip(clipOpen2)
  d2animator.addClip(clipClose2)
  d2animator.addClip(idleClip2)

  // Add entity to engine
  engine.addEntity(weaponBox)

  //Default Animation
  idleClip2.play();

    //add sound
    let clip = new AudioClip("sounds/sale.mp3");
    let purchase = new AudioSource(clip);
    weaponBox.addComponent(purchase)
}

shotgunBox();
machinegunBox();
