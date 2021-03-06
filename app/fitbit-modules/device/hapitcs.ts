import { vibration, VibrationPatternName } from "haptics";
import { Dictionary } from "../../pomoevents/coretypes/dictionary";

export enum VibrationPattern {
    Alert = 'alert',
    Bump = 'bump',
    Confirmation = 'confirmation',
    ConfirmationMax = 'confirmation-max',
    Nudge = 'nudge',
    NudgeMax = 'nudge-max',
    Ping = 'ping',
    Ring = 'ring'
}

class VibrationConfig {
    private pattern: VibrationPattern
    private playbackDurationSeconds: number

    constructor(pattern: VibrationPattern, playbackDuration: number) {
        this.pattern = pattern
        this.playbackDurationSeconds = playbackDuration
    }

    public getPlaybackDurationSeconds(playbackNum: number = 1) {
        return this.playbackDurationSeconds * playbackNum
    }
}

const vibrationConfigs: Dictionary<VibrationPattern, VibrationConfig> = {
    [VibrationPattern.Alert]: new VibrationConfig(VibrationPattern.Alert, 3),
    [VibrationPattern.Bump]: new VibrationConfig(VibrationPattern.Bump, 0.5),
    [VibrationPattern.Confirmation]: new VibrationConfig(VibrationPattern.Confirmation, 0.5),
    [VibrationPattern.ConfirmationMax]: new VibrationConfig(VibrationPattern.ConfirmationMax, 0.5),
    [VibrationPattern.Nudge]: new VibrationConfig(VibrationPattern.Nudge, 1),
    [VibrationPattern.NudgeMax]: new VibrationConfig(VibrationPattern.NudgeMax, 1),
    [VibrationPattern.Ping]: new VibrationConfig(VibrationPattern.Ping, 1),
    [VibrationPattern.Ring]: new VibrationConfig(VibrationPattern.Ring, 5),
}

export class Hapitcs {
    isPlayingVibration: boolean

    public playVibration(pattern: VibrationPattern, numberOfTimes: number, onVibrationStopCallbak: () => void = null) {
        if (this.isPlayingVibration) {
            return
        }

        const config = vibrationConfigs[pattern]

        this.isPlayingVibration = true

        vibration.start(pattern)

        setTimeout(() => {
            this.stopVibration()
            if (onVibrationStopCallbak) {
                onVibrationStopCallbak()
            }
        }, config.getPlaybackDurationSeconds(numberOfTimes) * 1000)
    }

    public stopVibration() {
        this.isPlayingVibration = false
        vibration.stop()
    }
}
