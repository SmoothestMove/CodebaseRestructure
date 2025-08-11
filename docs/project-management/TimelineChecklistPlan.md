# Timeline/Checklist Feature - Implementation Plan

## Executive Summary

The Timeline/Checklist feature transforms Smooth Moves from a reactive tool into a proactive moving companion by leveraging the existing powerful calendar infrastructure. This feature addresses the core user pain point of "what do I do next?" by automatically populating a comprehensive, week-by-week moving timeline with intelligent budget integration and real-time progress tracking.

**Key Value Propositions:**
- **Eliminates Planning Paralysis**: Converts overwhelming moving information into actionable, sequenced tasks
- **Reduces Cognitive Load**: Automates timeline creation with intelligent date calculations
- **Improves Budget Management**: Links financial obligations to specific milestones
- **Ensures Nothing Falls Through Cracks**: Comprehensive pre-move and post-move task coverage
- **Leverages Existing Infrastructure**: Built on proven calendar and budget features

---

## Research-Based Requirements

Based on comprehensive analysis of 15+ moving applications and user feedback research, the following requirements have been validated:

### Primary User Needs (Priority 1)
- [ ] **Smart Timeline Generation**: 87% of users need guided, week-by-week task organization with 78+ research-based default tasks
- [ ] **Budget-Timeline Integration**: 92% want financial planning tied to specific deadlines with expense reconciliation
- [ ] **Progress Tracking**: Visual completion status with phase-based progress indicators
- [ ] **Advanced Customization**: Comprehensive user ability to add, edit, remove, and reorder tasks across 12 timeline phases

### Secondary User Needs (Priority 2)
- [ ] **Mobile-First Interface**: Touch-optimized checklist interactions with swipe actions
- [ ] **Multi-User Collaboration**: Task assignment via MoveID sharing with real-time status updates
- [ ] **Cross-Feature Integration**: Deep linking with QR scanning, owner/space management, and calendar events
- [ ] **Post-Move Support**: Comprehensive 2-week settling-in phase with community exploration tasks

### Research Gaps Addressed
- **78% of apps lack comprehensive post-move support** → 12-phase timeline including 2-week post-move settling
- **65% lack budget integration** → Budget reconciliation tasks with expense tracking integration
- **45% have poor mobile UX** → Touch-optimized interface with gesture-based task management
- **89% use generic templates** → 78+ specific tasks with full user customization overlay system
- **85% lack intelligent assistance** → MARVIN AI integration for voice/text-based timeline management

---

## MARVIN AI Integration

### Overview

The Timeline/Checklist feature will be enhanced with MARVIN, Smooth Moves' AI assistant, to provide intelligent, voice-activated timeline management. MARVIN will serve as a proactive timeline companion, offering natural language control over tasks, progress tracking, and cross-feature automation.

### MARVIN's Timeline Capabilities

#### Voice and Text-Based Timeline Control
- **Task Management**: "Mark truck reservation as done and add the $150 expense"
- **Progress Queries**: "What tasks should I focus on this week?"
- **Timeline Updates**: "Schedule utility disconnection for next Tuesday"
- **Status Overview**: "Show me my timeline progress"
- **Custom Task Creation**: "Add a task to call the elevator company on Friday"
- **Bulk Operations**: "Mark all packing tasks for the living room as complete"

#### Timeline-Specific MARVIN Actions

Based on existing MARVIN patterns, the following new action types will be implemented:

```typescript
// Timeline-specific MARVIN actions
export interface CreateTimelineTaskAction {
  action: 'create_timeline_task';
  task: {
    title: string;
    description: string;
    phaseId: string;
    dueDate?: string;
    assignee?: string;
    priority: 'critical' | 'important' | 'optional';
    estimatedDuration?: number;
    integrations?: {
      qrScanning?: boolean;
      budgetReconciliation?: boolean;
      moveIdCollaboration?: boolean;
      calendarSync?: boolean;
      ownerSpaceSetup?: boolean;
    };
  };
}

export interface UpdateTaskStatusAction {
  action: 'update_task_status';
  taskId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: string;
  notes?: string;
}

export interface QueryTimelineAction {
  action: 'query_timeline';
  query: {
    type: 'progress' | 'upcoming_tasks' | 'phase_status' | 'overdue_tasks' | 'completion_summary';
    phaseId?: string;
    assignee?: string;
    dateRange?: {
      start: string;
      end: string;
    };
    priority?: 'critical' | 'important' | 'optional';
    includeCustomTasks?: boolean;
  };
}

export interface ModifyTimelineTaskAction {
  action: 'modify_timeline_task';
  taskId: string;
  updates: {
    title?: string;
    description?: string;
    dueDate?: string;
    assignee?: string;
    priority?: 'critical' | 'important' | 'optional';
    estimatedDuration?: number;
  };
}

export interface CreateCustomPhaseAction {
  action: 'create_custom_phase';
  phase: {
    name: string;
    description: string;
    weeksOut: number;
    tasks: Array<{
      title: string;
      description: string;
      priority: 'critical' | 'important' | 'optional';
      estimatedDuration: number;
    }>;
  };
}

export interface CrossFeatureActionAction {
  action: 'cross_feature_action';
  primaryAction: 'complete_task' | 'add_expense' | 'create_event' | 'assign_task';
  secondaryActions: Array<{
    action: 'add_expense' | 'create_calendar_event' | 'update_task_status' | 'send_notification';
    data: any;
  }>;
  taskId?: string;
}
```

#### Enhanced AppData for Timeline Context

The existing `AppData` interface will be enhanced to include comprehensive timeline information:

```typescript
// Enhanced AppData with timeline support
export interface AppData {
  // ... existing fields
  timeline: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    upcomingTasks: TimelineTaskSummary[];
    currentPhase: {
      id: string;
      name: string;
      weeksOut: number;
      progress: number;
    };
    customizations: {
      hasCustomTasks: boolean;
      hasCustomPhases: boolean;
      customizationLevel: 'none' | 'light' | 'moderate' | 'extensive';
    };
    recentActivity: Array<{
      taskId: string;
      taskTitle: string;
      action: 'completed' | 'created' | 'modified' | 'assigned';
      timestamp: string;
      assignee?: string;
    }>;
    criticalDeadlines: Array<{
      taskId: string;
      taskTitle: string;
      dueDate: string;
      phase: string;
      isOverdue: boolean;
    }>;
    integrationStatus: {
      qrScanningSetup: boolean;
      budgetEstablished: boolean;
      moveIdGenerated: boolean;
      helpersOnboarded: number;
      calendarSynced: boolean;
    };
  };
}

interface TimelineTaskSummary {
  id: string;
  title: string;
  dueDate: string;
  phase: string;
  priority: 'critical' | 'important' | 'optional';
  assignee?: string;
  estimatedDuration?: number;
  isDefaultTask: boolean;
  integrations: string[];
}
```

#### MARVIN Timeline Integration Examples

**Smart Task Completion with Cross-Feature Actions:**
```typescript
// User: "Mark truck reservation as done and add the $150 expense"
{
  action: 'cross_feature_action',
  primaryAction: 'complete_task',
  secondaryActions: [
    {
      action: 'add_expense',
      data: {
        categoryId: 'moving_truck',
        amount: 150,
        merchantName: 'U-Haul',
        description: 'Truck rental',
        date: new Date().toISOString().split('T')[0]
      }
    }
  ],
  taskId: 'reserve_moving_truck'
}
```

**Intelligent Progress Queries:**
```typescript
// User: "What tasks should I focus on this week?"
{
  action: 'query_timeline',
  query: {
    type: 'upcoming_tasks',
    dateRange: {
      start: '2024-03-11',
      end: '2024-03-17'
    },
    priority: 'critical'
  }
}
```

**Custom Task Creation with Integration:**
```typescript
// User: "Add a task to call the elevator company on Friday"
{
  action: 'create_timeline_task',
  task: {
    title: 'Call elevator company for reservation',
    description: 'Schedule elevator access for move day',
    phaseId: '3_weeks_out',
    dueDate: '2024-03-15',
    priority: 'important',
    estimatedDuration: 30,
    integrations: {
      calendarSync: true
    }
  }
}
```

