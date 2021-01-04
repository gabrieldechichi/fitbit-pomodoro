import document from "document"
import { Button, GraphicsElementWrapper, ArcElementWrapper, RectElementWrapper } from '../input/button';

export class ViewElements {
    private static btnToggleElement = document.getElementById('btn-toggle')

    static btnToggle: Button = new Button(document.getElementById('btn-toggle'))
    static btnToggle_ActiveIcon: Button = new Button(ViewElements.btnToggleElement.getElementById('combo-button-icon'))
    static btnToggle_PressedIcon: Button = new Button(ViewElements.btnToggleElement.getElementById('combo-button-icon-press'))
    static btnX: Button = new Button(document.getElementById('btn-exit'))

    static btnSkip: Button = new Button(document.getElementById('btn-skip'))
    static btnReset: Button = new Button(document.getElementById('btn-x'))

    static txtPomodoroTime: GraphicsElementWrapper = new GraphicsElementWrapper(document.getElementById('countdown-counter') as GraphicsElement)
    static txtPomodoroSessionsCounter: GraphicsElementWrapper = new GraphicsElementWrapper(document.getElementById('sessions-counter') as GraphicsElement)
    static pomodoroProgress: RectElementWrapper = new RectElementWrapper(document.getElementById('pomodoro-progress') as RectElement)

    static txtClock: GraphicsElementWrapper = new GraphicsElementWrapper(document.getElementById('clock-time') as GraphicsElement)
}