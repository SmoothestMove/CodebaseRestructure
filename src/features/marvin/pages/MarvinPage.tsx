import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Marvin } from '../components';
import { createMarvinAppData } from '../adapters/dataAdapter';
import { CalendarEvent, ChecklistItem } from '../types';
import { useBoxes } from '@/features/boxes/hooks/useBoxes';
import { useOwners } from '@/features/owners/hooks/useOwners';

const MarvinPage: React.FC = () => {
  const navigate = useNavigate();
  const { boxes } = useBoxes();
  const { owners } = useOwners();

  // Convert app data to MARVIN's expected format
  const appData = createMarvinAppData(boxes, owners, []);

  // Handler for calendar events - shows toast for now, could integrate with actual calendar
  const handleCalendarAction = (event: CalendarEvent) => {
    toast.success(`Calendar event created: "${event.title}" on ${event.date}${event.time ? ` at ${event.time}` : ''}`);
    // TODO: Integrate with actual calendar system when available
    console.log('Calendar event:', event);
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