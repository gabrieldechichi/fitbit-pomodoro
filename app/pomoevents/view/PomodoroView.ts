import { Pomodoro, PomodoroState, PomodoroStateEvent, PomodoroEventListener } from '../components/pomodoro';
import { Logger } from 'ts-log';
import { ViewElements } from './elements';
import { ClockFormatter, ClockFormatterSettings } from './clockFormatter';
import { Hapitcs, VibrationPattern } from '../device/hapitcs';
import { PanoramaView } from '../../fitbit-modules/panorama/panoramaView';
import { EndPomodoroSessionPopup } from './endPomodoroPopup';
import { AppRuntime } from '../device/appRuntime';

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
    private endSessionPopup: EndPomodoroSessionPopup
    private clockFormatter: ClockFormatter
    private hapitcs: Hapitcs
    private isSkipping: boolean = false

    constructor(logger: Logger, pomodoro: Pomodoro, panoramaItem: Element) {
        super(panoramaItem)
        this.logger = logger
        this.pomodoro = pomodoro
        this.endSessionPopup = new EndPomodoroSessionPopup(this.pomodoro)
        this.endSessionPopup.onPopupClicked = this.onEndSessionPopupClicked.bind(this)
        this.clockFormatter = new ClockFormatter(ClockFormatterSettings.getSettings())
        this.hapitcs = new Hapitcs()

        this.pomodoro.registerListener(this)

        ViewElements.txtPomodoroSessionsCounter.onanimationend
        ViewElements.btnToggle.addEventListener('activate', this.onToggleButtonPressed.bind(this))
        ViewElements.btnSkip.addEventListener('activate', this.onSkipButtonPressed.bind(this))
        ViewElements.btnReset.addEventListener('activate', this.onResetButtonPressed.bind(this))

        this.updateElements(this.pomodoro.getState())
    }

    private notifyPomodoroSessionEnd(pattern: VibrationPattern, count: number) {
        const isTransitioningFromWorkOrRest = [PomodoroState.Working, PomodoroState.Resting].indexOf(this.pomodoro.getPreviousState()) >= 0
        if (isTransitioningFromWorkOrRest && !this.isSkipping) {
            this.hapitcs.playVibration(pattern, count, () => this.endSessionPopup.dismiss())
            this.showSessionEndedPopup()
        }
    }

    //Callbacks
    onStartWorking() {
        this.notifyPomodoroSessionEnd(VibrationPattern.Alert, 2)
        this.updateElements(this.pomodoro.getState())
        this.setIsSkipping(false)
    }

    onStartResting() {
        this.notifyPomodoroSessionEnd(VibrationPattern.Alert, 2)
        this.updateElements(this.pomodoro.getState())
        this.setIsSkipping(false)
    }

    onPaused() {
        this.updateElements(this.pomodoro.getState())

        const previousStateColor = this.getColorForState(this.pomodoro.getPreviousState())
        ViewElements.txtPomodoroSessionsCounter.getElement().style.fill = previousStateColor
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
        const remainingTimeMs = this.pomodoro.getRemainingTimeMs()
        this.clockFormatter.setMilliSeconds(remainingTimeMs)
        ViewElements.txtPomodoroTime.getElement().text = this.clockFormatter.toString()

        const targetTime = this.pomodoro.getTargetSessionTimeForCurrentState()

        const percentProgress = (targetTime - remainingTimeMs) / targetTime
        ViewElements.pomodoroProgress.getElement().width = AppRuntime.getWidthPercent(1 - percentProgress)
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
        ViewElements.pomodoroProgress.getElement().class = this.getProgressGradientForState(state)

        //Update button icons
        const playPauseIcon = this.getToggleButtonIconForState(state)
        ViewElements.btnToggle_ActiveIcon.setImage(playPauseIcon.icon)
        ViewElements.btnToggle_PressedIcon.setImage(playPauseIcon.iconPressed)

        ViewElements.btnSkip.getElement<GraphicsElement>().style.display = this.getSkipButtonVisibility(state)
        ViewElements.btnReset.getElement<GraphicsElement>().style.display = this.getStopButtonVisibility(state)

        //Update sessions count
        const sessionsToLongBreak = this.pomodoro.getSettings().numberOfSessionsBeforeBreak
        const remainingSessionsToLongBreak = this.pomodoro.getWorkSessionNumber()
        const stateName = this.getStateName(state)
        ViewElements.txtPomodoroSessionsCounter.getElement().text = `${stateName}: ${remainingSessionsToLongBreak}/${sessionsToLongBreak}`

        this.onPomodoroUpdate()
    }

    private showSessionEndedPopup() {
        this.endSessionPopup.show()
    }

    private onEndSessionPopupClicked() {
        this.endSessionPopup.dismiss()
        this.hapitcs.stopVibration()
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

    private getProgressGradientForState(state: PomodoroState): string {
        switch (state) {
            case PomodoroState.Working:
                return 'pomo-gradient-red'
            case PomodoroState.Resting:
                return 'pomo-gradient-green'
            case PomodoroState.Paused:
                return 'pomo-gradient-blue-dark'
            case PomodoroState.Idle:
                return 'pomo-gradient-grey'
            default:
                this.logger.warn(`Unexpected Pomodoro State ${state}`)
        }
        return ""
    }

    private getStateName(state: PomodoroState): string {
        switch (state) {
            case PomodoroState.Working:
                return 'Working'
            case PomodoroState.Resting:
                return 'Resting'
            case PomodoroState.Paused:
                return 'Paused'
            case PomodoroState.Idle:
                return 'Stopped'
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

    private getSkipButtonVisibility(state: PomodoroState): 'inline' | 'none' {
        switch (state) {
            case PomodoroState.Working:
            case PomodoroState.Resting:
                return 'inline'
            case PomodoroState.Paused:
            case PomodoroState.Idle:
                return 'none'
            default:
                this.logger.warn(`Unexpected Pomodoro State ${state}`)
        }
        return 'none'
    }

    private getStopButtonVisibility(state: PomodoroState): 'inline' | 'none' {
        switch (state) {
            case PomodoroState.Working:
            case PomodoroState.Resting:
            case PomodoroState.Idle:
                return 'none'
            case PomodoroState.Paused:
                return 'inline'
            default:
                this.logger.warn(`Unexpected Pomodoro State ${state}`)
        }
        return 'none'
    }

    private setIsSkipping(newValue: boolean) {
        this.isSkipping = newValue
    }
}