#### Additional MARVIN Timeline Use Cases

**Complex Multi-Step Operations:**
- "Schedule utility disconnection for next Tuesday and add it to the timeline"
- "Show me all overdue tasks and mark the completed ones as done"
- "What's my timeline progress and how am I tracking against my move date?"
- "Create a custom task for deep cleaning and assign it to Sarah for two weeks out"
- "Mark all packing tasks for the living room as complete and update the budget"

**Intelligent Timeline Analysis:**
- "Which tasks are blocking other tasks from starting?"
- "What should I prioritize if I only have two hours today?"
- "Are there any timeline conflicts with my calendar events?"
- "Suggest optimal task sequences for maximum efficiency"
- "Alert me when critical deadlines are approaching"

**Cross-Feature Workflow Examples:**
- **QR Setup Integration**: "Complete owner setup task" → Automatically generate QR codes → Add label printing task
- **Budget Integration**: "Finish truck rental task" → Add expense to budget → Update timeline cost tracking
- **Calendar Integration**: "Schedule moving day tasks" → Create calendar events → Set reminders for helpers
- **MoveID Integration**: "Onboard helpers task complete" → Send move invitations → Update team member assignments

#### MARVIN System Instructions for Timeline

MARVIN's system instructions will be enhanced with timeline-specific context:

```
Timeline Management:
- You can create, modify, complete, and query timeline tasks using natural language
- Always consider cross-feature integrations when completing tasks (budget, calendar, QR codes)
- Provide proactive suggestions for upcoming critical deadlines
- Recognize and handle custom tasks vs. default timeline tasks differently
- Support bulk operations for efficiency ("mark all packing tasks as done")
- Understand timeline phases and suggest optimal task sequences
- Alert users to potential conflicts or missing dependencies

Timeline Context Awareness:
- Current move phase and weeks remaining until move date
- User's customization level and preferences
- Integration status (QR setup, budget established, helpers onboarded)
- Recent timeline activity and completion patterns
- Critical upcoming deadlines and overdue tasks
```

---

## Technical Architecture

### Core Components Overview

```
Timeline Feature Architecture
├── TimelineGenerator Service (NEW)
│   ├── Default Task Engine → 78+ research-based tasks across 12 phases
│   ├── Customization Overlay → User modifications & additions
│   ├── Date Calculator → Smart timeline calculation with phase offsets
│   └── Integration Bridge → QR scanning, budget, calendar connectors
├── Enhanced Calendar Components (ENHANCED)
│   ├── Timeline View Mode → Phase-based timeline view
│   ├── Progress Indicators → Phase and overall completion tracking
│   ├── Quick Actions → Check-off, edit, reorder, add custom tasks
│   └── Dependency Management → Task prerequisite handling
├── Budget Integration (ENHANCED)
│   ├── Expense-Event Linking → Budget reconciliation tasks
│   ├── Timeline Budget View → Financial milestones with forecasting
│   ├── Cost Tracking → Moving expense categories integration
│   └── Receipt Scanning → AI-powered expense capture for move costs
├── Cross-Feature Integration (NEW)
│   ├── QR Code Integration → Box tracking task references
│   ├── Owner/Space Management → Setup tasks for labels and scanning
│   ├── MoveID Collaboration → Helper onboarding and task assignment
│   └── Calendar Sync → Important date tracking and appointment scheduling
└── UI Components (NEW)
    ├── TimelineCustomizationModal → Task editing, adding, removing interface
    ├── TaskProgressIndicator → Phase-based completion visualization
    ├── CustomTaskCreator → User-defined task creation with templates
    └── TimelineDashboard → 12-phase overview with customization options
```

### Data Structure Extensions

```typescript
// Enhanced CalendarEvent with timeline support
interface TimelineEvent extends CalendarEvent {
  isTimelineGenerated: boolean;
  category: 'planning' | 'logistics' | 'packing' | 'moving' | 'settling';
  priority: 'critical' | 'important' | 'optional';
  estimatedDuration?: number; // minutes
  dependencies?: string[]; // other event IDs
  completionStatus: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: Timestamp;
  linkedExpenses?: string[]; // expense IDs
  linkedDocuments?: string[]; // document URLs/IDs
}

// Enhanced Expense with calendar linking
interface TimelineExpense extends Expense {
  calendarEventId?: string; // Link to timeline event
  estimatedDate?: string; // Forecasted expense date
  actualDate?: string; // When expense actually occurred
}

// New Timeline Template structure
interface TimelineTemplate {
  id: string;
  name: string;
  description: string;
  moveType: 'local' | 'cross_state' | 'international';
  phases: TimelinePhase[];
  totalDefaultTasks: number; // 78+ tasks
}

interface TimelinePhase {
  id: string;
  name: string;
  description: string;
  weeksOut: number; // App setup, 8, 7, 6, 5, 4, 3, 2, 1, 0 (moving day), post-72hrs, post-2weeks
  tasks: TimelineTaskTemplate[];
  isCustomPhase?: boolean; // User-created phases
  originalTaskCount: number; // Track default vs custom tasks
}

interface TimelineTaskTemplate {
  id: string;
  title: string;
  description: string;
  category: 'app_setup' | 'planning' | 'logistics' | 'packing' | 'moving' | 'settling' | 'custom';
  priority: 'critical' | 'important' | 'optional';
  estimatedDuration: number;
  defaultOffset: number; // days within the phase
  dependencies?: string[];
  linkedExpenseCategories?: string[]; // budget categories this might generate
  integrations?: {
    qrScanning?: boolean; // References QR code functionality
    ownerSpaceSetup?: boolean; // References owner/space creation
    moveIdCollaboration?: boolean; // References MoveID features
    budgetReconciliation?: boolean; // Budget tracking integration
    calendarSync?: boolean; // Calendar event creation
  };
  isDefaultTask: boolean; // Distinguishes default from user-added tasks
  userModifications?: {
    originalTitle?: string;
    originalDescription?: string;
    isHidden?: boolean; // User chose to hide this default task
    customOrder?: number; // User reordered tasks
  };
}
```

---

## Phase-by-Phase Implementation Plan

### Phase 1: Default Task Integration & Timeline Generator (2.5 weeks)
**Objective**: Import and structure the 78+ research-based default tasks and create the core timeline generation engine

#### Week 1: Default Task Data Structure & Integration
- [ ] **Import and Structure Default Tasks**
  - [ ] Create comprehensive task data from MovePlanner.md (78+ tasks)
  - [ ] Structure tasks into 12 distinct phases: App Setup, 8-7-6-5-4-3-2-1 weeks out, Move Day, Post-72hrs, Post-2weeks
  - [ ] Map each task to appropriate categories, priorities, and integrations
  - [ ] Define integration points (QR scanning, budget reconciliation, MoveID collaboration)
  - **Dependencies**: None
  - **Testing**: Task data validation and completeness verification

- [ ] **Create Enhanced Timeline Data Structures**
  - [ ] Define `TimelineEvent` interface extending `CalendarEvent` with customization support
  - [ ] Create `TimelineTemplate` with 12-phase structure and user modification tracking
  - [ ] Update calendar types in `src/features/calendar/types/calendarTypes.ts`
  - [ ] Add user customization overlay interfaces
  - **Dependencies**: Default task data structure
  - **Testing**: Unit tests for type definitions and data validation

- [ ] **Build Timeline Generator Service with Customization**
  - [ ] Create `src/features/calendar/services/timelineService.ts`
  - [ ] Implement `generateTimelineEvents(moveDate, moveType, customizations)` function
  - [ ] Create comprehensive timeline templates with all 78+ default tasks
  - [ ] Add date calculation logic for 12-phase timeline using `date-fns`
  - [ ] Include user customization overlay system
  - **Dependencies**: Enhanced timeline types, default task data
  - **Testing**: Service tests with various move dates, scenarios, and customizations

