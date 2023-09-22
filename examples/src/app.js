import { Scene, Camera, Rfx, ReduxEngine, Entity, UI } from "./redux.js";

 
class StartMenuScene extends Scene {
    constructor(engine) {
      super(engine);
      let div = document.createElement("div");
  
      this.startui = new UI(100, 100, 200, 50, null, "startui");
      this.startui.require("./views/view.html");
    }
  
    // Define the custom start logic for the StartMenuScene
    startLogic() {
      console.log("StartMenuScene: Scene-specific logic here.");
    }
    uiLogic() {
      this.startui.on("start", "click", () => {
        this.engine.startScene("Game");
      });
      this.addUIElement(this.startui);
    }
  
    // Define custom input setup for the StartMenuScene
    inputHandler() {
      this.addCustomInput(
        "gamepad0_button0",
        (e) => {
          this.engine.startScene("Game");
          this.engine.removeInputListeners("gamepad0_button0");
        },
        () => {}
      );
    }
  }

  
class GameScene extends Scene {
    constructor(engine) {
      super(engine);
      this.player = new Entity(100, 100, 50, 50, "blue");
      this.dummy = new Entity(100, 100, 50, 50, "red");
      this.entities.push(this.dummy);
      this.entities.push(this.player);
      this.v = 0;
      this.score = new UI(100, 200, 200, 50, ``, "score");
      const camera = new Camera(this.engine.container, "white");
      camera.follow(this.player);
      this.rfx = new Rfx(this.player, 0);
      this.rfx.setGravityDirection("down");
      
  
      // Set the camera for the game
      this.engine.setCamera(camera);
    }
  
    // Define the custom start logic for the GameScene
    startLogic() {
      console.log("GameScene: Scene-specific logic here.");
    }
    updateCallback(entities) {
      console.log(entities);
    }
  
    uiLogic() {
      this.addUIElement(this.score);
    }
  
    // Define custom input setup for the GameScene
    inputHandler() {
      this.player.addAnimationState(
        "inPlace",
        `texture('https://picsum.photos/200/300')`
      );
      this.addCustomInput(
        "ArrowRight",
        () => {
          // Calculate the new position
          const newX = this.player.x + 5;
  
          // Check for collision with the right window boundary
          if (newX + this.player.width <= this.engine.window().clientWidth) {
            this.player.setPosition(newX, this.player.y);
  
            if (this.player.animationState !== "inPlace") {
              this.player.changeState("inPlace");
            }
          }
          this.score.updateContent(`${this.v++}`);
        },
        () => {
          // Cleanup input when the key is released
          this.cleanupInputs();
        }
      );
  
      this.addCustomInput(
        "gamepad0_axis",
        () => {
          let e = this.engine.inputState.gamepad[0].axis[0];
  
          if (e > 0.5) {
            const newX = this.player.x + 5;
  
            // Check for collision with the right window boundary
            if (newX + this.player.width <= this.engine.window().clientWidth) {
              this.player.setPosition(newX, this.player.y);
  
              if (this.player.animationState !== "inPlace") {
                this.player.changeState("inPlace");
              }
            }
          } else if (e < -0.5) {
            // Calculate the new position
            const newX = this.player.x - 5;
  
            // Check for collision with the left window boundary
            if (newX >= 0) {
              this.player.setPosition(newX, this.player.y);
            }
          }
        },
        () => {}
      );
  
      this.addCustomInput(
          ' ', () => {
             if(this.player.animationState !== 'inPlace') {
              this.player.changeState('inPlace');
             }
             // make the player jump
             if(this.player.y === 0) {
              this.player.y  -= 100;
             }
             
             else{
              this.player.y  += 100;
             }
          }, () => {})
      // Add custom input for moving left
      this.addCustomInput(
        "ArrowLeft",
        () => {
          // Calculate the new position
          const newX = this.player.x - 5;
  
          // Check for collision with the left window boundary
          if (newX >= 0) {
            this.player.setPosition(newX, this.player.y);
          }
        },
        () => {
          // Cleanup input when the key is released
          this.cleanupInputs();
        }
      );
  
      this.addCustomInput(
        "mouse1",
        () => {
          console.log(this.engine.inputState.mouse);
          this.score.updateContent(`<p style="color: red;">${this.v++}</p>`);
        },
        () => {
          // Cleanup input when the key is released
          this.cleanupInputs();
        }
      );
  
      this.addCustomInput(
        "ArrowUp",
        () => {
          // Calculate the new position
          const newY = this.player.y - 10;
  
          // Check for collision with the top window boundary
          if (newY >= 0) {
            this.player.setPosition(this.player.x, newY);
          }
        },
        () => {}
      );
      this.addCustomInput(
        "ArrowDown",
        () => {
          // Calculate the new position
          const newY = this.player.y + 10;
  
          // Check for collision with the bottom window boundary
          if (newY + this.player.height <= this.engine.window().clientHeight) {
            this.player.setPosition(this.player.x, newY);
          }
        },
        () => {}
      );
    }
  }
  
  const engine = new ReduxEngine("game-container", 800, 600);
  
  const startMenuScene = new StartMenuScene(engine);
  const gameScene = new GameScene(engine);
  
  engine.addScene("StartMenu", startMenuScene);
  engine.addScene("Game", gameScene);
  
  engine.startScene("StartMenu");
  
  engine.start();
  