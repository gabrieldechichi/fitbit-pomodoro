import { me } from "appbit";
import * as fs from "fs";
import * as messaging from "messaging";
import { MessageEvent } from "messaging";

export class DeviceSettings<T> {
    static readonly SETTINGS_TYPE: 'cbor' | 'json' = "cbor"
    static readonly SETTINGS_FILE: string = "settings.cbor"

    private settings: any
    private onsettingschange: (settings: T) => void
    private defaultCtor: { new(): T }

    constructor(callback: (settings: T) => void, defaultCtor: { new(): T }) {
        this.defaultCtor = defaultCtor
        this.initialize(callback)
    }

    public getSettings(): T {
        return this.settings as T
    }

    public setSettings(settings: T) {
        this.settings = settings
    }

    public setSettingsAndSave(settings: T) {
        this.setSettings(settings)
        this.saveSettings()
    }

    private initialize(callback: (settings: T) => void) {
        this.settings = this.loadSettings();
        this.onsettingschange = callback;

        messaging.peerSocket.addEventListener('message', this.onCompanionMessage.bind(this))
        me.addEventListener("unload", this.saveSettings.bind(this));

        this.raiseSettingsChangedEvent()
    }

    private raiseSettingsChangedEvent() {
        if (this.onsettingschange) {
            this.onsettingschange(this.getSettings())
        }
    }

    private onCompanionMessage(evt: MessageEvent) {
        this.settings[evt.data.key] = evt.data.value;
        this.raiseSettingsChangedEvent()
    }

    private loadSettings() {
        try {
            const str = fs.readFileSync(DeviceSettings.SETTINGS_FILE, DeviceSettings.SETTINGS_TYPE);
            if (str) {
                return JSON.parse(str)
            } else {
                return new this.defaultCtor()
            }
        } catch (ex) {
            return new this.defaultCtor()
        }
    }

    public saveSettings() {
        fs.writeFileSync(DeviceSettings.SETTINGS_FILE, JSON.stringify(this.getSettings()), DeviceSettings.SETTINGS_TYPE);
    }
}
