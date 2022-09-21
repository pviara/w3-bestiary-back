import { ConfigurationService } from '../configuration/configuration.service';
import { Helper } from '../../utils/helper';
import { Injectable } from '@nestjs/common';

enum DatabaseType {
    Feature = 0,
    Testing = 1
}

@Injectable()
export class DatabaseService {
    get dbURI(): string {
        return this._assembleDbURI(DatabaseType.Feature);
    }

    get dbTestURI(): string {
        return this._assembleDbURI(DatabaseType.Testing);
    }

    constructor(private readonly _configService: ConfigurationService) {}

    private _assembleDbURI(dbType: DatabaseType): string {
        const username = this._configService.database.MONGODB_USER;
        const password = this._configService.database.MONGODB_PASSWORD;
        
        let dbName = this._configService.database.MONGODB_DBNAME;
        if (dbType === DatabaseType.Testing) {
            dbName = this._configService.database.MONGODB_TESTING_DBNAME;
        }

        return Helper.replace(
            this._configService.database.MONGODB_URI,
            { placeholder: '<username>', newValue: username },
            { placeholder: '<password>', newValue: password },
            { placeholder: '<dbname>', newValue: dbName },
        );
    }
}
