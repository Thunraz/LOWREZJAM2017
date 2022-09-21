import * as THREE from 'three';

import GP           from '../GameProperties.js';
import Player       from './Player.js';
import Port         from './Port.js';
import WaterSurface from './WaterSurface.js';
import WaterTrail   from './WaterTrail.js';

class Game {
    /**
     * Initialize the game
     * @param {Controls} controls the control handler instance
     */
    constructor(controls) {
        this.controls = controls;

        this.ratio = 1;
        this.gameContainer = document.getElementById('game');
        let rect = this.gameContainer.getBoundingClientRect();
        this.width  = rect.width;
        this.height = rect.height;

        this.frames = 0;
        this.runTime = 0.0;
        this.buttonTimeout = 0.0;
        this.isRecording = false;

        this.debugElement = document.getElementById('debug');

        this.scene = new THREE.Scene();

        this.waterSurface = new WaterSurface(this);
        this.scene.add(this.waterSurface);

        this.player = new Player(this);
        this.scene.add(this.player);

        this.waterTrail = new WaterTrail(this);
        this.scene.add(this.waterTrail);

        this.port = new Port(this, true);
        this.port.position.set(-100, 0, 0);
        this.scene.add(this.port);

        this.sun = new THREE.DirectionalLight(0xffffff, .5);
        this.sun.position.set(GP.SunPosition.x, GP.SunPosition.y, GP.SunPosition.z);
        this.sun.castShadow = true;
        this.sun.shadow.camera.near = 0.5;
        this.sun.shadow.camera.far  = 1000;

        this.sun.shadow.camera.top    = 300;
        this.sun.shadow.camera.right  = 200;
        this.sun.shadow.camera.bottom = -200;
        this.sun.shadow.camera.left   = -200;
        this.sun.target = this.player;
        this.scene.add(this.sun);

        let hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        this.scene.add(hemiLight);

        this.camera = new THREE.PerspectiveCamera(75, this.ratio, 0.1, 20000);
        this.camera.name = 'main cam';
        this.camera.position.set(GP.CameraOffset.x, GP.CameraOffset.y, GP.CameraOffset.z);
        this.camera.lookAt(new THREE.Vector3(0))

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(GP.GameSize, GP.GameSize);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type    = THREE.PCFShadowMap;
        this.gameContainer.appendChild(this.renderer.domElement);
        this.renderer.domElement.style = null;
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
        this.debugElement.innerText = '';

        this.runTime += dt;
        this.frames++;

        if(this.buttonTimeout >= 0.0) {
            this.buttonTimeout -= dt;
        }

        let oldPlayerPosition = new THREE.Vector3(this.player.position.x, 0, this.player.position.z);

        this.controls.update();
        this.handleControls(this.controls.states, dt);
        this.player.update(dt);

        let playerPositionDelta = oldPlayerPosition.sub(new THREE.Vector3(this.player.position.x, 0, this.player.position.z));
        this.camera.position.sub(playerPositionDelta);

        // Move water with camera
        this.waterSurface.position.set(
            this.camera.position.x - GP.CameraOffset.x,
            this.camera.position.y - GP.CameraOffset.y,
            this.camera.position.z - GP.CameraOffset.z
        );

        // Move sun with player
        this.sun.position.set(
            this.player.position.x + GP.SunPosition.x,
            this.player.position.y + GP.SunPosition.y,
            this.player.position.z + GP.SunPosition.z
        );

        this.waterSurface.offset.x -= playerPositionDelta.x / 800;
        this.waterSurface.offset.y += playerPositionDelta.z / 800;

        this.waterSurface.update(dt);
        this.waterTrail.update(dt);
        this.port.update(dt);
    }

    debug(text) {
        if(typeof(text) == 'object') {
            text = JSON.stringify(text);
        }
        this.debugElement.innerHTML += text + '\n';
    }

    handleControls(states, dt) {
        if(states.toggleRecord && this.buttonTimeout <= 0.0) {
            this.buttonTimeout += GP.ButtonTimeout;
            this.isRecording = !this.isRecording;

            if(this.isRecording) {
                console.log('Start recording');
                this.stream = this.renderer.domElement.captureStream();
                console.log(this.stream);
                this.recordedBlobs = [];

                let options = { mimeType: 'video/webm', videoBitsPerSecond: 4000e3 };
                try {
                    this.mediaRecorder = new MediaRecorder(this.stream, options);

                    this.mediaRecorder.ondataavailable = (event) => {
                        if (event.data && event.data.size > 0) {
                            this.recordedBlobs.push(event.data);
                            this.debug(this.recordedBlobs.length);
                        }
                    };
                    this.mediaRecorder.start(100); // collect 100ms of data
                    console.log(this.mediaRecorder);
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
