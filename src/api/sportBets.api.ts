import {
  writeBatch,
  doc,
  query,
  collection,
  getDocs,
  where,
  orderBy,
} from 'firebase/firestore';
import { SportBet } from '../types/sportBet.types';
import { db } from '../firebase';
import { SportSlug } from '../types/stake.types';

export const insertMultipleBets = async (
  sportBets: SportBet[]
): Promise<void> => {
  const batch = writeBatch(db);
  sportBets.forEach((bet) => {
    const docRef = doc(db, 'sportBets', bet.id);
    batch.set(docRef, bet);
  });
  await batch.commit();
};

export const getSportBets = async ({
  sportSlugs,
}: {
  sportSlugs: SportSlug[] | 'all';
}): Promise<SportBet[]> => {
  const sportBetsRef = collection(db, 'sportBets');
  const q = query(
    sportBetsRef,
    orderBy('createdAt', 'desc'),
    where('sportSlug', 'in', sportSlugs)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => doc.data() as SportBet)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};
