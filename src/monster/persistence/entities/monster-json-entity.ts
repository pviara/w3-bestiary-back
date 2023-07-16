export enum GameExpansionSet {
    HeartsOfStone = 'hearts-of-stone',
    BloodAndWine = 'blood-and-wine',
}

class MonsterTextesQuoteAuthorEntity {
    firstname: string;
    lastname: string;
    title: string;
}

class MonsterTextesQuoteEntity {
    author: MonsterTextesQuoteAuthorEntity;
    text: string;
}

export class MonsterTextesEntity {
    lang: string;
    description: string;
    name: string;
    quote?: MonsterTextesQuoteEntity;
}

class MonsterWeakspotsEntity {
    bombs: string[];
    potions: string[];
    signs: string[];
}

export class MonsterJsonEntity {
    category: string;
    code: string;
    extension?: GameExpansionSet;
    textes: MonsterTextesEntity[];
    weakspots: MonsterWeakspotsEntity;
}
