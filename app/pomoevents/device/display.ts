import { display } from "display";

export class Display {
    public static poke() {
        display.poke()
        display.on = true
    }

    public static isOn(): boolean {
        return display.on
    }
}
