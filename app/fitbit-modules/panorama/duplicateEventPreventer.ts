import { Logger } from 'ts-log';

type EventListenerCallback = (event: Event) => void

type ElementEventCallTimestamps = {
    [EventName in string]: number
}

type ElementEventCalls = {
    [Target in string]: ElementEventCallTimestamps
}

type AcceptableEvents = 'activate' | 'animationend' | 'animationiteration' | 'animationstart' | 'beforeunload' | 'click' | 'collapse' | 'disable' | 'enable' | 'expand' | 'highlight' | 'keydown' | 'keypress' | 'keyup' | 'listbackward' | 'listforward' | 'load' | 'mousedown' | 'mousemove' | 'mouseout' | 'mouseover' | 'mouseup' | 'pagescroll' | 'reload' | 'select' | 'unhighlight' | 'unload' | 'unselect'

/**
 * Fixes bug with Panorama in SDK 4.0, where button events are called twice
 * Event call memory is never freed
 */
export class DuplicateEventPreventer {
    logger: Logger
    elementEventCalls: ElementEventCalls = {}
    private readonly preventDelayEpislonMs = 50

    constructor(logger: Logger) {
        this.logger = logger
    }

    public addWrappedEventListener(element: Element, eventName: AcceptableEvents, callback: EventListenerCallback) {
        element.addEventListener(eventName, this.eventListenerWrapper(element.id, callback))
    }

    public removedWrappedEventListener(element: Element, eventName: AcceptableEvents, callback: EventListenerCallback) {
        element.removeEventListener(eventName, this.eventListenerWrapper(element.id, callback))
        if (this.elementEventCalls[element.id]) {
            delete this.elementEventCalls[element.id]
        }
    }

    private eventListenerWrapper(elementId: string, callback: EventListenerCallback): EventListenerCallback {
        return (evt: Event) => {
            if (!callback) {
                return
            }

            const now = Date.now()

            if (this.elementEventCalls[elementId]) {
                const lastValidCallForEvent = this.elementEventCalls[elementId][evt.type]
                if (lastValidCallForEvent) {
                    if (now - lastValidCallForEvent < this.preventDelayEpislonMs) {
                        return
                    }
                }
            } else {
                this.elementEventCalls[elementId] = {}
            }

            if (callback) {
                this.elementEventCalls[elementId][evt.type] = now
                callback(evt)
            }
        }
    }
}