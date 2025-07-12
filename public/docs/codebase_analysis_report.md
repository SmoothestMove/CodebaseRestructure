# Codebase Analysis Report

This report details inconsistencies, improper code implementations, and incorrect import designations found during the analysis of the codebase.

## 1. Import Inconsistencies

### `src/main.tsx`
[]- `import App from './App';` -> Should be `import App from '@/App';`
[]- `import { AuthProvider } from './context/AuthContext';` -> Should be `import { AuthProvider } from '@/features/auth/hooks/AuthContext';`
[]- `import { ThemeProvider } from './hooks/useTheme';` -> Should be `import { ThemeProvider } from '@/hooks/useTheme';`
[]- `import { firebaseConfig } from './constants';` -> Should be `import { firebaseConfig } from '@/lib/config/constants';`
--------------------------------------------------------------------------------------------------------------------------------


### `src/features/settings/services/settingsService.ts`
[]- `import { AppSettings } from '../types';` -> Should be `import { AppSettings } from '@/types';`
[]- `import { SETTINGS_LOCAL_STORAGE_KEY } from '../constants';` -> Should be `import { SETTINGS_LOCAL_STORAGE_KEY } from '@/lib/config/constants';`
--------------------------------------------------------------------------------------------------------------------------------


### `src/features/settings/services/moveService.ts`
[]- `import { firestore } from '../index';` -> Should be `import { firestore } from '@/main';`
--------------------------------------------------------------------------------------------------------------------------------


### `src/features/settings/pages/SettingsPage.tsx`
[]- `import { useSettings } from '../hooks/useSettings';` -> Should be `import { useSettings } from '@/features/settings/hooks/useSettings';`
[]- `import { useBoxes } from '../hooks/useBoxes';` -> Should be `import { useBoxes } from '@/features/boxes/hooks/useBoxes';`
[]- `import { useOwners } from '../hooks/useOwners';` -> Should be `import { useOwners } from '@/features/owners/hooks/useOwners';`
[]- `import { useTheme } from '../hooks/useTheme';` -> Should be `import { useTheme } from '@/hooks/useTheme';`
[]- `import { getMoveById } from '../services/moveService';` -> Should be `import { getMoveById } from '@/features/settings/services/moveService';`
[]- `import Button from '../components/Button';` -> Should be `import Button from '@/components/common/Button';`
[]- `import Input from '../components/Input';` -> Should be `import Input from '@/components/common/Input';`
[]- `import Modal from '../components/Modal';` -> Should be `import Modal from '@/components/common/Modal';`
[]- `import Alert from '../components/Alert';` -> Should be `import Alert from '@/components/common/Alert';`
[]- `import { IconSettings, IconTrash } from '../constants';` -> Should be `import { IconSettings, IconTrash } from '@/lib/config/constants';`
[]- `import { PREDEFINED_COMMUNAL_ROOMS } from '../constants';` -> Should be `import { PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants';`
--------------------------------------------------------------------------------------------------------------------------------


### `src/features/settings/pages/DashboardPage.tsx`
- `import { useMove } from '../contexts/MoveContext';` -> Should be `import { useMove } from '@/features/settings/hooks/MoveContext';`
- `import { useBoxes } from '../hooks/useBoxes';` -> Should be `import { useBoxes } from '@/features/boxes/hooks/useBoxes';`
- `import { ItemStatus } from '../types';` -> Should be `import { ItemStatus } from '@/types';`
- `import { IconListBullet, IconCamera } from '../constants';` -> Should be `import { IconListBullet, IconCamera } from '@/lib/config/constants';`
- `import Button from '../components/Button';` -> Should be `import Button from '@/components/common/Button';`
- `import { MOVING_STATUS_LABELS } from '../utils/statusUtils';` -> Should be `import { MOVING_STATUS_LABELS } from '@/utils/statusUtils';`
[]--------------------------------------------------------------------------------------------------------------------------------


### `src/features/settings/hooks/useSettings.ts`
- `import { AppSettings } from '../types';` -> Should be `import { AppSettings } from '@/types';`
- `import * as settingsService from '../services/settingsService';` -> Should be `import * as settingsService from '@/features/settings/services/settingsService';`
[]--------------------------------------------------------------------------------------------------------------------------------


