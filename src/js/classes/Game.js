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

        this.ambient = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(this.ambient);

        this.runTime = 0.0;
        this.buttonTimeout = 0.0;
        this.isRecording = false;
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

        if(this.buttonTimeout >= 0.0) {
            this.buttonTimeout -= dt;
        }

        let oldPlayerPosition = new THREE.Vector3(this.player.position.x, 0, this.player.position.z);

        this.controls.update();
        this.handleControls(this.controls.states, dt);
        this.player.update(dt);

        let playerPositionDelta = oldPlayerPosition.sub(new THREE.Vector3(this.player.position.x, 0, this.player.position.z));
        this.camera.position.sub(playerPositionDelta);

        this.waterSurface.position.set(
            this.camera.position.x - GP.CameraOffset.x,
            this.camera.position.y - GP.CameraOffset.y,
            this.camera.position.z - GP.CameraOffset.z
        );

        this.waterSurface.offset.x -= playerPositionDelta.x / 800;
        this.waterSurface.offset.y += playerPositionDelta.z / 800;

        this.waterSurface.update(dt);
    }

    handleControls(states, dt) {
        if(states.toggleRecord && this.buttonTimeout <= 0.0) {
            this.buttonTimeout += GP.ButtonTimeout;
            this.isRecording = !this.isRecording;

            if(this.isRecording) {
                console.log('Start recording');
                this.stream = this.renderer.domElement.captureStream();
                this.recordedBlobs = [];

                let options = { mimeType: 'video/webm' };
                try {
                    this.mediaRecorder = new MediaRecorder(this.stream, options);

                    this.mediaRecorder.ondataavailable = (event) => {
                        if (event.data && event.data.size > 0) {
                            this.recordedBlobs.push(event.data);
                        }
                    };
                    this.mediaRecorder.start(100); // collect 100ms of data
                } catch(e) {
                    console.warn('Unable to create MediaRecorder with options Object: ', e);
                }
            } else {
                console.log('Stop recording');
                this.mediaRecorder.stop();
                let blob = new Blob(this.recordedBlobs, { type: 'video/webm' });
                let url  = window.URL.createObjectURL(blob);
                let a    = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'output.webm';
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
            }
        }
    }
}

export default Game;