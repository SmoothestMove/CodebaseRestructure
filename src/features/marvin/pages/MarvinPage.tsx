import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Marvin } from '../components';
import { createMarvinAppData } from '../adapters/dataAdapter';
import { MarvinCalendarEvent, ChecklistItem, CreateCalendarEventAction, UpdateCalendarEventAction, DeleteCalendarEventAction, QueryCalendarAction, AddExpenseAction, CreateBudgetCategoryAction, QueryBudgetAction, LocationData } from '../types';
import { useBoxes } from '@/features/boxes/hooks/useBoxes';
import { useOwners } from '@/features/owners/hooks/useOwners';
import { useCalendar } from '@/features/calendar/hooks/useCalendar';
import { useMarvinCalendar } from '@/features/calendar/hooks/useMarvinCalendar';
import { useMarvinBudget } from '@/features/budget/hooks/useMarvinBudget';
import { locationService } from '../services/locationService';

const MarvinPage: React.FC = () => {
  const navigate = useNavigate();
  const { boxes } = useBoxes();
  const { owners } = useOwners();
  const { events } = useCalendar();
  const { 
    handleCreateCalendarEvent, 
    handleUpdateCalendarEvent, 
    handleDeleteCalendarEvent,
    handleQueryCalendarEvents
  } = useMarvinCalendar();
  
  const { 
    handleAddExpense, 
    handleCreateBudgetCategory, 
    handleQueryBudget, 
    budgetData 
  } = useMarvinBudget();

  // Location state
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [locationPermissionRequested, setLocationPermissionRequested] = useState(false);

  // Request location permission and get location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      if (locationPermissionRequested) return;
      
      setLocationPermissionRequested(true);
      
      try {
        // First check if we have cached location
        const cachedLocation = locationService.getCachedLocation();
        if (cachedLocation) {
          console.log('Using cached location for MARVIN');
          setUserLocation(cachedLocation);
          return;
        }
        
        // Request location permission and get current location
        const hasPermission = await locationService.requestLocationPermission();
        if (hasPermission) {
          console.log('Requesting current location for MARVIN...');
          const result = await locationService.getCurrentLocation();
          
          if (result.success && result.location) {
            console.log('Location obtained for MARVIN:', result.location);
            setUserLocation(result.location);
          } else {
            console.warn('Failed to get location for MARVIN:', result.error);
          }
        } else {
          console.log('Location permission denied for MARVIN');
        }
      } catch (error) {
        console.error('Error initializing location for MARVIN:', error);
      }
    };
    
    initializeLocation();
  }, [locationPermissionRequested]);

  // Convert app data to MARVIN's expected format including calendar events, budget data, and location
  const appData = createMarvinAppData(boxes, owners, [], events, budgetData, userLocation);

  // Enhanced handler for calendar actions with actual integration
  const handleCalendarAction = async (action: CreateCalendarEventAction | UpdateCalendarEventAction | DeleteCalendarEventAction | QueryCalendarAction | MarvinCalendarEvent) => {
    try {
      let result;
      
      switch (action.action) {
        case 'create_calendar_event':
          result = await handleCreateCalendarEvent(action);
          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
          break;
          
        case 'update_calendar_event':
          result = await handleUpdateCalendarEvent(action);
          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
          break;
          
        case 'delete_calendar_event':
          result = await handleDeleteCalendarEvent(action);
          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
          break;
          
        case 'query_calendar':
          result = await handleQueryCalendarEvents(action);
          if (result.success) {
            toast.success(result.message);
            // Optionally display query results in a more detailed way
            if (result.data && result.data.length > 0) {
              console.log('Calendar query results:', result.data);
            }
          } else {
            toast.error(result.message);
          }
          break;
          
        default:
          // Fallback for legacy single event format or direct event object
          const event = action as any;
          if (event.title && event.date) {
            const legacyAction: CreateCalendarEventAction = {
              action: 'create_calendar_event',
              event: event
            };
            result = await handleCreateCalendarEvent(legacyAction);
            if (result.success) {
              toast.success(result.message);
            } else {
              toast.error(result.message);
            }
          } else {
            console.error('Unknown calendar action format:', action);
            toast.error('Unknown calendar action format');
          }
          break;
      }
    } catch (error) {
      console.error('Calendar action error:', error);
      toast.error('Failed to perform calendar action');
    }
  };

  // Enhanced handler for budget actions with actual integration
  const handleBudgetAction = async (action: AddExpenseAction | CreateBudgetCategoryAction | QueryBudgetAction) => {
    try {
      let result;
      
      switch (action.action) {
        case 'add_expense':
          result = await handleAddExpense(action);
          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
          break;
          
        case 'create_budget_category':
          result = await handleCreateBudgetCategory(action);
          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
          break;
          
        case 'query_budget':
          result = await handleQueryBudget(action);
          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
          break;
          
        default:
          toast.error('Unknown budget action');
          break;
      }
    } catch (error) {
      console.error('Budget action error:', error);
      toast.error('Failed to perform budget action');
    }
  };

  // Handler for navigation requests - uses React Router
  const handleNavigate = (destination: string) => {
    toast.info(`Navigation requested to: ${destination}`);
    // TODO: Could integrate with maps or external navigation
    // For now, handle internal app navigation
    const routeMap: { [key: string]: string } = {
      'dashboard': '/',
      'boxes': '/boxes',
      'budget': '/budget',
      'owners': '/owners',
      'settings': '/settings'
    };
    
    const route = routeMap[destination.toLowerCase()];
    if (route) {
      navigate(route);
    } else {
      console.log('External navigation to:', destination);
    }
  };

  // Handler for checklist updates - redirects to calendar since no checklist system exists
  const handleUpdateChecklist = (items: Omit<ChecklistItem, 'id' | 'completed'>[]) => {
    toast.info(`Checklist functionality not available. Try asking me to create calendar events for your tasks instead.`);
    console.log('Checklist items that would be created:', items);
  };

  // Handler for wake word detection - could trigger UI focus or animations
  const handleWakeWordDetected = () => {
    toast.info('Wake word detected! MARVIN is listening...');
    // TODO: Could add visual feedback, modal focus, or other UI reactions
    console.log('Wake word detected');
  };

  return (
    <div className="container mx-auto p-4 h-full">
      <div className="max-w-4xl mx-auto h-full">
        <Marvin
          appData={appData}
          onCalendarAction={handleCalendarAction}
          onNavigate={handleNavigate}
          onUpdateChecklist={handleUpdateChecklist}
          onWakeWordDetected={handleWakeWordDetected}
          onBudgetAction={handleBudgetAction}
        />
      </div>
    </div>
  );
};

export default MarvinPage;