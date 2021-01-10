import { Pomodoro, PomodoroSettings, PomodoroState } from '../../../app/pomoevents/components/pomodoro';
import { Clock, ClockGranularity, ClockTickEvent } from '../../../app/fitbit-modules/clock/clock';
import { Logger } from 'ts-log';
import { createMock } from "ts-auto-mock"
import { On, method } from "ts-auto-mock/extension"
import { Delegate } from '../../../app/common/delegate';

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

describe('initialization should', () => {
    test('subcribe to clock', () => {
        const mockedMethod = On(clock).get(method(c => c.registerClockCallback))
        expect(mockedMethod).toHaveBeenCalled()
    })
})

describe('state control should', () => {
    test('begins in Idle state', () => {
        expect(pomodoro.getState()).toBe(PomodoroState.Idle)
        // const mockMethod = On(clock).get(method(mock => mock['onTick']))
    })

    test('switch from Idle to Working', () => {
        expect(pomodoro.getState()).toBe(PomodoroState.Idle)
        pomodoro.start()
        expect(pomodoro.getState()).toBe(PomodoroState.Working)
    })

    test('switch from Working to Idle', () => {
        pomodoro.start()
        expect(pomodoro.getState()).toBe(PomodoroState.Working)
        pomodoro.stop()
        expect(pomodoro.getState()).toBe(PomodoroState.Idle)
    })
})

describe('state transition should', () => {
    let delegate: Delegate<Date> = null
    let now: number

    beforeAll(() => {
        global.Date.now = () => now
        delegate = new Delegate()
        const mockedMethod = On(clock).get(method(c => c.registerClockCallback))
        mockedMethod.mockImplementation(jest.fn((callback: ClockTickEvent) => {
            if (delegate) {
                delegate.addEventListener(callback)
            }
        }))
    })

    afterAll(() => {
        const mockedMethod = On(clock).get(method(c => c.registerClockCallback))
        mockedMethod.mockClear()
    })

    beforeEach(() => {
        now = realDate()
    })

    afterEach(() => {
        delegate = new Delegate()
    })

    test('switch to Resting when Working is done', () => {
        pomodoro.start()
        expect(pomodoro.getState()).toBe(PomodoroState.Working)

        now += pomodoroSettings.workTimeSeconds * 1000 * 0.5
        delegate.emit(null)
        expect(pomodoro.getState()).toBe(PomodoroState.Working)

        now += pomodoroSettings.workTimeSeconds * 1000 * 0.5
        delegate.emit(null)
        expect(pomodoro.getState()).toBe(PomodoroState.Resting)
    })

    test('switch to Working when ShortBreak is done', () => {
        pomodoro.start()
        pomodoro.skip()
        expect(pomodoro.getState()).toBe(PomodoroState.Resting)

        now += pomodoroSettings.shortBreakTimeSeconds * 1000 * 0.5
        delegate.emit(null)
        expect(pomodoro.getState()).toBe(PomodoroState.Resting)

        now += pomodoroSettings.shortBreakTimeSeconds * 1000 * 0.5
        delegate.emit(null)
        expect(pomodoro.getState()).toBe(PomodoroState.Working)
    })

    test('switch to Work after Long Break is done', () => {
        pomodoro.start()
        while (!pomodoro.isInLongBreak()) {
            pomodoro.skip()
        }

        now += pomodoroSettings.longBreakTimeSeconds * 1000 * 0.5
        delegate.emit(null)
        expect(pomodoro.getState()).toBe(PomodoroState.Resting)
        expect(pomodoro.isInLongBreak()).toBe(true)

        now += pomodoroSettings.longBreakTimeSeconds * 1000 * 0.5
        delegate.emit(null)
        expect(pomodoro.getState()).toBe(PomodoroState.Working)
    })

    test('switch to LongBreak after enough work session', () => {
        pomodoro.start()
        expect(pomodoro.getState()).toBe(PomodoroState.Working)
        for (let i = 0; i <= pomodoroSettings.numberOfSessionsBeforeBreak; i++) {
            now += pomodoroSettings.workTimeSeconds * 1000
            delegate.emit(null)

            if (i < pomodoroSettings.numberOfSessionsBeforeBreak) {
                now += pomodoroSettings.shortBreakTimeSeconds * 1000
                delegate.emit(null)
            }
        }

        expect(pomodoro.getState()).toBe(PomodoroState.Resting)
        expect(pomodoro.isInLongBreak()).toBe(true)
    })
})
