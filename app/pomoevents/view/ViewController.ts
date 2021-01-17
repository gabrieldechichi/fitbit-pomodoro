import { Logger } from 'ts-log';
import { Pomodoro, PomodoroState } from '../components/pomodoro';
import { PomodoroView } from './pomodoroView';
import { AppInput, EventCalbackResponse, HardwareKeyType } from '../../fitbit-modules/input/appInput';
import { PanoramaViewController } from '../../fitbit-modules/panorama/panoramaView';
import { ExitAppView } from './exitAppView';
import { ClockView } from './clockView';
import { Clock } from '../../fitbit-modules/clock/clock';
import { SettingsView } from './settingsView';

export enum AppPanoramaViews {
    Close = 0,
    Pomodoro = 1,
    Settings = 2
}

export class ViewController extends PanoramaViewController {
    private static readonly PanoramaId: string = "mypano"
    private static readonly ContainerId: string = "container"

    logger: Logger
    pomodoroView: PomodoroView
    clockView: ClockView
    input: AppInput

    //We don't declare a constructor for pomodoro because we're creating a custom one
    panoramaConstructors = {
        [AppPanoramaViews.Close]: ExitAppView
    }

    constructor(logger: Logger, pomodoro: Pomodoro, clock: Clock, input: AppInput) {
        super(ViewController.PanoramaId, ViewController.ContainerId)
        this.logger = logger

        this.input = input
        this.input.registerHardwareKeyPressedCallback(HardwareKeyType.Back, this.onBackPressed.bind(this))
        this.input.registerHardwareKeyPressedCallback(HardwareKeyType.Up, this.onUpOrDownButtonPressed.bind(this))
        this.input.registerHardwareKeyPressedCallback(HardwareKeyType.Down, this.onUpOrDownButtonPressed.bind(this))

        this.clockView = new ClockView(clock)

        //Create pomodoro view
        const pomodoroPanoramaItem = this.items[AppPanoramaViews.Pomodoro]
        this.pomodoroView = new PomodoroView(logger, pomodoro, pomodoroPanoramaItem, this)
        this.panoramaObjects[AppPanoramaViews.Pomodoro] = this.pomodoroView

        //Create settings view
        const settingsItem = this.items[AppPanoramaViews.Settings]
        this.panoramaObjects[AppPanoramaViews.Settings] = new SettingsView(pomodoro.getSettings(), settingsItem, this)

        this.show(AppPanoramaViews.Pomodoro)
    }

    onUpOrDownButtonPressed(): EventCalbackResponse {
        if (this.getCurrentView() != this.pomodoroView) {
            setTimeout(() => {
                this.show(AppPanoramaViews.Pomodoro)
            }, 10);
        }
        return EventCalbackResponse.handled
    }

    onBackPressed(): EventCalbackResponse {
        this.scroll(-1)
        return EventCalbackResponse.handled
    }
}
