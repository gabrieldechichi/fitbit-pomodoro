import { Logger } from 'ts-log';
import { Pomodoro } from '../components/pomodoro';
import { PomodoroView } from './pomodoroView';
import { AppInput, EventCalbackResponse, HardwareKeyType } from '../input/app_input';

export class ViewController {
    logger: Logger
    pomodoroView: PomodoroView
    input: AppInput

    constructor(logger: Logger, pomodoro: Pomodoro, input: AppInput) {
        this.logger = logger
        this.pomodoroView = new PomodoroView(logger, pomodoro)
        this.input = input

        this.input.registerHardwareKeyPressedCallback(HardwareKeyType.Back, this.onBackPressed.bind(this))
    }

    onBackPressed(): EventCalbackResponse {
        return EventCalbackResponse.handled
    }
}