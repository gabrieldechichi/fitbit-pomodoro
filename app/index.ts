import { Logger } from 'ts-log';
import { Pomodoro, PomodoroSettings } from './pomoevents/components/pomodoro';
import { LoggerFactory } from './pomoevents/components/logger';

class App {
    pomodoro: Pomodoro
    logger: Logger
    constructor() {
        this.logger = LoggerFactory.createLogger()
        this.pomodoro = new Pomodoro(PomodoroSettings.getSettings(), this.logger)
        this.pomodoro.start()
    }
}

const app = new App()