### `src/features/settings/hooks/useMoveSync.ts`
- `import { firestore } from '../index';` -> Should be `import { firestore } from '@/main';`
- `import { Move } from '../services/moveService';` -> Should be `import { Move } from '@/features/settings/services/moveService';`
[]--------------------------------------------------------------------------------------------------------------------------------


### `src/features/settings/hooks/useMovePresence.ts`
- `import { auth, firestore } from '../index';` -> Should be `import { auth, firestore } from '@/main';`
[]----------------------------------------------------------------------------------------------------------------


### `src/features/owners/services/ownerService.ts`
- `import { firestore as db } from '../index';` -> Should be `import { firestore as db } from '@/main';`
- `import { Owner, NewOwnerData } from '../types';` -> Should be `import { Owner, NewOwnerData } from '@/types';`
- `import { PREDEFINED_COMMUNAL_ROOMS } from '../constants';` -> Should be `import { PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants';`
[]------------------------------------------------------------------------------------------------


### `src/features/owners/pages/ManageSpacesPage.tsx`
- `import { useOwners } from '../hooks/useOwners';` -> Should be `import { useOwners } from '@/features/owners/hooks/useOwners';`
- `import { Owner } from '../types';` -> Should be `import { Owner } from '@/types';`
- `import Button from '../components/Button';` -> Should be `import Button from '@/components/common/Button';`
- `import OwnerCard from '../components/OwnerCard';` -> Should be `import OwnerCard from '@/features/owners/components/OwnerCard';`
- `import AddSpaceModal from '../components/AddSpaceModal';` -> Should be `import AddSpaceModal from '@/features/owners/components/AddSpaceModal';`
- `import Alert from '../components/Alert';` -> Should be `import Alert from '@/components/common/Alert';`
- `import { IconPlus, PREDEFINED_COMMUNAL_ROOMS } from '../constants';` -> Should be `import { IconPlus, PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants';`
- `import { addPreppedBoxesForPrint } from '../services/boxService';` -> Should be `import { addPreppedBoxesForPrint } from '@/features/boxes/services/boxService';`
- `import { generateLabelPdf } from '../utils/pdfGenerator';` -> Should be `import { generateLabelPdf } from '@/utils/pdfGenerator';`
- `import BatchPrintConfirmationModal from '../components/BatchPrintConfirmationModal';` -> Should be `import BatchPrintConfirmationModal from '@/features/owners/components/BatchPrintConfirmationModal';`
- `import { useSettings } from '../hooks/useSettings';` -> Should be `import { useSettings } from '@/features/settings/hooks/useSettings';`
[]------------------------------------------------------------------------------------------------


### `src/features/owners/pages/ManageOwnersPage.tsx`
- `import { useOwners } from '../hooks/useOwners';` -> Should be `import { useOwners } from '@/features/owners/hooks/useOwners';`
- `import { Owner } from '../types';` -> Should be `import { Owner } from '@/types';`
- `import Button from '../components/Button';` -> Should be `import Button from '@/components/common/Button';`
- `import AddOwnerModal from '../components/AddOwnerModal';` -> Should be `import AddOwnerModal from '@/features/owners/components/AddOwnerModal';`
- `import OwnerCard from '../components/OwnerCard';` -> Should be `import OwnerCard from '@/features/owners/components/OwnerCard';`
- `import BatchPrintConfirmationModal from '../components/BatchPrintConfirmationModal';` -> Should be `import BatchPrintConfirmationModal from '@/features/owners/components/BatchPrintConfirmationModal';`
- `import Alert from '../components/Alert';` -> Should be `import Alert from '@/components/common/Alert';`
- `import { IconPlus, PREDEFINED_COMMUNAL_ROOMS } from '../constants';` -> Should be `import { IconPlus, PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants';`
- `import { addPreppedBoxesForPrint } from '../services/boxService';` -> Should be `import { addPreppedBoxesForPrint } from '@/features/boxes/services/boxService';`
- `import { generateLabelPdf } from '../utils/pdfGenerator';` -> Should be `import { generateLabelPdf } from '@/utils/pdfGenerator';`
- `import { useSettings } from '../hooks/useSettings';` -> Should be `import { useSettings } from '@/features/settings/hooks/useSettings';`
[]------------------------------------------------------------------------------------------------