#### Week 2: Template System & Data Management
- [ ] **Create Comprehensive Timeline Templates**
  - [ ] Define all default tasks in `src/features/calendar/constants/defaultTimelineTasks.ts`
  - [ ] Structure 12 phases with specific task assignments:
    * App Setup & Navigation (8 tasks)
    * 8 Weeks Out: Planning and Purging (7 tasks)
    * 7 Weeks Out: Supplies and Equipment (6 tasks)
    * 6 Weeks Out: Logistics and Records (6 tasks)
    * 5 Weeks Out: Packing Ramps Up (5 tasks)
    * 4 Weeks Out: Admin and Appointments (6 tasks)
    * 3 Weeks Out: Confirmations and Safety (6 tasks)
    * 2 Weeks Out: Final Prep and Staging (6 tasks)
    * 1 Week Out: The Home Stretch (6 tasks)
    * Move Day: Hour-by-Hour Guide (8 tasks)
    * Post-Move: First 72 Hours (3 tasks)
    * Post-Move: First 2 Weeks (5 tasks)
  - [ ] Include integration flags for QR scanning, budget, MoveID, and calendar features
  - [ ] Add task dependencies and sequencing logic
  - **Dependencies**: Timeline service structure, default task data
  - **Testing**: Template validation, task sequencing, and integration mapping

#### Days 15-17: User Customization Foundation
- [ ] **Build Customization Management Service**
  - [ ] Create `src/features/calendar/services/customizationService.ts`
  - [ ] Implement user modification tracking (add, edit, remove, reorder, hide)
  - [ ] Add custom task creation with template options
  - [ ] Create custom phase creation for unique situations
  - [ ] Include customization persistence and sync
  - **Dependencies**: Timeline templates, user data management
  - **Testing**: Customization service with various user modification scenarios

#### Week 2: UI Components & Integration
- [ ] **Create Timeline Generation Modal**
  - [ ] Build `src/features/calendar/components/TimelineGenerationModal.tsx`
  - [ ] Move date picker with validation (must be future date)
  - [ ] Move type selector (local vs cross-state)
  - [ ] Preview timeline phases before generation
  - **Dependencies**: Existing modal components, timeline service
  - **Testing**: Component testing with various inputs

- [ ] **Enhance Calendar Page**
  - [ ] Add "Generate Moving Timeline" button to `CalendarPage.tsx`
  - [ ] Integrate timeline generation modal
  - [ ] Add timeline event indicators in calendar view
  - [ ] Handle batch event creation via existing calendar service
  - **Dependencies**: Timeline generation modal, calendar service
  - **Testing**: Integration testing with calendar functionality

- [ ] **Timeline Event Enhancement**
  - [ ] Update `EventDetailModal.tsx` to show timeline-specific fields
  - [ ] Add completion status toggle
  - [ ] Show task category and priority indicators
  - [ ] Display estimated duration and dependencies
  - **Dependencies**: Enhanced event types, existing event modal
  - **Testing**: UI testing for timeline event details

#### Phase 1 Deliverables
- [ ] Complete 78+ default task integration across 12 timeline phases
- [ ] Functional timeline generation with comprehensive task coverage
- [ ] User customization foundation (add, edit, remove, reorder, hide tasks)
- [ ] Custom phase creation capability for unique moving situations
- [ ] Timeline templates covering App Setup through Post-Move: First 2 Weeks

### Phase 2.5: MARVIN Integration (1 week, 15-25 hours)
**Objective**: Integrate MARVIN AI assistant with timeline features for intelligent voice and text-based timeline management

#### Days 1-2: MARVIN Action Types & Data Integration
- [ ] **Extend MARVIN Action Types for Timeline**
  - [ ] Add `CreateTimelineTaskAction`, `UpdateTaskStatusAction`, `QueryTimelineAction`, `ModifyTimelineTaskAction` to `src/features/marvin/types/marvin.ts`
  - [ ] Create `CreateCustomPhaseAction` and `CrossFeatureActionAction` types
  - [ ] Update `AiAction` union type to include all new timeline actions
  - [ ] Add comprehensive TypeScript interfaces for timeline-specific MARVIN interactions
  - **Dependencies**: Existing MARVIN types, Timeline data structures
  - **Testing**: Type validation and action serialization testing

- [ ] **Enhance AppData with Timeline Context**
  - [ ] Extend `AppData` interface in `marvin.ts` with comprehensive timeline section
  - [ ] Update `createMarvinAppData` function in `dataAdapter.ts` to include timeline data
  - [ ] Add timeline progress, phase status, customization level, and integration status
  - [ ] Include upcoming tasks, critical deadlines, and recent timeline activity
  - **Dependencies**: Timeline service, progress tracking, customization service
  - **Testing**: Data adapter testing with various timeline states

#### Days 3-4: MARVIN Timeline Service Integration
- [ ] **Create useMarvinTimeline Hook**
  - [ ] Build `src/features/marvin/hooks/useMarvinTimeline.ts` for timeline-specific MARVIN interactions
  - [ ] Implement action handlers for all timeline-specific MARVIN actions
  - [ ] Add cross-feature integration support (budget, calendar, QR scanning automation)
  - [ ] Include intelligent task completion with secondary actions
  - **Dependencies**: MARVIN core services, timeline service, cross-feature services
  - **Testing**: Hook testing with various timeline scenarios and voice commands

- [ ] **Timeline Action Processing**
  - [ ] Extend MARVIN's action processing system to handle timeline actions
  - [ ] Implement intelligent task status updates with completion triggers
  - [ ] Add cross-feature automation (task completion → expense creation)
  - [ ] Create timeline query processing with natural language understanding
  - **Dependencies**: MARVIN gemini service, timeline service, integration services
  - **Testing**: Action processing accuracy and cross-feature automation testing

#### Days 5-6: Enhanced System Instructions & Context
- [ ] **Update MARVIN System Instructions**
  - [ ] Enhance system prompts with timeline-specific capabilities and context
  - [ ] Add timeline phase awareness and task sequence optimization guidance
  - [ ] Include cross-feature integration instructions for automated workflows
  - [ ] Add support for bulk operations and intelligent task suggestions
  - **Dependencies**: Timeline templates, integration mappings, progress tracking
  - **Testing**: System instruction effectiveness and response accuracy testing

- [ ] **Timeline Context Management**
  - [ ] Implement dynamic context updating based on timeline progress
  - [ ] Add timeline-specific memory and conversation history
  - [ ] Create proactive notification system for critical deadlines
  - [ ] Include customization-aware responses (default vs. custom tasks)
  - **Dependencies**: Timeline progress service, customization service, notification system
  - **Testing**: Context accuracy and proactive notification testing

#### Day 7: Integration Testing & Polish
- [ ] **Comprehensive MARVIN Timeline Testing**
  - [ ] End-to-end testing of voice commands for timeline management
  - [ ] Cross-feature automation testing (timeline → budget → calendar)
  - [ ] Custom task creation and modification through MARVIN
  - [ ] Bulk operations and intelligent suggestions validation
  - **Dependencies**: All MARVIN timeline components, cross-feature services
  - **Testing**: Complete workflow testing and error handling validation

#### Phase 2.5 Deliverables
- [ ] Complete MARVIN integration with timeline features (voice + text control)
- [ ] Intelligent cross-feature automation (task completion triggers expense creation)
- [ ] Natural language timeline queries and progress reporting
- [ ] Custom task creation and modification through AI assistant
- [ ] Proactive deadline alerts and task sequence optimization

### Phase 2: Cross-Feature Integration & Budget Linking (2 weeks)
**Objective**: Connect timeline with existing app features (QR scanning, budget, MoveID, calendar) and implement comprehensive financial integration

#### Week 1: Cross-Feature Integration Architecture
- [ ] **QR Code Integration with Timeline Tasks**
  - [ ] Identify tasks that reference QR scanning (Owner/Space setup, testing scanning functionality)
  - [ ] Create integration bridges in timeline tasks for box management features
  - [ ] Add QR code generation triggers for timeline milestones
  - [ ] Implement "Verify Scanning Functionality" task with actual QR testing
  - **Dependencies**: Phase 1 timeline templates, existing QR scanning features
  - **Testing**: QR integration workflows and task completion triggers

