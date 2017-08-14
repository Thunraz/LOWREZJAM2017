import * as THREE from 'three';

import GP from '../GameProperties';

class Player extends THREE.Object3D {
    /**
     * Loads player meshes
     * @param {Game} game Game instance
     */
    constructor(game) {
        super();

        this.game = game;

        let scale = 15;

        let loader = new THREE.ObjectLoader();
        loader.load(
            'assets/models/ship.json',
            (mesh) => {
                this.ship = mesh;
                this.ship.castShadow    = true;
                this.ship.receiveShadow = true;
                this.ship.scale.set(scale, scale, scale);
                this.add(this.ship);

                this.ship.geometry.computeBoundingBox();
                let shipBoundingBox = this.ship.geometry.boundingBox;
                let dimensions = new THREE.Vector3(
                    Math.abs(shipBoundingBox.max.x) + Math.abs(shipBoundingBox.min.x),
                    Math.abs(shipBoundingBox.max.y) + Math.abs(shipBoundingBox.min.y),
                    Math.abs(shipBoundingBox.max.z) + Math.abs(shipBoundingBox.min.z)
                );
                dimensions.multiplyScalar(scale);

                let boundingBoxGeometry = new THREE.BoxGeometry(
                    dimensions.x, dimensions.y, dimensions.z,
                    //4, 4, 12
                    1, 1, 1
                );
                let boundingBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, visible: false });
                this.boundingBox = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
                this.add(this.boundingBox);
            }
        );

        loader.load(
            'assets/models/sails.json',
            (mesh) => {
                this.sails = mesh;
                this.sails.castShadow    = true;
                this.sails.receiveShadow = true;
                this.sails.scale.set(scale, scale, scale);
                this.add(this.sails);
            }
        );

        this.acceleration = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster();
        this.numFrames = 0;
    }

    update(dt) {
        this.numFrames++;
        this.handleControls(this.game.controls.states, dt);

        if(this.checkForCollision()) {
            let factor = -0.5;
            console.log('collision');
            //this.acceleration.x = this.acceleration.x * factor;
            //this.acceleration.z = this.acceleration.z * factor;
        }

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

    checkForCollision() {
        let first = true;

        for (let index = 0; index < this.boundingBox.geometry.vertices.length; index++) {
            let localVertex     = this.boundingBox.geometry.vertices[index].clone();
            let globalVertex    = localVertex.applyMatrix4(this.matrix);
            let directionVector = globalVertex.sub(this.position);

            if(localVertex.length() != globalVertex.length())
                console.log(localVertex, globalVertex);
        
            this.raycaster.set(localVertex, directionVector.clone().normalize());

            for(let i = 0; i < this.game.port.children.length; i++) {
                let result = this.raycaster.intersectObjects(this.game.port.children);
                if(result == null) continue;
                //console.log(result);
                
                if (result.length > 0 && result[0].distance < directionVector.length()) {
                    if(first) {
                        first = false;
                        console.log(localVertex);
                        console.log(directionVector.length());
                        console.log(result);
                    }
                    return true;
                }
            }
        }

        return false;
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