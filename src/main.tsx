import React from 'react';
import '../index.css';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/hooks/AuthContext';
import { ThemeProvider } from '@/hooks/useTheme';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '@/lib/config/constants';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Create a component that wraps the app with AuthProvider
// This ensures all hooks inside AuthProvider have access to the router context
const AppWithProviders = () => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <App />
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

root.render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
);
