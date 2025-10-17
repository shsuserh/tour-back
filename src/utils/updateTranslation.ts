import { EntityManager } from 'typeorm';
import { TranslationUpdateDto } from '../datatypes/dtos/response/translation,response.dto';

export async function updateTranslations<T extends { translations: TranslationUpdateDto[] }>(
  item: T,
  entityClass: { new (): T },
  translations: { lgCode: string; field: string; value: string }[],
  transactionalEntityManager: EntityManager,
  ObjTranslation
): Promise<void> {
  const incomingTranslationKeys = new Set(translations.map(({ lgCode, field }) => `${lgCode}-${field}`));

  item.translations = item.translations.filter((translation) => {
    if (!incomingTranslationKeys.has(`${translation.lgCode}-${translation.field}`)) {
      transactionalEntityManager.remove(translation);
      return false;
    }
    return true;
  });

  const existingTranslationMap = new Map(item.translations.map((t) => [`${t.lgCode}-${t.field}`, t]));

  for (const newTranslation of translations) {
    const key = `${newTranslation.lgCode}-${newTranslation.field}`;
    const existingTranslation = existingTranslationMap.get(key);

    if (existingTranslation) {
      existingTranslation.value = newTranslation.value;
    } else {
      const newTranslationEntity = Object.assign(new ObjTranslation(), newTranslation, { item });
      item.translations.push(newTranslationEntity);
      existingTranslationMap.set(key, newTranslationEntity);
    }
  }

  await transactionalEntityManager.save(entityClass, item);
}
