import { Typo } from "src/typo/domain/typo";
import { TypoEntity } from "src/typo/persistence/typo-entity";

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