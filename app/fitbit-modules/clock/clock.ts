import clock, { TickEvent } from "clock"

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
    clockCallbacks: ClockTickEvent[] = []

    constructor(granularity: ClockGranularity) {
        clock.granularity = granularity;
        clock.addEventListener("tick", this.onTick.bind(this))
    }

    public registerClockCallback(callback: ClockTickEvent) {
        this.clockCallbacks[this.clockCallbacks.length] = callback
    }

    public deregisterClockCallback(callback: ClockTickEvent) {
        this.clockCallbacks.splice(this.clockCallbacks.indexOf(callback), 1)
    }

    private onTick(event: TickEvent) {
        for (let i = 0; i < this.clockCallbacks.length; i++) {
            const callback = this.clockCallbacks[i];
            if (callback) {
                callback(event.date)
            }
        }
    }
}