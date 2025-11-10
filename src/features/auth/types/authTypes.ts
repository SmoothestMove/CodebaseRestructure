
/**
 * @interface LoginFormInputs
 * @description Defines the shape of the login form data.
 */
export interface LoginFormInputs {
  /** The user's email address. */
  email: string;
  /** The user's password. */
  password: string;
}

/**
 * @interface RegisterFormInputs
 * @description Defines the shape of the registration form data.
 */
export interface RegisterFormInputs {
  /** The user's email address. */
  email: string;
  /** The user's password. */
  password: string;
  /** The user's full name. */
  fullName: string;
}
