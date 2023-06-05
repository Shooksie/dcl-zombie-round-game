import { setTimeout } from "@dcl/ecs-scene-utils";
import { canvas } from "@dcl/ui-scene-utils";
import gameManager from "./gameManager";
import GameManager from "./gameManager";

//dungeon info
export class DungeonInfo {
  private card: UIImage;

  constructor(texturePath: string) {
    this.card = new UIImage(canvas, new Texture(texturePath));
    this.card.name = "clickable-image";
    this.card.width = "768px";
    this.card.height = "420px";
    this.card.sourceWidth = 1920;
    this.card.sourceHeight = 1050;
    this.card.positionX = 0;
    this.card.positionY = 50;
    this.card.hAlign = "center";
    this.card.vAlign = "center";
    this.card.visible = false;
    this.card.isPointerBlocker = true;
  }

  public hide() {
    this.card.visible = false;
  }

  public show() {
    this.card.visible = true;
    setTimeout(20 * 1000, () => {
      this.card.visible = false;
    });
  }
}

export const dungeonInfoNightmare = new DungeonInfo("images/nightmare.png");

export class DungeonInfoExit {
  private card: UIImage;

  constructor() {
    this.card = new UIImage(canvas, new Texture("images/exit_button.png"));
    this.card.name = "clickable-image";
    this.card.width = "20px";
    this.card.height = "20px";
    this.card.sourceWidth = 40;
    this.card.sourceHeight = 40;
    this.card.positionX = 368;
    this.card.positionY = 244;
    this.card.hAlign = "center";
    this.card.vAlign = "center";
    this.card.visible = false;
    this.card.isPointerBlocker = true;
    this.card.onClick = new OnPointerDown(() => {
      dungeonInfoNightmare.hide();
      this.card.visible = false;
    });
  }

  public show() {
    this.card.visible = true;
  }
}

export const dungeonInfoExitButton = new DungeonInfoExit();