export class ClockFormatterSettings {
    separator: string = ':'

    static getSettings(): ClockFormatterSettings {
        return new ClockFormatterSettings()
    }
}

export class ClockFormatter {
    private settings: ClockFormatterSettings
    private totalSeconds: number
    private minutes: number
    private seconds: number

    constructor(settings: ClockFormatterSettings) {
        this.settings = settings
    }

    public setMilliSeconds(ms: number) {
        const total = Math.ceil(ms / 1000);
        const minutes = Math.floor(total / 60);
        const seconds = total - minutes * 60;

        this.totalSeconds = total
        this.minutes = minutes
        this.seconds = seconds
    }

    public toString(): string {
        return `${this.padSeconds(this.minutes)}${this.settings.separator}${this.padSeconds(this.seconds)}`
    }

    private padSeconds(seconds: number): string {
        return ('0' + seconds).slice(-2);
    }
}