### `src/features/owners/hooks/useOwners.ts`
- `import { firestore as db } from '../index';` -> Should be `import { firestore as db } from '@/main';`
- `import { useMove } from '../contexts/MoveContext';` -> Should be `import { useMove } from '@/features/settings/hooks/MoveContext';`
- `import { Owner, NewOwnerData } from '../types';` -> Should be `import { Owner, NewOwnerData } from '@/types';`
- `import { PREDEFINED_COMMUNAL_ROOMS } from '../constants';` -> Should be `import { PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants';`
[]------------------------------------------------------------------------------------------------


### `src/features/owners/components/ReprintBatchesModal.tsx`
- `import { Owner, Box } from '../types';` -> Should be `import { Owner, Box } from '@/types';`
- `import Modal from './Modal';` -> Should be `import Modal from '@/components/common/Modal';`
- `import Button from './Button';` -> Should be `import Button from '@/components/common/Button';`
[]------------------------------------------------


### `src/features/owners/components/PrintLabelsModal.tsx`
- `import Modal from './Modal';` -> Should be `import Modal from '@/components/common/Modal';`
- `import Input from './Input';` -> Should be `import Input from '@/components/common/Input';`
- `import Button from './Button';` -> Should be `import Button from '@/components/common/Button';`
- `import { Owner } from '../types';` -> Should be `import { Owner } from '@/types';`
- `import { IconQrCode, IconCheck } from '../constants';` -> Should be `import { IconQrCode, IconCheck } from '@/lib/config/constants';`
- `import Alert from './Alert';` -> Should be `import Alert from '@/components/common/Alert';`
- `import { useSettings } from '../hooks/useSettings';` -> Should be `import { useSettings } from '@/features/settings/hooks/useSettings';`
[]-----------------------------------------------


### `src/features/owners/components/OwnerCard.tsx`
- `import { Owner } from '../types';` -> Should be `import { Owner } from '@/types';`
- `import Button from './Button';` -> Should be `import Button from '@/components/common/Button';`
- `import { IconTrash } from '../constants';` -> Should be `import { IconTrash } from '@/lib/config/constants';`
- `import { useAuth } from '../context/AuthContext';` -> Should be `import { useAuth } from '@/features/auth/hooks/useAuth';`
- `import { useBoxes } from '../hooks/useBoxes';` -> Should be `import { useBoxes } from '@/features/boxes/hooks/useBoxes';`
- `import { Box } from '../types';` -> Should be `import { Box } from '@/types';`
- `import { addPreppedBoxesForPrint } from '../services/boxService';` -> Should be `import { addPreppedBoxesForPrint } from '@/features/boxes/services/boxService';`
- `import { generateLabelPdf } from '../utils/pdfGenerator';` -> Should be `import { generateLabelPdf } from '@/utils/pdfGenerator';`
- `import PrintLabelsModal from './PrintLabelsModal';` -> Should be `import PrintLabelsModal from '@/features/owners/components/PrintLabelsModal';`
- `import ReprintBatchesModal from './ReprintBatchesModal';` -> Should be `import ReprintBatchesModal from '@/features/owners/components/ReprintBatchesModal';`
[]------------------------------------------------


### `src/features/owners/components/BatchPrintConfirmationModal.tsx`
- `import Modal from './Modal';` -> Should be `import Modal from '@/components/common/Modal';`
- `import Button from './Button';` -> Should be `import Button from '@/components/common/Button';`
- `import { Owner } from '../types';` -> Should be `import { Owner } from '@/types';`
- `import { IconQrCode, IconCheck } from '../constants';` -> Should be `import { IconQrCode, IconCheck } from '@/lib/config/constants';`
- `import Alert from './Alert';` -> Should be `import Alert from '@/components/common/Alert';`
- `import { useSettings } from '../hooks/useSettings';` -> Should be `import { useSettings } from '@/features/settings/hooks/useSettings';`
[]------------------------------------------------


