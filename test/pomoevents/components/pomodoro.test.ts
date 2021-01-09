import { Pomodoro, PomodoroSettings, PomodoroState } from '../../../app/pomoevents/components/pomodoro';
import { Clock } from '../../../app/fitbit-modules/clock/clock';
import { Logger } from 'ts-log';
import { createMock } from "ts-auto-mock"
import { On, method } from "ts-auto-mock/extension";

let pomodoro: Pomodoro = null
let pomodoroSettings: PomodoroSettings = null
let clock: Clock = null
let logger: Logger = null

beforeAll(() => {
    clock = createMock<Clock>()
    logger = createMock<Logger>()
    pomodoroSettings = {
        workTimeSeconds: 1,
        shortBreakTimeSeconds: 1,
        longBreakTimeSeconds: 1,
        numberOfSessionsBeforeBreak: 1
    }
})

beforeEach(() => {
    pomodoro = new Pomodoro(pomodoroSettings, clock, logger)
})

describe('state transition', () => {
    test('begins in Idle state', () => {
        expect(pomodoro.getState()).toBe(PomodoroState.Idle)
        // const mockMethod = On(clock).get(method(mock => mock['onTick']))
    })

    test('switches from Idle to Working', () => {
        expect(pomodoro.getState()).toBe(PomodoroState.Idle)
        pomodoro.start()
        expect(pomodoro.getState()).toBe(PomodoroState.Working)
    })

    test('switches from Working to Idle', () => {
        pomodoro.start()
        expect(pomodoro.getState()).toBe(PomodoroState.Working)
        pomodoro.stop()
        expect(pomodoro.getState()).toBe(PomodoroState.Paused)
    })
})