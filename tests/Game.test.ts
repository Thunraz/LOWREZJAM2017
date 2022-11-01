import { mock } from 'jest-mock-extended';
import { Game } from '../src/lib/Game';
import { IInputManager } from '../src/lib/IInputManager';
import { IGameState } from '../src/lib/IGameState';
import { Vector2 } from 'three';

jest.mock('three', () => ({
    Vector2: class Vector2 {

    },
    WebGLRenderer: class WebGLRenderer {
        public shadowMap = {
            enabled: true
        };

        public domElement: HTMLElement = document.createElement('canvas');

        public setPixelRatio(): void {
            return;
        }

        public setSize(): void {
            return;
        }
    }
}));

// beforeAll(() => { });

describe('Game', () => {
    let rafSpy;
    beforeEach(() => {
        jest.useFakeTimers();

        rafSpy = jest.spyOn(window, 'requestAnimationFrame')
            .mockImplementation(_ => (1));
    });

    afterEach(() => {
        rafSpy.mockRestore();
        jest.clearAllTimers();
    });

    test('instance can be constructed', () => {
        const gameElement = document.createElement('div');
        const debugElement = document.createElement('div');
        const resolution = new Vector2(800, 600);
        const inputManager = mock<IInputManager>();
        const gameState = mock<IGameState>();

        expect(new Game(gameElement, debugElement, resolution, inputManager, gameState))
            .toBeDefined();
    });

    test('instance starts', () => {
        const gameElement = document.createElement('div');
        const debugElement = document.createElement('div');
        const resolution = new Vector2(800, 600);
        const inputManager = mock<IInputManager>();
        const gameState = mock<IGameState>();

        const game = new Game(gameElement, debugElement, resolution, inputManager, gameState);
        game.start();
        expect(gameState.start)
            .toBeCalled();
        expect(window.requestAnimationFrame)
            .toBeCalled();
    });

    test('static function Game.debug() exists', () => {
        expect(Game.debug)
            .toBeInstanceOf(Function);
    });
});