### `src/features/owners/components/AddSpaceModal.tsx`
- `import Modal from './Modal';` -> Should be `import Modal from '@/components/common/Modal';`
- `import Input from './Input';` -> Should be `import Input from '@/components/common/Input';`
- `import Button from './Button';` -> Should be `import Button from '@/components/common/Button';`
- `import { useOwners } from '../hooks/useOwners';` -> Should be `import { useOwners } from '@/features/owners/hooks/useOwners';`
- `import { Owner } from '../types';` -> Should be `import { Owner } from '@/types';`
- `import { IconPlus, IconCheck } from '../constants';` -> Should be `import { IconPlus, IconCheck } from '@/lib/config/constants';`
- `import Alert from './Alert';` -> Should be `import Alert from '@/components/common/Alert';`
--------------------------------


### `src/features/boxes/services/boxService.ts`
- `import { firestore as db } from '../index';` -> Should be `import { firestore as db } from '@/main';`
- `import { Box, NewBoxData, ScanEntry, ItemStatus } from '../types';` -> Should be `import { Box, NewBoxData, ScanEntry, ItemStatus } from '@/types';`
- `import { getOwnerByUid } from './ownerService';` -> Should be `import { getOwnerByUid } from '@/features/owners/services/ownerService';`
[]------------------------------------------------------------------------------------------------


### `src/features/boxes/pages/TruckLoadPage.tsx`
- `import { useBoxes } from '../hooks/useBoxes';` -> Should be `import { useBoxes } from '@/features/boxes/hooks/useBoxes';`
- `import { Box, ItemStatus, TruckZone, TRUCK_ZONES } from '../types';` -> Should be `import { Box, ItemStatus, TruckZone, TRUCK_ZONES } from '@/types';`
- `import TruckDiagram, { ZoneOccupancyInfo } from '../components/TruckDiagram';` -> Should be `import TruckDiagram, { ZoneOccupancyInfo } from '@/components/common/TruckDiagram';`
- `import BoxCard from '../components/BoxCard';` -> Should be `import BoxCard from '@/features/boxes/components/BoxCard';`
- `import Input from '../components/Input';` -> Should be `import Input from '@/components/common/Input';`
- `import Button from '../components/Button';` -> Should be `import Button from '@/components/common/Button';`
- `import { IconListBullet } from '../constants';` -> Should be `import { IconListBullet } from '@/lib/config/constants';`
[]------------------------------------------------


### `src/features/boxes/pages/ScanPage.tsx`
- `import { QRCodeScanner, ScannerError } from '../components/QRCodeScanner';` -> Should be `import { QRCodeScanner, ScannerError } from '@/features/boxes/components/QRCodeScanner';`
- `import { useBoxes } from '../hooks/useBoxes';` -> Should be `import { useBoxes } from '@/features/boxes/hooks/useBoxes';`
- `import { Box, ItemStatus, NewBoxData, Owner, TruckZone, VerticalPosition } from '../types';` -> Should be `import { Box, ItemStatus, NewBoxData, Owner, TruckZone, VerticalPosition } from '@/types';`
- `import Alert from '../components/Alert';` -> Should be `import Alert from '@/components/common/Alert';`
- `import Button from '../components/Button';` -> Should be `import Button from '@/components/common/Button';`
- `import Modal from '../components/Modal';` -> Should be `import Modal from '@/components/common/Modal';`
- `import Input from '../components/Input';` -> Should be `import Input from '@/components/common/Input';`
- `import Textarea from '../components/Textarea';` -> Should be `import Textarea from '@/components/common/Textarea';`
- `import TruckZoneSelectorModal from '../components/TruckZoneSelectorModal';` -> Should be `import TruckZoneSelectorModal from '@/features/boxes/components/TruckZoneSelectorModal';`
- `import QuickUnloadOptionsModal from '../components/QuickUnloadOptionsModal';` -> Should be `import QuickUnloadOptionsModal from '@/features/boxes/components/QuickUnloadOptionsModal';`
- `import { useOwners } from '../hooks/useOwners';` -> Should be `import { useOwners } from '@/features/owners/hooks/useOwners';`
- `import { useTheme } from '../hooks/useTheme';` -> Should be `import { useTheme } from '@/hooks/useTheme';`
- `import { IconCamera, IconQrCode, IconCheck, IconChevronLeft, IconLightningBolt, IconXMark } from '../constants';` -> Should be `import { IconCamera, IconQrCode, IconCheck, IconChevronLeft, IconLightningBolt, IconXMark } from '@/lib/config/constants';`
- `import { getItemStatusDisplayLabel } from '../utils/statusUtils';` -> Should be `import { getItemStatusDisplayLabel } from '@/utils/statusUtils';`
[]----------------------------------------------------------------


