import { CalendarDto } from '@/types/api';
import { signInAnonymously } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export const signInAnonymouslyAsync = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;

  if (currentUser) {
    return currentUser.uid;
  }

  try {
    const userCredential = await signInAnonymously(auth);

    return userCredential.user.uid;
  } catch (error) {
    return null;
  }
};

// 日付に対するステータスを書き込む
export const setStatusForDate = async (data: CalendarDto) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.error('User not authenticated.');
    return;
  }

  try {
    const docRef = doc(db, 'users', userId, 'calendarInfo', data.date);
    await setDoc(docRef, {
      status: data.status,
    });
    console.log('Document successfully written for user:', userId);
  } catch (e) {
    console.error('Error writing document:', e);
  }
};

// 全ての日付とステータスを取得
export const getAllData = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.error('User not authenticated.');
    return [];
  }

  const querySnapshot = await getDocs(collection(db, 'users', userId, 'calendarInfo'));
  const fetchedData: { date: string; status: string }[] = [];
  querySnapshot.forEach((doc) => {
    fetchedData.push({
      date: doc.id,
      status: doc.data().status as string,
    });
  });
  return fetchedData;
};

// 特定の日付のステータスを取得
export const getStatusByDate = async (date: string): Promise<string | null> => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.error('User not authenticated.');
    return null;
  }

  try {
    const docRef = doc(db, 'users', userId, 'calendarInfo', date);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log('No such document for user:', userId);
      return null;
    }

    return docSnap.data().status as string;

  } catch (e) {
    console.error('Error getting document: ', e);
    return null;
  }
};