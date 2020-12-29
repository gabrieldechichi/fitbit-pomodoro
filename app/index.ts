import { Logger } from 'ts-log';
import { Pomodoro, PomodoroSettings } from './pomoevents/components/pomodoro';
import { LoggerFactory } from './pomoevents/components/logger';
import { ViewController } from './pomoevents/view/viewController';
import { AppInput } from './pomoevents/input/appInput';

class App {
    logger: Logger
    pomodoro: Pomodoro
    input: AppInput
    view: ViewController

    constructor() {
        this.logger = LoggerFactory.createLogger()
        this.pomodoro = new Pomodoro(PomodoroSettings.getSettings(), this.logger)
        this.input = new AppInput(this.logger)
        this.view = new ViewController(this.logger, this.pomodoro, this.input)
    }
}

const app = new App()
