export class Popup {
    root: GraphicsElement
    onPopupClicked: () => void
    constructor(root: GraphicsElement) {
        this.root = root

        this.root.addEventListener('click', this.onClick.bind(this))
    }

    public show() {
        this.root.style.display = 'inline'
        this.onShow()
    }

    public dismiss() {
        this.root.style.display = 'none'
        this.onDismiss()
    }

    protected onClick(evt: MouseEvent) {
        this.onPopupClicked()
    }

    protected onShow() {

    }

    protected onDismiss() {

    }
}