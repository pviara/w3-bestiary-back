import { Typo } from 'src/monster/domain/typo';
import { TypoEntity } from 'src/monster/persistence/entities/typo-entity';

export class TypoMapper {
    static toTypo(typoEntity: TypoEntity): Typo {
        return new Typo(
            typoEntity._id,
            typoEntity.lang,
            typoEntity.monsterCode,
            typoEntity.content,
            typoEntity.githubIssueURL,
        );
    }
}
