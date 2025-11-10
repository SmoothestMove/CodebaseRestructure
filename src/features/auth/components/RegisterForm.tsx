
import React, { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * @interface RegisterFormProps
 * @description Defines the properties for the RegisterForm component.
 */
interface RegisterFormProps {
  /** A callback function to be called when the registration is successful. */
  onRegisterSuccess?: () => void;
}

/**
 * A component that displays a registration form and handles user registration.
 * @param {RegisterFormProps} props - The properties for the RegisterForm component.
 * @returns {JSX.Element} The rendered RegisterForm component.
 */
const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
      if (onRegisterSuccess) {
        onRegisterSuccess();
      } else {
        navigate('/app');
      }
    } catch (err) {
      setError('Failed to register');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