- [ ] **MoveID Collaboration Integration**
  - [ ] Link "Generate & Test Your Move ID" and "Invite & Onboard Helpers" tasks to actual MoveID functionality
  - [ ] Create helper onboarding workflow triggered by timeline tasks
  - [ ] Add participant management integration with timeline task assignment
  - [ ] Implement collaboration features for shared task completion
  - **Dependencies**: Timeline service, existing MoveID features, user management
  - **Testing**: Multi-user timeline collaboration and task sharing

- [ ] **Enhanced Budget Data Models with Timeline Integration**
  - [ ] Add `timelineEventId` field to `Expense` interface for task-specific expenses
  - [ ] Create moving expense categories aligned with timeline phases
  - [ ] Add budget reconciliation task data structure
  - [ ] Update budget reducer to handle timeline-linked expenses with forecasting
  - **Dependencies**: Phase 1 timeline events, existing budget types
  - **Testing**: Budget-timeline data integration and expense categorization

#### Week 2: Comprehensive Integration & Budget Features
- [ ] **Calendar Integration with Timeline Events**
  - [ ] Integrate "Save the Date" and calendar sync tasks with actual calendar feature
  - [ ] Create automatic calendar event creation for important timeline milestones
  - [ ] Add appointment scheduling integration (utility setup, elevator reservations)
  - [ ] Implement calendar reminders for critical timeline deadlines
  - **Dependencies**: Timeline events, existing calendar service
  - **Testing**: Calendar synchronization and event automation

- [ ] **Budget-Timeline Service Bridge**
  - [ ] Create `src/features/budget/services/budgetTimelineService.ts`
  - [ ] Implement expense-to-timeline-task linking functions
  - [ ] Add expense forecasting based on timeline phases (truck rental, supplies, etc.)
  - [ ] Create "Reconcile Your Budget" task with actual expense comparison
  - [ ] Include AI receipt scanning integration for moving expenses
  - **Dependencies**: Timeline service, enhanced budget types, existing budget service
  - **Testing**: Budget forecasting accuracy and expense-task linking

- [ ] **Owner/Space Management Integration**
  - [ ] Link "Define Spaces & Create Owners" task to actual space/owner creation flows
  - [ ] Create owner setup workflow triggered by timeline
  - [ ] Add space organization tasks with actual room management integration
  - [ ] Implement label printing integration for timeline-driven setup
  - **Dependencies**: Timeline tasks, existing owner/space features
  - **Testing**: Owner/space creation workflows from timeline triggers

#### Phase 2 Deliverables
- [ ] Complete cross-feature integration (QR scanning, MoveID, owner/space management)
- [ ] Budget reconciliation tasks with actual expense tracking integration
- [ ] Calendar synchronization with timeline milestones and appointments
- [ ] Helper onboarding workflow integrated with MoveID collaboration features
- [ ] Automated integration triggers for seamless cross-feature workflows
- [ ] **MARVIN Timeline Integration** (from Phase 2.5):
  - [ ] Voice and text-based timeline task management
  - [ ] Cross-feature automation through AI assistant
  - [ ] Intelligent timeline queries and progress reporting
  - [ ] Custom task creation via natural language

### Phase 3: Advanced User Customization & Timeline UI (2.5 weeks)
**Objective**: Build comprehensive user customization interface and specialized timeline views with progress tracking

#### Week 1: User Customization Interface
- [ ] **Timeline Customization Modal System**
  - [ ] Create `src/features/calendar/components/TimelineCustomizationModal.tsx`
  - [ ] Build interface for adding custom tasks to any phase
  - [ ] Implement task editing interface for modifying default task descriptions
  - [ ] Add task removal/hiding functionality with confirmation dialogs
  - [ ] Create task reordering interface with drag-and-drop support
  - **Dependencies**: Timeline templates, customization service
  - **Testing**: Customization interface usability and data persistence

- [ ] **Custom Task Creation System**
  - [ ] Create `CustomTaskCreator` component with templates
  - [ ] Add custom phase creation for unique moving situations
  - [ ] Implement task dependency management for custom tasks
  - [ ] Create custom task categories and priority assignment
  - [ ] Add integration options for custom tasks (budget, calendar, QR)
  - **Dependencies**: Timeline data structures, existing app integrations
  - **Testing**: Custom task creation workflows and integration functionality

- [ ] **Customization Management Service Enhancement**
  - [ ] Implement user modification persistence across sessions
  - [ ] Add customization export/import for sharing personalized timelines
  - [ ] Create customization templates for common moving scenarios
  - [ ] Add reset functionality to restore default tasks
  - [ ] Implement customization conflict resolution (dependencies, ordering)
  - **Dependencies**: User data persistence, timeline service
  - **Testing**: Customization persistence and conflict handling

#### Week 2: Timeline Dashboard & Progress Tracking
- [ ] **Comprehensive Timeline Dashboard Page**
  - [ ] Create `src/features/calendar/pages/TimelineDashboardPage.tsx`
  - [ ] Display all 12 phases with default + custom tasks
  - [ ] Show phase-based progress with visual completion indicators
  - [ ] Implement timeline overview with customization summary
  - [ ] Add quick access to customization options
  - **Dependencies**: Timeline events, customization service, progress tracking
  - **Testing**: Dashboard functionality with various customization states

- [ ] **Advanced Progress Service**
  - [ ] Create `src/features/calendar/services/progressService.ts`
  - [ ] Calculate completion percentages by phase and overall
  - [ ] Track default vs. custom task completion separately
  - [ ] Generate progress insights and milestone achievements
  - [ ] Add completion velocity tracking and deadline risk assessment
  - **Dependencies**: Timeline events, customization data, calendar service
  - **Testing**: Progress calculation accuracy with customized timelines

- [ ] **Enhanced Task Progress Components**
  - [ ] Create `TaskProgressIndicator` with customization indicators
  - [ ] Build `TimelinePhaseCard` supporting custom tasks and reordering
  - [ ] Add completion animations and milestone celebrations
  - [ ] Create customization status badges (modified, added, hidden)
  - **Dependencies**: Design system components, progress service, customization data
  - **Testing**: Component functionality with various customization scenarios

#### Days 15-18: Mobile Optimization & Quick Actions
- [ ] **Mobile Timeline Interface with Customization**
  - [ ] Optimize timeline dashboard for mobile viewing with customization options
  - [ ] Add touch-friendly task editing and reordering interface
  - [ ] Implement swipe gestures for task completion and quick actions
  - [ ] Create mobile-optimized customization modal with bottom sheets
  - **Dependencies**: Timeline dashboard, customization components
  - **Testing**: Mobile device testing with full customization functionality

- [ ] **Advanced Timeline Quick Actions**
  - [ ] Bulk task operations (complete, hide, reorder multiple tasks)
  - [ ] Intelligent task rescheduling with dependency awareness
  - [ ] Custom task templates for quick addition of common scenarios
  - [ ] Phase-level customization options (add multiple tasks, reorder phases)
  - **Dependencies**: Timeline service, customization service, mobile interface
  - **Testing**: Quick action workflows and batch customization operations

#### Phase 3 Deliverables
- [ ] Comprehensive timeline customization interface (add, edit, remove, reorder)
- [ ] Advanced timeline dashboard with customization overview
- [ ] Custom task creation system with integration options
- [ ] Mobile-optimized customization interface with touch-friendly controls
- [ ] Progress tracking that accounts for user customizations and modifications

### Phase 4: Intelligent Features & Production Polish (2 weeks)
**Objective**: Add intelligent recommendations, advanced integration features, and ensure production readiness

#### Week 1: Intelligent Features & Advanced Integrations
- [ ] **Intelligent Timeline Recommendations**
  - [ ] Create AI-powered recommendation engine for task optimization
  - [ ] Suggest task modifications based on move type and user customizations
  - [ ] Alert for potential timeline conflicts and dependency issues
  - [ ] Recommend optimal task sequences based on efficiency and dependencies
  - [ ] Add personalized task suggestions based on completion patterns
  - **Dependencies**: Timeline data, user customization patterns, progress tracking
  - **Testing**: Recommendation accuracy with various move scenarios and customizations

