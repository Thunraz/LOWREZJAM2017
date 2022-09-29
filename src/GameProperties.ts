import { Vector2, Vector3 } from 'three';

export class GameProperties {
    static get GameResolution(): Vector2 {
        return new Vector2(900, 900);
    }

    static get CameraOffset(): Vector3 {
        return new Vector3(0, 200, 100);
    }

    static get SunPosition() {
        return new Vector3(300, 500, 500);
    }

    static get PlayerAcceleration() {
        return 1.0;
    }

    static get PlayerTurnSpeed() {
        return 1.0;
    }
}
