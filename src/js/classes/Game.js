import * as THREE from 'three';

import GP           from '../GameProperties.js';
import Player       from './Player.js';
import WaterSurface from './WaterSurface.js';

class Game {
    /**
     * Initialize the game
     */
    constructor(controls) {
        this.controls = controls;

        this.ratio = 1;
        this.gameContainer = document.getElementById('g');
        let rect = this.gameContainer.getBoundingClientRect();
        this.width  = rect.width;
        this.height = rect.height;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, this.ratio, 0.1, 20000);
        this.camera.name = 'main cam';
        this.camera.position.set(GP.CameraOffset.x, GP.CameraOffset.y, GP.CameraOffset.z);
        this.camera.lookAt(new THREE.Vector3(0))

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(GP.GameSize, GP.GameSize);
        this.gameContainer.appendChild(this.renderer.domElement);
        this.renderer.domElement.style = null;

        this.waterSurface = new WaterSurface(this);
        this.scene.add(this.waterSurface);

        this.player = new Player(this);
        this.scene.add(this.player);

        this.light = new THREE.PointLight(0xffffff, 1, 1000);
        this.light.position.set(0, 50, 150);
        this.scene.add(this.light);
        
        let lightSphereGeometry = new THREE.SphereGeometry(5, 8, 8);
        let lightSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial);
        this.lightSphere.position.copy(this.light.position);
        this.scene.add(this.lightSphere);

        //this.ambient = new THREE.AmbientLight(0xffffff, 1);
        //this.scene.add(this.ambient);

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

        this.controls.update();
        this.handleControls(this.controls.states, dt);
        this.player.update(dt);

        this.waterSurface.position.set(
            this.camera.position.x - GP.CameraOffset.x,
            this.camera.position.y - GP.CameraOffset.y,
            this.camera.position.z - GP.CameraOffset.z
        );

        /*this.cube.rotation.x += Math.sin(this.runTime) * dt * 0.5;
        this.cube.rotation.y += Math.cos(this.runTime) * dt;*/

        this.waterSurface.update();
    }

    handleControls(states, dt) {
    }
}

export default Game;