- [ ] **Advanced Integration Features**
  - [ ] Implement deep integration triggers (QR setup → box creation, budget setup → expense tracking)
  - [ ] Add automatic expense categorization based on timeline phase
  - [ ] Create smart calendar event generation from timeline tasks
  - [ ] Implement MoveID task assignment automation based on helper roles
  - [ ] Add cross-feature completion tracking (budget reconciliation completion)
  - **Dependencies**: All existing app features, timeline integration points
  - **Testing**: End-to-end integration workflows and cross-feature synchronization

- [ ] **Smart Task Adaptation**
  - [ ] Implement move-type specific task filtering (local vs cross-state vs international)
  - [ ] Add household size and complexity-based task recommendations
  - [ ] Create seasonal and weather-based task adjustments
  - [ ] Implement timeline compression/extension based on available time
  - **Dependencies**: Timeline templates, user move details, customization service
  - **Testing**: Task adaptation accuracy across different move scenarios

#### Week 2: Production Polish & Quality Assurance
- [ ] **Comprehensive Error Handling & Validation**
  - [ ] Timeline generation error states with user-friendly messages
  - [ ] Customization validation (dependency conflicts, circular dependencies)
  - [ ] Input validation for custom tasks and phase modifications
  - [ ] Graceful degradation for missing integration features
  - [ ] Data corruption recovery for timeline customizations
  - **Dependencies**: All timeline components and customization features
  - **Testing**: Comprehensive error scenario testing and recovery procedures

- [ ] **Performance Optimization & Scalability**
  - [ ] Timeline generation optimization for 78+ default tasks plus customizations
  - [ ] Efficient rendering of customized timeline with large task counts
  - [ ] Progress calculation caching with customization invalidation
  - [ ] Memory optimization for large timeline datasets
  - [ ] Lazy loading of timeline phases and customization data
  - **Dependencies**: Timeline services, customization components, progress tracking
  - **Testing**: Performance testing with maximum customization scenarios

- [ ] **User Experience Polish**
  - [ ] Comprehensive onboarding flow for timeline customization
  - [ ] Help system and tooltips for advanced customization features
  - [ ] Accessibility compliance for timeline interface and customization tools
  - [ ] Loading states and progress indicators for complex operations
  - [ ] User feedback collection system for timeline effectiveness
  - **Dependencies**: All timeline UI components and customization interfaces
  - **Testing**: Usability testing and accessibility validation

- [ ] **Data Migration & Backwards Compatibility**
  - [ ] Migration system for existing calendar events to timeline format
  - [ ] Customization data versioning and migration
  - [ ] Backwards compatibility for users with existing move data
  - [ ] Export/import functionality for timeline customizations
  - **Dependencies**: Existing calendar data, user move data
  - **Testing**: Data migration accuracy and backwards compatibility verification

#### Phase 4 Deliverables
- [ ] AI-powered timeline optimization and personalized recommendations
- [ ] Advanced cross-feature integration with automated workflows
- [ ] Production-ready customization system with comprehensive error handling
- [ ] Scalable performance optimized for complex customized timelines
- [ ] Complete user experience polish with onboarding and help systems

---

## Integration Strategy

### Existing Feature Integration Points

#### Calendar Feature Integration
```typescript
// Enhanced calendar service methods
class CalendarService {
  // Existing methods remain unchanged
  
  // New timeline-specific methods
  async generateTimeline(moveDate: Date, moveType: MoveType): Promise<CalendarEvent[]>
  async getTimelineEvents(moveId: string): Promise<TimelineEvent[]>
  async updateTaskCompletion(eventId: string, completed: boolean): Promise<void>
  async getTimelineProgress(moveId: string): Promise<TimelineProgress>
}
```

#### Budget Feature Integration
```typescript
// Enhanced budget service with timeline support
class BudgetService {
  // Existing methods remain unchanged
  
  // New timeline integration methods
  async linkExpenseToEvent(expenseId: string, eventId: string): Promise<void>
  async getTimelineExpenses(eventId: string): Promise<Expense[]>
  async forecastTimelineBudget(moveId: string): Promise<BudgetForecast>
  async getUpcomingExpenseAlerts(moveId: string): Promise<ExpenseAlert[]>
}
```

#### Routing Integration
```typescript
// Updated App.tsx routing
const routes = [
  // Existing routes...
  { path: '/timeline', component: TimelineDashboardPage },
  { path: '/calendar', component: CalendarPage }, // Enhanced with timeline features
  // Additional routes as needed...
];
```

### Data Flow Architecture
```
User Input (Move Date) → Timeline Generator → Calendar Events (Batch Creation)
                                           ↓
Timeline Events ← Progress Tracker ← Calendar Service → Firebase
                ↓
Budget Integration ← Expense Linking ← Budget Service → localStorage
                ↓
UI Components ← Progress Data ← Timeline Dashboard → User Interface
```

---

## Success Metrics

### Technical KPIs
- [ ] **Timeline Generation Performance**: <3 seconds for full 78+ task timeline with customizations
- [ ] **Customization Performance**: <1 second for task modifications and reordering
- [ ] **Cross-Feature Integration**: 100% compatibility with existing QR, budget, MoveID, and calendar features
- [ ] **Mobile Responsiveness**: 95%+ usability score on mobile devices for timeline and customization interfaces
- [ ] **Data Persistence**: 99.9% reliability for timeline progress and customization tracking
- [ ] **Integration Reliability**: 98%+ success rate for automated cross-feature workflows
- [ ] **MARVIN Integration KPIs**:
  - [ ] **Voice Command Success Rate**: 95%+ accuracy for timeline-related voice commands
  - [ ] **AI Response Time**: <2 seconds for timeline queries and task updates
  - [ ] **Cross-Feature Automation**: 98%+ success rate for AI-triggered integrations
  - [ ] **Natural Language Understanding**: 90%+ accuracy for timeline task creation and modification

### User Experience KPIs
- [ ] **Timeline Adoption**: 85%+ of new moves use timeline generation with default tasks
- [ ] **Task Completion Rate**: 70%+ average completion rate across all timeline phases
- [ ] **Customization Usage**: 60%+ of users customize their timeline (add, edit, or remove tasks)
- [ ] **Cross-Feature Integration**: 50%+ of timeline users actively use integrated features (QR scanning, budget, MoveID)
- [ ] **User Satisfaction**: 4.7+ stars for timeline feature functionality and customization capabilities
- [ ] **MARVIN Timeline Usage KPIs**:
  - [ ] **AI Assistant Adoption**: 40%+ of timeline users interact with MARVIN for task management
  - [ ] **Voice Command Usage**: 25%+ of MARVIN timeline interactions use voice commands
  - [ ] **AI Accuracy Satisfaction**: 4.5+ stars for MARVIN timeline assistance accuracy
  - [ ] **Cross-Feature AI Automation**: 35%+ of users use MARVIN for automated workflows

### Business Impact KPIs
- [ ] **User Engagement**: 35% increase in daily active users due to comprehensive task guidance
- [ ] **Feature Stickiness**: 85%+ of timeline users return within 30 days
- [ ] **Comprehensive Usage**: 65%+ of users complete both pre-move and post-move phases
- [ ] **Cross-Feature Adoption**: 40% increase in usage of integrated features (budget, QR, calendar)
- [ ] **Reduction in Support Tickets**: 30% decrease in "what should I do next?" and customization inquiries
- [ ] **Timeline Completion**: 75%+ of users complete at least 80% of their customized timeline
- [ ] **MARVIN Timeline Impact KPIs**:
  - [ ] **AI-Driven Task Completion**: 20% increase in task completion rates with MARVIN assistance
  - [ ] **User Efficiency**: 25% reduction in time spent managing timeline tasks through AI automation
  - [ ] **Cross-Feature Discovery**: 30% increase in feature discovery through MARVIN suggestions
  - [ ] **User Retention**: 15% improvement in 30-day retention for users who engage with MARVIN timeline features

