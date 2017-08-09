import * as THREE from 'three';

import GP from '../GameProperties';

class Player extends THREE.Object3D {
    constructor(game) {
        super();

        this.game = game;

        let scale = 15;

        let loader = new THREE.ObjectLoader();
        loader.load(
            'assets/models/ship.json',
            (mesh) => {
                this.ship = mesh;
                this.ship.scale.set(scale, scale, scale);
                this.add(this.ship);
            }
        );

        loader.load(
            'assets/models/sails.json',
            (mesh) => {
                this.sails = mesh;
                this.sails.scale.set(scale, scale, scale);
                this.add(this.sails);
            }
        )

        this.acceleration = new THREE.Vector3();
    }

    update(dt) {
        this.handleControls(this.game.controls.states, dt);

        this.position.x += this.acceleration.x;
        this.position.z += this.acceleration.z;

        // Bop around in the water
        this.position.y = -0.5 * Math.sin(2 * this.game.runTime) + 1.5 * Math.sin(3 * this.game.runTime) + 0.5;
        this.rotation.z = Math.sin(1.5 * this.game.runTime) * 0.1;

        let rot = this.acceleration.x + this.acceleration.z;
        let maxAngle = 5;
        this.rotation.x += rot * Math.PI / 180;
        if(this.rotation.x >= maxAngle * Math.PI / 180) {
            this.rotation.x = maxAngle * Math.PI / 180;
        } else if(this.rotation.x <= -maxAngle * Math.PI / 180) {
            this.rotation.x = -maxAngle * Math.PI / 180;
        }

        this.rotation.x *= 0.99;

        this.acceleration.multiplyScalar(0.99);
    }

    handleControls(states, dt) {
        if(states.up) {
            this.acceleration.x += -Math.sin(this.rotation.y) * GP.PlayerAcceleration * dt;
            this.acceleration.z += -Math.cos(this.rotation.y) * GP.PlayerAcceleration * dt;
        }
        else if(states.down) {
            this.acceleration.x += Math.sin(this.rotation.y) * GP.PlayerAcceleration * dt;
            this.acceleration.z += Math.cos(this.rotation.y) * GP.PlayerAcceleration * dt;
        }

        if(states.left) {
            this.rotation.y += GP.PlayerTurnSpeed * dt;
        }
        else if(states.right) {
            this.rotation.y -= GP.PlayerTurnSpeed * dt;
        }
    }
}

export default Player;