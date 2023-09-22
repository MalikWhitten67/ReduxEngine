# ReduxEngine
A performant css and html game engine


# Why?

Canvas truly sucks and I believe the future of 2d web games should move to element based CSS manipulation. CSS has enough capabilities of both 2d and 3d in which is sufficient enough for a full blown engine.

# Installation

```html
<script src="/path/to/Redux.js">
```

# Usage 

```html
<div id="game-container"></div>
```

```js
import { Scene, Camera, Entity, ReduxEngine } from 'ReduxEngine'
/***
* @param {String} containerId - The id of the container element
* @param {Number} width - The width of the container element
* @param {Number} height - The height of the container element
* @param {Number} frameRate - The frame rate of the game
*
***/
const engine = new ReduxEngine('game-container', 800, 600, 60)

engine.setUpdateCallback((entities)=>{
   // specify logic for engine state updates
})


class StartMenu extends Scene{
 constructor(engine){
    super(engine)
    let startText = document.createElement('h1')
    startText.innerText = "Click Me To Start"

    /**
    * @class UI
    * @description Base class for UI elements
    * @param {Number} x - The x position of the UI element
    * @param {Number} y - The y position of the UI element
    * @param {Number} width - The width of the UI element
    * @param {Number} height - The height of the UI element
    * @param {String|HTMLElement} customContent - Custom content for the UI element
    * @param {String} tag - The tag for the UI element
    * @property {HTMLElement} element - The UI element
    * @method on - Add an event listener to the UI element
     **/
 

    

    startText =  new UI(100, 100, 200, 50, startText, 'startui');
// you can use external files using the new require function
   startText.require('./file')  // this replaces the html - you can get element id's by setting the id to the element in the file then calling the on function
  }

  updateCallback(entities){
   // run some code when the scene is updated
  }

  startLogic(){
   // run some code when the scene is started
  }

  // This is ran at loop start here we can apply logic to the ui element and add it to the screen

  uilogic(){
   this.startText.on('ID', 'click', (e) =>{
     this.engine.startScene('Game')
   })
   // append the uiElement to the game scene
    this.addUIElement(this.startText);
  }

  inputHandler() {
     // add input handling to the scene itself
  }
}

class GameMenu extends Scene {
 constructor(engine){
   super(engine)

   /***
   * @param {Number} x - the left and right position of the Entity on the x axis
   * @param {Number} y - the top and bottom position of the Entity on the y axis
   * @param {width}  width - Set the width of the Entity
   * @param {height} height - set the height of the Entity
   * @param {String} color - set the color of the Entity
   * @param {String} textureScript - apply Redux texture scripts to Entities
   * x, y, width, height, color,initialState, textureScript
   ***/

   this.player = new Entity(100, 100, 50, 50, null, 'blue')

   // animation state allows us to add textureScripts to our elements - images gifs vector border radius bgColor etc

   this.player.addAnimationState('inPlace', `texture('https://picsum.photos/200/300')`);

   this.entities.push(this.player) // apply the Entity to the game scene
   // Apply a camera to the given scene - it follows the player closely
   const camera = new Camera(this.engine.window(), this.player, 'white');
   // set camera
   this.engine.setCamera(camera)
 }

  updateCallback(entities){
   // run some code when the scene is updated
  }

 startLogic(){
   // run some code when the scene is started
  }
 
 inputHandler() {
     // addCustomInput is ran inside the game loop reading user input
     this.addCustomInput('ArrowRight', () => {
        const newX = this.player.x + 10

        /**
        * @class ReduxEngine
        * @method {window} @returns {HTMLELEMENT}  - game window element
        * @returns current animation state of the player 
        **/

        if(newX + this.player.width <= this.engine.window().clientWidth){
           // update the players position relative to the end of the window
           this.player.setPosition(newX, this.player.y)
        }

        /**
        * @class Entity
        * @method {String} animationState
        * @returns current animation state of the player 
        **/

        if(this.player.animationState !== 'inPlace'){
          // change the animation state of the Entity
          this.player.changeState('inPlace')
       }
     }, ()=>{
     // do something when the RightArrow is released
    })
   
  }
}

engine.addScene('Game', GameMenu)
engine.addScene('Start', StartMenu)
engine.startScene('Start') // init the start menu
engine.start() // loop the engine
// you can opt to log the fps on screen
let fps = 60
engine.logFps(fps, 'red')
```


 

