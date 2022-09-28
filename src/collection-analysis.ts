import { Pieces } from './api';

export function canBuildFrom(collection: Pieces, existingSet: Pieces): boolean {
  for (const [setPieceId, setPieceVariants] of existingSet) {
    if (!collection.has(setPieceId)) {
      return false;
    }
    for (const [setPieceColor, setPieceCount] of setPieceVariants) {
      const collectionVariants = collection.get(setPieceId);

      if (!collectionVariants) {
        return false;
      }

      if (!collectionVariants.has(setPieceColor)) {
        return false;
      }

      if (
        collectionVariants.has(setPieceColor) &&
        (collectionVariants.get(setPieceColor) as number) < setPieceCount
      ) {
        return false;
      }
    }
  }
  return true;
}
