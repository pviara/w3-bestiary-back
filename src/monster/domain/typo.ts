export class Typo {
    constructor(
        readonly _id: string,
        readonly lang: string,
        readonly monsterCode: string,
        readonly content: string,
        readonly githubIssueURL?: string,
    ) {}
}
