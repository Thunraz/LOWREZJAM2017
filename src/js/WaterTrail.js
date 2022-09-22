import * as THREE from 'three';

class WaterTrail extends THREE.Object3D {
    constructor(game) {
        super();

        this.game = game;

        const geometry  = new THREE.BufferGeometry();
        const material  = new THREE.MeshBasicMaterial({ color: 0xe6ffff });
        const positions = [];

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

        this.playerPositions = [];

        this.waterTrail = new THREE.Mesh(geometry, material);
        this.add(this.waterTrail);

        this.numFrames = 0;
    }

    update(_dt) {
        this.numFrames++;

        if (this.numFrames % 6 === 0) {
            this.numFrames = 0;

            const angle = this.game.player.rotation.y;

            const sternPos = this.game.player.position.clone();
            sternPos.x += Math.sin(angle) * 40;
            sternPos.z += Math.cos(angle) * 40;
            this.playerPositions.push({ pos: sternPos, angle });
            while (this.playerPositions.length > 100) {
                this.playerPositions = this.playerPositions.slice(1);
            }

            if (this.waterTrail) {
                const positions   = [];
                const trailWidth  = 7.5;
                const offsets = [
                    new THREE.Vector3(+trailWidth, 0, -trailWidth),
                    new THREE.Vector3(-trailWidth, 0, +trailWidth),
                    new THREE.Vector3(+trailWidth, 0, +trailWidth),

                    new THREE.Vector3(+trailWidth, 0, -trailWidth),
                    new THREE.Vector3(-trailWidth, 0, -trailWidth),
                    new THREE.Vector3(-trailWidth, 0, +trailWidth),
                ];

                for (let i = 1; i < this.playerPositions.length; i++) {
                    const y = (-Math.E) ** (i - this.playerPositions.length) + 0.5;

                    const point    = this.playerPositions[i - 1].pos;
                    const rotAngle = this.playerPositions[i - 1].angle;

                    for (let j = 0; j < offsets.length; j++) {
                        const rot = new THREE.Vector3(
                            Math.cos(rotAngle)  * offsets[j].x + Math.sin(rotAngle) * offsets[j].z,
                            offsets[j].y,
                            -Math.sin(rotAngle) * offsets[j].x + Math.cos(rotAngle) * offsets[j].z,
                        );

                        positions.push(point.x + rot.x, y + rot.y, point.z + rot.z);
                    }
                }
                
                this.waterTrail.geometry.dispose();
                this.waterTrail.geometry = null;
                this.waterTrail.geometry = new THREE.BufferGeometry();
                
                this.waterTrail.geometry.attributes.position = new THREE.BufferAttribute(
                    new Float32Array(positions),
                    3,
                );
            }
        }
    }
}

export default WaterTrail;
