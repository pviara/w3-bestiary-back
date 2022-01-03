import { ConfigurationService } from '../configuration/configuration.service';
import { Injectable } from '@nestjs/common';
import { Helper } from '../../utils/helper';

@Injectable()
export class DatabaseService {
	get dbURI(): string {
		return this._assembleDbURI();
	}

	constructor(private readonly _configService: ConfigurationService) {}

	private _assembleDbURI(): string {
		const username = this._configService.database.MONGODB_USER;
		const password = this._configService.database.MONGODB_PASSWORD;
		const dbName = this._configService.database.MONGODB_DBNAME;

		return Helper.replace(
			this._configService.database.MONGODB_URI,
			{ placeholder: '<username>', newValue: username },
			{ placeholder: '<password>', newValue: password },
			{ placeholder: '<dbname>', newValue: dbName }
		);
	}
}
