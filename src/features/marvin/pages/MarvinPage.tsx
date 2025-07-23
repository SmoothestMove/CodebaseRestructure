import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Marvin } from '../components';
import { createMarvinAppData } from '../adapters/dataAdapter';
import { MarvinCalendarEvent, ChecklistItem, CreateCalendarEventAction, UpdateCalendarEventAction, DeleteCalendarEventAction, QueryCalendarAction } from '../types';
import { useBoxes } from '@/features/boxes/hooks/useBoxes';
import { useOwners } from '@/features/owners/hooks/useOwners';
import { useCalendar } from '@/features/calendar/hooks/useCalendar';
import { useMarvinCalendar } from '@/features/calendar/hooks/useMarvinCalendar';

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

  // Convert app data to MARVIN's expected format including calendar events
  const appData = createMarvinAppData(boxes, owners, [], events);

  // Enhanced handler for calendar actions with actual integration
  const handleCalendarAction = async (action: CreateCalendarEventAction | UpdateCalendarEventAction | DeleteCalendarEventAction | QueryCalendarAction) => {
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
          // Fallback for legacy single event format
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
          }
          break;
      }
    } catch (error) {
      console.error('Calendar action error:', error);
      toast.error('Failed to perform calendar action');
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

  // Handler for checklist updates - shows toast for now, could integrate with task management
  const handleUpdateChecklist = (items: Omit<ChecklistItem, 'id' | 'completed'>[]) => {
    toast.success(`Added ${items.length} new tasks to your checklist`);
    // TODO: Integrate with actual task management system
    console.log('Checklist items:', items);
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
        />
      </div>
    </div>
  );
};

export default MarvinPage;