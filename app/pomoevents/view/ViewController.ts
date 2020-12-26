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
        ViewElements.btnSkip.addEventListener('activate', this.onSkipButtonPressed.bind(this))
        ViewElements.btnReset.addEventListener('activate', this.onResetButtonPressed.bind(this))
    }

    onToggleButtonPressed(event: MouseEvent) {
        if (this.pomodoro.isRunning()) {
            this.pomodoro.pause()
        } else if (this.pomodoro.isPaused()) {
            this.pomodoro.resume()
        } else {
            this.pomodoro.start()
        }
    }

    onSkipButtonPressed(event: MouseEvent) {

    }

    onResetButtonPressed(event: MouseEvent) {
        this.pomodoro.stop()
    }
}