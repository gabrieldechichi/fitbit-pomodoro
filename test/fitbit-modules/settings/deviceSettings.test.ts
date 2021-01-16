import fs from 'fs'
import { DeviceSettings } from '../../../app/fitbit-modules/settings/deviceSettings'

jest.mock('fs')

class DummySettings {
    intValue: number
    floatValue: number
    strValue: string
    boolValue: boolean
}

describe('device settings should', () => {
    let deviceSettings: DeviceSettings<DummySettings> = null
    let dummySettings: DummySettings = null

    let savedSettings: DummySettings = null

    beforeAll(() => {
        var readFileSync = jest.fn()
        readFileSync.mockImplementation(() => {
            return savedSettings
        })

        fs.readFileSync = readFileSync

        var writeFileSync = jest.fn()
        writeFileSync.mockImplementation((filename: string, data: any, encoding: 'cbor' | 'json') => {
            savedSettings = data as DummySettings
        })

        fs.writeFileSync = writeFileSync
    })

    beforeEach(() => {
        deviceSettings = new DeviceSettings(null, DummySettings)
        dummySettings = {
            intValue: 2,
            floatValue: 2.2,
            strValue: "",
            boolValue: true
        }
        savedSettings = {} as DummySettings
    })

    test('be constructable', () => {
        deviceSettings = new DeviceSettings(null, DummySettings)
        expect(deviceSettings).not.toBe(null)
    })

    test('have empty settings if not saved settings exists', () => {
        (fs.readFileSync as jest.Mock<any, any>).mockImplementationOnce(() => {
            throw new Error()
        })

        const otherSettings = new DeviceSettings(null, DummySettings)
        expect(otherSettings.getSettings()).not.toBe(null)
        expect(otherSettings.getSettings()).toStrictEqual(new DummySettings())
    })

    test('set settings', () => {
        expect(deviceSettings.getSettings()).not.toBe(dummySettings)
        deviceSettings.setSettings(dummySettings)
        expect(deviceSettings.getSettings()).toBe(dummySettings)
    })

    test('return pointer to settings', () => {
        const settings = deviceSettings.getSettings()
        expect(settings.intValue).toBe(undefined)

        settings.intValue = 2
        expect(deviceSettings.getSettings().intValue).toBe(2)
    })

    test('save settings', () => {
        expect(deviceSettings.getSettings()).not.toBe(dummySettings)
        deviceSettings.setSettings(dummySettings)
        expect(deviceSettings.getSettings()).toBe(dummySettings)

        deviceSettings.saveSettings()

        expect(fs.writeFileSync).toHaveBeenCalledTimes(1)

        const otherDeviceSettings = new DeviceSettings(null, DummySettings)
        expect(otherDeviceSettings.getSettings()).toBe(dummySettings)
    })
})