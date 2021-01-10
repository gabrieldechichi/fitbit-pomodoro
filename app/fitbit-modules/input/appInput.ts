import document from 'document'
import { Logger } from 'ts-log';
import { Dictionary } from '../../pomoevents/coretypes/dictionary';

export enum HardwareKeyType {
    Down = 'down',
    Up = 'up',
    Back = 'back'
}

export class EventCalbackResponse {
    shouldPreventDefault: boolean = true
    wasHandled: boolean = true

    private constructor(shouldPreventDefault: boolean, handled: boolean) {
        this.shouldPreventDefault = shouldPreventDefault
        this.wasHandled = handled
    }

    static readonly handled = new EventCalbackResponse(true, true)
    static readonly unhandled = new EventCalbackResponse(false, false)
}

export type KeyPressedEvent = () => EventCalbackResponse

export class AppInput {
    private logger: Logger

    private hardwareKeyPressedEvents: Dictionary<HardwareKeyType, KeyPressedEvent> = {
        [HardwareKeyType.Back]: null,
        [HardwareKeyType.Up]: null,
        [HardwareKeyType.Down]: null
    }

    private onBackPressed: KeyPressedEvent
    private onDownPressed: KeyPressedEvent
    private onUpPressed: KeyPressedEvent

    constructor(logger: Logger) {
        document.onkeypress = this.onKeyPress.bind(this)
    }

    public registerHardwareKeyPressedCallback(key: HardwareKeyType, callback: KeyPressedEvent) {
        this.hardwareKeyPressedEvents[key] = callback
    }

    private onKeyPress(evt: KeyboardEvent) {
        let callback: KeyPressedEvent = this.hardwareKeyPressedEvents[evt.key]

        if (!callback) {
            return
        }

        const response = callback()

        if (response.wasHandled && evt.stopPropagation) {
            evt.stopPropagation()
        }
        if (response.shouldPreventDefault && evt.preventDefault) {
            evt.preventDefault()
        }
    }
}
