// @ts-nocheck
// API service functions for authentication operations (login, register, logout).


import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { auth } from '@/main';
import { LoginFormInputs, RegisterFormInputs } from '../types/authTypes';

export const loginWithEmail = async (data: LoginFormInputs): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
  return userCredential.user;
};

export const registerWithEmail = async (data: RegisterFormInputs): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  return userCredential.user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const loginWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};


