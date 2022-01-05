import {
    Monster,
    MonsterTextes,
    MonsterTextesQuote,
    MonsterTextesQuoteAuthor,
    MonsterWeakspots
} from '../../monster/domain/monster';
import { MonsterEntity } from '../../monster/persistence/monster-entity';

export class MonsterMapper {
    static toDomainModel(monsterEntity: MonsterEntity): Monster {
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
                    monsterEntityTextes.quote.text
                )
            ),
            new MonsterWeakspots(
                monsterEntity.weakspots.bombs,
                monsterEntity.weakspots.oils,
                monsterEntity.weakspots.potions,
                monsterEntity.weakspots.signs,
            )
        );
    }

    static toDomainModels(monsterEntities: MonsterEntity[]): Monster[] {
        return monsterEntities
            .map(
                monsterEntity => this.toDomainModel(monsterEntity)
            );
    }
}
