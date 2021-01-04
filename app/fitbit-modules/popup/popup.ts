import { ElementWrapper } from '../../pomoevents/input/elementWrapper';
import { GraphicsElementWrapper } from '../../pomoevents/input/button';

export class Popup {
    root: GraphicsElementWrapper
    onPopupClicked: () => void
    constructor(root: GraphicsElement) {
        this.root = new ElementWrapper(root)

        this.root.addEventListener('click', this.onClick.bind(this))
    }

    public show() {
        this.root.getElement().style.display = 'inline'
        this.onShow()
    }

    public dismiss() {
        this.root.getElement().style.display = 'none'
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