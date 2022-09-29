import { Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, Texture, TextureLoader, Vector2 } from 'three';
import { IGameObject } from './lib/IGameObject';

export class WaterSurface extends IGameObject {
    public readonly offset: Vector2;

    private runtime: number;
    private textures: Array<Texture> = [];
    private surface: Mesh;
    private waves: Array<Mesh> = [];

    constructor() {
        super();

        this.runtime = 0.0;
        this.offset = new Vector2(0.0, 0.0);

        this.loadTextures();
        this.createSurface();
        this.createWaves();
    }

    update(dt: number): void {
        this.runtime += dt;
        for (let i = 0; i < this.waves.length; i++) {
            const material = <MeshStandardMaterial>this.waves[i].material;

            material.opacity = (Math.sin((this.runtime + (Math.PI * i) / 2) * 5) + 1) / 6;
            material.alphaMap.offset.x = this.offset.x;
            material.alphaMap.offset.y = this.offset.y;
            material.alphaMap.offset.x %= 1;
            material.alphaMap.offset.y %= 1;
        }
    }

    private loadTextures(): void {
        const textureLoader = new TextureLoader();
        for (let i = 1; i <= 4; ++i) {
            const texture = textureLoader.load(`assets/img/water-bump-${i}.png`);
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            this.textures.push(texture);
        }
    }

    private createSurface(): void {
        const surfaceGeometry = new PlaneGeometry(600, 800, 1, 1);
        surfaceGeometry.rotateX(-Math.PI / 2);
        const surfaceMaterial = new MeshStandardMaterial({
            color: 0x66aadd,
        });
        this.surface = new Mesh(surfaceGeometry, surfaceMaterial);
        this.surface.receiveShadow = true;
        this.add(this.surface);
    }

    private createWaves(): void {
        for (let i = 0; i < 4; i++) {
            const waveGeometry = new PlaneGeometry(600, 800, 1, 1);
            waveGeometry.rotateX(-Math.PI / 2);
            const waveMaterial = new MeshStandardMaterial({
                color: 0xb3f7ff,
                opacity: 0.0,
                transparent: true,
            });
            waveMaterial.alphaMap = this.textures[i];
            waveMaterial.bumpMap = this.textures[i];
            this.waves.push(new Mesh(waveGeometry, waveMaterial));
            this.add(this.waves[i]);
            this.waves[i].position.y = 0.1;
            this.waves[i].receiveShadow = true;
        }
    }
}
