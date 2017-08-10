import * as THREE from 'three';

class WaterTrail extends THREE.Object3D {
    constructor(game) {
        super();

        this.game = game;

        let geometry  = new THREE.BufferGeometry();
        let material  = new THREE.MeshBasicMaterial({ color: 0xe6ffff, side: THREE.DoubleSide });
        let positions = [
            5, 0.5, 50,
            5, 0.5, 40,
            -5, 0.5, 40,

            -5, 0.5, 40,
            -5, 0.5, 50,
            5, 0.5, 50,
        ];
        let colors = [];
        for(let i = 0; i < positions.length; i++) {
            colors.push(1);
        }

        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geometry.addAttribute('color',    new THREE.BufferAttribute(new Float32Array(colors),    3));

        this.playerPositions = [];

        this.waterTrail = new THREE.Mesh(geometry, material);
        this.add(this.waterTrail);

        this.numFrames = 0;
    }

    update(dt) {
        this.numFrames++;

        if(this.numFrames % 6 == 0) {
            this.numFrames = 0;
            let angle = this.game.player.rotation.y;

            let trailWidth  = 5;
            let trailLength = 10;

            let sternPos = this.game.player.position.clone();
            sternPos.x += Math.sin(angle) * 40;
            sternPos.z += Math.cos(angle) * 40;
            this.playerPositions.push({ pos: sternPos, angle: angle });
            while(this.playerPositions.length > 100) {
                this.playerPositions = this.playerPositions.slice(1);
            }

            if(this.waterTrail) {
                let positions   = [];
                let colors      = [];
                for(let i = 1; i < this.playerPositions.length; i++) {
                    let dir = this.playerPositions[i - 1].angle;
                    let x = this.playerPositions[i - 1].pos.x;
                    //let y = Math.pow(i, 2) / Math.pow(this.playerPositions.length, 2) - 1;
                    let y = 0.5;
                    let z = this.playerPositions[i - 1].pos.z;

                    let pSin = Math.sin(dir)  * trailWidth;
                    let nSin = Math.sin(-dir) * trailWidth;
                    let pCos = Math.cos(dir)  * trailWidth;
                    let nCos = Math.cos(-dir) * trailWidth;

                    positions.push(
                        x + pCos, y, z + nSin,
                        x + pCos, y, z + pSin,
                        x + nCos, y, z + pSin,

                        x + pCos, y, z - nSin,
                        x - nCos, y, z + pSin,
                        x - cos, y, z - sin
                    );

                    if(!this.first) {
                        this.first = true;
                        console.log('x', x);
                        console.log('direction', dir);
                        console.log(this.playerPositions);
                    }

                    for(let j = 0; j < positions.length; j++) colors.push(1);
                }

                //console.log(positions);
                
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