import clock, { TickEvent } from "clock"
import { Delegate } from '../../common/delegate';

export enum ClockGranularity {
    Off = 'off',
    Seconds = 'seconds',
    Minutes = 'minutes',
    Hours = 'hours'
}

export type ClockTickEvent = (date: Date) => void

/**
 * Clock core class
 */
export class Clock {
    clockCallbacks: Delegate<Date>

    constructor(granularity: ClockGranularity) {
        clock.granularity = granularity;
        clock.addEventListener("tick", this.onTick.bind(this))
        this.clockCallbacks = new Delegate<Date>()
    }

    public registerClockCallback(callback: ClockTickEvent) {
        this.clockCallbacks.addEventListener(callback)
    }

    public deregisterClockCallback(callback: ClockTickEvent) {
        this.clockCallbacks.removeEventListener(callback)
    }

    private onTick(event: TickEvent) {
        this.clockCallbacks.emit(event.date)
    }
}
