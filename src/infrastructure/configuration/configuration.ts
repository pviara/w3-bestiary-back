export class Configuration {
    readonly application = new ApplicationConfiguration();
    readonly file = new FileConfiguration();
    readonly logging = new LoggingConfiguration();
}

export class ApplicationConfiguration {
    environment: string;
}

export class LoggingConfiguration {
    LOGS_PATH: string;
}

export class FileConfiguration {
    FILES_PATH: string;
}
