import { Logger } from 'ts-log';
import { Clock, ClockGranularity } from '../../fitbit-modules/clock/clock';

export class PomodoroSettings {
    workTimeSeconds: number = 5
    shortBreakTimeSeconds: number = 5
    longBreakTimeSeconds: number = 10
    numberOfSessionsBeforeBreak: number = 2

    static getSettings(): PomodoroSettings {
        return new PomodoroSettings()
    }
}

export enum PomodoroState {
    Idle = "idle",
    Working = "working",
    Resting = "resting",
    Paused = "paused"
}

export interface PomodoroEventListener {
    onStartWorking: () => void
    onStartResting: () => void
    onPaused: () => void
    onResumed: () => void
    onIdle: () => void
    onPomodoroUpdate: () => void
}

export type PomodoroStateEvent = (state: PomodoroState) => void

export class Pomodoro {
    private logger: Logger
    private clock: Clock
    private settings: PomodoroSettings

    private listener: PomodoroEventListener

    //state variables
    private state: PomodoroState
    private previousState: PomodoroState

    private endWorkingTimeMs: number = 0
    private endRestingTimeMs: number = 0

    private remainingWorkingTimeMs: number = -1
    private remainingRestingTimeMs: number = -1

    private workSessionNumber: number = 0
    //end state variables

    constructor(settings: PomodoroSettings, clock: Clock, logger: Logger) {
        this.logger = logger
        this.settings = settings
        this.state = this.previousState = PomodoroState.Idle
        this.clock = clock
        this.clock.registerClockCallback(this.onClockUpdate.bind(this))
    }

    //begin public interface
    public start() {
        if (this.state === PomodoroState.Idle) {
            this.changeState(PomodoroState.Working)
        }
    }

    public stop() {
        if (this.state !== PomodoroState.Idle) {
            this.changeState(PomodoroState.Idle)
        }
    }

    public pause() {
        if (this.isRunning() && this.state !== PomodoroState.Paused) {
            this.changeState(PomodoroState.Paused)
        }
    }

    public resume() {
        if (this.state === PomodoroState.Paused) {
            this.changeState(this.previousState)
        }
    }

    public skip() {
        if (this.state === PomodoroState.Working) {
            this.changeState(PomodoroState.Resting)
        } else if (this.state === PomodoroState.Resting) {
            this.changeState(PomodoroState.Working)
        }
    }

    public isRunning(): boolean {
        return this.state === PomodoroState.Working || this.state === PomodoroState.Resting
    }

    public isPaused(): boolean {
        return this.state === PomodoroState.Paused
    }

    public wasPaused(): boolean {
        return this.previousState === PomodoroState.Paused
    }

    public getState(): PomodoroState {
        return this.state
    }

    public getPreviousState(): PomodoroState {
        return this.previousState
    }

    public getSettings(): PomodoroSettings {
        return this.settings
    }

    public getWorkSessionNumber(): number {
        if (this.workSessionNumber === 0) {
            return 0
        }

        const wrappedWorkSessionNumber = this.workSessionNumber % this.settings.numberOfSessionsBeforeBreak

        if (wrappedWorkSessionNumber === 0 && this.getState() === PomodoroState.Working) {
            return this.settings.numberOfSessionsBeforeBreak
        }

        return wrappedWorkSessionNumber
    }

    public getRemainingTimeMs(): number {
        const now = Date.now()
        let remainingTimeMs = -1
        switch (this.getState()) {
            case PomodoroState.Paused:
                remainingTimeMs = this.getPreviousState() == PomodoroState.Resting ? this.remainingRestingTimeMs : this.remainingWorkingTimeMs
                break
            case PomodoroState.Working:
                remainingTimeMs = this.endWorkingTimeMs - now
                break
            case PomodoroState.Resting:
                remainingTimeMs = this.endRestingTimeMs - now
                break
            case PomodoroState.Idle:
                remainingTimeMs = this.settings.workTimeSeconds * 1000
                break
            default:
                this.logger.warn(`Unexpected Pomdoro State: ${this.getState()}`)
        }

        return remainingTimeMs
    }

    public getTargetSessionTimeForCurrentState(): number {
        const getTargetTimeForWorkOrRest = (state: PomodoroState) => {
            switch (state) {
                case PomodoroState.Working:
                    return this.getSettings().workTimeSeconds * 1000
                    break
                case PomodoroState.Resting:
                    return (this.isInLongBreak() ? this.getSettings().longBreakTimeSeconds : this.getSettings().shortBreakTimeSeconds) * 1000;
                    break
                default:
                    this.logger.warn(`Unexpected State ${state}`)
            }
            return -1
        }

        switch (this.getState()) {
            case PomodoroState.Paused:
                return getTargetTimeForWorkOrRest(this.getPreviousState())
            case PomodoroState.Idle:
                return getTargetTimeForWorkOrRest(PomodoroState.Working)
            case PomodoroState.Working:
            case PomodoroState.Resting:
                return getTargetTimeForWorkOrRest(this.getState())
            default:
                this.logger.warn(`Unexpected State ${this.getState()}`)
        }

        return -1
    }

