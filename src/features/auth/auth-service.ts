"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  type User as FirebaseUser,
  type ConfirmationResult,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/constants";
import type { User, UserRole } from "@/types";
import { mockUser, mockClientUser } from "@/lib/mock-data";

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: UserRole = "advertiser"
): Promise<User> {
  if (!isFirebaseConfigured() || !auth || !db) {
    return {
      ...mockClientUser,
      email,
      name,
      role: "advertiser",
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(credential.user);

  const userData: Omit<User, "id"> = {
    name,
    email,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(doc(db, COLLECTIONS.users, credential.user.uid), {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const user: User = { id: credential.user.uid, ...userData };

  if (role === "advertiser") {
    const { resolveAdvertiserId } = await import("@/services/client-account-service");
    const advertiserId = await resolveAdvertiserId(user);
    if (advertiserId) {
      return { ...user, advertiserId };
    }
  }

  return user;
}

export async function signIn(email: string, password: string): Promise<User> {
  if (!isFirebaseConfigured() || !auth || !db) {
    if (email.includes("client") || email.includes("heritage") || email.includes("advertiser") || email.includes("amaravati")) {
      return { ...mockClientUser, email };
    }
    return { ...mockUser, email };
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  return getUserProfile(credential.user.uid);
}

export async function signInWithGoogle(): Promise<User> {
  if (!isFirebaseConfigured() || !auth || !db) {
    return mockUser;
  }

  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  const existing = await getDoc(doc(db, COLLECTIONS.users, credential.user.uid));

  if (!existing.exists()) {
    await setDoc(doc(db, COLLECTIONS.users, credential.user.uid), {
      name: credential.user.displayName ?? "User",
      email: credential.user.email,
      role: "advertiser",
      avatar: credential.user.photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  let profile = await getUserProfile(credential.user.uid);

  if (profile.role === "advertiser" && !profile.advertiserId) {
    const { resolveAdvertiserId } = await import("@/services/client-account-service");
    const advertiserId = await resolveAdvertiserId(profile);
    if (advertiserId) profile = { ...profile, advertiserId };
  }

  return profile;
}

export function setupRecaptcha(elementId: string): RecaptchaVerifier {
  if (!auth) throw new Error("Firebase Auth not configured");
  return new RecaptchaVerifier(auth, elementId, { size: "invisible" });
}

export async function signInWithPhone(
  phone: string,
  recaptcha: RecaptchaVerifier
): Promise<ConfirmationResult> {
  if (!auth) throw new Error("Firebase Auth not configured");
  return signInWithPhoneNumber(auth, phone, recaptcha);
}

export async function resetPassword(email: string): Promise<void> {
  if (!isFirebaseConfigured() || !auth) return;
  await sendPasswordResetEmail(auth, email);
}

export async function logOut(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export async function getUserProfile(uid: string): Promise<User> {
  if (!db) return mockUser;

  const snap = await getDoc(doc(db, COLLECTIONS.users, uid));
  if (!snap.exists()) throw new Error("User profile not found");
  return { id: snap.id, ...snap.data() } as User;
}

export function onAuthChange(callback: (user: User | null) => void) {
  if (!isFirebaseConfigured() || !auth) {
    callback(mockUser);
    return () => {};
  }

  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    try {
      let profile = await getUserProfile(firebaseUser.uid);

      if (!profile.advertiserId && profile.role === "advertiser") {
        const { resolveAdvertiserId } = await import("@/services/client-account-service");
        const advertiserId = await resolveAdvertiserId(profile);
        if (advertiserId) {
          profile = { ...profile, advertiserId };
        }
      }

      callback(profile);
    } catch {
      callback(null);
    }
  });
}
