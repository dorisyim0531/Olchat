import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Unsubscribe,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Post } from '../types';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_HANDOVER_LOCATION,
  INITIAL_POSTS,
} from '../utils/storage';

const POSTS_COLLECTION = 'posts';
const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'config';

const postsCollectionRef = collection(db, POSTS_COLLECTION);
const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);

let initialSeedPromise: Promise<void> | null = null;
let initialSettingsPromise: Promise<void> | null = null;

export function seedInitialPostsIfEmpty(): Promise<void> {
  if (initialSeedPromise) return initialSeedPromise;

  initialSeedPromise = (async () => {
    try {
      const snapshot = await getDocs(postsCollectionRef);
      if (!snapshot.empty) {
        return;
      }

      const batch = writeBatch(db);
      for (const post of INITIAL_POSTS) {
        const docRef = doc(db, POSTS_COLLECTION, post.id);
        batch.set(docRef, {
          type: post.type,
          category: post.category,
          title: post.title,
          location: post.location,
          handoverLocation: post.handoverLocation,
          createdAt: post.createdAt,
        });
      }
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, POSTS_COLLECTION);
    }
  })();

  return initialSeedPromise;
}

export function ensureInitialSettings(): Promise<void> {
  if (initialSettingsPromise) return initialSettingsPromise;

  initialSettingsPromise = (async () => {
    try {
      const snapshot = await getDoc(settingsDocRef);
      if (snapshot.exists()) {
        return;
      }

      await setDoc(
        settingsDocRef,
        {
          handoverLocation: DEFAULT_HANDOVER_LOCATION,
          categories: DEFAULT_CATEGORIES,
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.WRITE,
        `${SETTINGS_COLLECTION}/${SETTINGS_DOC_ID}`
      );
    }
  })();

  return initialSettingsPromise;
}

export function subscribeToPosts(
  onUpdate: (posts: Post[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  const postsQuery = query(postsCollectionRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    postsQuery,
    (snapshot) => {
      const nextPosts: Post[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          type: data.type === 'found' ? 'found' : 'lost',
          category: typeof data.category === 'string' ? data.category : '',
          title: typeof data.title === 'string' ? data.title : '',
          location: typeof data.location === 'string' ? data.location : '',
          handoverLocation:
            typeof data.handoverLocation === 'string' && data.handoverLocation.trim()
              ? data.handoverLocation
              : DEFAULT_HANDOVER_LOCATION,
          createdAt: typeof data.createdAt === 'string' ? data.createdAt : '',
        };
      });
      onUpdate(nextPosts);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, POSTS_COLLECTION);
      } catch (wrappedError) {
        onError(wrappedError);
      }
    }
  );
}

export interface AppSettings {
  handoverLocation: string;
  categories: string[];
}

export function subscribeToSettings(
  onUpdate: (settings: AppSettings) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  return onSnapshot(
    settingsDocRef,
    (docSnap) => {
      if (!docSnap.exists()) {
        onUpdate({
          handoverLocation: DEFAULT_HANDOVER_LOCATION,
          categories: DEFAULT_CATEGORIES,
        });
        return;
      }

      const data = docSnap.data();
      const handoverLocation =
        typeof data.handoverLocation === 'string' && data.handoverLocation.trim()
          ? data.handoverLocation.trim()
          : DEFAULT_HANDOVER_LOCATION;

      const categories =
        Array.isArray(data.categories) && data.categories.length > 0
          ? data.categories.filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
          : DEFAULT_CATEGORIES;

      onUpdate({
        handoverLocation,
        categories: categories.length > 0 ? categories : DEFAULT_CATEGORIES,
      });
    },
    (error) => {
      try {
        handleFirestoreError(
          error,
          OperationType.GET,
          `${SETTINGS_COLLECTION}/${SETTINGS_DOC_ID}`
        );
      } catch (wrappedError) {
        onError(wrappedError);
      }
    }
  );
}

export async function createPost(postData: Omit<Post, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(postsCollectionRef, {
      type: postData.type,
      category: postData.category,
      title: postData.title,
      location: postData.location,
      handoverLocation: postData.handoverLocation,
      createdAt: postData.createdAt,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, POSTS_COLLECTION);
  }
}

export async function deletePost(postId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, postId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${POSTS_COLLECTION}/${postId}`);
  }
}

export async function saveHandoverLocation(handoverLocation: string): Promise<void> {
  try {
    await setDoc(settingsDocRef, { handoverLocation }, { merge: true });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      `${SETTINGS_COLLECTION}/${SETTINGS_DOC_ID}`
    );
  }
}

export async function saveCategories(categories: string[]): Promise<void> {
  try {
    await setDoc(settingsDocRef, { categories }, { merge: true });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      `${SETTINGS_COLLECTION}/${SETTINGS_DOC_ID}`
    );
  }
}
