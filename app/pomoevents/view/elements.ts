import document from "document"

export class ViewElements {
    private static btnToggleElement = document.getElementById('btn-toggle')

    static btnToggle: Element = document.getElementById('btn-toggle')
    static btnToggle_ActiveIcon: Element = ViewElements.btnToggleElement.getElementById('combo-button-icon')
    static btnToggle_PressedIcon: Element = ViewElements.btnToggleElement.getElementById('combo-button-icon-press')
    static btnX: Element = document.getElementById('btn-exit')

    static btnSkip: GraphicsElement = document.getElementById('btn-skip') as GraphicsElement
    static btnReset: GraphicsElement = document.getElementById('btn-x') as GraphicsElement

    static txtPomodoroTime: GraphicsElement = document.getElementById('countdown-counter') as GraphicsElement
    static txtPomodoroTimeShadown: GraphicsElement = document.getElementById('countdown-counter-shadow') as GraphicsElement

    static txtPomodoroSessionsCounter: GraphicsElement = document.getElementById('sessions-counter') as GraphicsElement
    static txtPomodoroSessionName: GraphicsElement = document.getElementById('session-name') as GraphicsElement
    static pomodoroProgress: ArcElement = document.getElementById('pomo-arc') as ArcElement
    static pomodoroBg: RectElement = document.getElementById('pomodoro-bg') as RectElement

    static txtClock: GraphicsElement = document.getElementById('clock-time') as GraphicsElement
    static txtCalendarDay: GraphicsElement = document.getElementById('calendar-day') as GraphicsElement
    static txtCalendarMonth: GraphicsElement = document.getElementById('calendar-month') as GraphicsElement
}
