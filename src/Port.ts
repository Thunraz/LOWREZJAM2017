import { IGameObject } from './IGameObject';
import {
    BoxGeometry,
    Material,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Object3D,
    ObjectLoader,
    Vector3
} from 'three';

export class Port extends IGameObject {
    public showBoundingBox = false;

    constructor() {
        super();

        const scale = 15;

        const loader = new ObjectLoader();
        loader.load(
            'assets/models/port.json',
            (mesh) => {
                for (let i = 0; i < mesh.children.length; i++) {
                    const child = <Mesh>mesh.children[i].clone();
                    child.castShadow = true;
                    child.receiveShadow = true;

                    child.geometry.scale(scale, scale, scale);

                    // Calculate bounding boxes for geometries
                    child.geometry.computeBoundingBox();
                    // this.createBoundingBox(child);

                    // Apply material to houses
                    if (child.name === 'Houses') {
                        for (let j = 0; j < (<Material[]>child.material).length; j++) {
                            if (child.material[j].name === 'Walls') {
                                child.material[j] = new MeshStandardMaterial({ color: 0x8c001a });
                                child.material[j].name = 'Walls';
                            } else if (child.material[j].name === 'Roofs') {
                                child.material[j] = new MeshStandardMaterial({ color: 0x333333 });
                                child.material[j].name = 'Roofs';
                            } else if (child.material[j].name === 'Hook') {
                                child.material[j] = new MeshStandardMaterial({ color: 0xdddddd });
                                child.material[j].name = 'Hook';
                            } else if (child.material[j].name === 'Dark') {
                                child.material[j] = new MeshStandardMaterial({ color: 0x0 });
                                child.material[j].name = 'Dark';
                            } else if (child.material[j].name === 'Ground') {
                                child.material[j] = new MeshStandardMaterial({ color: 0xd86f1c });
                                child.material[j].name = 'Ground';
                            } else if (child.material[j].name === 'Doors') {
                                child.material[j] = new MeshStandardMaterial({ color: 0x6f7ad5 });
                                child.material[j].name = 'Doors';
                            }
                        }
                    }
                    this.add(child);
                }
            },
        );

        loader.load(
            'assets/models/island.json',
            (mesh) => {
                const island = <Mesh><Object3D>mesh.clone();
                island.castShadow = true;
                island.receiveShadow = true;
                // island.scale.set(scale, scale, scale);

                this.createBoundingBox(mesh);

                island.material = new MeshStandardMaterial({
                    name: 'Sand',
                    color: 0x336699,
                });

                this.add(island);
            },
        );

    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    update(): void {
    }

    createBoundingBox(mesh) {
        mesh.geometry.computeBoundingBox();
        const { boundingBox } = mesh.geometry;
        const dimensions = new Vector3(
            boundingBox.max.x - boundingBox.min.x,
            boundingBox.max.y - boundingBox.min.y,
            boundingBox.max.z - boundingBox.min.z,
        );

        const boundingBoxGeometry = new BoxGeometry(
            dimensions.x,
            dimensions.y,
            dimensions.z,
            1,
            1,
            1,
        );
        const boundingBoxMaterial = new MeshBasicMaterial({
            color: 0xff00ff,
            visible: this.showBoundingBox,
            wireframe: true,
        });
        const boundingBoxMesh = new Mesh(boundingBoxGeometry, boundingBoxMaterial);
        boundingBoxMesh.position.set(
            (boundingBox.min.x + boundingBox.max.x) / 2,
            (boundingBox.min.y + boundingBox.max.y) / 2,
            (boundingBox.min.z + boundingBox.max.z) / 2,
        );
        boundingBoxMesh.name = `bounding_box_${mesh.name}`;

        // eslint-disable-next-line no-console
        console.log(boundingBoxMesh);
        this.add(boundingBoxMesh);
    }

}
