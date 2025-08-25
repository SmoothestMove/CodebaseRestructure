# Moving Planner Enhancement Plan

## Understanding of Instructions

Based on the provided requirements, this plan addresses seven key enhancement areas for the Moving Planner feature:

1. **Frame Management**: Add persistent "+ Add Frame" button with AddNewFrame modal for custom frame creation
2. **Task Card Editing**: Enable click-to-edit functionality on Timeline task cards with delete options (Task Card editing is initiated when empty space on a card (WhiteSpace) is clicked/tapped)
3. **Immediate Task Creation**: Show AddNewTask modal immediately when "Add Task" is clicked/tapped (instead of adding it directly to the bottom of the tasklist)
4. **UI Consistency**: Standardize Labels dropdown to match Priority/Status styling (within the task-modal)
5. **Date Functionality**: Implement calendar picker with proper tooltip guidance (in the task-modal)
6. **Terminology Update**: Change "Members" to "Assignments" throughout the interface (specifically in the task-modal, where options/details are chosen)
7. **Assignment System**: Create differentiated assignment mechanics for Members, Owners, and Spaces with visual indicators on Task Cards (reference TaskCardExample in Docs>Images)

## Implementation Phases

### Phase 1: Foundation & Structure Setup
**Objective**: Establish comprehensive foundation with enhanced types and utilities

- [ ] Create comprehensive type definitions for all data structures
- [ ] Implement proper state management structure foundation
- [ ] Add comprehensive error handling and validation utilities
- [ ] Create utility functions for common operations
- [ ] Set up constants and configuration values
- [ ] Add detailed AI integration comments throughout codebase

### Phase 2: Frame Management System
**Objective**: Add persistent frame creation functionality

- [ ] Create NewFrame modal component with title, subtitle, and color selection
- [ ] Add persistent "+ Add Frame" button as rightmost frame element
- [ ] Implement frame creation logic with proper state management
- [ ] Reuse existing Add Task button component styling for consistency
- [ ] Test frame creation and ensure proper integration with existing frames

### Phase 3: Task Card Enhancement
**Objective**: Enable direct task card editing and deletion

- [ ] Implement click-to-edit functionality for Timeline task cards (empty space detection)
- [ ] Modify existing task modal to display current task data when editing
- [ ] Add "Delete" option to task edit modals with confirmation
- [ ] Ensure drag-and-drop functionality remains intact during editing
- [ ] Test task editing and deletion workflows

### Phase 4: Immediate Task Creation
**Objective**: Show task creation modal immediately upon "Add Task" click

- [ ] Modify "Add Task" button behavior to show modal immediately
- [ ] Determine target location (Task List vs Timeline Frame) based on button clicked
- [ ] Pre-populate modal with appropriate default values based on context
- [ ] Ensure proper task placement after creation
- [ ] Test task creation from both Task List and Timeline Frame contexts

### Phase 5: UI Consistency & Date Functionality
**Objective**: Standardize dropdowns and implement date picker

- [ ] Update Labels dropdown to match Priority/Status styling in task modals
- [ ] Implement calendar picker component for date selection
- [ ] Add tooltip guidance: "Choose start date then end date or tap date twice for due date"
- [ ] Integrate date functionality into task creation and editing workflows
- [ ] Test date selection and validation

### Phase 6: Assignment System Implementation
**Objective**: Create differentiated assignment mechanics with visual indicators

- [ ] Change "Members" terminology to "Assignments" throughout the interface
- [ ] Create Member assignment option with user avatar display (top-right of task cards)
- [ ] Create Owner assignment option with User icon in Owner-specific color
- [ ] Create Space assignment option with Spaces icon in unique color
- [ ] Implement placeholder logic for all assignment types
- [ ] Add assignment selection interface to task modals
- [ ] Test assignment visual indicators and placement on task cards

### Phase 7: Integration & Testing
**Objective**: Ensure all features work together seamlessly

- [ ] Conduct comprehensive testing of all new features
- [ ] Verify no conflicts between new and existing functionality
- [ ] Test responsive design across different screen sizes
- [ ] Validate accessibility compliance for new components
- [ ] Perform final code cleanup and optimization

## Technical Considerations

- **State Management**: All new features must integrate with existing task and frame state management
- **Component Reusability**: Leverage existing components where possible (Add Task button, modal patterns)
- **Placeholder Logic**: Assignment system requires placeholder implementation for future app integration
- **Visual Consistency**: All new UI elements must follow established design patterns and color schemes
- **Performance**: Ensure new functionality doesn't impact existing drag-and-drop or scrolling performance

## Success Criteria

- Users can create custom frames with titles, subtitles, and colors
- Timeline task cards are directly editable by clicking empty space
- Task creation is immediate and context-aware
- All dropdowns follow consistent styling patterns
- Date selection is intuitive with proper guidance
- Assignment system provides clear visual differentiation
- All existing functionality remains intact and performant
\`\`\`

```typescriptreact file="lib/utils.ts" isDeleted="true"
...deleted...
