export class Configuration {
    readonly database = new DatabaseConfiguration();
    readonly logging = new LoggingConfiguration();
}

export class DatabaseConfiguration {
    MONGODB_URI: string;
    MONGODB_USER: string;
    MONGODB_PASSWORD: string;
    MONGODB_DBNAME: string;
}

export class LoggingConfiguration {
    LOGS_PATH: string;
}
