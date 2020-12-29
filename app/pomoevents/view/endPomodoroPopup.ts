import document from 'document';
import { Popup } from '../../fitbit-modules/popup/popup';

export class EndPomodoroSessionPopup extends Popup {
    private static readonly endSessionPopupRoot: GraphicsElement = document.getElementById('end-session-popup') as GraphicsElement

    constructor() {
        super(EndPomodoroSessionPopup.endSessionPopupRoot)
    }
}