import { Camera, DirectionalLight, HemisphereLight, PerspectiveCamera, Renderer, Scene, Vector3 } from 'three';
import { IGameState } from './IGameState';
import { Player } from './Player';
import { GameProperties as GP } from './GameProperties';
import { WaterSurface } from './WaterSurface';
import { WaterTrail } from './WaterTrail';
import { Port } from './Port';

export class GameStateMain implements IGameState {
    private readonly _scene: Scene;
    private readonly _camera: Camera;
    private readonly player: Player;
    private readonly waterTrail: WaterTrail;
    private readonly waterSurface: WaterSurface;
    private readonly port: Port;
    private readonly sun: DirectionalLight;

    constructor() {
        this._runtime = 0.0;
        this._scene = new Scene();

        this._camera = new PerspectiveCamera(75, 1, 0.1, 20000);
        this._camera.name = 'main cam';
        this._camera.position.set(GP.CameraOffset.x, GP.CameraOffset.y, GP.CameraOffset.z);
        this._camera.lookAt(new Vector3(0, 0, 0));

        this.waterSurface = new WaterSurface();
        this._scene.add(this.waterSurface);

        this.player = new Player();
        this._scene.add(this.player);

        this.waterTrail = new WaterTrail();
        this._scene.add(this.waterTrail);

        this.port = new Port();
        this.port.position.set(-100, 0, 0);
        this._scene.add(this.port);

        this.sun = new DirectionalLight(0xffffff, 0.5);
        this.sun.position.set(GP.SunPosition.x, GP.SunPosition.y, GP.SunPosition.z);
        this.sun.castShadow = true;
        this.sun.shadow.camera.near = 0.5;
        this.sun.shadow.camera.far = 1000;
        this.sun.shadow.camera.top = 300;
        this.sun.shadow.camera.right = 200;
        this.sun.shadow.camera.bottom = -200;
        this.sun.shadow.camera.left = -200;
        this.sun.target = this.player;
        this._scene.add(this.sun);

        const hemiLight = new HemisphereLight(0xffffbb, 0x080820, 1);
        this._scene.add(hemiLight);
    }

    private _runtime: number;

    get runtime(): number {
        return this._runtime;
    }

    render(renderer: Renderer): void {
        renderer.render(this._scene, this._camera);
    }

    update(dt: number): void {
        this._runtime += dt;
        this.player.handleControls();
        this.player.update(dt);
        this.waterSurface.update(dt);
    }
}
