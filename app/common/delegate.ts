type DelegateCallback<T> = (params: T) => void;

export class Delegate<T> {
    listeners: Array<DelegateCallback<T>>

    addEventListener(fn: DelegateCallback<T>): void {
        this.listeners = (this.listeners || []).concat(fn);
    }

    removeEventListener(fn: DelegateCallback<T>): void {
        this.listeners = (this.listeners || []).filter(f => f !== fn);
    }

    emit(params: T): void {
        (this.listeners || []).forEach(function (fn) {
            fn(params);
        });
    }
}
