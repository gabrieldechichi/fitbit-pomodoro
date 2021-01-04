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
    clockCallback: ClockTickEvent

    constructor(granularity: ClockGranularity, callback: ClockTickEvent) {
        clock.granularity = granularity;
        this.clockCallback = callback;
        clock.addEventListener("tick", this.onTick.bind(this))
    }

    private onTick(event: TickEvent) {
        if (this.clockCallback) {
            this.clockCallback(event.date)
        }
    }
}