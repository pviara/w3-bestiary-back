import { ConfigurationModule } from 'src/infrastructure/configuration/configuration.module';
import { Module } from '@nestjs/common';
import { GitHubService } from './application/github.service';

@Module({
    exports: [GitHubService],
    imports: [ConfigurationModule],
    providers: [GitHubService]
})
export class GitHubModule {}