### `src/features/boxes/pages/PackBoxPage.tsx`
- `import { useBoxes } from '../hooks/useBoxes';` -> Should be `import { useBoxes } from '@/features/boxes/hooks/useBoxes';`
- `import { useOwners } from '../hooks/useOwners';` -> Should be `import { useOwners } from '@/features/owners/hooks/useOwners';`
- `import { NewBoxData, Box } from '../types';` -> Should be `import { NewBoxData, Box } from '@/types';`
- `import QRCodeDisplay from '../components/QRCodeDisplay';` -> Should be `import QRCodeDisplay from '@/components/common/QRCodeDisplay';`
- `import Button from '../components/Button';` -> Should be `import Button from '@/components/common/Button';`
- `import Input from '../components/Input';` -> Should be `import Input from '@/components/common/Input';`
- `import Textarea from '../components/Textarea';` -> Should be `import Textarea from '@/components/common/Textarea';`
- `import Select from '../components/Select';` -> Should be `import Select from '@/components/common/Select';`
- `import Alert from '../components/Alert';` -> Should be `import Alert from '@/components/common/Alert';`
- `import { IconPlus, IconQrCode } from '../constants';` -> Should be `import { IconPlus, IconQrCode } from '@/lib/config/constants';`
- `import { getItemStatusDisplayLabel } from '../utils/statusUtils';` -> Should be `import { getItemStatusDisplayLabel } from '@/utils/statusUtils';`
[]--------------------------------


### `src/features/boxes/pages/BoxesListPage.tsx`
- `import { useBoxes } from '../hooks/useBoxes';` -> Should be `import { useBoxes } from '@/features/boxes/hooks/useBoxes';`
- `import BoxCard from '../components/BoxCard';` -> Should be `import BoxCard from '@/features/boxes/components/BoxCard';`
- `import Input from '../components/Input';` -> Should be `import Input from '@/components/common/Input';`
- `import Select from '../components/Select';` -> Should be `import Select from '@/components/common/Select';`
- `import { ItemStatus } from '../types';` -> Should be `import { ItemStatus } from '@/types';`
- `import Button from '../components/Button';` -> Should be `import Button from '@/components/common/Button';`
- `import { IconQrCode, IconListBullet } from '../constants';` -> Should be `import { IconQrCode, IconListBullet } from '@/lib/config/constants';`
- `import { getItemStatusOptionsForSelect } from '../utils/statusUtils';` -> Should be `import { getItemStatusOptionsForSelect } from '@/utils/statusUtils';`
[]--------------------------------


