/**
 * @class ReduxEngine
 * @description Base class for ReduxEngine
 * @param {String} containerId - The id of the container element
 * @param {Number} width - The width of the container element
 * @param {Number} height - The height of the container element
 * @param {Number} frameRate - The frame rate of the game
 * @property {HTMLElement} container - The container element
 * @property {Array} entities - The entities in the game
 * @property {Boolean} isRunning - The running state of the game
 * @property {Function} updateCallback - The update callback function
 * @property {Number} frameRate - The frame rate of the game
 * @property {Number} frameInterval - The frame interval of the game
 * @property {Number} lastFrameTime - The last frame time of the game
 * @property {Object} keyStates - The key states of the game
 * @property {HTMLElement} fpsElement - The FPS element of the game
 * @property {Scene} currentScene - The current scene of the game
 * @property {Object} scenes - The scenes of the game
 * @property {Camera} camera - The camera of the game
 * @method setUpdateCallback - Set the update callback function
 * @object {Object} inputState - The engine input state
 * @method setUpdateCallback - Set the update callback function
 * @method addEntity - Add an entity to the game
 * @method removeEntity - Remove an entity from the game
 * @method clearEntities - Clear all entities from the game
 * @method addScene - Add a scene to the game
 * @method startScene - Start a scene in the game
 * @method handleInput - Handle input for the game
 * @method removeInputListeners - Remove input listeners from the game
 * @method logFps - Log the FPS of the game
 * @method loop - The game loop
 * @method start - Start the game
 * @method setupInputListeners - Setup input listeners for the game
 * @example
 * const engine = new ReduxEngine('game-container', 800, 600);
 * engine.setUpdateCallback((entities) => {
 * // Update logic here
 * });
 * engine.addEntity(entity);
 * engine.removeEntity(entity);
 * engine.clearEntities();
 * engine.addScene('StartMenu', startMenuScene);
 * engine.addScene('Game', gameScene);
 * engine.startScene('StartMenu');
 * engine.handleInput('ArrowRight', () => {
 * // ArrowRight pressed
 * }, () => {
 * // ArrowRight released
 * });
 * engine.removeInputListeners('ArrowRight');
 * engine.logFps(fps);
 * engine.start();
 * engine.setupInputListeners();
 */
class ReduxEngine {
    constructor(containerId, width, height, frameRate = 60) {
      this.container = document.getElementById(containerId);
      this.container.style.position = "relative";
      this.container.style.width = width + "px";
      this.container.style.height = height + "px";
      this.container.style.overflow = "hidden";
      this.container.style.justifyContent = "center";
      this.container.style.alignItems = "center";
      this.container.style.display = "flex";
      this.entities = [];
      this.isRunning = false;
      this.updateCallback = null;
      this.frameRate = frameRate;
      this.frameInterval = 1000 / this.frameRate;
      this.lastFrameTime = 0;
  
      let inputState = {
        keyboard: {},
        mouse: {},
        touch: {},
        gamepad: [
          {
            input: null,
            axis: [],
            buttons: [],
          },
        ],
      };
      /**
       * @property {Object} inputState - The engine input state
       * @property {Object} inputState.keyboard -  The keyboard input state
       * @property {Object} inputState.mouse -  The mouse input state
       * @property {Object} inputState.touch -  The touch input state
       * @property {Object} inputState.gamepad -  The gamepad input state
       * @property {Object} inputState.gamepad[0] -  The first gamepad input state
       * @property {Object} inputState.gamepad[1] -  The second gamepad input state
       * @property {Object} inputState.gamepad[index].input -  The gamepad input
       * @property {Object} inputState.gamepad[index].axis -  The gamepad axis
       * @readonly
       */
      this.inputState = inputState;
      this.gamepadStates = {};
      this.keyStates = {};
      this.fpsElement = null; // For displaying FPS
      this.currentScene = null;
      this.scenes = {};
      this.camera = null;
    }
    /**
     * @method setUpdateCallback
     * @param {*} callback
     * @description Set the update callback function
     */
  
    setUpdateCallback(callback) {
      this.updateCallback = callback;
    }
    /**
     * @method addEntity
     * @param {*} element
     * @description Add an entity to the game
     * @example
     * ReduxEngine.addEntity(entity);
     */
  
    addEntity(element) {
      this.entities.push(element);
      this.container.appendChild(element.element);
    }
    /**
     * @method removeEntity
     * @param {*} element
     * @description Remove an entity from the game
     * @example
     * ReduxEngine.removeEntity(entity);
     */
  
