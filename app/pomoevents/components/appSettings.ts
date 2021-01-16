import { PomodoroSettings } from './pomodoro';
import { DeviceSettings } from '../../fitbit-modules/settings/deviceSettings';

export class AppSettings {
    pomoSettings: PomodoroSettings = new PomodoroSettings()
}

export class AppDeviceSettings extends DeviceSettings<AppSettings> {
    constructor() {
        super(null, AppSettings)
    }
}
