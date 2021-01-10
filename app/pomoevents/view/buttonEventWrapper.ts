import { DuplicateEventPreventer, EventListenerCallback } from '../../fitbit-modules/panorama/duplicateEventPreventer';
import { Hapitcs, VibrationPattern } from '../../fitbit-modules/device/hapitcs';
import { Logger } from 'ts-log';

export class ButtonEventWrapper extends DuplicateEventPreventer {
    hapitcs: Hapitcs

    constructor(logger: Logger, hapitcs: Hapitcs) {
        super(logger)
        this.hapitcs = hapitcs
    }

    protected safeRaiseCallback(evt: Event, elementId: string, callback: EventListenerCallback): boolean {
        if (super.safeRaiseCallback(evt, elementId, callback)) {
            if (this.hapitcs) {
                this.hapitcs.playVibration(VibrationPattern.Bump, 1)
            }
            return true
        }
        return false
    }
}
