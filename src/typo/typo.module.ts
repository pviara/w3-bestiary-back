import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypoController } from './presentation/typo.controller';
import { TypoRepoProvider } from './persistence/typo-repository.provider';
import { typoSchema } from './persistence/typo-entity';
import { ReportTextTypoHandler } from './application/commands/report-text-typo.handler';

@Module({
    controllers: [TypoController],
    exports: [],
    imports: [
        CqrsModule,
        MongooseModule.forFeature([{ name: 'Typo', schema: typoSchema }])
    ],
    providers: [
        ReportTextTypoHandler,
        TypoRepoProvider,
    ],
})
export class TypoModule {}
