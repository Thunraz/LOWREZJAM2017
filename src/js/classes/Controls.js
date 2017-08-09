class Controls {
    constructor() {
        // Add a couple of event listeners
        document.addEventListener('pointerlockchange', () => { this.onPointerLockChange() }, false);
        document.addEventListener('pointerlockerror',  () => { this.onPointerLockError()  }, false);
        document.addEventListener('mousemove',        (e) => { this.onMouseMove(e)        }, false);
        document.addEventListener('click',            (e) => { this.onMouseClick(e)       }, false);
        document.addEventListener('mouseup',          (e) => { this.onMouseUp(e)          }, false);
        document.addEventListener('mousedown',        (e) => { this.onMouseDown(e)        }, false);
        document.addEventListener('keydown',          (e) => { this.onKeyDown(e)          }, false);
        document.addEventListener('keyup',            (e) => { this.onKeyUp(e)            }, false);

        this.noticeContainer = document.getElementById('notice-container');
        this.blocker         = document.getElementById('blocker');
        this.element         = document.body;

        this.noticeContainer.addEventListener('click', () => {
            this.noticeContainer.style.display = 'none';
            this.element.requestPointerLock();
        }, false );

        // Define keyboard keys
        this.keyCodes = {
            38: 'up',    // ↑
            40: 'down',  // ↓
            37: 'left',  // ←
            39: 'right', // →

            87: 'up',    // W
            83: 'down',  // S
            65: 'left',  // A
            68: 'right', // D
            
            82: 'toggleRecord', // R
        };
        
        this.states = {
            // Mouse
            leftMouseJustClicked: false,
            leftMouseJustUp     : false,
            leftMouseJustDown   : false,
            leftMouseUp         : true,
            leftMouseDown       : false,

            // Keyboard
            up                  : false,
            down                : false,
            left                : false,
            right               : false,
            movementX           : 0.0,
            movementY           : 0.0,

            toggleRecord        : false
        };
    }

    /**
     * Callback when point lock changes
     * @returns {void}
     */
    onPointerLockChange() {
        if (document.pointerLockElement === this.element) {
            this.enabled = true;

            this.blocker.style.display = 'none';
        } else {
            this.enabled = false;

            this.blocker.style.display = 'block';
            this.noticeContainer.style.display = '';
        }
    }

    /**
     * Callback when an error during pointer locking occurred
     * @returns {void}
     */
    onPointerLockError() {
        this.noticeContainer.style.display = '';
    }

    /**
     * Update controls
     * @returns {void}
     */
    update() {
        this.states.leftMouseJustClicked = false;
        this.states.leftMouseJustUp      = false;
        this.states.leftMouseJustDown    = false;
        this.states.leftMouseUp          = true;
        this.states.leftMouseDown        = false;

        this.states.movementX            = 0.0;
        this.states.movementY            = 0.0;
    }

    /**
     * Handles key down events
     * @param {Event} e Key down event
     * @returns {void}
     */
    onKeyDown(e) {
        let code = this.keyCodes[e.which];

        if(code !== undefined) {
            this.states[code] = true;
        }
    }

    /**
     * Handles key up events
     * @param {Event} e Key up event
     * @returns {void}
     */
    onKeyUp(e) {
        let code = this.keyCodes[e.which];
        
        if(code !== undefined) {
            this.states[code] = false;
        }
    }

    /**
     * Handles mouse move event
     * @param {Event} e Mouse move event
     * @returns {void}
     */
    onMouseMove(e) {
        this.states.movementX = e.movementX;
        this.states.movementY = e.movementY;
    }

    /**
     * Handles mouse click event
     * @returns {void}
     */
    onMouseClick() {
        this.states.leftMouseJustClicked = true;
    }

    /**
     * Handles mouse up event
     * @returns {void}
     */
    onMouseUp() {
        this.states.leftMouseJustUp = true;
        this.states.leftMouseDown   = false;
        this.states.leftMouseUp     = true;
    }

    /**
     * Handles mouse down event
     * @returns {void}
     */
    onMouseDown() {
        this.states.leftMouseJustDown = true;
        this.states.leftMouseDown     = true;
        this.states.leftMouseUp       = false;
    }

}

export default Controls;