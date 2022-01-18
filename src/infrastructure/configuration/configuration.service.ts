import { ConfigService } from '@nestjs/config';
import { Configuration, DatabaseConfiguration } from './configuration';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationService {
    private readonly _configuration = new Configuration();

    get database(): DatabaseConfiguration {
        return this._configuration.database;
    }

    constructor(private readonly _configService: ConfigService) {
        this._configuration.database.MONGODB_URI =
            this._configService.get<string>('MONGODB_URI');

        this._configuration.database.MONGODB_USER =
            this._configService.get<string>('MONGODB_USER');

        this._configuration.database.MONGODB_PASSWORD =
            this._configService.get<string>('MONGODB_PASSWORD');

        this._configuration.database.MONGODB_DBNAME =
            this._configService.get<string>('MONGODB_DBNAME');
    }
}