    removeEntity(element) {
      this.entities = this.entities.filter((entity) => entity !== element);
      element.element.remove();
    }
    /**
     * @method clearEntities
     * @description Clear all entities from the game
     * @example
     * ReduxEngine.clearEntities();
     */
  
    clearEntities() {
      this.entities.forEach((entity) => {
        this.removeEntity(entity);
      });
    }
    /**
     * @method addScene
     * @param {*} sceneName
     * @param {*} scene
     * @description Allows you to add scenes to the game
     * @example
     * ReduxEngine.addScene('StartMenu', startMenuScene);
     */
  
    addScene(sceneName, scene) {
      this.scenes[sceneName] = scene;
    }
  
    /**
     * @method startScene
     * @param {*} sceneName
     * @description Start the given scene
     * @example
     * ReduxEngine.startScene('StartMenu');
     */
    startScene(sceneName) {
      if (this.currentScene) {
        this.currentScene.stop();
      }
      this.currentScene = this.scenes[sceneName];
      this.currentScene.start();
    }
  
    setCamera(camera) {
      this.camera = camera;
    }
  
    /***
     * @method handleInput
     * @param {*} key
     * @param {*} startCallback
     * @param {*} stopCallback
     * @description Handle input for the game
     * @example
     * ReduxEngine.handleInput('ArrowRight', () => {
     * // ArrowRight pressed
     * }, () => {
     * // ArrowRight released
     * });
     */
  
    /**
     * @method removeInputListeners
     * @param {*} key
     * @description Remove input listeners from the game
     * @example
     * ReduxEngine.removeInputListeners('ArrowRight');
     */
  
    removeInputListeners(key) {
      delete this.keyStates[key];
    }
  
    /**
     * @method inputHandler
     * @param {*} key
     * @param {Function} startCallback
     * @param {Fnction} stopCallback
     * @description Implement custom input setup in derived scenes
     * @example
     * this.inputHandler('ArrowRight', () => {
     * // ArrowRight pressed
     * }, () => {
     * // ArrowRight released
     * });
     *
     * this.inputHandler('ArrowLeft', () => {
     * // ArrowLeft pressed
     *
     * }, () => {
     * // ArrowLeft released
     * });
     * this.inputHandler('mouse1', () => {
     * // mouse1 pressed
     * }, () => {});
     *
     */
  
    inputHandler(key, startCallback, stopCallback) {
      this.keyStates[key] = {
        isPressed: false,
        startCallback: startCallback,
        stopCallback: stopCallback,
      };
    }
    /**
     * @method logFps
     * @param {*} fps
     * @param {*} color
     * @description Displays a fps counter on the screen
     * @example
     * ReduxEngine.logFps(fps);
     */
  
    logFps(fps, color = "black") {
      if (!this.fpsElement) {
        this.fpsElement = document.createElement("div");
        this.fpsElement.style.position = "absolute";
        this.fpsElement.style.top = "10px";
        this.fpsElement.style.color = color;
        this.fpsElement.style.left = "10px";
        this.container.appendChild(this.fpsElement);
        document.title = `FPS: ${fps.toFixed(2)}`;
      }
      this.fpsElement.innerText = `FPS: ${fps.toFixed(2)}`;
    }
  
    loop() {
      if (!this.isRunning) {
        return;
      }
  
      const currentTime = Date.now();
      const elapsed = currentTime - this.lastFrameTime;
  
      if (elapsed >= this.frameInterval) {
        this.lastFrameTime = currentTime;
  
        if (this.updateCallback) {
          this.updateCallback(this.entities);
        }
  
        // Check for key state changes
        for (const key in this.keyStates) {
          if (this.keyStates.hasOwnProperty(key)) {
            const keyState = this.keyStates[key];
            if (keyState.isPressed && keyState.startCallback) {
              keyState.startCallback();
            } else if (!keyState.isPressed && keyState.stopCallback) {
              keyState.stopCallback();
            }
          }
        }
  
        if (this.camera) {
          this.camera.update();
        }
  
        // Calculate and log FPS
        const fps = 1000 / elapsed;
        this.logFps(fps);
      }
  
      requestAnimationFrame(() => this.loop());
    }
    /**
     * @method start
     * @description Initiate the game loop
     * @example
     * ReduxEngine.start();
     */
  
