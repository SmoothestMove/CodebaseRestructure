import React from 'react';
import { Owner, Category } from '../types/types';
import { IoSettingsSharp, IoSync } from 'react-icons/io5'; 
import { FcGoogle } from 'react-icons/fc'; 
import { FaExclamationTriangle } from 'react-icons/fa';
import {
    FaBoxOpen, FaTruck, FaWrench, FaHome, FaUtensils, FaQuestionCircle, FaPlusCircle, FaEdit, FaTrash, FaCamera, FaKeyboard, FaTimes, FaGift, FaBriefcase, FaShoppingCart, FaCreditCard, FaDollarSign, FaClipboardList, FaCog, FaGasPump, FaWarehouse, FaShieldAlt, FaBed, FaTape, FaBroom, FaPlug, FaWifi, FaCouch, FaPaintBrush, FaKey, FaApple, FaPaw, FaBaby, FaPeopleCarry, FaMoneyBillWave, FaHouseUser, FaInfoCircle
} from 'react-icons/fa';
import { IoHome, IoHammer, IoBagHandle } from 'react-icons/io5';

/**
 * Firebase configuration with environment-specific settings.
 * @type {object}
 */
export const firebaseConfig = {
  apiKey: String(import.meta.env.VITE_FIREBASE_API_KEY || '').replace(/[\s]/g, ''),
  authDomain: String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '').replace(/[\s]/g, ''),
  projectId: String(import.meta.env.VITE_FIREBASE_PROJECT_ID || '').replace(/[\s]/g, ''),
  storageBucket: String(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '').replace(/[\s]/g, ''),
  messagingSenderId: String(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '').replace(/[\s]/g, ''),
  appId: String(import.meta.env.VITE_FIREBASE_APP_ID || '').replace(/[\s]/g, ''),
  measurementId: "G-4NW7CSXH7S"
};

/**
 * The key for storing settings in local storage.
 * @type {string}
 */
export const SETTINGS_LOCAL_STORAGE_KEY = 'smoothMovesSettings'; 

/**
 * A list of predefined communal rooms.
 * @type {Owner[]}
 */
export const PREDEFINED_COMMUNAL_ROOMS: Owner[] = [
  { uid: 'KT', firstName: 'Kitchen', lastName: '(Communal)', color: '#FFA500', createdAt: 0 },
  { uid: 'LR', firstName: 'Living Room', lastName: '(Communal)', color: '#008000', createdAt: 0 },
  { uid: 'BR', firstName: 'Bathroom', lastName: '(Communal)', color: '#00FFFF', createdAt: 0 },
  { uid: 'DR', firstName: 'Dining Room', lastName: '(Communal)', color: '#800000', createdAt: 0 },
  { uid: 'BM', firstName: 'Basement', lastName: '(Communal)', color: '#FFC0CB', createdAt: 0 },
  { uid: 'GA', firstName: 'Garage', lastName: '(Communal)', color: '#7B3F1B', createdAt: 0 },
  { uid: 'OF', firstName: 'Office', lastName: '(Communal)', color: '#000080', createdAt: 0 },
];

const iconBaseClass = "inline-block";

/**
 * A mapping of icon names to React components.
 * @type {object.<string, React.ReactNode>}
 */
export const ICONS: { [key: string]: React.ReactNode } = {
    Package: <FaBoxOpen />,
    Truck: <FaTruck />,
    Wrench: <FaWrench />,
    Home: <FaHome />,
    Utensils: <FaUtensils />,
    HelpCircle: <FaQuestionCircle />,
    PlusCircle: <FaPlusCircle />,
    Edit: <FaEdit />,
    Trash: <FaTrash />,
    Camera: <FaCamera />,
    Type: <FaKeyboard />,
    X: <FaTimes />,
    Gift: <FaGift />,
    Briefcase: <FaBriefcase />,
    ShoppingCart: <FaShoppingCart />,
    CreditCard: <FaCreditCard />,
    DollarSign: <FaDollarSign />,
    Clipboard: <FaClipboardList />,
    Settings: <FaCog />,
    Fuel: <FaGasPump />,
    Warehouse: <FaWarehouse />,
    ShieldCheck: <FaShieldAlt />,
    Bed: <FaBed />,
    Tape: <FaTape />,
    Broom: <FaBroom />,
    Plug: <FaPlug />,
    Wifi: <FaWifi />,
    Couch: <FaCouch />,
    Paintbrush: <FaPaintBrush />,
    Key: <FaKey />,
    Apple: <FaApple />,
    PawPrint: <FaPaw />,
    AlertTriangle: <FaExclamationTriangle />,
    Info: <FaInfoCircle />,
    // New Icons from feedback
    MovingCompany: <FaPeopleCarry />,
    MoversTip: <FaMoneyBillWave />,
    PackingSupplies: <FaBoxOpen />,
    ToolsEquipment: <IoHammer />,
    CleaningSupplies: <FaBroom />,
    Utilities: <FaPlug />,
    InternetCable: <FaWifi />,
    NewFurniture: <FaCouch />,
    HomeRepairs: <IoHome />,
    Groceries: <IoBagHandle />,
    Deposits: <FaHouseUser />,
    PetCare: <FaPaw />,
    ChildCare: <FaBaby />,
    ProfessionalServicesIcon: <FaBriefcase />
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Packing Supplies', estimatedAmount: 0, color: '#3b82f6', icon: 'PackingSupplies', deletable: true },
  { id: 'cat-2', name: 'Transportation', estimatedAmount: 0, color: '#8b5cf6', icon: 'Truck', deletable: true },
  { id: 'cat-3', name: 'Professional Services', estimatedAmount: 0, color: '#ec4899', icon: 'ProfessionalServicesIcon', deletable: true },
  { id: 'cat-4', name: 'New Home Essentials', estimatedAmount: 0, color: '#f59e0b', icon: 'Home', deletable: true },
  { id: 'cat-5', name: 'Food & Refreshments', estimatedAmount: 0, color: '#10b981', icon: 'Utensils', deletable: true },
  { id: 'cat-6', name: 'Miscellaneous/Contingency', estimatedAmount: 0, color: '#64748b', icon: 'HelpCircle', deletable: true },
];

export const BUDGET_TEMPLATES = {
  LOCAL: {
    'cat-1': 15,
    'cat-2': 60,
    'cat-3': 5,
    'cat-4': 5,
    'cat-5': 5,
    'cat-6': 10,
  },
  LONG_DISTANCE: {
    'cat-1': 3,
    'cat-2': 81,
    'cat-3': 5,
    'cat-4': 3,
    'cat-5': 3,
    'cat-6': 5,
  },
};

export const CATEGORY_ICONS_OPTIONS = [
    'PackingSupplies', 'Truck', 'ProfessionalServicesIcon', 'Home', 'Utensils', 'ShoppingCart', 'CreditCard', 'DollarSign', 'Briefcase',
    'Gift', 'Clipboard', 'Settings', 'HelpCircle', 'Fuel', 'Warehouse', 'ShieldCheck', 'Bed', 'Tape',
    'Broom', 'Plug', 'Wifi', 'Couch', 'Paintbrush', 'Key', 'Apple', 'PawPrint',
    'MovingCompany', 'MoversTip', 'ToolsEquipment', 'Groceries', 'Deposits', 'PetCare', 'ChildCare'
];

export const IconPlus: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`${iconBaseClass} ${className}`}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
);

// ... (rest of icon helpers unchanged)
