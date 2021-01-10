import clock, { TickEvent } from "clock"
import { Delegate } from '../../common/delegate';

export enum ClockGranularity {
    Off = 'off',
    Seconds = 'seconds',
    Minutes = 'minutes',
    Hours = 'hours'
}

export enum TickMode {
    OnlyWhenDisplayIsOn = 0,
    TickOnBackground
}

export type ClockTickEvent = (date: Date) => void

/**
 * Clock core class
 */
export class Clock {
    clockCallbacks: Delegate<Date>
    timeoutRoutine: number
    date: Date

    constructor(granularity: ClockGranularity, tickMode: TickMode = TickMode.OnlyWhenDisplayIsOn) {
        if (tickMode === TickMode.TickOnBackground) {
            clock.granularity = ClockGranularity.Off
            clock.ontick = null
            this.date = new Date()
            this.timeoutRoutine = setInterval(
                this.onIntervalTick.bind(this),
                this.getTimeoutForGranularity(granularity));
        } else {
            clock.granularity = granularity;
            clock.addEventListener("tick", this.onFitbitClockTick.bind(this))
        }
        this.clockCallbacks = new Delegate<Date>()
    }

    public registerClockCallback(callback: ClockTickEvent) {
        this.clockCallbacks.addEventListener(callback)
    }

    public deregisterClockCallback(callback: ClockTickEvent) {
        this.clockCallbacks.removeEventListener(callback)
    }

    private onFitbitClockTick(event: TickEvent) {
        this.onTick(event.date)
    }

    private onIntervalTick() {
        this.date.setTime(Date.now())
        this.onTick(this.date)
    }

    private onTick(date: Date) {
        this.clockCallbacks.emit(date)
    }

    private getTimeoutForGranularity(granularity: ClockGranularity): number {
        switch (granularity) {
            case ClockGranularity.Hours:
                return 1000 * 60 * 60
            case ClockGranularity.Minutes:
                return 1000 * 60
            case ClockGranularity.Seconds:
                return 1000
        }

        throw new Error(`Unexpected granularity: ${granularity}`)
    }
}