    start() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.loop();
        this.setupInputListeners(); // Add input event listeners once when starting
      } else {
        throw new Error(
          "Too many instances of ReduxEngine start should only be called once"
        );
      }
    }
  
    handleMouseInput(event) {
      // get button etc
      let { type } = event;
      event.preventDefault();
  
      switch (type) {
        case "mousedown":
          this.inputState.mouse = {
            input: event,
            x: event.clientX,
            y: event.clientY,
          };
  
          if (this.keyStates["mouse" + event.button]) {
            this.keyStates["mouse" + event.button].isPressed = true;
          }
          break;
        case "mouseup":
          this.inputState.mouse = {
            input: event,
            x: event.clientX,
            y: event.clientY,
          };
          if (this.keyStates["mouse" + event.button]) {
            this.keyStates["mouse" + event.button].isPressed = false;
          }
          break;
        case "mousemove":
          this.inputState.mouse = {
            input: event,
            x: event.clientX,
            y: event.clientY,
          };
          if (this.keyStates["getMousePosition"]) {
            this.keyStates["getMousePosition"].isPressed = true;
          }
  
          break;
        default:
          break;
      }
    }
  
    handleGamepadInput(event) {
      const { type, gamepad } = event;
  
      if (type === "gamepadconnected") {
        this.gamepadStates[gamepad.index] = gamepad;
  
        const updateGamepad = () => {
          const updatedGamepad = navigator.getGamepads()[gamepad.index];
  
          if (updatedGamepad) {
            // Check button presses
            for (let i = 0; i < updatedGamepad.buttons.length; i++) {
              const button = updatedGamepad.buttons[i];
              let inputKey = `gamepad${gamepad.index}_button${i}`;
              if (this.keyStates[inputKey]) {
                if (button.pressed) {
                  this.keyStates[inputKey].isPressed = true;
                } else {
                  this.keyStates[inputKey].isPressed = false;
                }
              }
            }
  
            // Check axis values
            for (let i = 0; i < updatedGamepad.axes.length; i++) {
              const axisValue = updatedGamepad.axes[i];
              const inputKey = `gamepad${gamepad.index}_axis`;
  
              if (this.keyStates[inputKey]) {
                this.inputState.gamepad[gamepad.index] = {
                  input: updatedGamepad,
                  axis: updatedGamepad.axes,
                  buttons: updatedGamepad.buttons,
                };
                this.keyStates[inputKey].isPressed = true;
              }
            }
          }
          requestAnimationFrame(updateGamepad);
        };
        updateGamepad();
      } else if (type === "gamepaddisconnected") {
        delete this.gamepadStates[gamepad.index];
      }
    }
  
    handleTouchInput(event) {
      const { type } = event;
  
      switch (type) {
        case "touchstart":
          // Handle touch start if needed
          break;
        case "touchend":
          // Handle touch end if needed
          break;
        case "touchmove":
          // Handle touch move if needed
          break;
        default:
          break;
      }
    }
  
    handleKeyboardInput(event) {
      const { key, type } = event;
  
      switch (type) {
        case "keydown":
          this.inputState.keyboard[key] = true;
  
          if (this.keyStates[key]) {
            this.keyStates[key].isPressed = true;
          }
          break;
        case "keyup":
          this.inputState.keyboard[key] = false;
  
          if (this.keyStates[key]) {
            this.keyStates[key].isPressed = false;
          }
          break;
        default:
          break;
      }
    }
  
    /**
     * @method setupInputListeners
     * @description Setup input listeners for the game
     * @example
     * ReduxEngine.setupInputListeners();
     * @private
     */
  
    setupInputListeners() {
      let isPressed = false;
      window.addEventListener("keydown", (event) => {
        this.handleKeyboardInput(event);
      });
  
      window.addEventListener("keyup", (event) => {
        this.handleKeyboardInput(event);
      });
      document.addEventListener("contextmenu", (event) => event.preventDefault());
  
      // constantly check mouse input
      this.container.addEventListener("mousedown", (event) => {
        event.preventDefault();
        this.handleMouseInput(event);
      });
      this.container.addEventListener("mouseup", (event) => {
        event.preventDefault();
        this.handleMouseInput(event);
      });
      this.container.addEventListener("mousemove", (event) => {
        event.preventDefault();
        this.handleMouseInput(event);
      });
  
      this.container.addEventListener("touchstart", (event) => {
        this.handleTouchInput(event);
      });
  
      this.container.addEventListener("touchend", (event) => {
        this.handleTouchInput(event);
      });
  
      this.container.addEventListener("touchmove", (event) => {
        this.handleTouchInput(event);
      });
  
      window.addEventListener("gamepadconnected", (event) => {
        this.handleGamepadInput(event);
      });
  
      window.addEventListener("gamepaddisconnected", (event) => {
        this.handleGamepadInput(event);
      });
    }
  
    /**
     * @method Object
     * @returns @type {Object} - The window dimensions
     * @description Get the window dimensionss
     */
    window() {
      return this.container;
    }
  }
  
  class Camera {
    constructor(container, voidColor) {
      this.container = container;
      this.targetEntity = null;
      this.voidColor =   voidColor || "black";
      this.container.style.overflow = "hidden";
      this.offsetX = 0;
      this.offsetY = 0;
    }
    follow(entity) {
      this.targetEntity = entity;
    }
  
    update() {
      if (this.targetEntity) {
        const targetX = this.targetEntity.x;
        const targetY = this.targetEntity.y;
  
        // follow entitity closely
        const newOffsetX =
          targetX - this.container.clientWidth / 2 + this.targetEntity.width / 2;
        const newOffsetY =
          targetY -
          this.container.clientHeight / 2 +
          this.targetEntity.height / 2;
        // Apply the new position to the container's scroll position
        if (this.container.scrollLeft !== newOffsetX) {
          this.container.style.transform = `translate(${
            this.offsetX - newOffsetX
          }px, ${this.offsetY - newOffsetY}px)`;
        }
        this.container.style.backgroundColor = this.voidColor;
  
        // Update the camera's offset values
        this.offsetX = newOffsetX / 5;
        this.offsetY = newOffsetY / 2;
  
        return {
          x: this.offsetX,
          y: this.offsetY,
        };
      } else {
        throw new Error("Camera must have a target entity");
      }
    }
  }
  
  /**
   * @function isColliding
   * @param {*} elementA
   * @param {*} elementB
   * @param {*} sensitivity
   * @returns  @type {String} - The direction of collision
   * @description Check if two elements are colliding
   * @example
   * // entities are instances of the Entity class
   * this.player = new Entity(100, 100, 50, 50, 'blue');
   * this.dummy = new Entity(100, 100, 50, 50, 'red');
   * if(isColliding(this.player.element, this.dummy.element, 200) === 'left'){
   * console.log('colliding')
   * }
   */
  const isColliding = (elementA, elementB, sensitivity) => {
    // Get the bounding rectangles of the two elements
    const rectA = elementA.getBoundingClientRect();
    const rectB = elementB.getBoundingClientRect();
    console.log(rectA, rectB);
    // Calculate the vectors to check the direction of collision
    const dx = (rectA.right + rectA.left) / 2 - (rectB.right + rectB.left) / 2;
    const dy = (rectA.bottom + rectA.top) / 2 - (rectB.bottom + rectB.top) / 2;
    const widthA = rectA.right - rectA.left;
    const widthB = rectB.right - rectB.left;
    const heightA = rectA.bottom - rectA.top;
    const heightB = rectB.bottom - rectB.top;
  
    // Calculate the minimum distance for collision to occur
    const minDistance = (widthA + widthB) / 2 / 2;
  
    // Adjust the minimum distance with sensitivity
    const adjustedMinDistance = minDistance * sensitivity;
  
    // Check for collision and determine the direction
    if (
      Math.abs(dx) <= (widthA + widthB) / 2 + adjustedMinDistance &&
      Math.abs(dy) <= (heightA + heightB) / 2 + adjustedMinDistance
    ) {
      const overlapX = (widthA + widthB) / 2 + adjustedMinDistance - Math.abs(dx);
      const overlapY =
        (heightA + heightB) / 2 + adjustedMinDistance - Math.abs(dy);
  
      if (overlapX >= overlapY) {
        if (dy > 0) {
          return "top";
        }
        return "bottom";
      }
      if (dx > 0) {
        return "left";
      }
      return "right";
    }
  
    // No collision detected
    return null;
  };
  
  /***
   * @function parseTextureScript
   * @param {*} textureScript
   * @returns @type {Object} - The styles for the texture script
   * @description Parse Redux Texture Scripts to CSS Browser Styles
   * @example
   * let textureScript = `
   * w(100)
   * h(100)
   * bgColor(FF0000)
   * `
   * const styles = parseTextureScript(textureScript);
   *
   * for (const key in styles) {
   *  if (styles.hasOwnProperty(key)) {
   *   this.element.style.cssText += `${styles[key]};`;
   *  }
   * }
   *
   */
  
  function parseTextureScript(textureScript) {
    const styles = {};
    const lines = textureScript.split("\n");
  
    const functions = {
      vector: (value, inset) => `border-radius: ${value}; padding: ${inset};`, // Set border radius
      min: (value) => Math.min(value), // Set border radius
      color: (value) => `#${value}`,
      screenW: () => window.innerWidth,
      screenH: () => window.innerHeight,
      gradient: (direction, color1, color2) =>
        `linear-gradient(${direction}, #${color1}, #${color2})`,
      boxShadow: (x, y, blur, color) => `${x}px ${y}px ${blur}px #${color}`,
      opacity: (value) => value,
      rotate: (angle) => `rotate(${angle}deg)`,
      scale: (value) => `scale(${value})`,
      translate: (x, y) => `translate(${x}px, ${y}px)`,
      font: (family, size) => `'${family}', ${size}`,
      textShadow: (x, y, blur, color) => `${x}px ${y}px ${blur}px #${color}`,
      w: (value) => `width: ${value};`,
      tile: (value) => `background-repeat: repeat; background-size: ${value}px;`,
      texture: (url) => `background-image: url(${url}); background-size: cover;`,
      bgColor: (color) => `background-color: #${color};`,
      bgGradient: (direction, color1, color2) =>
        `background-image: linear-gradient(${direction}, #${color1}, #${color2});`,
      bgGradientRadial: (color1, color2) =>
        `background-image: radial-gradient(#${color1}, #${color2});`,
      bgGradientRadialCircle: (color1, color2) =>
        `background-image: radial-gradient(circle, #${color1}, #${color2});`,
      bgGradientRadialEllipse: (color1, color2) =>
        `background-image: radial-gradient(ellipse, #${color1}, #${color2});`,
      bgGradientRadialClosestSide: (color1, color2) =>
        `background-image: radial-gradient(closest-side, #${color1}, #${color2});`,
    };
  
    lines.forEach((line) => {
      const [key, value] = line
        .split("(")
        .map((item) => item.trim().replace(")", ""));
      if (window[value]) {
        value = window[value]();
        console.log(value);
      }
      if (functions[key]) {
        styles[key] = functions[key](...value.split(","));
      }
    });
  
    return styles;
  }
  
  class Entity {
    constructor(x, y, width, height, color, initialState, textureScript) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color || "black";
      this.element = document.createElement("div");
      this.element.style.position = "absolute";
      this.element.style.width = this.width + "px";
      this.element.style.height = this.height + "px";
      this.state = initialState || {};
      this.animationStates = {};
      this.animationState = null;
      this.applyTextureScript(textureScript);
      this.element.style.backgroundColor = this.color;
      this.element.style.left = this.x + "px";
      this.element.style.top = this.y + "px";
      this.element.style.pointerEvents = "none";
      this.element.style.zIndex = "1"; // Ensure entities are displayed above UI elements
      this.parseTextureScript = parseTextureScript;
    }
  
    /**
     * @method applyTextureScript
     * @param {*} textureScript
     * @returns  @type {Object} - The styles for the texture script
     * @description Apply Redux Texture Scripts to the entity
     * @example
     * let textureScript = `
     * w(100)
     * h(100)
     * bgColor(FF0000)
     * `
     * entity.applyTextureScript(textureScript);
     */
    applyTextureScript(textureScript) {
      if (!textureScript) return;
  
      const styles = this.parseTextureScript(textureScript);
  
      for (const key in styles) {
        if (styles.hasOwnProperty(key)) {
          this.element.cssText = "    ";
          this.element.style.cssText += `${styles[key]};`;
        }
      }
    }
    /**
     * @method index
     * @description Set the z-index of the entity - higher z-index means the entity is displayed above other entities
     * @example
     * entity.index(1);
     * @param {*} I
     */
    index(I) {
      this.element.style.zIndex = index;
    }
    /**
     * @method addAnimationState
     * @description Add an animation state to the entity and apply a texture script
     * @param {*} stateName
     * @param {*} textureScript
     * @example
     * entity.addAnimationState('inPlace', `texture('https://picsum.photos/200/300')`);
     * entity.changeState('inPlace');
     */
    addAnimationState(stateName, textureScript) {
      this.animationStates[stateName] = textureScript;
    }
    /**
     * @method changeState
     * @description Change the animation state of the entity
     * @param {*} stateName
     * @returns
     */
    changeState(stateName) {
      if (this.animationState === stateName) return;
      this.animationState = stateName;
      this.applyTextureScript(this.animationStates[stateName]);
      this.render();
    }
  
    /**
     * @method setAnimationState
     * @param {*} state
     * @description Set the animation state of the entity
     */
    static setAnimationState(state) {
      this.animationState = state;
    }
    getAnimationState() {
      return this.animationState;
    }
  
    /**
     * @method render
     * @description Render the entity
     * @example
     * entity.render();
     */
  
    render() {
      this.element.style.left = this.x + "px";
      this.element.style.top = this.y + "px";
    }
  
    getState() {
      return this.state;
    }
  
    setState(newState) {
      this.state = { ...this.state, ...newState };
    }
  
    bind(key, callback) {
      if (typeof callback === "function") {
        this.state[key] = callback;
      }
    }
  
    /**
     * @method Object
     * @returns @type {HTMLElement} - The entity element
     */
    Object() {
      return this.element;
    }
  
    /**
     * @method setPosition
     * @param {*} x
     * @param {*} y
     * @description Set the position of the entity
     * @example
     * entity.setPosition(100, 100);
     * entity.setPosition(entity.x + 10, entity.y);
     */
    setPosition(x, y) {
      if (x && y) {
        this.x = x;
        this.y = y;
        this.render();
      }
    }
  }
  
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
   * @example
   * const uiElement = new UI(100, 100, 200, 50, div, 'startui');
   * uiElement.on('click', () => {
   * console.log('UI element clicked.');
   * });
   **/
  class UI {
    constructor(x, y, width, height, customContent, tag) {
      this.element = document.createElement("div");
      this.element.style.position = "absolute";
      this.element.style.width = width + "px";
      this.element.style.height = height + "px";
      this.element.style.left = x + "px";
      this.element.style.top = y + "px";
      this.element.style.zIndex = "1"; // Ensure UI elements are displayed above entities
      if (tag === undefined) {
        throw new Error("UI element must have a tag");
      }
      this.element.id = tag;
      this.element.style.pointerEvents = "none"; // Disable pointer events for UI elements
      // Append custom content to the UI element
      if (customContent) {
        if (typeof customContent === "string") {
          // If customContent is a string, treat it as HTML content
          this.element.innerHTML = customContent;
        } else if (customContent instanceof HTMLElement) {
          // If customContent is an HTMLElement, append it directly
          this.element.appendChild(customContent);
        }
      }
    }
  
    // Method to load external HTML content
    async require(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load external HTML from ${url}`);
        }
        const htmlContent = await response.text();
        this.element.innerHTML = htmlContent;
      } catch (error) {
        console.error(error);
      }
    }
  
    /**
     * @method on
     * @param {Identifier} target - the target element id - useful for nested views and imported ui elements
     * @param {Event} event - The event to listen for
     * @param {Function} callback  - The callback function
     * @description Add an event listener to the UI element
     */
  
    on(target, event, callback) {
      // wait for the element to be rendered
      setTimeout(() => {
        this.element.style.pointerEvents = "auto"; // Enable pointer events for UI elements
        this.element.addEventListener(event, (e) => {
          if (e.target.id === target) {
            callback(e);
          }
        });
      }, 0);
    }
    /**
     * @method updateContent
     * @param {*} content
     * @description Update the content of the UI element
     */
    updateContent(content) {
      this.element.innerHTML = content;
    }
  
    /**
     * @method Object
     * @description Use to explicitly return the UI element
     * @returns @type {HTMLElement} - The UI element
     */
    Object() {
      return this.element;
    }
  }
  
  /***
   * @class Scene
   * @description Base class for scenes
   * @param {ReduxEngine} engine - The ReduxEngine instance
   * @property {ReduxEngine} engine - The ReduxEngine instance
   * @property {Array} entities - The entities in the scene
   * @property {Object} customInputs - Custom input bindings for the scene
   * @property {Array} uiElements - The UI elements in the scene
   * @method addUIElement - Add a UI element to the scene
   * @method removeUIElements - Remove all UI elements from the scene
   * @method removeUIElement - Remove a UI element from the scene
   * @method uiLogic - Implement UI logic in derived scenes
   * @method start - Start the scene
   * @method stop - Stop the scene
   * @method startLogic - Implement custom start logic in derived scenes
   * @method inputHandler - Implement custom input setup in derived scenes
   * @method addCustomInput - Add a custom input binding to the scene
   * @method cleanupInputs - Remove custom input bindings from the scene
   * @example
   * class StartMenuScene extends Scene {
   *  constructor(engine) {
   *     super(engine);
   * }
   * startLogic() {
   *    console.log('StartMenuScene: Scene-specific logic here.');
   * }
   * uiLogic() {
   *   console.log('StartMenuScene: UI logic here.');
   * }
   * inputHandler() {
   *   this.addCustomInput('ArrowRight', () => {
   *     console.log('StartMenuScene: ArrowRight pressed.');
   *  }, () => {
   *    console.log('StartMenuScene: ArrowRight released.');
   * });
   * }
   * }
   *
   */
  class Scene {
    constructor(engine) {
      /**
       * @property {ReduxEngine} engine - The ReduxEngine instance
       * @param {String} containerId - The id of the container element
       * @param {Number} width - The width of the container element
       * @param {Number} height - The height of the container element
       * @param {Number} frameRate - The frame rate of the game
       * @property {HTMLElement} container - The container element
       * @property {Array} entities - The entities in the game
       * @property {Boolean} isRunning - The running state of the game
       * @property {Function} updateCallback - The update callback function
       * @property {Number} frameRate - The frame rate of the game
       * @property {Number} frameInterval - The frame interval of the game
       * @property {Number} lastFrameTime - The last frame time of the game
       * @property {Object} keyStates - The key states of the game
       * @property {HTMLElement} fpsElement - The FPS element of the game
       * @property {Scene} currentScene - The current scene of the game
       * @property {Object} scenes - The scenes of the game
       * @property {Camera} camera - The camera of the game
       * @method setUpdateCallback - Set the update callback function
       * @object {Object} inputState - The engine input state
       * @method setUpdateCallback - Set the update callback function
       * @method addEntity - Add an entity to the game
       * @method removeEntity - Remove an entity from the game
       * @method clearEntities - Clear all entities from the game
       * @method addScene - Add a scene to the game
       * @method startScene - Start a scene in the game
       * @method handleInput - Handle input for the game
       * @method removeInputListeners - Remove input listeners from the game
       * @method logFps - Log the FPS of the game
       * @method loop - The game loop
       * @method start - Start the game
       * @method setupInputListeners - Setup input listeners for the game
       * @private
       */
      this.engine = engine;
      this.entities = [];
      this.customInputs = {}; // Custom input bindings for the scene
      this.uiElements = [];
    }
    /**
     * @method addUIElement
     * @description Allows you to add ui elements to the scene
     * @param {*} uiElement
     * @typedef {Object} uiElement
     * @property {HTMLElement} element - The UI element
     * @property {Function} on - Add an event listener to the UI element
     * @example
     * const uiElement = new UI(100, 100, 200, 50, div, 'startui');
     * this.addUIElement(uiElement);
     *
     */
  
    addUIElement(uiElement = Object) {
      this.uiElements.push(uiElement);
      this.engine.container.appendChild(uiElement.element);
    }
    /**
     * @method removeUIElements
     * @description Removes all UI elements from the scene
     * @example
     * this.removeUIElements();
     */
    removeUIElements() {
      this.uiElements.forEach((uiElement) => {
        uiElement.element.remove();
      });
      this.uiElements = [];
    }
    /**
     * @method removeUIElement
     * @description Removes a UI element from the scene
     * @param {*} uiElement
     * @example
     * this.removeUIElement(uiElement);
     *
     * **/
    removeUIElement(uiElement) {
      this.uiElements = this.uiElements.filter(
        (element) => element !== uiElement
      );
      uiElement.element.remove();
    }
  
    /**
     * @method uiLogic
     * @description Implement UI logic in derived scenes this will be called when the scene is started
     * @example
     * uiLogic() {
     *  this.startui.on('click', () => {
     *   this.engine.startScene('Game');
     * });
     */
    uiLogic() {
      // Implement UI logic here
    }
    /**
     * @method start
     * @description Start the scene
     */
    start() {
      this.entities.forEach((entity) => {
        this.engine.addEntity(entity);
      });
      console.log("Scene: Scene-specific logic here.");
  
      this.inputHandler(); // Call the custom input setup for the scene
      this.startLogic(); // Call the custom start logic for the scene
      this.uiLogic(); // Call the custom UI logic for the scene
    }
    /**
     * @method stop
     * @description Stop the scene
     */
  
    stop() {
      this.entities.forEach((entity) => {
        this.engine.removeEntity(entity);
      });
  
      this.cleanupInputs(); // Remove custom input bindings for the scene
      this.removeUIElements();
    }
  
    /**
     * @method startLogic
     * @description Implement custom start logic in derived scenes
     */
    startLogic() {
      // Implement custom start logic in derived scenes
    }
  
    /**
     * @method inputHandler
     * @description Implement custom input setup in derived scenes
     */
    inputHandler() {
      // Implement custom input setup in derived scenes
    }
  
    /**
     * @method addCustomInput
     * @param {*} key
     * @param {*} startCallback
     * @param {*} stopCallback
     * @description Add a custom input binding to the scene
     * @key {String}
     * - Mouse: 'mouse0', 'mouse1', 'mouse2', 'getMousePosition', gamepad: gampad[INDEX]_button[INDEX], gamepad[INDEX]_axis, keyboard: 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter', 'Escape'
     * @example
     * this.addCustomInput('ArrowRight', () => {
     * console.log('StartMenuScene: ArrowRight pressed.');
     * }, () => {
     * console.log('StartMenuScene: ArrowRight released.');
     * });
     *
     * this.addCustomInput('gamepad0_button0', (e) => {
     * console.log('gamepad0_button0 pressed.');
     * }, () => {});
     *
     * this.addCustomInput('gamepad0_axis', (e) => {
     *  SuperClass = engine // as per example
     *  e = this.SuperClass.inputState.gamepad[0].axis[0]
     *  console.log(e)
     * }, () => {});
     *
     * this.addCustomInput('mouse0', (e) => {
     *  console.log(e)
     * }, () => {
     *  console.log(`mouse0 released`)
     * });
     *
     *
     *
     */
    addCustomInput(key, startCallback, stopCallback) {
      this.engine.inputHandler(key, startCallback, stopCallback);
    }
  
    /**
     * @method cleanupInputs
     * @description Remove custom input bindings from the scene
     */
    cleanupInputs() {
      for (const key in this.customInputs) {
        if (this.customInputs.hasOwnProperty(key)) {
          this.engine.removeInputListeners(key);
        }
      }
    }
  }
   
  function require(PATH) {
    if (!PATH.endsWith(".html") || !PATH.endsWith(".texture")) {
      throw new Error("Only html and texture files are supported");
    }
    return fetch(PATH).then((res) => res.text());
  }
  /**
   * @class Rfx - Physics engine
   * @param {Entity} entity - The entity to apply physics to
   * @param {Number} threshold - The threshold for the entity
   * @pram {Number} gravity - The gravity for the entity
   * @pram {Number} friction - The friction for the entity
   * @pram {Number} bounceFactor - The bounce factor for the entity
   * @pram {Number} terminalVelocity - The terminal velocity for the entity
   * @pram {String} gravityDirection - The gravity direction for the entity
   * @method setGravityDirection - Set the gravity direction for the entity
   * @method update - Update the entity
   * @example
   * const rfx = new Rfx(entity, 0);
   * rfx.setGravityDirection('down');
   * rfx.update();
   * 
   * @description Base class for the redux engine physics engine
   * 
   */
  
  class Rfx {
      constructor(entity, threshold) {
          this.entity = entity;
          this.threshold = threshold || 0; // Default threshold to 0 if not provided
          this.gravity = 0.1;
          this.friction = 0.9;
          this.bounceFactor = 0.9;
          this.terminalVelocity = 10;
          this.gravityDirection = null;
      }
  
      setGravityDirection(direction) {
          this.gravityDirection = direction;
      }
  
      update() {
          if (this.gravityDirection === 'down') {
              this.entity.y += this.gravity;
              // Limit vertical velocity to the terminal velocity
              this.entity.y = Math.min(this.entity.y, this.threshold + this.terminalVelocity);
          } else if (this.gravityDirection === 'up') {
              this.entity.y -= this.gravity;
              // Limit vertical velocity to the negative of the terminal velocity
              this.entity.y = Math.max(this.entity.y, this.threshold - this.terminalVelocity);
          } else if (this.gravityDirection === 'left') {
              this.entity.x -= this.gravity;
              // Limit horizontal velocity to the negative of the terminal velocity
              this.entity.x = Math.max(this.entity.x, -this.terminalVelocity);
          } else if (this.gravityDirection === 'right') {
              this.entity.x += this.gravity;
              // Limit horizontal velocity to the terminal velocity
              this.entity.x = Math.min(this.entity.x, this.terminalVelocity);
          }
  
          // Apply friction (reduces velocity)
          this.entity.x *= this.friction;
          this.entity.y *= this.friction;
  
          // Apply bounce on collision with the ground (threshold)
          if (this.entity.y > this.threshold) {
              this.entity.y = this.threshold;
              this.entity.y *= -this.bounceFactor;
          }
      }
  }
   
  export { Camera, Entity, Rfx, Scene, UI, ReduxEngine, isColliding, parseTextureScript, require}