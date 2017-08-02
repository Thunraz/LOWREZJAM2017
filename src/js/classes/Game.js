import * as THREE from 'three';

class Game {
    /**
     * Initialize the game
     */
    constructor() {
        this.ratio = 1;
        this.gameContainer = document.getElementById('g');
        let rect = this.gameContainer.getBoundingClientRect();
        this.width  = rect.width;
        this.height = rect.height;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, this.ratio, 0.1, 20000);
        this.camera.position.z = 400;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(64, 64);
        this.gameContainer.appendChild(this.renderer.domElement);
        this.renderer.domElement.style = null;

        let geometry = new THREE.BoxGeometry(200, 200, 200);
        let material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        this.cube    = new THREE.Mesh(geometry, material);
        this.cube.position.set(0, 0, -50);
        this.scene.add(this.cube);

        this.light = new THREE.PointLight(0xffffff, 1, 100);
        this.light.position.set(0, 0, 75);
        this.scene.add(this.light);

        this.ambient = new THREE.AmbientLight(0x444444, 1);
        this.scene.add(this.ambient);

        this.runTime = 0.0;
    }
    
    /**
     * Draw a single frame
     * @returns {void}
     */
    draw() {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Update all game objects, handle input, etc.
     * @param {number} dt Delta Time in s
     * @returns {void}
     */
    update(dt) {
        this.runTime += dt;

        this.cube.rotation.x += Math.sin(this.runTime) * dt * 0.5;
        this.cube.rotation.y += Math.cos(this.runTime) * dt;
    }
}

export default Game;