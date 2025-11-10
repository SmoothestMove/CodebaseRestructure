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

/**
 * Signs in a user with email and password.
 * @param {LoginFormInputs} data - The user's login credentials.
 * @returns {Promise<User>} A promise that resolves with the authenticated user object.
 */
export const loginWithEmail = async (data: LoginFormInputs): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
  return userCredential.user;
};

/**
 * Registers a new user with email and password.
 * @param {RegisterFormInputs} data - The user's registration data.
 * @returns {Promise<User>} A promise that resolves with the newly created user object.
 */
export const registerWithEmail = async (data: RegisterFormInputs): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  return userCredential.user;
};

/**
 * Signs out the current user.
 * @returns {Promise<void>} A promise that resolves when the user has been signed out.
 */
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Signs in a user with Google.
 * @returns {Promise<User>} A promise that resolves with the authenticated user object.
 */
export const loginWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

