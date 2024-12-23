class Logger {
    // Utility function to get the current timestamp
    private static getTimestamp() {
        const now = new Date();
        return now.toISOString();
    }

    // Basic log function with a custom prefix and log level
    private static log(prefix: string, level: string, message: string, ...optionalParams: any[]) {
        const timestamp = this.getTimestamp();
        const logMessage = `[${timestamp}] [${prefix}] [${level}] ${message}`;
        if (optionalParams.length > 0) {
            console.log(logMessage, ...optionalParams);
        } else {
            console.log(logMessage);
        }
    }

    // Info level log with custom prefix
    public static info(prefix: string, message: string, ...optionalParams: any[]) {
        this.log(prefix, 'INFO', message, ...optionalParams);
    }

    // Warn level log with custom prefix
    public static warn(prefix: string, message: string, ...optionalParams: any[]) {
        this.log(prefix, 'WARN', message, ...optionalParams);
    }

    // Error level log with custom prefix
    public static error(prefix: string, message: string, ...optionalParams: any[]) {
        this.log(prefix, 'ERROR', message, ...optionalParams);
    }

    // Debug level log with custom prefix
    public static debug(prefix: string, message: string, ...optionalParams: any[]) {
        this.log(prefix, 'DEBUG', message, ...optionalParams);
    }
}

export default Logger;