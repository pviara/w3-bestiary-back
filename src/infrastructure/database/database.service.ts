import { ConfigurationService } from '../configuration/configuration.service';
import { Helper } from '../../utils/helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
    private _assembledDbURI!: string;

    get dbURI(): string {
        return this._assembleDbURI();
    }

    constructor(private readonly _configService: ConfigurationService) {}

    private _assembleDbURI(): string {
        if (this._assembledDbURI) {
            return this._assembledDbURI;
        }

        const username = this._configService.database.MONGODB_USER;
        const password = this._configService.database.MONGODB_PASSWORD;
        const dbName = this._configService.database.MONGODB_DBNAME;

        this._assembledDbURI = Helper.replace(
            this._configService.database.MONGODB_URI,
            { placeholder: '<username>', newValue: username },
            { placeholder: '<password>', newValue: password },
            { placeholder: '<dbname>', newValue: dbName },
        );

        return this._assembledDbURI;
    }
}
