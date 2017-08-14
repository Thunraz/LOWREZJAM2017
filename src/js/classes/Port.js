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
                
                for(let i = 0; i < mesh.children.length; i++) {
                    let child = mesh.children[i].clone();
                    child.castShadow    = true;
                    child.receiveShadow = true;

                    child.geometry.scale(scale, scale, scale);
                    
                    // Calculate bounding boxes for geometries
                    child.geometry.computeBoundingBox();
                    let boundingBox = child.geometry.boundingBox;
                    let dimensions = new THREE.Vector3(
                        boundingBox.max.x - boundingBox.min.x,
                        boundingBox.max.y - boundingBox.min.y,
                        boundingBox.max.z - boundingBox.min.z
                    );
    
                    let boundingBoxGeometry = new THREE.BoxGeometry(
                        dimensions.x, dimensions.y, dimensions.z,
                        //4, 4, 12
                        1, 1, 1
                    );
                    let boundingBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, visible: true, wireframe: true });
                    let boundingBoxMesh     = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
                    boundingBoxMesh.position.set(
                        (boundingBox.min.x + boundingBox.max.x) / 2,
                        (boundingBox.min.y + boundingBox.max.y) / 2,
                        (boundingBox.min.z + boundingBox.max.z) / 2
                    );
                    boundingBoxMesh.name = 'bounding_box_' + i;
                    this.add(boundingBoxMesh);


                    // Apply material to houses
                    if(child.name == 'Houses') {
                        for(let j = 0; j < child.material.length; j++) {
                            if(child.material[j].name == 'Walls') {
                                child.material[j] = new THREE.MeshStandardMaterial({ color: 0x8c001a });
                                child.material[j].name = 'Walls';
                            } else if(child.material[j].name == 'Roofs') {
                                child.material[j] = new THREE.MeshStandardMaterial({ color: 0x333333 });
                                child.material[j].name = 'Roofs';
                            } else if(child.material[j].name == 'Hook') {
                                child.material[j] = new THREE.MeshStandardMaterial({ color: 0xdddddd });
                                child.material[j].name = 'Hook';
                            } else if(child.material[j].name == 'Dark') {
                                child.material[j] = new THREE.MeshStandardMaterial({ color: 0x0 });
                                child.material[j].name = 'Dark';
                            } else if(child.material[j].name == 'Ground') {
                                child.material[j] = new THREE.MeshStandardMaterial({ color: 0xd86f1c });
                                child.material[j].name = 'Ground';
                            } else if(child.material[j].name == 'Doors') {
                                child.material[j] = new THREE.MeshStandardMaterial({ color: 0x6f7ad5 });
                                child.material[j].name = 'Doors';
                            }
                        }
                    }
                    this.add(child);
                }

                //this.game.addCubes();
            }
        );

        loader.load(
            'assets/models/island.json',
            (mesh) => {
                let island = mesh.clone();
                island.castShadow    = true;
                island.receiveShadow = true;
                island.scale.set(scale, scale, scale);
                
                island.material = new THREE.MeshStandardMaterial({
                    name: 'Sand',
                    color: 0x336699
                });
                
                this.add(island);
            }
        );

        this.rotateY(-Math.PI / 2);
    }

    update(dt) {

    }
}

export default Port;