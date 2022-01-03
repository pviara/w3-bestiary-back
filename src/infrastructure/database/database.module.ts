import { ConfigurationModule } from '../configuration/configuration.module';
import { DatabaseService } from './database.service';
import { Module } from '@nestjs/common';

@Module({
	exports: [DatabaseService],
	imports: [ConfigurationModule],
	providers: [DatabaseService],
})
export class DatabaseModule {}
