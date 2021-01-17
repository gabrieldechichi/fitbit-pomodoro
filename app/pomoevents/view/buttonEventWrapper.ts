import { DuplicateEventPreventer, EventListenerCallback } from '../../fitbit-modules/panorama/duplicateEventPreventer';
import { Hapitcs, VibrationPattern } from '../../fitbit-modules/device/hapitcs';
import { Logger } from 'ts-log';
import { Delegate } from '../../common/delegate';

type BeforeButtonPressHandler = (buttonId: string) => boolean

export class ButtonEventWrapper extends DuplicateEventPreventer {
    hapitcs: Hapitcs
    beforeButtonPress: BeforeButtonPressHandler

    constructor(logger: Logger, hapitcs: Hapitcs, beforeButtonPress = null) {
        super(logger)
        this.hapitcs = hapitcs
        this.beforeButtonPress = beforeButtonPress
    }

    protected safeRaiseCallback(evt: Event, elementId: string, callback: EventListenerCallback): boolean {
        if (this.beforeButtonPress && !this.beforeButtonPress(elementId)) {
            return false
        }

        if (super.safeRaiseCallback(evt, elementId, callback)) {
            if (this.hapitcs) {
                this.hapitcs.playVibration(VibrationPattern.Bump, 1)
            }

            return true
        }
        return false
    }
}
