export class Configuration {
    readonly database = new DatabaseConfiguration();
    readonly gitHub = new GitHubConfiguration();
}

export class DatabaseConfiguration {
    MONGODB_URI: string;
    MONGODB_USER: string;
    MONGODB_PASSWORD: string;
    MONGODB_DBNAME: string;
}

export class GitHubConfiguration {
    GITHUB_USER: string;
    GITHUB_REPO: string;
}
