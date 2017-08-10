import * as THREE from 'three';

class WaterTrail extends THREE.Object3D {
    constructor(game) {
        super();

        this.game = game;

        let geometry  = new THREE.BufferGeometry();
        let material  = new THREE.LineBasicMaterial({ color: 0xe6ffff });
        let positions = [0, 0, 0];
        let colors    = [1, 1, 1];

        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geometry.addAttribute('color',    new THREE.BufferAttribute(new Float32Array(colors),    3));

        this.playerPositions = [];

        this.waterTrail = new THREE.Line(geometry, material);
        this.add(this.waterTrail);

        this.numFrames = 0;
    }

    update(dt) {
        this.numFrames++;

        if(this.numFrames % 6 == 0) {
            this.numFrames = 0;

            let sternPos = this.game.player.position.clone();
            sternPos.x += Math.sin(this.game.player.rotation.y) * 40;
            sternPos.z += Math.cos(this.game.player.rotation.y) * 40;
            this.playerPositions.push(sternPos);
            while(this.playerPositions.length > 100) {
                this.playerPositions = this.playerPositions.slice(1);
            }

            if(this.waterTrail) {
                let positions   = [];
                let colors      = [];
                for(let i = 1; i < this.playerPositions.length; i++) {
                    let y = Math.pow(i, 2) / Math.pow(this.playerPositions.length, 2) - 1;
                    positions.push(
                        this.playerPositions[i - 1].x,
                        y,
                        this.playerPositions[i - 1].z
                    );
                    colors.push(1, 1, 1);
                }
                
                this.waterTrail.geometry.dispose();
                this.waterTrail.geometry = null;
                this.waterTrail.geometry = new THREE.BufferGeometry();
                
                this.waterTrail.geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(positions), 3);
                this.waterTrail.geometry.attributes.color    = new THREE.BufferAttribute(new Float32Array(colors),    3);
            }
        }
    }
}

export default WaterTrail;