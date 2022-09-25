import * as THREE from 'three';
import { Object3D, ObjectLoader } from 'three';
import { IGameObject } from './IGameObject';

export class Player extends IGameObject {
    private ship;
    private sails;

    constructor() {
        super();

        const scale = 15;
        const loader = new ObjectLoader();
        loader.load(
            'assets/models/ship.json',
            (mesh) => {
                this.ship = <Object3D>mesh;
                this.ship.castShadow = true;
                this.ship.receiveShadow = true;
                this.ship.geometry.scale(scale, scale, scale);
                this.add(this.ship);

                this.ship.geometry.computeBoundingBox();
                const shipBoundingBox = this.ship.geometry.boundingBox;
                const dimensions = new THREE.Vector3(
                    Math.abs(shipBoundingBox.max.x) + Math.abs(shipBoundingBox.min.x),
                    Math.abs(shipBoundingBox.max.y) + Math.abs(shipBoundingBox.min.y),
                    Math.abs(shipBoundingBox.max.z) + Math.abs(shipBoundingBox.min.z),
                );

                // const boundingBoxGeometry = new THREE.BoxGeometry(
                //     dimensions.x,
                //     dimensions.y,
                //     dimensions.z,
                //     2,
                //     4,
                //     12,
                // );
                // const boundingBoxMaterial = new THREE.MeshBasicMaterial(
                //     { color: 0xff00ff, visible: true, wireframe: true },
                // );
                // this.boundingBox = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
                // this.add(this.boundingBox);
            },
        );

        loader.load(
            'assets/models/sails.json',
            (mesh) => {
                this.sails = mesh;
                this.sails.castShadow = true;
                this.sails.receiveShadow = true;
                this.sails.geometry.scale(scale, scale, scale);
                this.add(this.sails);
            },
        );
    }

    update(dt: number): void {
    }

    handleControls(): void {
    }

}
