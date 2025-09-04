import { CalendarDto } from '@/types/api';
import { signInAnonymously } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

/** 
 * Firebase Authentication を使用して匿名ユーザーとしてサインイン
 * サインイン済みのユーザーがいればその UID を返す
 */
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

/** 
 * 指定された日付 (data.date) のユーザーのステータス (data.status) を Firestore に保存
 */
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

/** 
 * Firestore 内にある全ての日付とステータスのデータを取得
 */
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

/** 
 * 指定された日付 (date) に対応する単一のステータスを Firestore から取得
 */
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