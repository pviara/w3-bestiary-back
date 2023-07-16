import {
    ApplicationConfiguration,
    Configuration,
    FileConfiguration,
    LoggingConfiguration,
} from './configuration';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationService {
    private readonly _configuration = new Configuration();

    get application(): ApplicationConfiguration {
        return this._configuration.application;
    }

    get file(): FileConfiguration {
        return this._configuration.file;
    }

    get logging(): LoggingConfiguration {
        return this._configuration.logging;
    }

    constructor(private readonly _configService: ConfigService) {
        this._configuration.application.environment =
            this._configService.get<string>('APP_ENV');

        this._configuration.file.FILES_PATH =
            this._configService.get<string>('FILES_PATH');

        this._configuration.logging.LOGS_PATH =
            this._configService.get<string>('LOGS_PATH');
    }
}
