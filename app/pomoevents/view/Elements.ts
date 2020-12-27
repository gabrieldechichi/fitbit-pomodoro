import document from "document"

export class ViewElements {
    static btnToggle: Element = document.getElementById('btn-toggle')
    static btnToggle_ActiveIcon: Element = ViewElements.btnToggle.getElementById('combo-button-icon')
    static btnToggle_PressedIcon: Element = ViewElements.btnToggle.getElementById('combo-button-icon-press')

    static btnSkip: Element = document.getElementById('btn-skip')
    static btnReset: Element = document.getElementById('btn-x')

    static txtPomodoroTime: GraphicsElement = <GraphicsElement>document.getElementById('countdown-counter')
    static txtPomodoroSessionsCounter: GraphicsElement = <GraphicsElement>document.getElementById('interval-counter')
    static arcPomodoroProgress: ArcElement = <ArcElement>document.getElementById('countdown-arc')
}