import { GameProperties } from '../src/GameProperties';
import { Vector2, Vector3 } from 'three';

describe.skip('GameResolution', () => {
    test('GameResolution is a THREE.Vector2', () => {
        expect(GameProperties.GameResolution)
            .toBeInstanceOf(Vector2);
    });

    test('GameResolution x and y are set to a non-zero value', () => {
        expect(GameProperties.GameResolution.x)
            .toBeGreaterThan(0);
        expect(GameProperties.GameResolution.y)
            .toBeGreaterThan(0);
    });
});

describe.skip('CameraOffset', () => {
    test('CameraOffset is a THREE.Vector3', () => {
        expect(GameProperties.CameraOffset)
            .toBeInstanceOf(Vector3);
    });

    test('CameraOffset x, y, and z are set', () => {
        expect(GameProperties.CameraOffset.x)
            .toBeDefined();
        expect(GameProperties.CameraOffset.y)
            .toBeDefined();
        expect(GameProperties.CameraOffset.z)
            .toBeDefined();
    });
});

describe.skip('ButtonTimeout', () => {
    test('ButtonTimeout is a Number', () => {
        expect(GameProperties.ButtonTimeout)
            .toEqual(expect.any(Number));
    });

    test('ButtonTimeout is set to a positive value or zero', () => {
        expect(GameProperties.ButtonTimeout)
            .toBeGreaterThanOrEqual(0);
    });
});

describe.skip('SunPosition', () => {
    test('SunPosition is a THREE.Vector3', () => {
        expect(GameProperties.SunPosition)
            .toBeInstanceOf(Vector3);
    });

    test('SunPosition x, y, and z are set', () => {
        expect(GameProperties.SunPosition.x)
            .toBeDefined();
        expect(GameProperties.SunPosition.y)
            .toBeDefined();
        expect(GameProperties.SunPosition.z)
            .toBeDefined();
    });
});

describe.skip('PlayerAcceleration', () => {
    test('PlayerAcceleration is a Number', () => {
        expect(GameProperties.PlayerAcceleration)
            .toEqual(expect.any(Number));
    });

    test('PlayerAcceleration is set to a positive value or zero', () => {
        expect(GameProperties.PlayerAcceleration)
            .toBeGreaterThanOrEqual(0);
    });
});

describe.skip('PlayerTurnSpeed', () => {
    test('PlayerTurnSpeed is a Number', () => {
        expect(GameProperties.PlayerTurnSpeed)
            .toEqual(expect.any(Number));
    });

    test('PlayerTurnSpeed is set to a positive value or zero', () => {
        expect(GameProperties.PlayerTurnSpeed)
            .toBeGreaterThanOrEqual(0);
    });
});
