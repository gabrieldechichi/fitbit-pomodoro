import { Logger } from 'ts-log';
import { Pomodoro, PomodoroSettings } from './pomoevents/components/pomodoro';
import { LoggerFactory } from './pomoevents/components/logger';
import { ViewController } from './pomoevents/view/viewController';
import { AppInput } from './fitbit-modules/input/appInput';
import { Clock, ClockGranularity, TickMode } from './fitbit-modules/clock/clock';
import { AppRuntime } from './fitbit-modules/device/appRuntime';
import { AppDeviceSettings } from './pomoevents/components/appSettings';

export class App {
    logger: Logger
    settings: AppDeviceSettings
    pomodoro: Pomodoro
    clock: Clock
    input: AppInput
    view: ViewController

    constructor() {
        this.logger = LoggerFactory.createLogger()
        this.settings = new AppDeviceSettings()
        this.clock = new Clock(ClockGranularity.Seconds, TickMode.TickOnBackground)
        this.pomodoro = new Pomodoro(this.settings.getSettings().pomoSettings, this.clock, this.logger)
        this.input = new AppInput(this.logger)
        this.view = new ViewController(this.logger, this.pomodoro, this.clock, this.input)

        AppRuntime.setTimeoutEnabled(false)
    }
}
