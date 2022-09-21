import { ConfigService } from '@nestjs/config';
import {
    Configuration,
    DatabaseConfiguration,
    FileConfiguration,
    LoggingConfiguration,
} from './configuration';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationService {
    private readonly _configuration = new Configuration();

    get database(): DatabaseConfiguration {
        return this._configuration.database;
    }

    get file(): FileConfiguration {
        return this._configuration.file;
    }

    get logging(): LoggingConfiguration {
        return this._configuration.logging;
    }

    constructor(private readonly _configService: ConfigService) {
        this._configuration.file.FILES_PATH =
            this._configService.get<string>('FILES_PATH');

        this._configuration.database.MONGODB_URI =
            this._configService.get<string>('MONGODB_URI');

        this._configuration.database.MONGODB_USER =
            this._configService.get<string>('MONGODB_USER');

        this._configuration.database.MONGODB_PASSWORD =
            this._configService.get<string>('MONGODB_PASSWORD');

        this._configuration.database.MONGODB_DBNAME =
            this._configService.get<string>('MONGODB_DBNAME');

        this._configuration.database.MONGODB_TESTING_DBNAME =
            this._configService.get<string>('MONGODB_TESTING_DBNAME');

        this._configuration.logging.LOGS_PATH =
            this._configService.get<string>('LOGS_PATH');
    }
}