    public isInLongBreak(): boolean {
        return this.getState() === PomodoroState.Resting && this.getWorkSessionNumber() === 0
    }

    public registerListener(listener: PomodoroEventListener) {
        this.listener = listener
    }
    //end public interface

    private changeState(newState: PomodoroState) {
        const setNewState = (processEnterState: () => void) => {
            this.previousState = this.state
            this.state = newState
            processEnterState()
        }

        switch (newState) {
            case PomodoroState.Working:
                if (this.state !== PomodoroState.Working) {
                    setNewState(this.onEnterState_Working.bind(this))
                }
                break
            case PomodoroState.Idle:
                if (this.state !== PomodoroState.Idle) {
                    setNewState(this.onEnterState_Idle.bind(this))
                }
                break
            case PomodoroState.Resting:
                if (this.state !== PomodoroState.Resting) {
                    setNewState(this.onEnterState_Resting.bind(this))
                }
                break
            case PomodoroState.Paused:
                if (this.state !== PomodoroState.Paused) {
                    setNewState(this.onEnterState_Paused.bind(this))
                }
                break
            default:
                this.logger.warn(`Unexpected state:  ${newState}`)
        }
    }

    private onClockUpdate(date: Date) {
        switch (this.state) {
            case PomodoroState.Working:
                this.onStateUpdate_Working()
                break
            case PomodoroState.Resting:
                this.onStateUpdate_Resting()
                break
            case PomodoroState.Paused:
                this.onStateUpdate_Paused()
                break
            case PomodoroState.Idle:
                this.onStateUpdate_Idle()
                break
            default:
                this.logger.warn(`Unexpected state: ${this.state}`)
        }

        this.listener.onPomodoroUpdate()
    }

    ///////
    private onEnterState_Working() {
        const workTimeMs = this.remainingWorkingTimeMs < 0 ? this.settings.workTimeSeconds * 1000 : this.remainingWorkingTimeMs
        this.endWorkingTimeMs = Date.now() + workTimeMs
        this.remainingWorkingTimeMs = -1

        if (this.wasPaused()) {
            this.listener.onResumed()
        } else {
            ++this.workSessionNumber
            this.listener.onStartWorking()
        }
    }

    private onStateUpdate_Working() {
        this.logger.debug(`Remaining work time ${(this.endWorkingTimeMs - Date.now()) / 1000}`)
        const now = Date.now()
        if (now >= this.endWorkingTimeMs) {
            this.changeState(PomodoroState.Resting)
        }
    }
    //////

    /////
    private onEnterState_Resting() {
        let breakTimeMs = this.remainingRestingTimeMs
        if (breakTimeMs < 0) {
            breakTimeMs = this.isInLongBreak()
                ? this.settings.longBreakTimeSeconds
                : this.settings.shortBreakTimeSeconds
            breakTimeMs *= 1000
        }

        this.endRestingTimeMs = Date.now() + breakTimeMs
        this.remainingRestingTimeMs = -1

        if (this.wasPaused()) {
            this.listener.onResumed()
        } else {
            this.listener.onStartResting()
        }
    }

    private onStateUpdate_Resting() {
        this.logger.debug(`Remaining REST time ${(this.endRestingTimeMs - Date.now()) / 1000}`)
        const now = Date.now()
        if (now >= this.endRestingTimeMs) {
            this.changeState(PomodoroState.Working)
        }
    }
    /////

    /////
    private onEnterState_Idle() {
        this.logger.debug("Entering Idle state!")
        this.workSessionNumber = 0
        this.remainingRestingTimeMs = -1
        this.remainingWorkingTimeMs = -1
        this.endWorkingTimeMs = 0
        this.endRestingTimeMs = 0

        this.listener.onIdle()
    }

    private onStateUpdate_Idle() {
        this.logger.debug("Idle state update!")
    }
    /////

    /////
    private onEnterState_Paused() {
        this.logger.debug("Entering Paused state")
        const now = Date.now()
        this.remainingWorkingTimeMs = this.endWorkingTimeMs - now
        this.remainingRestingTimeMs = this.endRestingTimeMs - now

        this.listener.onPaused()
    }

    private onStateUpdate_Paused() {
        this.logger.debug("Paused state update")
    }
    /////
}