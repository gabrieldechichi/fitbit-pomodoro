import { Pomodoro, PomodoroState, PomodoroStateEvent, PomodoroEventListener } from '../components/pomodoro';
import { Logger } from 'ts-log';
import { ViewElements } from './elements';
import { ClockFormatter, ClockFormatterSettings } from './clockFormatter';
import { Hapitcs, VibrationPattern } from '../device/hapitcs';
import { PanoramaView } from '../../fitbit-modules/panorama/panorama-view';

class ButtonIcon {
    icon: string
    iconPressed: string

    constructor(icon: string, iconPressed: string) {
        this.icon = icon
        this.iconPressed = iconPressed
    }
}

class ControlIcons {
    private static pause: string = 'icons/pause.png'
    private static pausePressed: string = 'icons/pause.png'
    private static play: string = 'icons/play.png'
    private static playPressed: string = 'icons/play_press.png'

    static PauseButton: ButtonIcon = new ButtonIcon(ControlIcons.pause, ControlIcons.pausePressed)
    static PlayButton: ButtonIcon = new ButtonIcon(ControlIcons.play, ControlIcons.playPressed)
}

export class PomodoroView extends PanoramaView implements PomodoroEventListener {
    private logger: Logger
    private pomodoro: Pomodoro
    private clockFormatter: ClockFormatter
    private hapitcs: Hapitcs
    private isSkipping: boolean = false

    constructor(logger: Logger, pomodoro: Pomodoro, panoramaItem: Element) {
        super(panoramaItem)
        this.logger = logger
        this.pomodoro = pomodoro
        this.clockFormatter = new ClockFormatter(ClockFormatterSettings.getSettings())
        this.hapitcs = new Hapitcs()

        this.pomodoro.registerListener(this)

        ViewElements.txtPomodoroSessionsCounter.onanimationend
        ViewElements.btnToggle.addEventListener('activate', this.onToggleButtonPressed.bind(this))
        ViewElements.btnSkip.addEventListener('activate', this.onSkipButtonPressed.bind(this))
        ViewElements.btnReset.addEventListener('activate', this.onResetButtonPressed.bind(this))

        this.updateElements(this.pomodoro.getState())
    }

    private playVibration(pattern: VibrationPattern, count: number) {
        const isTransitioningFromWorkOrRest = [PomodoroState.Working, PomodoroState.Resting].indexOf(this.pomodoro.getPreviousState()) >= 0
        if (isTransitioningFromWorkOrRest && !this.isSkipping) {
            this.hapitcs.playVibration(pattern, count)
        }
    }

    //Callbacks
    onStartWorking() {
        this.playVibration(VibrationPattern.Alert, 2)
        this.updateElements(this.pomodoro.getState())
        this.setIsSkipping(false)
    }

    onStartResting() {
        this.playVibration(VibrationPattern.Alert, 2)
        this.updateElements(this.pomodoro.getState())
        this.setIsSkipping(false)
    }

    onPaused() {
        this.updateElements(this.pomodoro.getState())

        const previousStateColor = this.getColorForState(this.pomodoro.getPreviousState())
        ViewElements.txtPomodoroSessionsCounter.getElement().style.fill = previousStateColor
        ViewElements.txtPomodoroTime.getElement().style.fill = previousStateColor
    }

    onResumed() {
        this.updateElements(this.pomodoro.getState())
    }

    onIdle() {
        this.updateElements(this.pomodoro.getState())
    }

    onPomodoroUpdate() {
        //Update arc
        const remainingTimeMs = this.pomodoro.getRemainingTimeMs()
        this.clockFormatter.setMilliSeconds(remainingTimeMs)
        ViewElements.txtPomodoroTime.getElement().text = this.clockFormatter.toString()

        const targetTime = this.pomodoro.getTargetSessionTimeForCurrentState()

        ViewElements.arcPomodoroProgress.getElement().sweepAngle = Math.ceil(((targetTime - remainingTimeMs) / targetTime) * 360)
    }
    //End callbacks

    //Control callbacks
    private onToggleButtonPressed(event: MouseEvent) {
        if (this.pomodoro.isRunning()) {
            this.pomodoro.pause()
        } else if (this.pomodoro.isPaused()) {
            this.pomodoro.resume()
        } else {
            this.pomodoro.start()
        }
    }

    private onSkipButtonPressed(event: MouseEvent) {
        this.setIsSkipping(true)
        this.pomodoro.skip()
    }

    private onResetButtonPressed(event: MouseEvent) {
        this.pomodoro.stop()
    }
    //End Control callbacks

    private updateElements(state: PomodoroState) {
        //Update colors
        const color = this.getColorForState(state)
        ViewElements.txtPomodoroSessionsCounter.getElement().style.fill = color
        ViewElements.txtPomodoroTime.getElement().style.fill = color
        ViewElements.arcPomodoroProgress.getElement().style.fill = color

        //Update button icons
        const playPauseIcon = this.getToggleButtonIconForState(state)
        ViewElements.btnToggle_ActiveIcon.setImage(playPauseIcon.icon)
        ViewElements.btnToggle_PressedIcon.setImage(playPauseIcon.iconPressed)

        //Update sessions count
        const sessionsToLongBreak = this.pomodoro.getSettings().numberOfSessionsBeforeBreak
        const remainingSessionsToLongBreak = this.pomodoro.getWorkSessionNumber()
        ViewElements.txtPomodoroSessionsCounter.getElement().text = `${remainingSessionsToLongBreak}/${sessionsToLongBreak}`

        this.onPomodoroUpdate()
    }

    private getColorForState(state: PomodoroState): string {
        switch (state) {
            case PomodoroState.Working:
                return '#d33b37'
            case PomodoroState.Resting:
                return 'fb-blue'
            case PomodoroState.Paused:
            case PomodoroState.Idle:
                return 'gray'
            default:
                this.logger.warn(`Unexpected Pomodoro State ${state}`)
        }
        return ""
    }

    private getToggleButtonIconForState(state: PomodoroState): ButtonIcon {
        switch (state) {
            case PomodoroState.Working:
            case PomodoroState.Resting:
                return ControlIcons.PauseButton
            case PomodoroState.Paused:
            case PomodoroState.Idle:
                return ControlIcons.PlayButton
            default:
                this.logger.warn(`Unexpected Pomodoro State ${state}`)
        }
        return new ButtonIcon("", "")
    }

    private setIsSkipping(newValue: boolean) {
        this.isSkipping = newValue
    }
}