### `src/features/boxes/pages/BoxDetailsPage.tsx`
- `import { useBoxes } from '../hooks/useBoxes';` -> Should be `import { useBoxes } from '@/features/boxes/hooks/useBoxes';`
- `import { useOwners } from '../hooks/useOwners';` -> Should be `import { useOwners } from '@/features/owners/hooks/useOwners';`
- `import { Box, ItemStatus, NewBoxData, TruckZone, VerticalPosition } from '../types';` -> Should be `import { Box, ItemStatus, NewBoxData, TruckZone, VerticalPosition } from '@/types';`
- `import QRCodeDisplay from '../components/QRCodeDisplay';` -> Should be `import QRCodeDisplay from '@/components/common/QRCodeDisplay';`
- `import Button from '../components/Button';` -> Should be `import Button from '@/components/common/Button';`
- `import Input from '../components/Input';` -> Should be `import Input from '@/components/common/Input';`
- `import Textarea from '../components/Textarea';` -> Should be `import Textarea from '@/components/common/Textarea';`
- `import Select from '../components/Select';` -> Should be `import Select from '@/components/common/Select';`
- `import Modal from '../components/Modal';` -> Should be `import Modal from '@/components/common/Modal';`
- `import Alert from '../components/Alert';` -> Should be `import Alert from '@/components/common/Alert';`
- `import TruckZoneSelectorModal from '../components/TruckZoneSelectorModal';` -> Should be `import TruckZoneSelectorModal from '@/features/boxes/components/TruckZoneSelectorModal';`
- `import { IconChevronLeft, IconEdit, IconCamera, IconTrash, IconCheck, IconQrCode } from '../constants';` -> Should be `import { IconChevronLeft, IconEdit, IconCamera, IconTrash, IconCheck, IconQrCode } from '@/lib/config/constants';`
- `import { getItemStatusDisplayLabel, getItemStatusOptionsForSelect } from '../utils/statusUtils';` -> Should be `import { getItemStatusDisplayLabel, getItemStatusOptionsForSelect } from '@/utils/statusUtils';`
- `import { useAuth } from '../context/AuthContext';` -> Should be `import { useAuth } from '@/features/auth/hooks/useAuth';`
[]-----------------------------


### `src/features/boxes/hooks/useBoxes.ts`
- `import { firestore as db } from '../index';` -> Should be `import { firestore as db } from '@/main';`
- `import { useMove } from '../contexts/MoveContext';` -> Should be `import { useMove } from '@/features/settings/hooks/MoveContext';`
- `import { Box, NewBoxData, ItemStatus } from '../types';` -> Should be `import { Box, NewBoxData, ItemStatus } from '@/types';`
- `import * as boxService from '../services/boxService';` -> Should be `import * as boxService from '@/features/boxes/services/boxService';`
[]-------------------------------------------------


### `src/features/boxes/components/TruckZoneSelectorModal.tsx`
- `import Modal from './Modal';` -> Should be `import Modal from '@/components/common/Modal';`
- `import Button from './Button';` -> Should be `import Button from '@/components/common/Button';`
- `import TruckDiagram from './TruckDiagram';` -> Should be `import TruckDiagram from '@/components/common/TruckDiagram';`
- `import { Box, TruckZone, VerticalPosition, TRUCK_ZONES } from '../types';` -> Should be `import { Box, TruckZone, VerticalPosition, TRUCK_ZONES } from '@/types';`
- `import { IconCheck } from '../constants';` -> Should be `import { IconCheck } from '@/lib/config/constants';`
[]--------------------------------


### `src/features/boxes/components/QuickUnloadOptionsModal.tsx`
- `import Modal from './Modal';` -> Should be `import Modal from '@/components/common/Modal';`
- `import Button from './Button';` -> Should be `import Button from '@/components/common/Button';`
- `import Input from './Input';` -> Should be `import Input from '@/components/common/Input';`
- `import { Box } from '../types';` -> Should be `import { Box } from '@/types';`
- `import { IconCheck, IconHome, IconBox as IconBoxCustom } from '../constants';` -> Should be `import { IconCheck, IconHome, IconBox as IconBoxCustom } from '@/lib/config/constants';`
- `import Alert from './Alert';` -> Should be `import Alert from '@/components/common/Alert';`
[]-------------------------------


### `src/features/boxes/components/QRCodeScanner.tsx`
- `import { IconSpinner, IconWarning } from '../constants';` -> Should be `import { IconSpinner, IconWarning } from '@/lib/config/constants';`
[]------------------------------------------------


