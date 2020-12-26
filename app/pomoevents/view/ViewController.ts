import { ViewElements } from './elements';
import { Logger } from 'ts-log';
import { Pomodoro } from '../components/pomodoro';
import { PomodoroView } from './pomodoroView';

export class ViewController {
    logger: Logger
    pomodoroView: PomodoroView

    constructor(logger: Logger, pomodoro: Pomodoro) {
        this.logger = logger
        this.pomodoroView = new PomodoroView(logger, pomodoro)
    }
}