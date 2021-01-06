import { PanoramaView, PanoramaViewController } from '../../fitbit-modules/panorama/panoramaView';
import { ViewElements } from './elements';
import { AppRuntime } from '../device/appRuntime';

export class ExitAppView extends PanoramaView {
    constructor(item: Element, controller: PanoramaViewController) {
        super(item, controller)
        ViewElements.btnX.addEventListener('activate', this.onButtonXClicked.bind(this))
    }

    private onButtonXClicked(event: Event) {
        AppRuntime.exit()
    }
}