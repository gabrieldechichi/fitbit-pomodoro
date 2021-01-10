type EventMap = Record<string, any>

type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

interface Emitter<T extends EventMap> {
    addEventListener<K extends EventKey<T>>
        (eventName: K, fn: EventReceiver<T[K]>): void;
    removeEventListener<K extends EventKey<T>>
        (eventName: K, fn: EventReceiver<T[K]>): void;
    emit<K extends EventKey<T>>
        (eventName: K, params: T[K]): void;
}

export class EventEmitter<T extends EventMap> implements Emitter<T> {
    listeners: {
        [K in keyof EventMap]?: Array<(p: EventMap[K]) => void>
    } = {}

    addEventListener<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void {
        this.listeners[eventName] = (this.listeners[eventName] || []).concat(fn);
    }
    removeEventListener<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void {
        this.listeners[eventName] = (this.listeners[eventName] || []).filter(f => f !== fn);
    }
    emit<K extends EventKey<T>>(eventName: K, params: T[K]): void {
        (this.listeners[eventName] || []).forEach(function (fn) {
            fn(params);
        });
    }
}
