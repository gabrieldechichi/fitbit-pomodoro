import { me } from 'appbit'
import { me as device } from 'device'

export class AppRuntime {
    static exit() {
        me.exit()
    }

    static getScreen() {
        if (!device.screen) {
            device['screen' as any] = { width: 348, height: 250 };
        }
        return device.screen
    }

    static getWidthPercent(percent: number) {
        return this.getScreen().width * percent
    }

    static getHeightPercent(percent: number) {
        return this.getScreen().height * percent
    }

    static setTimeoutEnabled(enabled: boolean) {
        me.appTimeoutEnabled = enabled
    }
}
