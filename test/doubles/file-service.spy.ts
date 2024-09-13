import { Error } from '../../src/application/error';
import {
    FileFolder,
    FileFormat,
    FileService,
} from '../../src/file/application/file-service.interface';
import { ReadStream } from 'fs';
import { Result } from '../../src/application/result';

export class FileServiceSpy implements FileService {
    calls = {
        computeFilePath: {
            count: 0,
            history: [] as [FileFolder, FileFormat, string][],
        },
        getFileStream: {
            count: 0,
            history: [] as string[],
        },
    };

    computeFilePath(
        folder: FileFolder,
        format: FileFormat,
        code: string,
    ): string {
        this.incrementCallsToComputeFilePath([folder, format, code]);
        return '';
    }

    incrementCallsToComputeFilePath(
        history: [FileFolder, FileFormat, string],
    ): void {
        this.calls.computeFilePath.count++;
        this.calls.computeFilePath.history.push(history);
    }

    getFileStream(path: string): Result<ReadStream> | Error {
        this.calls.getFileStream.count++;
        this.calls.getFileStream.history.push(path);
        return new Result();
    }
}

export function stubComputeFilePath(
    service: FileServiceSpy,
    value: ReturnType<FileService['computeFilePath']>,
): void {
    service.computeFilePath = (
        folder: FileFolder,
        format: FileFormat,
        code: string,
    ): typeof value => {
        service.incrementCallsToComputeFilePath([folder, format, code]);
        return value;
    };
}
