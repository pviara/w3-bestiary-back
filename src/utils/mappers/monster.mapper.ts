import {
    Monster,
    MonsterByCategory,
    MonstersByCategory,
    MonstersByCategoryCategory,
    MonsterTextes,
    MonsterTextesQuote,
    MonsterTextesQuoteAuthor,
    MonsterWeakspots,
} from '../../monster/domain/monster';
import {
    MonsterByCategoryEntity,
    MonsterEntity,
    MonstersByCategoryEntity,
} from '../../monster/persistence/monster-entity';

export class MonsterMapper {
    static toMonster(monsterEntity: MonsterEntity): Monster {
        const monsterEntityTextes = monsterEntity.textes[0];
        return new Monster(
            monsterEntity.category,
            monsterEntity.code,
            new MonsterTextes(
                monsterEntityTextes.description,
                monsterEntityTextes.name,
                new MonsterTextesQuote(
                    new MonsterTextesQuoteAuthor(
                        monsterEntityTextes.quote.author.firstname,
                        monsterEntityTextes.quote.author.lastname,
                        monsterEntityTextes.quote.author.title,
                    ),
                    monsterEntityTextes.quote.text,
                ),
            ),
            new MonsterWeakspots(
                monsterEntity.weakspots.bombs,
                monsterEntity.weakspots.oils,
                monsterEntity.weakspots.potions,
                monsterEntity.weakspots.signs,
            ),
        );
    }

    static toMonsterByCategory(
        monsterByCategoryEntity: MonsterByCategoryEntity,
    ): MonsterByCategory {
        const monsterByCategoryEntityTextes = monsterByCategoryEntity.textes[0];

        return new MonsterByCategory(
            monsterByCategoryEntity.code,
            monsterByCategoryEntityTextes,
        );
    }

    static toMonsters(monsterEntities: MonsterEntity[]): Monster[] {
        return monsterEntities.map((monsterEntity) =>
            this.toMonster(monsterEntity),
        );
    }

    static toMonstersByCategories(
        monstersByCategoryEntities: MonstersByCategoryEntity[],
    ): MonstersByCategory[] {
        return monstersByCategoryEntities.map((monsterByCategoryEntity) =>
            this.toMonstersByCategory(monsterByCategoryEntity),
        );
    }

    static toMonstersByCategory(
        monstersByCategoryEntity: MonstersByCategoryEntity,
    ): MonstersByCategory {
        const categoryTextes = monstersByCategoryEntity.category.textes[0];

        return new MonstersByCategory(
            new MonstersByCategoryCategory(
                monstersByCategoryEntity.category.code,
                categoryTextes.name,
            ),
            this.toMonstersInsideCategories(monstersByCategoryEntity.monsters),
        );
    }

    static toMonstersInsideCategories(
        monstersByCategoryEntities: MonsterByCategoryEntity[],
    ): MonsterByCategory[] {
        return monstersByCategoryEntities.map(
            (monsterByCategoryEntity) =>
                new MonsterByCategory(
                    monsterByCategoryEntity.code,
                    monsterByCategoryEntity.textes[0],
                ),
        );
    }
}
