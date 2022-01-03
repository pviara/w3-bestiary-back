export class Configuration {
	readonly database = new DatabaseConfiguration();
}

export class DatabaseConfiguration {
	MONGODB_URI: string;
	MONGODB_USER: string;
	MONGODB_PASSWORD: string;
	MONGODB_DBNAME: string;
}
