import document from 'document';
import { Popup } from '../../fitbit-modules/popup/popup';
import { GraphicsElementWrapper } from '../input/button';
import { Pomodoro, PomodoroState } from '../components/pomodoro';

export class EndPomodoroSessionPopup extends Popup {
    private static readonly endSessionPopupRoot: GraphicsElement = document.getElementById('end-session-popup') as GraphicsElement
    private static readonly txtCurrentSession: GraphicsElementWrapper = new GraphicsElementWrapper(EndPomodoroSessionPopup.endSessionPopupRoot.getElementById("popup-current-session") as GraphicsElement)
    private static readonly txtSessionCounter: GraphicsElementWrapper = new GraphicsElementWrapper(EndPomodoroSessionPopup.endSessionPopupRoot.getElementById("popup-session-counter") as GraphicsElement)

    pomodoro: Pomodoro

    constructor(pomodoro: Pomodoro) {
        super(EndPomodoroSessionPopup.endSessionPopupRoot)

        this.pomodoro = pomodoro
    }

    protected onShow() {
        super.onShow()
        EndPomodoroSessionPopup.txtCurrentSession.getElement().text = this.getEndOfSessionMessage(this.pomodoro.getState())

        const sessionsToLongBreak = this.pomodoro.getSettings().numberOfSessionsBeforeBreak
        const remainingSessionsToLongBreak = this.pomodoro.getWorkSessionNumber()

        EndPomodoroSessionPopup.txtSessionCounter.getElement().text = `${remainingSessionsToLongBreak}/${sessionsToLongBreak}`
    }

    private getEndOfSessionMessage(state: PomodoroState): string {
        switch (state) {
            case PomodoroState.Working:
                return "Work"
            case PomodoroState.Resting:
                return "Rest"
        }
        return "Unexpected state " + state
    }
}