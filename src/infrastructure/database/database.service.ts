import { ConfigurationService } from '../configuration/configuration.service';
import { Helper } from '../../utils/helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
    get dbURI(): string {
        return this._assembleDbURI();
    }

    constructor(private readonly _configService: ConfigurationService) {}

    private _assembleDbURI(): string {
        const { environment } = this._configService.application;

        const dbUri = this._configService.database.MONGODB_URI;
        const username = this._configService.database.MONGODB_USER;
        const password = this._configService.database.MONGODB_PASSWORD;
        let dbName = this._configService.database.MONGODB_DBNAME;

        if (environment === 'TEST') {
            dbName = this._configService.database.MONGODB_TESTING_DBNAME;
        }

        return Helper.replace(
            dbUri,
            { placeholder: '<username>', newValue: username },
            { placeholder: '<password>', newValue: password },
            { placeholder: '<dbname>', newValue: dbName },
        );
    }
}
