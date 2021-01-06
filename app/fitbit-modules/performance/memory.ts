import { memory } from "system";
import { Logger } from 'ts-log';
import { DebugLogger } from '../../pomoevents/components/logger';

const JS_MEMORY_ALERT_LEVEL = 60000;

export class MemoryProfiler {
    logger: Logger
    constructor() {
        this.logger = new DebugLogger()
    }

    logMemoryStats(message) {
        this.logger.info(`MEMORY: ${message} JS: ${memory.js.used} / ${memory.js.total}, Native: ${memory.native.used} / ${memory.native.total}`);
        if (memory.js.used > JS_MEMORY_ALERT_LEVEL) {
            this.logger.error(`Out of memory!: ${memory.js.used}`)
        }
    }

    getJsMemoryUsed() {
        if (memory.js.used > JS_MEMORY_ALERT_LEVEL) {
            this.logger.info(`JS Memory: ${memory.js.used}`);
        }
        return memory.js.used;
    }
}