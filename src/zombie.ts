export class Zombie extends Entity {
  health: number;
  constructor(model: GLTFShape, transform: Transform) {
    super();
    log('adding zombie to engine')
    engine.addEntity(this);
    this.addComponent(model);
    this.addComponent(transform);
    this.health = 100;

    this.addComponent(new Animator());
    this.getComponent(Animator).addClip(
      new AnimationState("Walking", { looping: true })
    );
    this.getComponent(Animator).addClip(
      new AnimationState("Attacking", { looping: true })
    );
    this.getComponent(Animator).getClip("Walking").play();
  }

  // Play attacking animation
  attack() {
    this.getComponent(Animator).getClip("Attacking").play();
  }

  hit(damage: number) {
   this.health -= damage;
  }

  // Play walking animation
  walk() {
    this.getComponent(Animator).getClip("Walking").play();
  }

  // Bug workaround: otherwise the next animation clip won't play
  stopAnimations() {
    this.getComponent(Animator).getClip("Walking").stop();
    this.getComponent(Animator).getClip("Attacking").stop();
  }
}
