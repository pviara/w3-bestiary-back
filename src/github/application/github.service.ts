import axios from 'axios';
import { ConfigurationService } from 'src/infrastructure/configuration/configuration.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GitHubService {
    private _endpoint!: string;

    constructor(private readonly _configService: ConfigurationService) {
        const gitHubUser = this._configService.gitHub.GITHUB_USER;
        const gitHubRepo = this._configService.gitHub.GITHUB_REPO;
        this._endpoint = `https://api.github.com/repos/${gitHubUser}/${gitHubRepo}`;
    }

    async getRepoIssues() {
        const response = await axios.get(`${this._endpoint}/issues`);
        console.log(response.data);
    }
}