### `src/features/boxes/components/BoxCard.tsx`
- `import { Box, ItemStatus } from '../types';` -> Should be `import { Box, ItemStatus } from '@/types';`
- `import Button from './Button';` -> Should be `import Button from '@/components/common/Button';`
- `import { IconTrash } from '../constants';` -> Should be `import { IconTrash } from '@/lib/config/constants';`
- `import { useAuth } from '../context/AuthContext';` -> Should be `import { useAuth } from '@/features/auth/hooks/useAuth';`
- `import { useBoxes } from '../hooks/useBoxes';` -> Should be `import { useBoxes } from '@/features/boxes/hooks/useBoxes';`
- `import { addPreppedBoxesForPrint } from '../services/boxService';` -> Should be `import { addPreppedBoxesForPrint } from '@/features/boxes/services/boxService';`
- `import { generateLabelPdf } from '../utils/pdfGenerator';` -> Should be `import { generateLabelPdf } from '@/utils/pdfGenerator';`
- `import PrintLabelsModal from './PrintLabelsModal';` -> Should be `import PrintLabelsModal from '@/features/owners/components/PrintLabelsModal';`
- `import ReprintBatchesModal from './ReprintBatchesModal';` -> Should be `import ReprintBatchesModal from '@/features/owners/components/ReprintBatchesModal';`
[]----------------------------------------------


### `src/features/auth/pages/AuthPage.tsx`
- `import Button from '../components/Button';` -> Should be `import Button from '@/components/common/Button';`
- `import Input from '../components/Input';` -> Should be `import Input from '@/components/common/Input';`
- `import Alert from '../components/Alert';` -> Should be `import Alert from '@/components/common/Alert';`
- `import { createMove, joinMove, getUserMoves } from '../services/moveService';` -> Should be `import { createMove, joinMove, getUserMoves } from '@/features/settings/services/moveService';`
- `import { useAuth } from '../context/AuthContext';` -> Should be `import { useAuth } from '@/features/auth/hooks/useAuth';`
- `import { IconSmoothMovesLogo, IconGoogle } from '../constants';` -> Should be `import { IconSmoothMovesLogo, IconGoogle } from '@/lib/config/constants';`
- `import { useSettings } from '../hooks/useSettings';` -> Should be `import { useSettings } from '@/features/settings/hooks/useSettings';`
[]-----------------------------------------------


### `src/features/auth/hooks/AuthContext.tsx`
- `import { auth } from '../index';` -> Should be `import { auth } from '@/main';`
- `import { getSettings, saveSettings } from '../services/settingsService';` -> Should be `import { getSettings, saveSettings } from '@/features/settings/services/settingsService';`
[]-----------------------------------------------


### `src/features/auth/components/ProtectedRoute.tsx`
- `import { useAuth } from '../context/AuthContext';` -> Should be `import { useAuth } from '@/features/auth/hooks/useAuth';`
[]-----------------------------------------------


### `src/components/common/TruckDiagram/index.tsx`
- `import { TRUCK_ZONES, Box as AppBox } from '../types';` -> Should be `import { TRUCK_ZONES, Box as AppBox } from '@/types';`
- `import { IconBox } from '../constants';` -> Should be `import { IconBox } from '@/lib/config/constants';`
- `import { useTheme } from '../hooks/useTheme';` -> Should be `import { useTheme } from '@/hooks/useTheme';`
[]-----------------------------------------------


### `src/components/common/QRCodeDisplay/index.tsx`
- `import { useTheme } from '../hooks/useTheme';` -> Should be `import { useTheme } from '@/hooks/useTheme';`
[]-----------------------------------------------


### `src/components/common/Modal/index.tsx`
- `import Button from './Button';` -> Should be `import Button from '@/components/common/Button';`
- `import { IconXMark } from '../constants';` -> Should be `import { IconXMark } from '@/lib/config/constants';`
[]-----------------------------------------------


### `src/components/common/Button/index.tsx`
- `import { IconCheck } from '../constants';` -> Should be `import { IconCheck } from '@/lib/config/constants';`
[]--------------------------------------------


### `src/components/common/Alert/index.tsx`
- `import { IconCheck, IconXMark, IconPlus, IconCamera } from '../constants';` -> Should be `import { IconCheck, IconXMark, IconPlus, IconCamera } from '@/lib/config/constants';`
[]--------------------------------------------


