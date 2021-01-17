import { PanoramaView, PanoramaViewController } from '../../fitbit-modules/panorama/panoramaView';
import document from 'document';
import { PomodoroSettings } from '../components/pomodoro';

type OnlyNumberKeys<O> = {
    [K in keyof O]: O[K] extends number ? K : never;
}[keyof O];

class PomoSettingsPropertyEditor {
    root: Element
    label: TextElement
    valueElement: TextElement
    labelString: string
    settings: PomodoroSettings
    propertyName: OnlyNumberKeys<PomodoroSettings>
    resolution: number
    resolutionLabel: string

    constructor(root: Element, label: string, settings: PomodoroSettings, propertyName: OnlyNumberKeys<PomodoroSettings>, resolution: number, resolutionLabel: string) {
        this.root = root
        this.labelString = label
        this.label = this.root.getElementById('settings-name') as TextElement
        this.valueElement = this.root.getElementById('settings-value') as TextElement
        this.settings = settings
        this.propertyName = propertyName
        this.resolution = resolution
        this.resolutionLabel = resolutionLabel

        this.root.getElementById('decrement')
            .addEventListener('activate', this.onDecrement.bind(this))

        this.root.getElementById('increment')
            .addEventListener('activate', this.onIncrement.bind(this))

        this.updateUI()
    }

    updateUI() {
        this.label.text = `${this.labelString}`
        this.valueElement.text = `${this.getValueInResolution()} ${this.resolutionLabel}`.trim()
    }

    private onDecrement(evt: Event) {
        this.changeValue(-this.resolution)
    }

    private onIncrement(evt: Event) {
        this.changeValue(this.resolution)
    }

    private changeValue(amount: number) {
        const newValue = this.getValueInResolution() * this.resolution + amount
        this.settings[this.propertyName] = Math.max(this.resolution, newValue)
        this.updateUI()
    }

    private getValueInResolution(): number {
        return Math.ceil(this.settings[this.propertyName] / this.resolution)
    }
}

export class SettingsView extends PanoramaView {
    pomoSessionPropertyEditors: PomoSettingsPropertyEditor[]

    constructor(settings: PomodoroSettings, item: Element, controller: PanoramaViewController) {
        super(item, controller)

        this.pomoSessionPropertyEditors = [
            new PomoSettingsPropertyEditor(
                document.getElementById('settings-pomo-session-count'),
                "Sessions",
                settings,
                'numberOfSessionsBeforeBreak',
                1,
                ''),

            new PomoSettingsPropertyEditor(
                document.getElementById('settings-pomo-work-time'),
                "Work",
                settings,
                'workTimeSeconds', 60, 'min'),

            new PomoSettingsPropertyEditor(
                document.getElementById('settings-pomo-rest-time'),
                "Short Break",
                settings,
                'shortBreakTimeSeconds', 60, 'min'),

            new PomoSettingsPropertyEditor(
                document.getElementById('settings-pomo-long-rest-time'),
                "Long Break",
                settings,
                'longBreakTimeSeconds', 60, 'min')
        ]
    }

    onShow() {
        super.onShow()
        for (let i = 0; i < this.pomoSessionPropertyEditors.length; i++) {
            this.pomoSessionPropertyEditors[i].updateUI()
        }
    }
}
