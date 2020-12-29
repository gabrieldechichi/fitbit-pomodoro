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
    }

    public dismiss() {
        this.root.getElement().style.display = 'none'
    }

    protected onClick(evt: MouseEvent) {
        this.onPopupClicked()
    }
}