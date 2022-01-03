import { AppService } from './app.service';
import { ConfigurationModule } from './infrastructure/configuration/configuration.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { DatabaseService } from './infrastructure/database/database.service';
import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Module({
	imports: [
		ConfigurationModule,
		MongooseModule.forRootAsync({
			imports: [DatabaseModule],
			useFactory: (dbService: DatabaseService) => {
				const options: MongooseModuleOptions = {
					uri: dbService.dbURI,
					useNewUrlParser: true,
					useUnifiedTopology: true,
				};
				return options;
			},
			inject: [DatabaseService],
		}),
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
