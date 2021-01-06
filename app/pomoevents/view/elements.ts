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
    static txtPomodoroSessionsCounter: GraphicsElement = document.getElementById('sessions-counter') as GraphicsElement
    static pomodoroProgress: RectElement = document.getElementById('pomodoro-progress') as RectElement

    static txtClock: GraphicsElement = document.getElementById('clock-time') as GraphicsElement
}