import { ViewElements } from './Elements';
import { Logger } from 'ts-log';
import { Pomodoro } from '../components/pomodoro';

export class ViewController {
    logger: Logger
    pomodoro: Pomodoro
    constructor(logger: Logger, pomodoro: Pomodoro) {
        this.logger = logger
        this.pomodoro = pomodoro
        ViewElements.btnToggle.addEventListener('activate', this.onToggleButtonPressed.bind(this))
    }

    onToggleButtonPressed(event: MouseEvent) {
        if (this.pomodoro.isRunning()) {
            this.pomodoro.stop()
        } else {
            this.pomodoro.start()
        }
    }
}