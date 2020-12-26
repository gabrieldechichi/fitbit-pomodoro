import { Pomodoro, PomodoroSettings } from './pomoevents/components/pomodoro';

class App {
    pomodoro: Pomodoro
    constructor() {
        this.pomodoro = new Pomodoro(PomodoroSettings.getSettings())
        this.pomodoro.start()
        setTimeout(() => {
            console.log("HEEEEERE")
            app.pomodoro.stop()
        }, 5000);
    }
}

const app = new App()
