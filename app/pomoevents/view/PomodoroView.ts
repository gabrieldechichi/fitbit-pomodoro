import { Pomodoro, PomodoroState, PomodoroStateEvent } from '../components/pomodoro';
import { Logger } from 'ts-log';
import { ViewElements } from './Elements';
import { ClockFormatter, ClockFormatterSettings } from './ClockFormatter';

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

export class PomodoroView {
    logger: Logger
    pomodoro: Pomodoro
    clockFormatter: ClockFormatter

    constructor(logger: Logger, pomodoro: Pomodoro) {
        this.logger = logger
        this.pomodoro = pomodoro
        this.clockFormatter = new ClockFormatter(ClockFormatterSettings.getSettings())

        this.pomodoro.registerOnEnterStateCallback(this.onEnterStateCallback.bind(this))
        this.pomodoro.registerOnUpdateStateCallback(this.onUpdateStateCallback.bind(this))

        ViewElements.btnToggle.addEventListener('activate', this.onToggleButtonPressed.bind(this))
        ViewElements.btnSkip.addEventListener('activate', this.onSkipButtonPressed.bind(this))
        ViewElements.btnReset.addEventListener('activate', this.onResetButtonPressed.bind(this))

        this.onEnterStateCallback(this.pomodoro.getState())
        this.onUpdateStateCallback(this.pomodoro.getState())
    }

    //Callbacks
    private onEnterStateCallback(state: PomodoroState) {
        const color = this.getColorForState(state)
        ViewElements.txtPomodoroSessionsCounter.style.fill = color
        ViewElements.txtPomodoroTime.style.fill = color
        ViewElements.arcPomodoroProgress.style.fill = color

        if (state === PomodoroState.Paused) {
            const previousStateColor = this.getColorForState(this.pomodoro.getPreviousState())
            ViewElements.txtPomodoroSessionsCounter.style.fill = previousStateColor
            ViewElements.txtPomodoroTime.style.fill = previousStateColor
        }

        const playPauseIcon = this.getToggleButtonIconForState(state)
        ViewElements.btnToggle_ActiveIcon['image' as any] = playPauseIcon.icon
        ViewElements.btnToggle_PressedIcon['image' as any] = playPauseIcon.iconPressed

        const sessionsToLongBreak = this.pomodoro.getSettings().numberOfSessionsBeforeBreak
        const remainingSessionsToLongBreak = this.pomodoro.getRemainingWorkSessionsToLongBreak()

        ViewElements.txtPomodoroSessionsCounter.text = `${remainingSessionsToLongBreak}/${sessionsToLongBreak}`
    }

    private onUpdateStateCallback(state: PomodoroState) {
        this.clockFormatter.setMilliSeconds(this.pomodoro.getRemainingTimeMs())
        ViewElements.txtPomodoroTime.text = this.clockFormatter.toString()
    }

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
        this.pomodoro.skip()
    }

    private onResetButtonPressed(event: MouseEvent) {
        this.pomodoro.stop()
    }
    //End callbacks

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
}