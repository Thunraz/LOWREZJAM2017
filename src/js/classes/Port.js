import * as THREE from 'three';

class Port extends THREE.Object3D {
    /**
     * Loads port mesh
     * @param {Game} game Game instance
     */
    constructor(game) {
        super();

        this.game = game;

        let scale = 15;

        let loader = new THREE.ObjectLoader();
        loader.load(
            'assets/models/port.json',
            (mesh) => {
                this.port = mesh;
                this.port.castShadow    = true;
                this.port.receiveShadow = true;
                this.port.scale.set(scale, scale, scale);
                this.add(this.port);
                
                for(let i = 0; i < this.port.children.length; i++) {
                    if(this.port.children[i].name == 'Houses') {
                        let houses = this.port.children[i];
                        for(let j = 0; j < houses.material.length; j++) {
                            if(houses.material[j].name == 'Walls') {
                                houses.material[j] = new THREE.MeshStandardMaterial({ color: 0x8c001a });
                                houses.material[j].name = 'Walls';
                            } else if(houses.material[j].name == 'Roofs') {
                                houses.material[j] = new THREE.MeshStandardMaterial({ color: 0x333333 });
                                houses.material[j].name = 'Roofs';
                            } else if(houses.material[j].name == 'Hook') {
                                houses.material[j] = new THREE.MeshStandardMaterial({ color: 0xdddddd });
                                houses.material[j].name = 'Hook';
                            } else if(houses.material[j].name == 'Dark') {
                                houses.material[j] = new THREE.MeshStandardMaterial({ color: 0x0 });
                                houses.material[j].name = 'Dark';
                            } else if(houses.material[j].name == 'Ground') {
                                houses.material[j] = new THREE.MeshStandardMaterial({ color: 0xd86f1c });
                                houses.material[j].name = 'Ground';
                            } else if(houses.material[j].name == 'Doors') {
                                houses.material[j] = new THREE.MeshStandardMaterial({ color: 0x6f7ad5 });
                                houses.material[j].name = 'Doors';
                            }
                        }
                    }
                }
            }
        );

        this.rotateY(-Math.PI / 2);
    }
}

export default Port;