import { Pomodoro, PomodoroSettings } from './pomoevents/components/pomodoro';

class App {
    pomodoro: Pomodoro
    constructor() {
        this.pomodoro = new Pomodoro(PomodoroSettings.getSettings())
        this.pomodoro.start()
    }
}

const app = new App()
