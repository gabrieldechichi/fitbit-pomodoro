import { Logger } from 'ts-log';
import { Pomodoro } from '../components/pomodoro';
import { PomodoroView } from './pomodoroView';
import { AppInput, EventCalbackResponse, HardwareKeyType } from '../input/appInput';
import { PanoramaViewController } from '../../fitbit-modules/panorama/panoramaView';
import { ExitAppView } from './exitAppView';
import { ClockView } from './clockView';
import { Clock } from '../../fitbit-modules/clock/clock';

enum AppPanoramaViews {
    Close = 0,
    Pomodoro = 1
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

        this.clockView = new ClockView(clock)

        //Create pomodoro view
        const pomodoroPanoramaItem = this.items[AppPanoramaViews.Pomodoro]
        this.pomodoroView = new PomodoroView(logger, pomodoro, pomodoroPanoramaItem)
        this.panoramaObjects[AppPanoramaViews.Pomodoro] = this.pomodoroView

        this.show(AppPanoramaViews.Pomodoro)
    }

    onBackPressed(): EventCalbackResponse {
        this.show(AppPanoramaViews.Close)
        return EventCalbackResponse.handled
    }
}