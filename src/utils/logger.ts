import log from "loglevel";

const logger = log.getLogger("app");

if (process.env.NODE_ENV === "production") {
    logger.disableAll();
} else {
    logger.setLevel("debug");
}

export default logger;
