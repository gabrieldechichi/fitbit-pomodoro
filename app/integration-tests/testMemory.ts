import { App } from '../app';
import { MemoryProfiler } from '../fitbit-modules/performance/memory';

export class TestMemory {
    app: App
    memory: MemoryProfiler
    now: number

    public async test() {
        this.memory = new MemoryProfiler()

        this.memory.logMemoryStats('Before App')
        this.app = new App()
        this.memory.logMemoryStats('After App')

        const realDate = Date.now
        this.now = realDate()
        Date.now = () => this.now

        this.app.pomodoro.start()
        for (let i = 0; i < 100000; i++) {
            await this.tickPomodoro()
        }

        Date.now = realDate
    }

    private async tickPomodoro() {
        this.app.pomodoro['onClockUpdate'](null)
        this.now += 1000
        this.memory.logMemoryStats('Clock update')

        // return new Promise(r => setTimeout(r, 100))
    }
}
