export class Configuration {
    readonly database = new DatabaseConfiguration();
    readonly file = new FileConfiguration();
    readonly logging = new LoggingConfiguration();
}

export class DatabaseConfiguration {
    MONGODB_URI: string;
    MONGODB_USER: string;
    MONGODB_PASSWORD: string;
    MONGODB_DBNAME: string;
    MONGODB_TESTING_DBNAME: string;
}

export class LoggingConfiguration {
    LOGS_PATH: string;
}

export class FileConfiguration {
    FILES_PATH: string;
}
