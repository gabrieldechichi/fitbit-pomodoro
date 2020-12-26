import { Clock, ClockGranularity } from './clock';

export class PomodoroSettings {
    workTimeSeconds: number = 2
    shortBreakTimeSeconds: number = 2
    longBreakTimeSeconds: number = 5
    numberOfSessionsBeforeBreak: number = 2

    static getSettings(): PomodoroSettings {
        return new PomodoroSettings()
    }
}

enum PomodoroState {
    Idle = "Idle",
    Working = "running",
    Resting = "resting"
}

export class Pomodoro {
    private clock: Clock
    private settings: PomodoroSettings
    private state: PomodoroState

    private endWorkingTimeMs: number = 0
    private endRestingTimeMs: number = 0
    private finishedSessions: number = 0

    constructor(settings: PomodoroSettings) {
        this.settings = settings
        this.state = PomodoroState.Idle
        this.clock = new Clock(ClockGranularity.Seconds, this.onClockUpdate.bind(this))
    }

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

    private changeState(newState: PomodoroState) {
        switch (newState) {
            case PomodoroState.Working:
                if (this.state !== PomodoroState.Working) {
                    this.state = PomodoroState.Working
                    this.onEnterState_Working()
                }
                break
            case PomodoroState.Idle:
                if (this.state !== PomodoroState.Idle) {
                    this.state = PomodoroState.Idle
                    this.onEnterState_Idle()
                }
                break
            case PomodoroState.Resting:
                if (this.state !== PomodoroState.Resting) {
                    this.state = PomodoroState.Resting
                    this.onEnterState_Resting()
                }
                break
            default:
                console.log("Unexpected state: " + newState)
        }
    }

    ///////
    private onEnterState_Working() {
        this.endWorkingTimeMs = Date.now() + this.settings.workTimeSeconds * 1000
    }

    private onStateUpdate_Working() {
        console.log("Remaining work time " + (this.endWorkingTimeMs - Date.now()) / 1000)
        const now = Date.now()
        if (now >= this.endWorkingTimeMs) {
            ++this.finishedSessions
            this.changeState(PomodoroState.Resting)
        }
    }
    //////

    /////
    private onEnterState_Resting() {
        console.log("-->" + this.finishedSessions + ", " + this.settings.numberOfSessionsBeforeBreak + ", " + this.finishedSessions % this.settings.numberOfSessionsBeforeBreak)
        const breakTimeSeconds = this.finishedSessions % this.settings.numberOfSessionsBeforeBreak === 0
            ? this.settings.longBreakTimeSeconds
            : this.settings.shortBreakTimeSeconds

        this.endRestingTimeMs = Date.now() + breakTimeSeconds * 1000
    }

    private onStateUpdate_Resting() {
        console.log("Remaining REST time " + (this.endRestingTimeMs - Date.now()) / 1000)
        const now = Date.now()
        if (now >= this.endRestingTimeMs) {
            this.changeState(PomodoroState.Working)
        }
    }
    /////

    private onEnterState_Idle() {
        console.log("Entering Idle state!")
    }

    private onStateUpdate_Idle() {
        console.log("Idle state update!")
    }

    private onClockUpdate(date: Date) {
        switch (this.state) {
            case PomodoroState.Working:
                this.onStateUpdate_Working()
                break
            case PomodoroState.Resting:
                this.onStateUpdate_Resting()
                break
            case PomodoroState.Idle:
                this.onStateUpdate_Idle()
                break
            default:
                console.log("Unexpected state: " + this.state)
        }
    }
}