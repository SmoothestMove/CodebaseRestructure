// @ts-nocheck
// API service functions for authentication operations (login, register, logout).

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/main';
import { LoginFormInputs, RegisterFormInputs } from '../types/authTypes';
import { retryWithBackoff } from '@/lib/api/retry';

const shouldRetryAuthError = (error: unknown) => {
  return error instanceof FirebaseError && error.code === 'auth/network-request-failed';
};

const withAuthRetry = async <T>(operation: () => Promise<T>): Promise<T> => {
  return retryWithBackoff(() => operation(), {
    shouldRetry: (error, attempt) => {
      const retryable = shouldRetryAuthError(error);
      if (retryable && typeof console !== 'undefined') {
        console.warn('[auth] Network request failed – retrying sign-in/register flow', { attempt: attempt + 1 });
      }
      return retryable;
    },
  });
};

const extractUser = (credential: UserCredential): User => credential.user;

export const loginWithEmail = async (data: LoginFormInputs): Promise<User> => {
  const credential = await withAuthRetry(() => signInWithEmailAndPassword(auth, data.email, data.password));
  return extractUser(credential);
};

export const registerWithEmail = async (data: RegisterFormInputs): Promise<User> => {
  const credential = await withAuthRetry(() => createUserWithEmailAndPassword(auth, data.email, data.password));
  return extractUser(credential);
};

export const logout = async (): Promise<void> => {
  await withAuthRetry(() => signOut(auth));
};

export const loginWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const credential = await withAuthRetry(() => signInWithPopup(auth, provider));
  return extractUser(credential);
};
