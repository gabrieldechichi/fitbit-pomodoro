import document from 'document'
import { Logger } from 'ts-log';

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

    private onBackPressed: KeyPressedEvent
    private onDownPressed: KeyPressedEvent
    private onUpPressed: KeyPressedEvent

    constructor(logger: Logger) {
        document.onkeypress = this.onKeyPress.bind(this)
    }

    public registerHardwareKeyPressedCallback(key: HardwareKeyType, callback: KeyPressedEvent) {
        switch (key) {
            case HardwareKeyType.Down:
                this.onDownPressed = callback
                break
            case HardwareKeyType.Up:
                this.onUpPressed = callback
                break
            case HardwareKeyType.Back:
                this.onBackPressed = callback
                break
            default:
                this.logger.warn(`Unexpected key event: ${key}`)
        }
    }

    private onKeyPress(evt: KeyboardEvent) {
        let callback: KeyPressedEvent = null

        switch (evt.key) {
            case HardwareKeyType.Down:
                callback = this.onDownPressed
                break
            case HardwareKeyType.Up:
                callback = this.onUpPressed
                break
            case HardwareKeyType.Back:
                callback = this.onBackPressed
                break
            default:
                this.logger.warn(`Unexpected key event: ${evt.key}`)
        }

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