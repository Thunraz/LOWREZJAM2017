import { Vector2, Vector3 } from 'three';

export class GameProperties {
    //*
    static get GameResolution(): Vector2 {
        return new Vector2(900, 900);
    }

    /*/
    static get GameResolution(): Vector2 {
        return new Vector2(64, 64);
    }

    //*/

    static get CameraOffset(): Vector3 {
        return new Vector3(0, 200, 100);
    }

    static get ButtonTimeout(): number {
        return 0.25;
    }

    static get SunPosition(): Vector3 {
        return new Vector3(300, 500, 500);
    }

    static get PlayerAcceleration(): number {
        return 0.003;
    }

    static get PlayerTurnSpeed(): number {
        return 0.003;
    }
}
