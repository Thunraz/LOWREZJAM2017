import * as THREE from 'three';
import {
    BoxGeometry,
    BufferGeometry,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    ObjectLoader,
    Vector3
} from 'three';
import { IGameObject } from './lib/IGameObject';
import { MyInputStates } from './main';
import { GameProperties as GP } from './GameProperties';
import { IInputStates } from './lib/IInputStates';

export class Player extends IGameObject {
    public enableBop = true;
    private _ship: Mesh;
    private _boundingBox: Mesh;
    private _sails: Mesh;
    private _acceleration: Vector3;
    private _runtime: number;
    private readonly _line: Line<BufferGeometry, LineBasicMaterial>;

    constructor() {
        super();

        this._runtime = 0.0;

        const scale = 15;
        const loader = new ObjectLoader();
        loader.load(
            'assets/models/ship.json',
            (mesh) => {
                this._ship = <Mesh><Object3D>mesh;
                this._ship.castShadow = true;
                this._ship.receiveShadow = true;
                this._ship.geometry.scale(scale, scale, scale);
                this.add(this._ship);

                this._ship.geometry.computeBoundingBox();
                const shipBoundingBox = this._ship.geometry.boundingBox;
                const dimensions = new Vector3(
                    Math.abs(shipBoundingBox.max.x) + Math.abs(shipBoundingBox.min.x),
                    Math.abs(shipBoundingBox.max.y) + Math.abs(shipBoundingBox.min.y),
                    Math.abs(shipBoundingBox.max.z) + Math.abs(shipBoundingBox.min.z),
                );

                const boundingBoxGeometry = new BoxGeometry(
                    dimensions.x,
                    dimensions.y,
                    dimensions.z,
                    2,
                    4,
                    12,
                );
                const boundingBoxMaterial = new MeshBasicMaterial(
                    { color: 0xff00ff, visible: true, wireframe: true },
                );
                this._boundingBox = new Mesh(boundingBoxGeometry, boundingBoxMaterial);
                this.add(this._boundingBox);
            },
        );

        loader.load(
            'assets/models/sails.json',
            (mesh) => {
                this._sails = <Mesh><Object3D>mesh;
                this._sails.castShadow = true;
                this._sails.receiveShadow = true;
                this._sails.geometry.scale(scale, scale, scale);
                this.add(this._sails);
            },
        );

        this._acceleration = new Vector3();

        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true });
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([]), 3));
        lineGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array([]), 3));

        this._line = new THREE.Line(lineGeometry, lineMaterial);
        this.add(this._line);
    }

    update(dt: number, inputStates: IInputStates): void {
        this._runtime += dt;
        this.handleControls(<MyInputStates>inputStates, dt);

        this.position.x += this._acceleration.x;
        this.position.z += this._acceleration.z;

        // Bop around in the water
        if (this.enableBop) {
            this.position.y = -0.5 * Math.sin(2 * this._runtime) + 1.5 * Math.sin(3 * this._runtime) + 0.5;
            this.rotation.z = Math.sin(1.5 * this._runtime) * 0.1;

            const rot = this._acceleration.x + this._acceleration.z;
            const maxAngle = 5;
            this.rotation.x += (rot * Math.PI) / 180;
            if (this.rotation.x >= (maxAngle * Math.PI) / 180) {
                this.rotation.x = (maxAngle * Math.PI) / 180;
            } else if (this.rotation.x <= (-maxAngle * Math.PI) / 180) {
                this.rotation.x = (-maxAngle * Math.PI) / 180;
            }
        }

        this.rotation.x *= 0.99;

        this._acceleration.multiplyScalar(0.99);
        if (this._acceleration.length() <= GP.PlayerAcceleration * 0.1) this._acceleration.multiplyScalar(0.0);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private handleControls(inputStates: MyInputStates, _dt: number) {
        if (inputStates.up) {
            this._acceleration.x += -Math.sin(this.rotation.y) * GP.PlayerAcceleration;
            this._acceleration.z += -Math.cos(this.rotation.y) * GP.PlayerAcceleration;
        } else if (inputStates.down) {
            this._acceleration.x += Math.sin(this.rotation.y) * GP.PlayerAcceleration;
            this._acceleration.z += Math.cos(this.rotation.y) * GP.PlayerAcceleration;
        }

        if (inputStates.left) {
            this.rotation.y += GP.PlayerTurnSpeed;
        } else if (inputStates.right) {
            this.rotation.y -= GP.PlayerTurnSpeed;
        }
    }
}
