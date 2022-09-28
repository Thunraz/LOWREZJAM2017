import { IGameObject } from './IGameObject';
import * as THREE from 'three';
import { BufferAttribute, BufferGeometry, Euler, Mesh, MeshBasicMaterial, Vector3 } from 'three';

type PlayerPosition = { position: Vector3, angle: number };

export class WaterTrail extends IGameObject {
    public playerPosition: Vector3 = new Vector3();
    public playerRotation: Euler = new Euler();

    private readonly _mesh: Mesh;
    private readonly _playerPositions: Array<PlayerPosition> = [];
    private _numFrames = 0;

    constructor() {
        super();

        const geometry = new BufferGeometry();
        const material = new MeshBasicMaterial({ color: 0xe6ffff });
        const positions = [];

        geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));

        this._mesh = new Mesh(geometry, material);
        this.add(this._mesh);
    }

    update(): void {
        this._numFrames++;

        if (this._numFrames % 6 === 0) {
            this._numFrames = 0;

            const angle = this.playerRotation.y;
            const sternPos = this.playerPosition.clone();
            sternPos.x += Math.sin(angle) * 40;
            sternPos.z += Math.cos(angle) * 40;
            this._playerPositions.push({ position: sternPos, angle: angle });
            while (this._playerPositions.length > 100) {
                this._playerPositions.splice(0, 1);
            }

            if (this._mesh) {
                const positions = [];
                const trailWidth = 7.5;
                const offsets = [
                    new THREE.Vector3(+trailWidth, 0, -trailWidth),
                    new THREE.Vector3(-trailWidth, 0, +trailWidth),
                    new THREE.Vector3(+trailWidth, 0, +trailWidth),

                    new THREE.Vector3(+trailWidth, 0, -trailWidth),
                    new THREE.Vector3(-trailWidth, 0, -trailWidth),
                    new THREE.Vector3(-trailWidth, 0, +trailWidth),
                ];

                for (let i = 1; i < this._playerPositions.length; i++) {
                    const y = (-Math.E) ** (i - this._playerPositions.length) + 0.5;

                    const point = this._playerPositions[i - 1].position;
                    const rotAngle = this._playerPositions[i - 1].angle;

                    for (let j = 0; j < offsets.length; j++) {
                        const rot = new THREE.Vector3(
                            Math.cos(rotAngle) * offsets[j].x + Math.sin(rotAngle) * offsets[j].z,
                            offsets[j].y,
                            -Math.sin(rotAngle) * offsets[j].x + Math.cos(rotAngle) * offsets[j].z,
                        );

                        positions.push(point.x + rot.x, y + rot.y, point.z + rot.z);
                    }
                }

                this._mesh.geometry.dispose();
                this._mesh.geometry = null;
                this._mesh.geometry = new THREE.BufferGeometry();

                this._mesh.geometry.attributes.position = new THREE.BufferAttribute(
                    new Float32Array(positions),
                    3,
                );
            }
        }
    }
}
