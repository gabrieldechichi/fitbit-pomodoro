import document from "document"

export class PanoramaView {
    item: Element
    constructor(item: Element) {
        this.item = item
    }

    public onShow() {

    }

    public onDismiss() {

    }
}

type PanoramaConstructors = {
    [Index in number]: typeof PanoramaView
}

type PanoramaObjects = {
    [Index in number]: PanoramaView
}

export class PanoramaViewController {
    private panoramaContainer: Element
    private panoramaId: string
    private panoramaContainerId: string
    private currentPanoramaIndex: number = -1

    protected readonly items: Element[]

    protected readonly panoramaConstructors: PanoramaConstructors = {}
    protected panoramaObjects: PanoramaObjects = {}

    constructor(panoramaId: string, panoramaContainerId: string) {
        this.panoramaId = panoramaId
        this.panoramaContainerId = panoramaContainerId
        this.panoramaContainer = document
            .getElementById(this.panoramaId)
            .getElementById(this.panoramaContainerId)

        this.panoramaContainer.addEventListener('select', this.onPanoramaSelected.bind(this))

        this.items = this.panoramaContainer.getElementsByClassName('panoramaview-item')

        this.setActivePanoramaIndex(0)
    }

    public show(panoramaIndex: number) {
        const currentView = this.getCurrentView()

        if (currentView && currentView === this.panoramaObjects[panoramaIndex]) {
            return
        }

        if (currentView) {
            currentView.onDismiss()
        }

        this.setActivePanoramaIndex(panoramaIndex)
    }

    public scroll(dir: 1 | -1) {
        const nextIdnex = (this.getActivePanoramaIndex() + dir) % this.getPanoramaCount()
        this.show(nextIdnex)
    }

    private onPanoramaSelected(evt: Event) {
        const previousView = this.getCurrentView()
        if (previousView) {
            previousView.onDismiss()
        }

        this.currentPanoramaIndex = this.panoramaContainer.value as number
        const currentView = this.getCurrentView()
        if (currentView) {
            currentView.onShow()
        }
    }

    public getCurrentView(): PanoramaView {
        return this.getOrCreatePanoramaView(this.getActivePanoramaIndex())
    }

    private getActivePanoramaIndex(): number {
        return this.currentPanoramaIndex
    }

    private setActivePanoramaIndex(index: number) {
        this.currentPanoramaIndex = index
        this.panoramaContainer.value = index
    }

    private getPanoramaCount(): number {
        return this.items.length
    }

    private getOrCreatePanoramaView(index: number): PanoramaView {
        const view = this.panoramaObjects[index]
        if (view) {
            return view
        }

        const constructor = this.panoramaConstructors[index]
        if (!constructor) {
            return null
        }

        const item = this.items[index]
        if (!item) {
            return null
        }

        const newView = new constructor(item)

        this.panoramaObjects[index] = newView
        return newView
    }
}