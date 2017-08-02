import * as THREE from 'three';

class Game {
    /**
     * Initialize the game
     */
    constructor() {
        this.ratio  = window.innerWidth / window.innerHeight;
        this.width  = window.innerWidth;
        this.height = window.innerHeight;

        window.addEventListener('resize', () => { this.onResize(this); });

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, this.ratio, 0.1, 20000);
        this.camera.position.set(0, 0, 75);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('g').appendChild(this.renderer.domElement);
    }
    
    /**
     * Draw a single frame
     * @returns {void}
     */
    draw() {

    }

    /**
     * Update all game objects, handle input, etc.
     * @param {number} dt Delta Time in s
     * @returns {void}
     */
    update(dt) {

    }

    /**
     * Handle browser window resizing
     */
    onResize() {
        this.ratio  = window.innerWidth / window.innerHeight;
        this.camera.aspect = this.ratio;
        this.camera.updateProjectionMatrix();

        this.width  = window.innerWidth;
        this.height = this.width / this.ratio;

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export default Game;