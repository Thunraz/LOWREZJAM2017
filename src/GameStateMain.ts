import { Camera, DirectionalLight, HemisphereLight, PerspectiveCamera, Renderer, Scene, Vector3 } from 'three';
import { IGameState } from './lib/IGameState';
import { Player } from './Player';
import { GameProperties as GP } from './GameProperties';
import { WaterSurface } from './WaterSurface';
import { WaterTrail } from './WaterTrail';
import { Port } from './Port';
import { IInputStates } from './lib/IInputStates';
import { MyInputStates } from './main';
import { Game } from './lib/Game';

function padLeft(input: string | number, length: number, char?: string): string {
    char = char ?? '0';
    const strInput = input.toString();
    let output = strInput;
    for (let i = 0; i < length - strInput.length; i++) {
        output = char + output;
    }

    return output;
}

function getFormattedDateTimeString(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = padLeft(date.getMonth() + 1, 2);
    const day = padLeft(date.getDate(), 2);
    const hours = padLeft(date.getHours(), 2);
    const minutes = padLeft(date.getMinutes(), 2);
    const seconds = padLeft(date.getSeconds(), 2);

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

export class GameStateMain implements IGameState {
    private game: Game;
    private readonly scene: Scene;
    private readonly camera: Camera;
    private readonly player: Player;
    private readonly waterTrail: WaterTrail;
    private readonly waterSurface: WaterSurface;
    private readonly port: Port;
    private readonly sun: DirectionalLight;
    private buttonTimeout = 0.0;

    private isRecording = false;
    private stream: MediaStream;
    private recordedBlobs: Blob[];
    private mediaRecorder: MediaRecorder;

    constructor() {
        this._runtime = 0.0;
        this.scene = new Scene();

        this.camera = new PerspectiveCamera(75, 1, 0.1, 20000);
        this.camera.name = 'main cam';
        this.camera.position.set(GP.CameraOffset.x, GP.CameraOffset.y, GP.CameraOffset.z);
        this.camera.lookAt(new Vector3(0, 0, 0));

        this.waterSurface = new WaterSurface();
        this.scene.add(this.waterSurface);

        this.player = new Player();
        this.scene.add(this.player);

        this.waterTrail = new WaterTrail();
        this.scene.add(this.waterTrail);

        this.port = new Port();
        this.port.position.set(-100, 0, 0);
        this.scene.add(this.port);

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
        this.scene.add(this.sun);

        const hemiLight = new HemisphereLight(0xffffbb, 0x080820, 1);
        this.scene.add(hemiLight);
    }

    private _runtime: number;

    get runtime(): number {
        return this._runtime;
    }

    start(game: Game) {
        this.game = game;
    }

    render(renderer: Renderer): void {
        renderer.render(this.scene, this.camera);
    }

    update(dt: number, inputStates: IInputStates): void {
        this._runtime += dt;

        if (this.buttonTimeout >= 0.0) {
            this.buttonTimeout -= dt;
        }

        this.handleControls(<MyInputStates>inputStates);

        const oldPlayerPosition = new Vector3(this.player.position.x, 0, this.player.position.z);
        this.player.update(dt, inputStates);

        const playerPositionDelta = oldPlayerPosition.sub(
            new Vector3(this.player.position.x, 0, this.player.position.z),
        );
        this.camera.position.sub(playerPositionDelta);

        // Move water with camera
        this.waterSurface.position.set(
            this.camera.position.x - GP.CameraOffset.x,
            this.camera.position.y - GP.CameraOffset.y,
            this.camera.position.z - GP.CameraOffset.z,
        );
        this.waterSurface.offset.x -= playerPositionDelta.x / 800.0;
        this.waterSurface.offset.y += playerPositionDelta.z / 800.0;

        // Move sun with player
        this.sun.position.set(
            this.player.position.x + GP.SunPosition.x,
            this.player.position.y + GP.SunPosition.y,
            this.player.position.z + GP.SunPosition.z,
        );

        this.waterTrail.playerRotation = this.player.rotation;
        this.waterTrail.playerPosition = this.player.position;
        this.waterTrail.update();
        this.waterSurface.update(dt);
    }

    /* eslint-disable no-console */
    handleControls(inputStates: MyInputStates) {
        Game.debug(inputStates.toggleRecord);
        if (inputStates.toggleRecord && this.buttonTimeout <= 0.0) {
            console.log('hey');
            this.buttonTimeout += GP.ButtonTimeout;
            this.isRecording = !this.isRecording;

            if (this.isRecording) {

                console.log('Start recording');
                this.stream = this.game.renderer.domElement.captureStream();
                console.log(this.stream);
                this.recordedBlobs = [];

                const options = { mimeType: 'video/webm', videoBitsPerSecond: 4000e3 };
                try {
                    this.mediaRecorder = new MediaRecorder(this.stream, options);

                    this.mediaRecorder.ondataavailable = (event) => {
                        if (event.data && event.data.size > 0) {
                            this.recordedBlobs.push(event.data);
                            Game.debug(this.recordedBlobs.length);
                        }
                    };
                    this.mediaRecorder.start(100); // collect 100ms of data
                    console.log(this.mediaRecorder);
                } catch (e) {
                    console.warn('Unable to create MediaRecorder with options Object: ', e);
                }
            } else {
                console.log('Stop recording');
                this.mediaRecorder.stop();
                const blob = new Blob(this.recordedBlobs, { type: 'video/webm' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `${document.title}_${getFormattedDateTimeString()}.webm`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
            }
        }
    }

    /* eslint-enable no-console */
}
