import { Logger } from 'ts-log';
import { Pomodoro, PomodoroSettings } from './pomoevents/components/pomodoro';
import { LoggerFactory } from './pomoevents/components/logger';
import { ViewController } from './pomoevents/view/viewController';
import { AppInput } from './pomoevents/input/appInput';
import { Clock, ClockGranularity } from './fitbit-modules/clock/clock';
import { MemoryProfiler } from './fitbit-modules/performance/memory';

class App {
    logger: Logger
    pomodoro: Pomodoro
    clock: Clock
    input: AppInput
    view: ViewController

    constructor() {
        this.logger = LoggerFactory.createLogger()
        this.clock = new Clock(ClockGranularity.Seconds)
        this.pomodoro = new Pomodoro(PomodoroSettings.getSettings(), this.clock, this.logger)
        this.input = new AppInput(this.logger)
        this.view = new ViewController(this.logger, this.pomodoro, this.clock, this.input)
    }
}

const memory = new MemoryProfiler()
memory.logMemoryStats('Before app')
const app = new App()
memory.logMemoryStats('After app')