### `src/App.tsx`
- `import Navbar from './components/Navbar';` -> Should be `import Navbar from '@/components/layout/Header';`
- `import DashboardPage from './pages/DashboardPage';` -> Should be `import DashboardPage from '@/features/settings/pages/DashboardPage';`
- `import ScanPage from './pages/ScanPage';` -> Should be `import ScanPage from '@/features/boxes/pages/ScanPage';`
- `import BoxDetailsPage from './pages/BoxDetailsPage';` -> Should be `import BoxDetailsPage from '@/features/boxes/pages/BoxDetailsPage';`
- `import BoxesListPage from './pages/BoxesListPage';` -> Should be `import BoxesListPage from '@/features/boxes/pages/BoxesListPage';`
- `import ManageOwnersPage from './pages/ManageOwnersPage';` -> Should be `import ManageOwnersPage from '@/features/owners/pages/ManageOwnersPage';`
- `import ManageSpacesPage from './pages/ManageSpacesPage';` -> Should be `import ManageSpacesPage from '@/features/owners/pages/ManageSpacesPage';`
- `import TruckLoadPage from './pages/TruckLoadPage';` -> Should be `import TruckLoadPage from '@/features/boxes/pages/TruckLoadPage';`
- `import SettingsPage from './pages/SettingsPage';` -> Should be `import SettingsPage from '@/features/settings/pages/SettingsPage';`
- `import AuthPage from './pages/AuthPage';` -> Should be `import AuthPage from '@/features/auth/pages/AuthPage';`
- `import ProtectedRoute from './components/ProtectedRoute';` -> Should be `import ProtectedRoute from '@/features/auth/components/ProtectedRoute';`
- `import { BoxesProvider } from './hooks/useBoxes';` -> Should be `import { BoxesProvider } from '@/features/boxes/hooks/useBoxes';`
- `import { OwnersProvider } from './hooks/useOwners';` -> Should be `import { OwnersProvider } from '@/features/owners/hooks/useOwners';`
- `import { SettingsProvider } from './hooks/useSettings';` -> Should be `import { SettingsProvider } from '@/features/settings/hooks/useSettings';`
- `import { useAuth } from './context/AuthContext';` -> Should be `import { useAuth } from '@/features/auth/hooks/useAuth';`
- `import { MoveProvider } from './contexts/MoveContext';` -> Should be `import { MoveProvider } from '@/features/settings/hooks/MoveContext';`
- `import AddOwnerModal from './components/AddOwnerModal';` -> Should be `import AddOwnerModal from '@/features/owners/components/AddOwnerModal';`
[]------------------------------------------------


### `src/components/layout/Header/index.tsx`
- `import { IconHome, IconListBullet, IconSmoothMovesLogo, IconSettings } from '../constants';` -> Should be `import { IconHome, IconListBullet, IconSmoothMovesLogo, IconSettings } from '@/lib/config/constants';`
[]------------------------------------------------


### `src/utils/pdfGenerator.ts`
- `import { Owner, Box } from '../types';` -> Should be `import { Owner, Box } from '@/types';`
[]------------------------------------------------


### `src/utils/statusUtils.ts`
- `import { ItemStatus } from '../types';` -> Should be `import { ItemStatus } from '@/types';`
[]------------------------------------------------


## 2. Empty Files (Inconsistencies)

The following files are currently empty and should contain the respective components/pages:

- `src/features/auth/pages/RegistrationPage.tsx` // I believe the AuthPage.tsx file contains all the logic for registration page
- `src/features/auth/pages/SignInPage.tsx` // I believe the AuthPage.tsx file contains all the logic for the Sign-In page

These empty files indicate incomplete implementation or placeholders that need to be filled with actual code.

## 3. Other Observations

- The codebase generally follows a feature-sliced architecture, which is a good practice for scalability and maintainability in React/TypeScript projects.
- The use of `@/` path alias is a good step towards cleaner imports, but consistent application is crucial.
- No obvious improper code implementations or logical errors were found during this structural analysis. A deeper code review would be required to identify such issues.

---