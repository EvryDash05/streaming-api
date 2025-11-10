import log from "loglevel";

const logger = log.getLogger("app");

if (process.env.NODE_ENV === "production") {
    logger.disableAll();
} else {
    logger.setLevel("debug");
}

const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
};

const loggerMessage = {
    debug: (msg: string) => logger.debug(`${colors.cyan}[DEBUG]${colors.reset} ${msg}`),
    info: (msg: string) => logger.info(`${colors.green}[INFO]${colors.reset} ${msg}`),
    warn: (msg: string) => logger.warn(`${colors.yellow}[WARN]${colors.reset} ${msg}`),
    error: (msg: string) => logger.error(`${colors.red}[ERROR]${colors.reset} ${msg}`),
};

export default loggerMessage;
