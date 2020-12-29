type EventListenerCallback = (event: Event) => void

type ElementEventCallTimestamps = {
    [EventName in string]: number
}

export class ElementWrapper<ElementType extends Element = Element> implements GlobalEvents {
    private element: ElementType
    private elementEventCalls: ElementEventCallTimestamps = {}
    private readonly preventDelayEpislonMs = 10


    constructor(el: ElementType) {
        this.element = el

        if (this.element) {
            this.onactivate = this.eventListenerWrapper(this.element.onactivate).bind(this)
            this.onanimationend = this.eventListenerWrapper(this.element.onanimationend).bind(this)
            this.onanimationiteration = this.eventListenerWrapper(this.element.onanimationiteration).bind(this)
            this.onanimationstart = this.eventListenerWrapper(this.element.onanimationstart).bind(this)
            this.onbeforeunload = this.eventListenerWrapper(this.element.onbeforeunload).bind(this)
            this.onclick = this.eventListenerWrapper(this.element.onclick).bind(this)
            this.oncollapse = this.eventListenerWrapper(this.element.oncollapse).bind(this)
            this.ondisable = this.eventListenerWrapper(this.element.ondisable).bind(this)
            this.onenable = this.eventListenerWrapper(this.element.onenable).bind(this)
            this.onexpand = this.eventListenerWrapper(this.element.onexpand).bind(this)
            this.onhighlight = this.eventListenerWrapper(this.element.onhighlight).bind(this)
            this.onkeydown = this.eventListenerWrapper(this.element.onkeydown).bind(this)
            this.onkeypress = this.eventListenerWrapper(this.element.onkeypress).bind(this)
            this.onkeyup = this.eventListenerWrapper(this.element.onkeyup).bind(this)
            this.onlistbackward = this.eventListenerWrapper(this.element.onlistbackward).bind(this)
            this.onlistforward = this.eventListenerWrapper(this.element.onlistforward).bind(this)
            this.onload = this.eventListenerWrapper(this.element.onload).bind(this)
            this.onmousedown = this.eventListenerWrapper(this.element.onmousedown).bind(this)
            this.onmousemove = this.eventListenerWrapper(this.element.onmousemove).bind(this)
            this.onmouseout = this.eventListenerWrapper(this.element.onmouseout).bind(this)
            this.onmouseover = this.eventListenerWrapper(this.element.onmouseover).bind(this)
            this.onmouseup = this.eventListenerWrapper(this.element.onmouseup).bind(this)
            this.onpagescroll = this.eventListenerWrapper(this.element.onpagescroll).bind(this)
            this.onreload = this.eventListenerWrapper(this.element.onreload).bind(this)
            this.onselect = this.eventListenerWrapper(this.element.onselect).bind(this)
            this.onunhighlight = this.eventListenerWrapper(this.element.onunhighlight).bind(this)
            this.onunload = this.eventListenerWrapper(this.element.onunload).bind(this)
            this.onunselect = this.eventListenerWrapper(this.element.onunselect).bind(this)
        }
    }

    //BEGIN Global events implementation
    onactivate: (event: Event) => void
    onanimationend: (event: AnimationEvent) => void
    onanimationiteration: (event: AnimationEvent) => void
    onanimationstart: (event: AnimationEvent) => void
    onbeforeunload: (event: Event) => void
    onclick: (event: MouseEvent) => void
    oncollapse: (event: Event) => void
    ondisable: (event: Event) => void
    onenable: (event: Event) => void
    onexpand: (event: Event) => void
    onhighlight: (event: Event) => void
    onkeydown: (event: KeyboardEvent) => void
    onkeypress: (event: KeyboardEvent) => void
    onkeyup: (event: KeyboardEvent) => void
    onlistbackward: (event: ListScrollEvent) => void
    onlistforward: (event: ListScrollEvent) => void
    onload: (event: LoadEvent) => void
    onmousedown: (event: MouseEvent) => void
    onmousemove: (event: MouseEvent) => void
    onmouseout: (event: MouseEvent) => void
    onmouseover: (event: MouseEvent) => void
    onmouseup: (event: MouseEvent) => void
    onpagescroll: (event: PageScrollEvent) => void
    onreload: (event: Event) => void
    onselect: (event: Event) => void
    onunhighlight: (event: Event) => void
    onunload: (event: Event) => void
    onunselect: (event: Event) => void

    addEventListener<EventName extends "activate" | "animationend" | "animationiteration" | "animationstart" | "beforeunload" | "click" | "collapse" | "disable" | "enable" | "expand" | "highlight" | "keydown" | "keypress" | "keyup" | "listbackward" | "listforward" | "load" | "mousedown" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "pagescroll" | "reload" | "select" | "unhighlight" | "unload" | "unselect">(eventName: EventName, eventListener: (eventName: { activate: Event; animationend: AnimationEvent; animationiteration: AnimationEvent; animationstart: AnimationEvent; beforeunload: Event; click: MouseEvent; collapse: Event; disable: Event; enable: Event; expand: Event; highlight: Event; keydown: KeyboardEvent; keypress: KeyboardEvent; keyup: KeyboardEvent; listbackward: ListScrollEvent; listforward: ListScrollEvent; load: LoadEvent; mousedown: MouseEvent; mousemove: MouseEvent; mouseout: MouseEvent; mouseover: MouseEvent; mouseup: MouseEvent; pagescroll: PageScrollEvent; reload: LoadEvent; select: Event; unhighlight: Event; unload: Event; unselect: Event }[EventName]) => void): void {
        this.element.addEventListener(eventName, this.eventListenerWrapper(eventListener).bind(this))
    }
    removeEventListener<EventName extends "activate" | "animationend" | "animationiteration" | "animationstart" | "beforeunload" | "click" | "collapse" | "disable" | "enable" | "expand" | "highlight" | "keydown" | "keypress" | "keyup" | "listbackward" | "listforward" | "load" | "mousedown" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "pagescroll" | "reload" | "select" | "unhighlight" | "unload" | "unselect">(eventName: EventName, eventListener: (event: { activate: Event; animationend: AnimationEvent; animationiteration: AnimationEvent; animationstart: AnimationEvent; beforeunload: Event; click: MouseEvent; collapse: Event; disable: Event; enable: Event; expand: Event; highlight: Event; keydown: KeyboardEvent; keypress: KeyboardEvent; keyup: KeyboardEvent; listbackward: ListScrollEvent; listforward: ListScrollEvent; load: LoadEvent; mousedown: MouseEvent; mousemove: MouseEvent; mouseout: MouseEvent; mouseover: MouseEvent; mouseup: MouseEvent; pagescroll: PageScrollEvent; reload: LoadEvent; select: Event; unhighlight: Event; unload: Event; unselect: Event }[EventName]) => void): void {
        this.element.removeEventListener(eventName, this.eventListenerWrapper(eventListener).bind(this))
    }
    // END Global events implementation

    getElement<T extends ElementType>(): T {
        return this.element as T
    }

    setImage(imagePath: string) {
        this.getElement()['image' as any] = imagePath
    }


    private eventListenerWrapper(callback: EventListenerCallback): EventListenerCallback {
        return (evt: Event) => {
            if (!callback) {
                return
            }

            const now = Date.now()
            const lastValidCallForEvent = this.elementEventCalls[evt.type]
            if (lastValidCallForEvent) {
                if (now - lastValidCallForEvent < this.preventDelayEpislonMs) {
                    return
                }
            }

            if (callback) {
                this.elementEventCalls[evt.type] = now
                callback(evt)
            }
        }
    }
}
