import { AppService } from './app.service';
import { ConfigurationModule } from './infrastructure/configuration/configuration.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { DatabaseService } from './infrastructure/database/database.service';
import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MonsterModule } from './monster/monster.module';
import { RouterModule } from '@nestjs/core';


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
        MonsterModule,
        RouterModule.register([{
            path: 'api',
            children: [{
                path: 'monster',
                module: MonsterModule
            }]
        }])
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
