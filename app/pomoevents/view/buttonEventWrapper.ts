import { DuplicateEventPreventer, EventListenerCallback } from '../../fitbit-modules/panorama/duplicateEventPreventer';
import { Hapitcs, VibrationPattern } from '../../fitbit-modules/device/hapitcs';
import { Logger } from 'ts-log';
import { Delegate } from '../../common/delegate';

export class ButtonEventWrapper extends DuplicateEventPreventer {
    hapitcs: Hapitcs
    onAnyButtonPressed: Delegate<void>

    constructor(logger: Logger, hapitcs: Hapitcs) {
        super(logger)
        this.hapitcs = hapitcs
        this.onAnyButtonPressed = new Delegate<void>()
    }

    protected safeRaiseCallback(evt: Event, elementId: string, callback: EventListenerCallback): boolean {
        if (super.safeRaiseCallback(evt, elementId, callback)) {
            if (this.hapitcs) {
                this.hapitcs.playVibration(VibrationPattern.Bump, 1)
            }

            this.onAnyButtonPressed.emit()

            return true
        }
        return false
    }
}