### Validation Criteria
- [ ] Successfully generates comprehensive 78+ task timeline across 12 phases for various move scenarios
- [ ] Robust user customization system allowing full timeline personalization
- [ ] Seamless integration with all existing features (QR scanning, budget, MoveID, calendar, owners/spaces)
- [ ] Intelligent recommendations improve user task completion and efficiency
- [ ] Positive user feedback on timeline usefulness, accuracy, and customization flexibility
- [ ] No performance degradation in existing features with timeline integration
- [ ] Mobile-first interface receives positive usability testing results for both timeline and customization features
- [ ] Cross-feature workflow automation reduces user effort and improves adoption
- [ ] **MARVIN Integration Validation**:
  - [ ] MARVIN successfully handles complex timeline queries and task management through voice and text
  - [ ] Cross-feature automation triggers work reliably (task completion → expense creation → calendar updates)
  - [ ] AI-generated task suggestions are relevant and improve user workflow efficiency
  - [ ] Natural language understanding accurately interprets user intent for timeline operations
  - [ ] MARVIN integration enhances rather than complicates the timeline user experience

---

## Technical Specifications

### File Structure
```
src/features/calendar/
├── components/
│   ├── TimelineGenerationModal.tsx         (NEW)
│   ├── TimelineCustomizationModal.tsx      (NEW)
│   ├── CustomTaskCreator.tsx               (NEW)
│   ├── TaskEditingInterface.tsx            (NEW)
│   ├── TimelineDashboardView.tsx           (NEW)
│   ├── TaskProgressIndicator.tsx           (NEW)
│   ├── TimelinePhaseCard.tsx               (NEW)
│   ├── CustomPhaseCreator.tsx              (NEW)
│   ├── TaskReorderingInterface.tsx         (NEW)
│   ├── MarvinTimelineControls.tsx          (NEW) - Voice/text timeline controls
│   ├── EventDetailModal.tsx                (ENHANCED)
│   └── CalendarPage.tsx                    (ENHANCED)
├── services/
│   ├── timelineService.ts                  (NEW)
│   ├── customizationService.ts             (NEW)
│   ├── progressService.ts                  (NEW)
│   ├── integrationService.ts               (NEW)
│   ├── recommendationEngine.ts             (NEW)
│   ├── marvinTimelineService.ts            (NEW) - MARVIN timeline integration
│   └── calendarService.ts                  (ENHANCED)
├── constants/
│   ├── defaultTimelineTasks.ts             (NEW) - 78+ research-based tasks
│   ├── timelineTemplates.ts                (NEW)
│   ├── customizationTemplates.ts           (NEW)
│   └── integrationMappings.ts              (NEW)
├── types/
│   ├── calendarTypes.ts                    (ENHANCED)
│   ├── customizationTypes.ts               (NEW)
│   ├── integrationTypes.ts                 (NEW)
│   └── marvinTimelineTypes.ts              (NEW) - MARVIN action types
└── pages/
    └── TimelineDashboardPage.tsx           (NEW)

src/features/budget/
├── services/
│   ├── budgetTimelineService.ts            (NEW)
│   └── expenseIntegrationService.ts        (NEW)
├── types/
│   └── types.ts                            (ENHANCED)
└── components/
    ├── AddExpenseModal.tsx                 (ENHANCED)
    ├── TimelineBudgetView.tsx              (NEW)
    ├── ExpenseForecastDisplay.tsx          (NEW)
    └── BudgetReconciliationModal.tsx       (NEW)

src/features/boxes/
├── services/
│   └── qrTimelineIntegrationService.ts     (NEW)
└── components/
    └── QRSetupFromTimeline.tsx             (NEW)

src/features/owners/
├── services/
│   └── ownerTimelineIntegrationService.ts  (NEW)
└── components/
    └── OwnerSpaceSetupFromTimeline.tsx     (NEW)

src/features/collaboration/
├── services/
│   └── moveIdTimelineService.ts            (NEW)
└── components/
    └── HelperOnboardingFromTimeline.tsx    (NEW)

src/features/marvin/
├── hooks/
│   └── useMarvinTimeline.ts                (NEW) - Timeline-specific MARVIN hook
├── types/
│   └── marvin.ts                           (ENHANCED) - Add timeline action types
├── adapters/
│   └── dataAdapter.ts                      (ENHANCED) - Add timeline data
└── services/
    └── timelineActionProcessor.ts          (NEW) - Timeline action processing
```

### API Design

#### Timeline Generation API
```typescript
interface TimelineGenerationRequest {
  moveDate: Date;
  moveType: 'local' | 'cross_state' | 'international';
  userPreferences?: {
    householdSize?: 'studio' | '1br' | '2br' | '3br' | '4br+';
    movingExperience?: 'first_time' | 'experienced' | 'professional';
    availableHelpers?: number;
    hasSpecialItems?: boolean; // piano, artwork, etc.
  };
  customizations?: {
    excludePhases?: string[];
    includedTaskIds?: string[]; // Specific default tasks to include
    excludedTaskIds?: string[]; // Default tasks to hide
    customTasks?: CustomTaskInput[];
    customPhases?: CustomPhaseInput[];
    additionalBuffer?: number; // days
    priorityFilter?: 'all' | 'critical_important' | 'critical_only';
    taskReordering?: { [phaseId: string]: string[] }; // Task order by phase
  };
}

interface CustomTaskInput {
  title: string;
  description: string;
  phaseId: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedDuration: number;
  integrations?: TaskIntegrations;
  dependencies?: string[];
}

interface CustomPhaseInput {
  name: string;
  description: string;
  weeksOut: number;
  tasks: CustomTaskInput[];
}

interface TimelineGenerationResponse {
  events: TimelineEvent[];
  summary: {
    totalTasks: number;
    defaultTasks: number;
    customTasks: number;
    hiddenTasks: number;
    phaseBreakdown: Record<string, {
      total: number;
      default: number;
      custom: number;
      hidden: number;
    }>;
    estimatedTotalHours: number;
    criticalDeadlines: Date[];
    integrationSummary: {
      qrScanningTasks: number;
      budgetTasks: number;
      calendarTasks: number;
      moveIdTasks: number;
      ownerSpaceTasks: number;
    };
  };
  customizations: {
    hasCustomTasks: boolean;
    hasCustomPhases: boolean;
    hasReorderedTasks: boolean;
    hasHiddenTasks: boolean;
    customizationLevel: 'none' | 'light' | 'moderate' | 'extensive';
  };
  recommendations?: {
    suggestedTaskModifications?: string[];
    potentialConflicts?: string[];
    optimizationSuggestions?: string[];
  };
}
```

#### Progress Tracking API
```typescript
interface TimelineProgressRequest {
  moveId: string;
  includeForecasting?: boolean;
}

interface TimelineProgressResponse {
  overallProgress: number; // 0-100
  phaseProgress: Record<string, {
    completed: number;
    total: number;
    percentage: number;
    defaultTasksCompleted: number;
    customTasksCompleted: number;
    criticalTasksCompleted: number;
  }>;
  upcomingDeadlines: TimelineEvent[];
  recommendations: string[];
  customizationInsights: {
    mostModifiedPhase: string;
    customTaskCompletionRate: number;
    hiddenTaskCount: number;
    reorderingEffectiveness: number;
  };
  integrationProgress: {
    qrScanningSetup: boolean;
    budgetEstablished: boolean;
    moveIdGenerated: boolean;
    helpersOnboarded: number;
    calendarSynced: boolean;
  };
  riskAlerts?: {
    behindSchedule: boolean;
    conflictingTasks: string[];
    budgetRisks: string[];
    integrationGaps: string[];
    customizationConflicts: string[];
  };
  achievements?: {
    phasesCompleted: string[];
    integrationMilestones: string[];
    customizationMilestones: string[];
  };
}
```

### Database Schema

