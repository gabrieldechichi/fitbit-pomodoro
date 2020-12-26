import { Logger } from 'ts-log';

export class LoggerFactory {
    public static createLogger(): Logger {
        return new DebugLogger()
    }
}

export class DebugLogger implements Logger {

    [x: string]: any;
    trace(message?: any, ...optionalParams: any[]): void {
        console.trace()
    }
    debug(message?: any, ...optionalParams: any[]): void {
        console.log(message, ...optionalParams)
    }
    info(message?: any, ...optionalParams: any[]): void {
        console.info(message, ...optionalParams)
    }
    warn(message?: any, ...optionalParams: any[]): void {
        console.warn(message, ...optionalParams)
    }
    error(message?: any, ...optionalParams: any[]): void {
        console.error(message, ...optionalParams)
    }

}