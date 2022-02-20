import { ConfigService } from '@nestjs/config';
import { Configuration, DatabaseConfiguration, GitHubConfiguration } from './configuration';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationService {
    private readonly _configuration = new Configuration();

    get database(): DatabaseConfiguration {
        return this._configuration.database;
    }

    get gitHub(): GitHubConfiguration {
        return this._configuration.gitHub;
    }

    constructor(private readonly _configService: ConfigService) {
        this._configuration.gitHub.GITHUB_USER =
            this._configService.get<string>('GITHUB_USER');

        this._configuration.gitHub.GITHUB_REPO =
            this._configService.get<string>('GITHUB_REPO');
        
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