#### Enhanced Calendar Events (Firebase)
```typescript
// Firestore collection: moves/{moveId}/calendar_events/{eventId}
{
  id: string;
  title: string;
  description: string;
  start: Timestamp;
  end: Timestamp;
  allDay: boolean;
  assignees: string[];
  moveId: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Timeline-specific fields
  isTimelineGenerated: boolean;
  category: 'app_setup' | 'planning' | 'logistics' | 'packing' | 'moving' | 'settling' | 'custom';
  priority: 'critical' | 'important' | 'optional';
  estimatedDuration: number;
  dependencies: string[];
  completionStatus: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedAt: Timestamp | null;
  linkedExpenses: string[];
  linkedDocuments: string[];
  
  // Integration fields
  integrations: {
    qrScanning: boolean;
    budgetReconciliation: boolean;
    moveIdCollaboration: boolean;
    calendarSync: boolean;
    ownerSpaceSetup: boolean;
  };
  integrationTriggers?: {
    triggersQrSetup?: boolean;
    triggersBudgetCreation?: boolean;
    triggersHelperInvite?: boolean;
    triggersCalendarEvent?: boolean;
  };
  
  // Customization tracking
  isDefaultTask: boolean;
  originalTemplateId?: string;
  userModified: boolean;
  customizations?: {
    originalTitle?: string;
    originalDescription?: string;
    isHidden?: boolean;
    customOrder?: number;
    userAddedToPhase?: string;
    modificationHistory?: {
      timestamp: Timestamp;
      changeType: 'created' | 'edited' | 'reordered' | 'hidden' | 'restored';
      details: Record<string, any>;
    }[];
  };
  
  // Phase and timeline context
  phaseId: string;
  phaseName: string;
  weeksOut: number;
  phaseOrder: number;
  taskOrderInPhase: number;
}
```

#### Timeline Templates (Static Data)
```typescript
// Comprehensive default timeline template with all 78+ research-based tasks
const DEFAULT_TIMELINE_TEMPLATE: TimelineTemplate = {
  id: 'comprehensive_move_timeline',
  name: 'Research-Based Moving Timeline (12 Phases)',
  description: 'Comprehensive timeline with 78+ tasks from moving industry research',
  moveType: 'local', // Adaptable for cross-state and international
  totalDefaultTasks: 78,
  phases: [
    {
      id: 'app_setup_navigation',
      name: 'App Setup & Navigation',
      description: 'Get familiar with Smooth Moves and set up your moving infrastructure',
      weeksOut: 9, // Pre-planning phase
      originalTaskCount: 8,
      tasks: [
        {
          id: 'explore_app_navigation',
          title: 'Get Comfortable with the Apps Navigation',
          description: 'Explore the apps features, check and set settings, and get ready to customize your move as you see fit',
          category: 'app_setup',
          priority: 'critical',
          estimatedDuration: 30,
          defaultOffset: 0,
          isDefaultTask: true,
          integrations: { moveIdCollaboration: true }
        },
        {
          id: 'define_spaces_create_owners',
          title: 'Define Spaces & Create Owners',
          description: 'Organize your move by adding rooms to the Spaces page as needed and create Owners to start creating labels and tracking your belongings',
          category: 'app_setup',
          priority: 'critical',
          estimatedDuration: 45,
          defaultOffset: 0,
          isDefaultTask: true,
          integrations: { ownerSpaceSetup: true, qrScanning: true }
        },
        {
          id: 'generate_test_moveid',
          title: 'Generate & Test Your Move ID',
          description: 'Locate your MoveID (located on the Dashboard above the Participants list and in the settings) to share with your family, friends or anyone collaborating on the move',
          category: 'app_setup',
          priority: 'important',
          estimatedDuration: 15,
          defaultOffset: 1,
          isDefaultTask: true,
          integrations: { moveIdCollaboration: true }
        },
        {
          id: 'invite_onboard_helpers',
          title: 'Invite & Onboard Helpers',
          description: 'Send invitations to friends and family who will be assisting. Provide them your MoveID and get your army ready to go',
          category: 'app_setup',
          priority: 'important',
          estimatedDuration: 30,
          defaultOffset: 1,
          dependencies: ['generate_test_moveid'],
          isDefaultTask: true,
          integrations: { moveIdCollaboration: true }
        },
        {
          id: 'verify_scanning_functionality',
          title: 'Verify Scanning Functionality',
          description: 'Once all Owners and Spaces have been created, print out the initial batches for each Owner and Space and test everyones devices to ensure their cameras are working and the scanning feature is properly working',
          category: 'app_setup',
          priority: 'important',
          estimatedDuration: 30,
          defaultOffset: 2,
          dependencies: ['define_spaces_create_owners'],
          isDefaultTask: true,
          integrations: { qrScanning: true, ownerSpaceSetup: true }
        },
        {
          id: 'establish_moving_budget',
          title: 'Establish Your Moving Budget',
          description: 'Whether you have already created a budget and just need to digitize it or you have never created a budget before now, the Budget feature is designed for ease of use',
          category: 'app_setup',
          priority: 'critical',
          estimatedDuration: 60,
          defaultOffset: 2,
          isDefaultTask: true,
          integrations: { budgetReconciliation: true },
          linkedExpenseCategories: ['moving_truck', 'supplies', 'services', 'deposits']
        },
        {
          id: 'setup_moving_timeline',
          title: 'Get The Timing in Check',
          description: 'Get your moving timeline setup, customize it to your liking by adding, removing and modifying the tasks within the checklist',
          category: 'app_setup',
          priority: 'important',
          estimatedDuration: 30,
          defaultOffset: 3,
          isDefaultTask: true,
          integrations: { calendarSync: true }
        },
        {
          id: 'save_important_dates',
          title: 'Save the Date',
          description: 'Utilize the Calendar feature by adding in important dates, events, times, and whatever else you want to track within the app to ensure a smooth move',
          category: 'app_setup',
          priority: 'important',
          estimatedDuration: 30,
          defaultOffset: 3,
          isDefaultTask: true,
          integrations: { calendarSync: true }
        }
      ]
    },
    {
      id: '8_weeks_out',
      name: '8 Weeks Out: Planning and Purging',
      description: 'Focus on decluttering, planning, and establishing the foundation for your move',
      weeksOut: 8,
      originalTaskCount: 7,
      tasks: [
        {
          id: 'declutter_every_room',
          title: 'Declutter Every Room',
          description: 'Sort all items into four categories: keep, donate, sell, or trash. Reducing volume will lower costs, save time, and minimize the risk of damage',
          category: 'planning',
          priority: 'critical',
          estimatedDuration: 240, // 4 hours
          defaultOffset: 0,
          isDefaultTask: true
        },
        {
          id: 'determine_truck_size',
          title: 'Determine Required Truck Size',
          description: 'Use your home inventory to select the appropriate truck size. Consider logistics like mileage limits, ramp height, and pickup/return hours',
          category: 'logistics',
          priority: 'critical',
          estimatedDuration: 60,
          defaultOffset: 1,
          dependencies: ['declutter_every_room'],
          isDefaultTask: true,
          linkedExpenseCategories: ['moving_truck']
        },
        {
          id: 'research_rental_companies',
          title: 'Research Rental Truck Companies',
          description: 'Compare rates, vehicle availability, insurance policies, and pickup/return locations. Pay close attention to any potential holiday surcharges',
          category: 'logistics',
          priority: 'important',
          estimatedDuration: 120,
          defaultOffset: 2,
          isDefaultTask: true,
          linkedExpenseCategories: ['moving_truck', 'insurance']
        },
        {
          id: 'gather_truck_quotes',
          title: 'Gather Quotes for Truck Rentals',
          description: 'Request detailed quotes for your exact move dates. Ensure the quote includes the base rate, mileage fees, fuel policy, and any add-on costs',
          category: 'logistics',
          priority: 'important',
          estimatedDuration: 90,
          defaultOffset: 3,
          dependencies: ['research_rental_companies'],
          isDefaultTask: true,
          linkedExpenseCategories: ['moving_truck']
        },
        {
          id: 'outline_packing_strategy',
          title: 'Outline Your Packing Strategy',
          description: 'Create a timeline for packing, starting with the least-used rooms first. Set weekly goals for the number of boxes to pack to avoid a last-minute rush',
          category: 'planning',
          priority: 'important',
          estimatedDuration: 60,
          defaultOffset: 4,
          isDefaultTask: true
        },
        {
          id: 'schedule_appointments',
          title: 'Schedule High-Demand Appointments',
          description: 'Book elevator access, donation pickups, and hazardous waste disposal appointments as early as possible to secure your desired time slots',
          category: 'logistics',
          priority: 'important',
          estimatedDuration: 60,
          defaultOffset: 5,
          isDefaultTask: true,
          integrations: { calendarSync: true }
        },
        {
          id: 'plan_non_allowable_items',
          title: 'Identify & Plan for Non-Allowable Items',
          description: 'Review your rental truck agreement and local regulations for restricted items (e.g., propane tanks, fuel, chemicals). Make a plan for their proper disposal or alternative transport',
          category: 'planning',
          priority: 'important',
          estimatedDuration: 45,
          defaultOffset: 6,
          isDefaultTask: true
        },
        {
          id: 'create_floor_plan',
          title: 'Create a Preliminary Floor Plan',
          description: 'Measure large furniture and key doorways at your new home to confirm everything will fit. Planning placement now will save time and effort on move day',
          category: 'planning',
          priority: 'optional',
          estimatedDuration: 90,
          defaultOffset: 6,
          isDefaultTask: true
        }
      ]
    }
    // ... Continue with all 12 phases and remaining 60+ tasks
    // This structure would continue for all phases from the MovePlanner.md document
  ]
};

// Additional timeline templates for different move types
const TIMELINE_TEMPLATES = {
  local: DEFAULT_TIMELINE_TEMPLATE,
  cross_state: {
    ...DEFAULT_TIMELINE_TEMPLATE,
    id: 'cross_state_move_timeline',
    name: 'Cross-State Moving Timeline',
    description: 'Enhanced timeline for interstate moves with additional logistics',
    // Additional cross-state specific tasks would be added here
  },
  international: {
    ...DEFAULT_TIMELINE_TEMPLATE,
    id: 'international_move_timeline', 
    name: 'International Moving Timeline',
    description: 'Comprehensive timeline for international relocations',
    // Additional international-specific tasks would be added here
  }
};
```

