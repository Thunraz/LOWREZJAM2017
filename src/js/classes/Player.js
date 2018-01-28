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

        this.enableBop = false;

        let scale = 15;

        let loader = new THREE.ObjectLoader();
        loader.load(
            'assets/models/ship.json',
            (mesh) => {
                this.ship = mesh;
                this.ship.castShadow    = true;
                this.ship.receiveShadow = true;
                this.ship.geometry.scale(scale, scale, scale);
                this.add(this.ship);

                this.ship.geometry.computeBoundingBox();
                let shipBoundingBox = this.ship.geometry.boundingBox;
                let dimensions = new THREE.Vector3(
                    Math.abs(shipBoundingBox.max.x) + Math.abs(shipBoundingBox.min.x),
                    Math.abs(shipBoundingBox.max.y) + Math.abs(shipBoundingBox.min.y),
                    Math.abs(shipBoundingBox.max.z) + Math.abs(shipBoundingBox.min.z)
                );

                let boundingBoxGeometry = new THREE.BoxGeometry(
                    dimensions.x, dimensions.y, dimensions.z,
                    2, 4, 12
                );
                let boundingBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, visible: true, wireframe: true });
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
                this.sails.geometry.scale(scale, scale, scale);
                this.add(this.sails);
            }
        );

        this.acceleration = new THREE.Vector3();
        this.numFrames = 0;

        let lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true });
        let lineGeometry = new THREE.BufferGeometry();
        lineGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array([]), 3));
        lineGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array([]), 3));

        this.line = new THREE.Line(lineGeometry, lineMaterial);
        this.game.scene.add(this.line);
        
        this.first = true;
    }

    update(dt) {
        this.numFrames++;
        this.handleControls(this.game.controls.states, dt);

        if(this.checkForCollision()) {
            let factor = -1.1;
            console.log('collision');
            this.acceleration.x = this.acceleration.x * factor;
            this.acceleration.z = this.acceleration.z * factor;
        }

        this.position.x += this.acceleration.x;
        this.position.z += this.acceleration.z;

        // Bop around in the water
        if(this.enableBop) {
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
        }

        this.rotation.x *= 0.99;

        this.acceleration.multiplyScalar(0.99);
        if(this.acceleration.length() <= 0.01) this.acceleration.multiplyScalar(0.0);
    }

    checkForCollision() {
        let boundingBoxes = this.game.port.children.filter((cur) => {
            return cur.name.startsWith('bounding_box_');
        });

        let portChildren = this.game.port.children.filter((cur) => {
            return !cur.name.startsWith('bounding_');
        });

        let vertices = [];
        let colors   = [];

        for(let index = 0; index < this.boundingBox.geometry.vertices.length; index++) {
            let directionVector = this.localToWorld(this.boundingBox.geometry.vertices[index].clone());
            let directionNormalized = directionVector.clone().normalize();
            
            // Add vertices for the lines
            colors.push(
                1.0, 1.0, 0.0,
                0.0, 1.0, 1.0
            );
            vertices.push(
                this.position.x, this.position.y, this.position.z,
                directionVector.x, directionVector.y, directionVector.z
            );

            let ray = new THREE.Ray(this.position, directionVector);
            for(let i = 0; i < portChildren.length; i++) {
                if(portChildren[i].name == 'Island_1') continue;

                let min = portChildren[i].geometry.boundingBox.min.clone();
                let max = portChildren[i].geometry.boundingBox.max.clone();

                min = this.game.port.localToWorld(min);
                max = this.game.port.localToWorld(max);

                let result = ray.intersectBox(new THREE.Box3(min, max));
                if(result != null && result.length() <= directionVector.length()) {
                    //console.log(portChildren[i].name, portChildren[i].geometry.boundingBox);
                    return true;
                }
            }

            /*this.raycaster.set(this.position, directionVector);
            let result = this.raycaster.intersectObjects(boundingBoxes);
            if(result == null) continue;
            
            if (result.length > 0 && result[0].distance < directionVector.length()) {
                console.log(result, result[0].object.name);
                return true;
            }*/
        }
        this.line.geometry = new THREE.BufferGeometry();
        this.line.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.line.geometry.addAttribute('color',    new THREE.BufferAttribute(new Float32Array(colors),   3));

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