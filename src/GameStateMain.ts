import { Camera, DirectionalLight, HemisphereLight, PerspectiveCamera, Renderer, Scene, Vector3 } from 'three';
import { IGameState } from './IGameState';
import { Player } from './Player';
import { GameProperties as GP } from './GameProperties';
import { WaterSurface } from './WaterSurface';
import { WaterTrail } from './WaterTrail';
import { Port } from './Port';
import { IInputStates } from './IInputStates';

export class GameStateMain implements IGameState {
    private readonly _scene: Scene;
    private readonly _camera: Camera;
    private readonly _player: Player;
    private readonly _waterTrail: WaterTrail;
    private readonly _waterSurface: WaterSurface;
    private readonly _port: Port;
    private readonly _sun: DirectionalLight;

    constructor() {
        this._runtime = 0.0;
        this._scene = new Scene();

        this._camera = new PerspectiveCamera(75, 1, 0.1, 20000);
        this._camera.name = 'main cam';
        this._camera.position.set(GP.CameraOffset.x, GP.CameraOffset.y, GP.CameraOffset.z);
        this._camera.lookAt(new Vector3(0, 0, 0));

        this._waterSurface = new WaterSurface();
        this._scene.add(this._waterSurface);

        this._player = new Player();
        this._scene.add(this._player);

        this._waterTrail = new WaterTrail();
        this._scene.add(this._waterTrail);

        this._port = new Port();
        this._port.position.set(-100, 0, 0);
        this._scene.add(this._port);

        this._sun = new DirectionalLight(0xffffff, 0.5);
        this._sun.position.set(GP.SunPosition.x, GP.SunPosition.y, GP.SunPosition.z);
        this._sun.castShadow = true;
        this._sun.shadow.camera.near = 0.5;
        this._sun.shadow.camera.far = 1000;
        this._sun.shadow.camera.top = 300;
        this._sun.shadow.camera.right = 200;
        this._sun.shadow.camera.bottom = -200;
        this._sun.shadow.camera.left = -200;
        this._sun.target = this._player;
        this._scene.add(this._sun);

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

    update(dt: number, inputStates: IInputStates): void {
        this._runtime += dt;

        this._player.update(dt, inputStates);
        this._waterTrail.playerRotation = this._player.rotation;
        this._waterTrail.playerPosition = this._player.position;
        this._waterTrail.update();
        this._waterSurface.update(dt);
    }
}
