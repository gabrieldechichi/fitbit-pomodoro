import { Logger } from 'ts-log';
import { Pomodoro, PomodoroSettings } from './pomoevents/components/pomodoro';
import { LoggerFactory } from './pomoevents/components/logger';
import { ViewController } from './pomoevents/view/viewController';

class App {
    logger: Logger
    pomodoro: Pomodoro
    view: ViewController

    constructor() {
        this.logger = LoggerFactory.createLogger()
        this.pomodoro = new Pomodoro(PomodoroSettings.getSettings(), this.logger)
        this.view = new ViewController(this.logger, this.pomodoro)
    }
}

const app = new App()
