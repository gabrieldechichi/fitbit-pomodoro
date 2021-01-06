import { Clock, ClockGranularity } from "../../fitbit-modules/clock/clock";
import { ViewElements } from './elements';

export class ClockView {
    clock: Clock

    constructor(clock: Clock) {
        this.clock = clock
        this.clock.registerClockCallback(this.onClockUpdate.bind(this))
    }

    onClockUpdate(date: Date) {
        let hours = date.getHours()
        let amPm = ""

        if (hours < 12) {
            amPm = "AM"
        } else {
            amPm = "PM"
            hours -= 12
        }

        const minutes = date.getMinutes()
        ViewElements.txtClock.text = `${this.zeroPad(hours)}:${this.zeroPad(minutes)} ${amPm}`
    }

    private zeroPad(n: number): string {
        return n < 10 ? "0" + n : n.toString()
    }
}