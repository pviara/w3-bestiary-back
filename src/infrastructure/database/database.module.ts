import { ConfigurationModule } from '../configuration/configuration.module';
import { DatabaseService } from './database.service';
import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Module({
    exports: [DatabaseService],
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
    providers: [DatabaseService],
})
export class DatabaseModule {}
