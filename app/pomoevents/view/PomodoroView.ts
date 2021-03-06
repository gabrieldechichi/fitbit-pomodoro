import { Pomodoro, PomodoroState, PomodoroStateEvent, PomodoroEventListener } from '../components/pomodoro';
import { Logger } from 'ts-log';
import { ViewElements } from './elements';
import { ClockFormatter, ClockFormatterSettings } from './clockFormatter';
import { Hapitcs, VibrationPattern } from '../../fitbit-modules/device/hapitcs';
import { PanoramaView } from '../../fitbit-modules/panorama/panoramaView';
import { EndPomodoroSessionPopup } from './endPomodoroPopup';
import { AppPanoramaViews, ViewController } from './ViewController';
import { Display } from '../../fitbit-modules/device/display';
import { ButtonEventWrapper } from './buttonEventWrapper';
import { CSSUtils } from '../../common/style/styleutils';
import { display } from 'display';

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
    private buttonEventWrapper: ButtonEventWrapper

    constructor(logger: Logger, pomodoro: Pomodoro, panoramaItem: Element, controller: ViewController) {
        super(panoramaItem, controller)
        this.logger = logger
        this.pomodoro = pomodoro
        this.endSessionPopup = new EndPomodoroSessionPopup(this.pomodoro)
        this.endSessionPopup.onPopupClicked = this.onEndSessionPopupClicked.bind(this)
        this.clockFormatter = new ClockFormatter(ClockFormatterSettings.getSettings())
        this.hapitcs = new Hapitcs()
        this.buttonEventWrapper = new ButtonEventWrapper(this.logger, this.hapitcs, this.onAnyButtonPressed.bind(this))

        this.pomodoro.registerListener(this)

        this.buttonEventWrapper.addWrappedEventListener(ViewElements.btnToggle, 'activate', this.onToggleButtonPressed.bind(this))
        this.buttonEventWrapper.addWrappedEventListener(ViewElements.btnSkip, 'activate', this.onSkipButtonPressed.bind(this))
        this.buttonEventWrapper.addWrappedEventListener(ViewElements.btnReset, 'activate', this.onResetButtonPressed.bind(this))
        this.buttonEventWrapper.addWrappedEventListener(ViewElements.btnSettings, 'activate', this.onSettingsButtonPressed.bind(this))

        this.updateElements(this.pomodoro.getState())
    }

    onShow() {
        super.onShow()
        this.updateElements(this.pomodoro.getState())
    }

    private notifyPomodoroSessionEnd() {
        const isTransitioningFromWorkOrRest = [PomodoroState.Working, PomodoroState.Resting].indexOf(this.pomodoro.getPreviousState()) >= 0
        if (isTransitioningFromWorkOrRest && !this.isSkipping) {
            Display.poke()
            this.hapitcs.playVibration(VibrationPattern.Alert, 3, () => this.endSessionPopup.dismiss())
            this.showSessionEndedPopup()
        }
    }

    //Callbacks
    onStartWorking() {
        this.notifyPomodoroSessionEnd()
        this.updateElements(this.pomodoro.getState())
        this.setIsSkipping(false)
    }

    onStartResting() {
        this.notifyPomodoroSessionEnd()
        this.updateElements(this.pomodoro.getState())
        this.setIsSkipping(false)
    }

    onPaused() {
        this.updateElements(this.pomodoro.getState())

        const previousStateColor = this.getColorForState(this.pomodoro.getPreviousState())
        ViewElements.txtPomodoroSessionsCounter.style.fill = previousStateColor
        ViewElements.txtPomodoroSessionName.style.fill = previousStateColor
        ViewElements.txtPomodoroTime.style.fill = previousStateColor

        ViewElements.txtPomodoroTime.animate('enable')
        ViewElements.txtPomodoroTimeShadown.animate('enable')
    }

    onResumed() {
        this.updateElements(this.pomodoro.getState())

        ViewElements.txtPomodoroTime.animate('disable')
        ViewElements.txtPomodoroTimeShadown.animate('disable')
    }

    onIdle() {
        this.updateElements(this.pomodoro.getState())
        ViewElements.txtPomodoroTime.animate('disable')
        ViewElements.txtPomodoroTimeShadown.animate('disable')
    }

    onPomodoroUpdate() {
        const remainingTimeMs = this.pomodoro.getRemainingTimeMs()
        this.clockFormatter.setMilliSeconds(remainingTimeMs)
        ViewElements.txtPomodoroTime.text =
            ViewElements.txtPomodoroTimeShadown.text = this.clockFormatter.toString()

        const targetTime = this.pomodoro.getTargetSessionTimeForCurrentState()

        const percentProgress = (targetTime - remainingTimeMs) / targetTime
        ViewElements.pomodoroProgress.sweepAngle = Math.ceil(360 * percentProgress)
    }
    //End callbacks

    //Control callbacks
    private onToggleButtonPressed(event: MouseEvent) {
        if (this.isVisible()) {
            if (this.pomodoro.isRunning()) {
                this.pomodoro.pause()
            } else if (this.pomodoro.isPaused()) {
                this.pomodoro.resume()
            } else {
                this.pomodoro.start()
            }
        }
    }

    private onSkipButtonPressed(event: MouseEvent) {
        if (this.isVisible()) {
            this.setIsSkipping(true)
            this.pomodoro.skip()
        }
    }

    private onResetButtonPressed(event: MouseEvent) {
        if (this.isVisible()) {
            this.pomodoro.stop()
        }
    }

    private onSettingsButtonPressed(event: MouseEvent) {
        if (this.isVisible()) {
            this.getViewController().show(AppPanoramaViews.Settings)
        }
    }

    private onAnyButtonPressed(elementId: string): boolean {
        this.onEndSessionPopupClicked()
        return Display.isOn()
    }
    //End Control callbacks

    private updateElements(state: PomodoroState) {
        //Update colors
        const color = this.getColorForState(state)
        ViewElements.txtPomodoroSessionsCounter.style.fill = color
        ViewElements.txtPomodoroTime.style.fill = color

        const previousTyle = this.getPomodoroArcStyle(this.pomodoro.getPreviousState())
        const newStyle = this.getPomodoroArcStyle(state)
        CSSUtils.replaceElementClass(ViewElements.pomodoroProgress, previousTyle, newStyle)

        const previousBg = this.getPomodoroBgStyle(this.pomodoro.getPreviousState())
        const newBg = this.getPomodoroBgStyle(state)
        CSSUtils.replaceElementClass(ViewElements.pomodoroBg, previousBg, newBg)

        //Update button icons
        const playPauseIcon = this.getToggleButtonIconForState(state)
        ViewElements.btnToggle_ActiveIcon['image' as any] = playPauseIcon.icon
        ViewElements.btnToggle_PressedIcon['image' as any] = playPauseIcon.iconPressed

        ViewElements.btnSkip.style.display = this.getSkipButtonVisibility(state)
        ViewElements.btnReset.style.display = this.getStopButtonVisibility(state)
        ViewElements.btnSettings.style.display = this.getSettingsButtonVisibility(state)

        //Update sessions count
        const sessionsToLongBreak = this.pomodoro.getSettings().numberOfSessionsBeforeBreak
        const remainingSessionsToLongBreak = this.pomodoro.getWorkSessionNumber()

        ViewElements.txtPomodoroSessionsCounter.text = `${remainingSessionsToLongBreak}/${sessionsToLongBreak}`
        ViewElements.txtPomodoroSessionName.text = this.getStateName(state)

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
        return "white"
        switch (state) {
            case PomodoroState.Working:
                return '#570000'
            case PomodoroState.Resting:
                return '#005721'
            case PomodoroState.Paused:
            case PomodoroState.Idle:
                return 'gray'
            default:
                this.logger.warn(`Unexpected Pomodoro State ${state}`)
        }
        return ""
    }

    private getPomodoroArcStyle(state: PomodoroState): string {
        switch (state) {
            case PomodoroState.Working:
                return 'pomo-arc-working'
            case PomodoroState.Resting:
                return 'pomo-arc-resting'
            case PomodoroState.Paused:
                return 'pomo-arc-paused'
            case PomodoroState.Idle:
                return 'pomo-arc-idle'
            default:
                this.logger.warn(`Unexpected Pomodoro State ${state}`)
        }
        return ""
    }

    private getPomodoroBgStyle(state: PomodoroState): string {
        switch (state) {
            case PomodoroState.Working:
                return 'pomo-bg-working'
            case PomodoroState.Resting:
                return 'pomo-bg-resting'
            case PomodoroState.Paused:
                return 'pomo-bg-paused'
            case PomodoroState.Idle:
                return 'pomo-bg-idle'
            default:
                this.logger.warn(`Unexpected Pomodoro State ${state}`)
        }
        return ""
    }

    private getStateName(state: PomodoroState): string {
        switch (state) {
            case PomodoroState.Working:
                return 'Focus'
            case PomodoroState.Resting:
                return 'Rest'
            case PomodoroState.Paused:
                return 'Paused'
            case PomodoroState.Idle:
                return 'Start'
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

    private getSettingsButtonVisibility(state: PomodoroState): 'inline' | 'none' {
        switch (state) {
            case PomodoroState.Working:
            case PomodoroState.Resting:
            case PomodoroState.Paused:
                return 'none'
            case PomodoroState.Idle:
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
