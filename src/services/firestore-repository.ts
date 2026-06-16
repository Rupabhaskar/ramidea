import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type QueryConstraint,
  type DocumentData,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/constants";

export class FirestoreRepository<T extends { id: string }> {
  constructor(
    private collectionName: string,
    private mockData: T[] = []
  ) {}

  private getCollection() {
    if (!db) throw new Error("Firestore not configured");
    return collection(db, this.collectionName);
  }

  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    if (!isFirebaseConfigured() || !db) return [...this.mockData];

    const q = query(this.getCollection(), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  }

  async getById(id: string): Promise<T | null> {
    if (!isFirebaseConfigured() || !db) {
      return this.mockData.find((item) => item.id === id) ?? null;
    }

    const snap = await getDoc(doc(db, this.collectionName, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as T;
  }

  async create(data: Omit<T, "id">): Promise<T> {
    if (!isFirebaseConfigured() || !db) {
      const item = { id: crypto.randomUUID(), ...data } as T;
      this.mockData.push(item);
      return item;
    }

    const docRef = await addDoc(this.getCollection(), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data } as T;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      const index = this.mockData.findIndex((item) => item.id === id);
      if (index >= 0) this.mockData[index] = { ...this.mockData[index], ...data };
      return;
    }

    await updateDoc(doc(db, this.collectionName, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  async delete(id: string): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
      this.mockData = this.mockData.filter((item) => item.id !== id);
      return;
    }
    await deleteDoc(doc(db, this.collectionName, id));
  }

  subscribe(
    callback: (items: T[]) => void,
    constraints: QueryConstraint[] = []
  ): () => void {
    if (!isFirebaseConfigured() || !db) {
      callback([...this.mockData]);
      return () => {};
    }

    const q = query(this.getCollection(), ...constraints);
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
      callback(items);
    });
  }

  async queryByField(field: string, value: unknown): Promise<T[]> {
    return this.getAll([where(field, "==", value)]);
  }
}

export { collection, doc, query, where, orderBy, limit, onSnapshot, serverTimestamp };
export type { QueryConstraint, DocumentData };
