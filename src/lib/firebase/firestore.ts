import { db, storage } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  orderBy,
  query,
  updateDoc,
  doc,
  increment,
  onSnapshot,
  deleteDoc,
  type Timestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import type { LevelMessage as DbLevelMessage } from '@/ai/flows/personalized-level-messages';

// Re-export LevelMessage and add id
export type LevelMessage = DbLevelMessage & { id?: string };

export type Wish = {
  id?: string;
  author: string;
  message: string;
  likes?: number;
  createdAt?: Timestamp;
};

export type ContactMessage = {
  id?: string;
  name: string;
  message: string;
  createdAt?: Timestamp;
};

export type ChatMessage = {
  id?: string;
  author: string;
  message: string;
  createdAt?: Timestamp;
};


// Function to upload a file to Firebase Storage
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

// Function to add a level message
export const addLevelMessage = async (message: DbLevelMessage) => {
  await addDoc(collection(db, 'level-messages'), {
    ...message,
    createdAt: serverTimestamp(),
  });
};

// Function to get all level messages
export const getLevelMessages = async (): Promise<LevelMessage[]> => {
  const q = query(collection(db, 'level-messages'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LevelMessage));
};

// Generic function to delete a document from a collection
export const deleteLevelMessage = async (collectionName: string, id: string) => {
    await deleteDoc(doc(db, collectionName, id));
};


// Function to add a birthday wish
export const addWish = async (wish: { author: string; message: string }): Promise<string> => {
  const docRef = await addDoc(collection(db, 'wishes'), {
    ...wish,
    likes: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Function to get all birthday wishes
export const getWishes = async (): Promise<Wish[]> => {
  const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Wish));
};

// Function to "like" a wish
export const likeWish = async (id: string) => {
  const wishRef = doc(db, 'wishes', id);
  await updateDoc(wishRef, {
    likes: increment(1),
  });
};

// Function to add a contact message
export const addContactMessage = async (message: { name: string; message: string }) => {
  await addDoc(collection(db, 'contact-messages'), {
    ...message,
    createdAt: serverTimestamp(),
  });
};

// Function to get all contact messages
export const getContactMessages = async (): Promise<ContactMessage[]> => {
    const q = query(collection(db, 'contact-messages'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
}

// Function to add a chat message
export const addChatMessage = async (message: { author: string; message: string }) => {
    await addDoc(collection(db, 'chat-messages'), {
      ...message,
      createdAt: serverTimestamp(),
    });
};
  
// Function to listen for real-time chat messages
export const onChatMessagesSnapshot = (
    callback: (messages: ChatMessage[]) => void,
    onError: (error: Error) => void
) => {
    const q = query(collection(db, 'chat-messages'), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
        callback(messages);
    }, (error) => {
        console.error("Error in chat snapshot listener: ", error);
        onError(error);
    });

    return unsubscribe;
};
