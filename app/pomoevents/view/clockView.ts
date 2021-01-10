import { Clock, ClockGranularity } from "../../fitbit-modules/clock/clock";
import { ViewElements } from './elements';

export class ClockView {
    clock: Clock
    private static months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"];

    constructor(clock: Clock) {
        this.clock = clock
        this.clock.registerClockCallback(this.onClockUpdate.bind(this))
    }

    onClockUpdate(date: Date) {
        let hours = date.getHours()
        let amPm = ""

        if (hours < 12) {
            amPm = "AM"
            if (hours === 12) {
                hours -= 12
            }
        } else {
            amPm = "PM"
            if (hours !== 12) {
                hours -= 12
            }
        }

        const minutes = date.getMinutes()
        ViewElements.txtClock.text = `${this.zeroPad(hours)}:${this.zeroPad(minutes)} ${amPm}`

        ViewElements.txtCalendarDay.text = `${date.getDate()}`
        ViewElements.txtCalendarMonth.text = `${ClockView.months[date.getMonth()]}`
    }

    private zeroPad(n: number): string {
        return n < 10 ? "0" + n : n.toString()
    }
}
