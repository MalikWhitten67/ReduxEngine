# ReduxEngine
A performant css and html game engine


# Why?

Canvas truly sucks and I believe the future of 2d web games should move to element based CSS manipulation.CSS has enough capabilities of both 2d and 3d in which is sufficient enough for a full blown engine.

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
 }
}

engine.addScene('Game', GameMenu)

```