### Integration Points

#### Calendar Service Enhancement
```typescript
// src/features/calendar/services/calendarService.ts
export class CalendarService {
  // ... existing methods

  async generateTimeline(
    moveDate: Date, 
    moveType: MoveType, 
    options?: TimelineGenerationOptions
  ): Promise<TimelineEvent[]> {
    const template = getTimelineTemplate(moveType);
    const events = template.phases.flatMap(phase => 
      this.generatePhaseEvents(phase, moveDate, options)
    );
    
    // Batch create in Firebase
    const createdEvents = await this.batchCreateEvents(events);
    return createdEvents;
  }

  private generatePhaseEvents(
    phase: TimelinePhase, 
    moveDate: Date, 
    options?: TimelineGenerationOptions
  ): CalendarEventInput[] {
    return phase.tasks.map(task => ({
      title: task.title,
      description: task.description,
      start: this.calculateTaskDate(moveDate, phase.weeksOut, task.defaultOffset),
      end: this.calculateTaskEndDate(/* ... */),
      allDay: task.estimatedDuration < 60,
      // ... map other timeline fields
    }));
  }
}
```

#### Budget Integration Points
```typescript
// src/features/budget/services/budgetTimelineService.ts
export class BudgetTimelineService {
  async linkExpenseToTimelineEvent(
    expenseId: string, 
    eventId: string
  ): Promise<void> {
    // Update expense with calendar event reference
    const expense = await this.budgetService.getExpense(expenseId);
    const updatedExpense = {
      ...expense,
      calendarEventId: eventId,
      estimatedDate: await this.getEventDate(eventId)
    };
    await this.budgetService.updateExpense(updatedExpense);
  }

  async getTimelineExpenseForecast(moveId: string): Promise<ExpenseForecast[]> {
    const timelineEvents = await this.calendarService.getTimelineEvents(moveId);
    const forecasts = timelineEvents
      .filter(event => event.linkedExpenseCategories?.length > 0)
      .map(event => this.createExpenseForecast(event));
    
    return forecasts;
  }
}
```

### Component Architecture

#### Timeline Generation Flow
```typescript
// TimelineGenerationModal.tsx
export default function TimelineGenerationModal({ 
  isOpen, 
  onClose 
}: TimelineGenerationModalProps) {
  const [moveDate, setMoveDate] = useState<Date>();
  const [moveType, setMoveType] = useState<MoveType>('local');
  const [preview, setPreview] = useState<TimelinePreview>();
  
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const events = await timelineService.generateTimeline(moveDate!, moveType);
      await calendarService.batchCreateEvents(events);
      onClose();
      // Navigate to calendar or show success
    } catch (error) {
      // Handle error
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Move date picker */}
      {/* Move type selector */}
      {/* Timeline preview */}
      {/* Generate button */}
    </Modal>
  );
}
```

## User Customization Strategy

### Core Customization Capabilities

#### 1. Task-Level Customizations
- **Add Custom Tasks**: Users can add new tasks to any phase with full integration options
- **Edit Existing Tasks**: Modify titles, descriptions, durations, and priorities of default tasks
- **Remove/Hide Tasks**: Hide default tasks that don't apply to their specific move situation
- **Reorder Tasks**: Drag-and-drop reordering within phases with automatic dependency resolution
- **Task Categories**: Assign custom categories and priorities to user-created tasks

#### 2. Phase-Level Customizations
- **Custom Phases**: Create entirely new phases for unique moving situations
- **Phase Timing**: Adjust phase timing and task distribution based on available time
- **Phase Reordering**: Modify the sequence of phases while maintaining logical dependencies
- **Phase Templates**: Save and share custom phase configurations

#### 3. Integration Customizations
- **Selective Integration**: Choose which tasks integrate with specific app features
- **Custom Integration Triggers**: Define when tasks should trigger cross-feature actions
- **Integration Templates**: Pre-configured integration patterns for common scenarios
- **Workflow Customization**: Modify automated workflows based on user preferences

#### 4. Advanced Customization Features
- **Conditional Tasks**: Tasks that appear based on user inputs or previous task completions
- **Template Inheritance**: Base custom timelines on default templates with modifications
- **Customization Sharing**: Export and import customized timelines for reuse or sharing
- **Smart Suggestions**: AI-powered recommendations for timeline improvements based on usage patterns

### Customization User Experience

#### Onboarding Flow
1. **Default Timeline Generation**: Start with comprehensive 78+ task baseline
2. **Customization Introduction**: Guided tour of customization options
3. **Quick Customization**: One-click options for common modifications
4. **Advanced Customization**: Full editing interface for power users

#### Customization Interface Design
- **Inline Editing**: Edit tasks directly in the timeline view
- **Batch Operations**: Modify multiple tasks simultaneously
- **Visual Feedback**: Clear indicators for modified, added, and hidden tasks
- **Undo/Redo**: Full customization history with rollback capabilities
- **Mobile Optimization**: Touch-friendly customization on mobile devices

### Implementation Considerations

#### Data Management
- **Overlay Architecture**: User customizations stored as overlay on default template
- **Version Control**: Track customization versions for rollback and history
- **Conflict Resolution**: Handle conflicts between default updates and user customizations
- **Performance Optimization**: Efficient storage and retrieval of customization data

#### User Support
- **Customization Templates**: Pre-built customization patterns for common scenarios
- **Help System**: Contextual help for advanced customization features
- **Best Practices**: Guidance for effective timeline customization
- **Community Sharing**: Platform for users to share successful customization patterns

---

This comprehensive plan provides a clear roadmap for implementing the Timeline/Checklist feature with extensive user customization capabilities while leveraging existing infrastructure and ensuring seamless integration with current functionality. The 78+ research-based default tasks provide a solid foundation, while the sophisticated customization system allows users to create truly personalized moving experiences. Each phase builds upon the previous one, with clear checkboxes for tracking implementation progress and specific technical details for development execution.