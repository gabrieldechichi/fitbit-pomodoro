import { Pomodoro, PomodoroSettings, PomodoroState } from '../../../app/pomoevents/components/pomodoro';
import { Clock, ClockGranularity, ClockTickEvent } from '../../../app/fitbit-modules/clock/clock';
import { Logger } from 'ts-log';
import { createMock } from "ts-auto-mock"
import { On, method } from "ts-auto-mock/extension"
import { EventEmitter } from '../../../app/common/eventEmitter';

let pomodoro: Pomodoro = null
let pomodoroSettings: PomodoroSettings = null
let clock: Clock = null
let logger: Logger = null
const realDate = global.Date.now

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

afterAll(() => {
    global.Date.now = realDate
})

describe('initialization', () => {
    test('should subcribe to clock', () => {
        const mockedMethod = On(clock).get(method(c => c.registerClockCallback))
        expect(mockedMethod).toHaveBeenCalled()
    })
})

describe('state control', () => {
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
        expect(pomodoro.getState()).toBe(PomodoroState.Idle)
    })
})

describe('state transition', () => {
    let eventEmitter: EventEmitter<Record<string, Date>> = null

    beforeAll(() => {
        eventEmitter = new EventEmitter()
        const mockedMethod = On(clock).get(method(c => c.registerClockCallback))
        mockedMethod.mockImplementation(jest.fn((callback: ClockTickEvent) => {
            if (eventEmitter) {
                eventEmitter.addEventListener('tick', callback)
            }
        }))
    })

    afterAll(() => {
        const mockedMethod = On(clock).get(method(c => c.registerClockCallback))
        mockedMethod.mockClear()
    })

    afterEach(() => {
        eventEmitter = new EventEmitter()
    })

    test('switch to Resting when Working is done', () => {
        let now = realDate()
        global.Date.now = () => now

        pomodoro.start()
        expect(pomodoro.getState()).toBe(PomodoroState.Working)

        now += pomodoroSettings.workTimeSeconds * 1000 * 0.5
        eventEmitter.emit('tick', null)
        expect(pomodoro.getState()).toBe(PomodoroState.Working)

        now += pomodoroSettings.workTimeSeconds * 1000 * 0.5
        eventEmitter.emit('tick', null)
        expect(pomodoro.getState()).toBe(PomodoroState.Resting)
    })
})
