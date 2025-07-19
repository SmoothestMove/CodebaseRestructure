# Dynamic AI Coding Project Journal

## 🎯 PROJECT OBJECTIVE
**Goal**: [Clear, specific end goal in one sentence]

**Context**: [Brief background explaining why this matters and what success looks like]

---

## 📋 MASTER PLAN
**Status**: `ACTIVE` | `PAUSED` | `COMPLETED` | `BLOCKED`

### Current Phase
**Phase**: [e.g., "Setup", "Core Implementation", "Testing", "Deployment"]
**Focus**: [What we're working on right now]

### High-Level Steps
- [ ] **Step 1**: [Major milestone] - `NOT_STARTED` | `IN_PROGRESS` | `COMPLETED` | `BLOCKED`
- [ ] **Step 2**: [Major milestone] - `NOT_STARTED` | `IN_PROGRESS` | `COMPLETED` | `BLOCKED`
- [ ] **Step 3**: [Major milestone] - `NOT_STARTED` | `IN_PROGRESS` | `COMPLETED` | `BLOCKED`

### Current Task Breakdown
**Active Task**: [What we're doing right now]

#### Immediate Checklist
- [ ] **Task 1**: [Specific action] - [Owner: Human/AI] - [Priority: HIGH/MED/LOW]
- [ ] **Task 2**: [Specific action] - [Owner: Human/AI] - [Priority: HIGH/MED/LOW]
- [ ] **Task 3**: [Specific action] - [Owner: Human/AI] - [Priority: HIGH/MED/LOW]

#### Next Up (Backlog)
- [ ] **Future Task 1**: [Description]
- [ ] **Future Task 2**: [Description]

---

## 🔧 TECHNICAL CONTEXT

### Project Structure
```
D:.
├───-p
├───.vscode
├───.zencoder
│   └───docs
├───dist
│   ├───.vite
│   ├───assets
│   └───docs
├───docs

├───public
│   └───docs
└───src
    ├───components
    │   ├───common
    │   │   ├───Alert
    │   │   ├───Button
    │   │   ├───Card
    │   │   ├───Input
    │   │   ├───Modal
    │   │   ├───QRCodeDisplay
    │   │   ├───Select
    │   │   ├───Textarea
    │   │   └───TruckDiagram
    │   └───layout
    │       ├───Footer
    │       └───Header
    ├───features
    │   ├───auth
    │   │   ├───components
    │   │   ├───hooks
    │   │   ├───pages
    │   │   ├───services
    │   │   └───types
    │   ├───boxes
    │   │   ├───components
    │   │   ├───hooks
    │   │   ├───pages
    │   │   └───services
    │   ├───feedback
    │   │   └───components
    │   ├───owners
    │   │   ├───components
    │   │   ├───hooks
    │   │   ├───pages
    │   │   └───services
    │   ├───products
    │   │   ├───components
    │   │   ├───hooks
    │   │   ├───pages
    │   │   ├───services
    │   │   └───types
    │   └───settings
    │       ├───hooks
    │       ├───pages
    │       └───services
    ├───hooks
    ├───lib
    │   ├───api
    │   ├───config
    │   └───helpers
    ├───pages
    ├───types
    └───utils
```

### Architecture Overview
This appears to be a React-based application with a modern feature-driven architecture. The project structure reveals several key patterns:

**Frontend Framework**: React/TypeScript with Vite build system (evidenced by dist/.vite)
**Architecture Pattern**: Feature-based organization with shared components
**Key Features**: Authentication, box management, owner management, product management, feedback, and settings

**Core Directories**:
- `src/components/common/` - Reusable UI components (Alert, Button, Card, Input, Modal, QRCodeDisplay, Select, Textarea, TruckDiagram)
- `src/features/` - Feature modules following consistent structure (components, hooks, pages, services, types)
- `src/lib/` - Core utilities (api, config, helpers)
- `src/hooks/` - Shared React hooks
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

**Business Domain**: The presence of "boxes", "owners", "products", and "TruckDiagram" suggests this is likely a logistics, shipping, or inventory management application.

### Key Files Status
| File | Purpose | Last Modified | Status | Notes |
|------|---------|---------------|--------|-------|
| `file1.js` | [purpose] | [date] | `STABLE` | [any important notes] |
| `file2.py` | [purpose] | [date] | `NEEDS_WORK` | [what needs attention] |

---

## 🚧 ACTIVE WORK LOG

### Current Session: [Date/Time]
**Working on**: [Current focus]

#### Progress Made
- [2025-07-18 10:30 AM] - Updated navigation links in Header component to point to budget-setup page.
- [2025-07-18 10:35 AM] - Added new route for BudgetSetupPage in App.tsx.
- [2025-07-18 10:40 AM] - Added import statement for BudgetSetupPage in App.tsx.

#### Changes Made
**File**: `src/components/layout/Header/index.tsx`
- **Lines [20-22]**: MODIFIED - Updated desktop navigation link for Budget to '/app/budget-setup'.
- **Lines [35-37]**: MODIFIED - Updated mobile bottom navigation link for Budget to '/app/budget-setup'.

**File**: `src/App.tsx`
- **Lines [100-101]**: ADDED - Added new route for BudgetSetupPage under '/app/budget-setup'.
- **Lines [13-14]**: ADDED - Added import for BudgetSetupPage.

---

## 🐛 ERROR TRACKING

### Active Issues
#### Error #1: [Brief description]
**Status**: `INVESTIGATING` | `BLOCKED` | `RESOLVED`
**Severity**: `CRITICAL` | `HIGH` | `MEDIUM` | `LOW`

**Error Details**:
```
[Exact error message]
```

**Reproduction Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Environment**: [When/where this occurs]

**Investigation Notes**:
- [Timestamp] - [What was tried]
- [Timestamp] - [Results/observations]

**Resolution**: [How it was fixed, if resolved]

### Resolved Issues
#### Error #X: [Brief description] - `RESOLVED`
**Solution**: [Brief description of fix]
**Files Changed**: [List of files modified]
**Prevention**: [How to avoid in future]

---

## 🤖 AI AGENT INSTRUCTIONS

### For All AI Models
**READ THIS FIRST**: This is a dynamic document. Always check the "Current Task Breakdown" section to understand what we're working on. Update the relevant sections as you help with tasks.

**When you help**:
1. Update the "Active Work Log" with timestamps and actions
2. Mark checklist items as completed when done
3. Add any new errors to the "Error Tracking" section
4. Update file statuses in the "Key Files Status" table
5. Suggest new tasks for the backlog when you identify them

### Model-Specific Instructions

#### 📘 For Claude (Anthropic)
**Strengths**: Code analysis, documentation, debugging, architectural thinking
**Best Use**: Complex problem-solving, code review, planning

**Special Instructions**:
- When creating code, always include detailed comments explaining the reasoning
- If you identify architectural concerns, add them to the backlog
- Use your analysis capabilities to suggest improvements to the current approach
- When debugging, create step-by-step investigation plans

#### 🔷 For Gemini CLI
**Strengths**: File operations, shell commands, automation
**Best Use**: File manipulation, running tests, executing scripts

**Special Instructions**:
- When making file changes, always show the exact lines being modified
- Include shell commands that can be copied and pasted
- Focus on automation opportunities you can identify
- Provide specific command sequences for testing and validation

#### 🌊 For Windsurf Cascade
**Strengths**: Multi-file editing, project-wide changes, refactoring
**Best Use**: Large-scale changes, code organization, project restructuring

**Special Instructions**:
- When suggesting changes, consider the entire project structure
- Identify files that need coordinated changes
- Focus on consistency across the codebase
- Suggest project organization improvements

---

## 📚 KNOWLEDGE BASE

### Decisions Made
- **Decision**: [What was decided]
- **Date**: [When]
- **Reasoning**: [Why this choice was made]
- **Impact**: [How it affects the project]

### Patterns & Best Practices
- **Pattern**: [Description]
- **Use Case**: [When to use it]
- **Implementation**: [How to implement]

### Common Pitfalls
- **Issue**: [What to watch out for]
- **Solution**: [How to avoid/fix]
- **Prevention**: [How to prevent in future]

---

## 🔄 SESSION HANDOFF

### Previous Session Summary
**Date**: [Last session date]
**Duration**: [Time spent]
**Primary Focus**: [What was the main objective]

**Key Decisions Made**:
- **Decision**: [What was decided]
- **Rationale**: [Why this approach was chosen]
- **Alternatives Rejected**: [What was considered but not chosen]
- **Impact**: [How this affects the project]

**Context for Next Session**:
- **Current State**: [Where we left off]
- **Assumptions Made**: [What we're assuming to be true]
- **Open Questions**: [What still needs clarification]
- **Critical Knowledge**: [What the next AI absolutely must know]

**Handoff Checklist**:
- [ ] All code changes documented in Active Work Log
- [ ] Any new dependencies added to Dependency Web
- [ ] Error states updated in tracking section
- [ ] Next session priorities identified

---

## 🕸️ DEPENDENCY WEB

### Component Dependencies
**Component**: [Name]
- **Depends On**: [List of dependencies]
- **Used By**: [List of components that use this]
- **Breaking Changes Impact**: [What breaks if this changes]

### Feature Dependencies
**Feature**: Authentication
- **Technical Dependencies**: [APIs, services, libraries it needs]
- **Business Dependencies**: [Other features that rely on auth]
- **Data Dependencies**: [Database tables, external data sources]
- **UI Dependencies**: [Components, layouts, routing]

**Feature**: Box Management
- **Technical Dependencies**: [APIs, services, libraries it needs]
- **Business Dependencies**: [Other features that rely on boxes]
- **Data Dependencies**: [Database tables, external data sources]
- **UI Dependencies**: [Components, layouts, routing]

**Feature**: Owner Management
- **Technical Dependencies**: [APIs, services, libraries it needs]
- **Business Dependencies**: [Other features that rely on owners]
- **Data Dependencies**: [Database tables, external data sources]
- **UI Dependencies**: [Components, layouts, routing]

**Feature**: Product Management
- **Technical Dependencies**: [APIs, services, libraries it needs]
- **Business Dependencies**: [Other features that rely on products]
- **Data Dependencies**: [Database tables, external data sources]
- **UI Dependencies**: [Components, layouts, routing]

### Cross-Feature Impact Matrix
| Change to → | Auth | Boxes | Owners | Products | Settings |
|-------------|------|-------|--------|----------|----------|
| **Auth**    | -    | HIGH  | MED    | LOW      | HIGH     |
| **Boxes**   | MED  | -     | HIGH   | HIGH     | LOW      |
| **Owners**  | LOW  | HIGH  | -      | MED      | LOW      |
| **Products**| LOW  | HIGH  | MED    | -        | LOW      |
| **Settings**| HIGH | LOW   | LOW    | LOW      | -        |

### Critical Path Dependencies
**If this breaks → This also breaks**:
- Authentication failure → All protected features become inaccessible
- Box service failure → Owner management loses context, Product tracking fails
- Database connection → All features affected
- [Add critical paths as discovered]

---

## 💬 COMMUNICATION PROTOCOLS

### Standard Information Formats

#### Bug Reports
**Format**: Use this exact structure when documenting bugs
```
**Bug**: [One-line description]
**Severity**: CRITICAL | HIGH | MEDIUM | LOW
**Reproducible**: YES | NO | SOMETIMES
**Environment**: [Browser/OS/Version where it occurs]
**User Type**: [Who experiences this - admin/user/guest]

**Steps to Reproduce**:
1. [Exact step]
2. [Exact step]
3. [Exact step]

**Expected Result**: [What should happen]
**Actual Result**: [What actually happens]
**Error Message**: [Exact text in code blocks]
**Workaround**: [Temporary solution if any]
```

#### Feature Requests
**Format**: Use this structure for new feature documentation
```
**Feature**: [Name of feature]
**Priority**: HIGH | MEDIUM | LOW
**Effort**: SMALL | MEDIUM | LARGE
**Business Value**: [Why this matters]

**User Story**: As a [user type], I want [goal] so that [benefit]

**Acceptance Criteria**:
- [ ] [Specific, testable requirement]
- [ ] [Specific, testable requirement]
- [ ] [Specific, testable requirement]

**Technical Requirements**:
- [API endpoints needed]
- [Database changes required]
- [UI components needed]
- [Dependencies or integrations]

**Definition of Done**:
- [ ] Code implemented and tested
- [ ] Documentation updated
- [ ] Peer review completed
- [ ] User acceptance testing passed
```

#### Code Changes
**Format**: Use this structure when documenting code modifications
```
**File**: `path/to/file.ext`
**Change Type**: ADDED | MODIFIED | REMOVED | REFACTORED
**Lines**: [Line numbers or "NEW FILE"]
**Reason**: [Why this change was needed]

**Before**:
```[language]
[Original code if modified]
```

**After**:
```[language]
[New code]
```

**Testing**: [How this change was validated]
**Side Effects**: [What else this might affect]
```

#### AI Agent Instructions
**Format**: Use this structure when giving instructions to AI agents
```
**Task**: [Clear, specific action needed]
**Context**: [Background information the AI needs]
**Constraints**: [Limitations or requirements]
**Expected Output**: [What format/type of response you want]
**Success Criteria**: [How you'll know it's done correctly]

**Files to Consider**: [Specific files the AI should examine]
**Avoid**: [What the AI should NOT do]
**Prioritize**: [What's most important if trade-offs are needed]
```

### AI Agent Response Standards

#### For All AI Agents
**When you receive a task**:
1. **Confirm understanding**: Restate the task in your own words
2. **Identify dependencies**: Check the Dependency Web for impact
3. **Plan approach**: Outline your steps before starting
4. **Request clarification**: Ask specific questions if anything is unclear

**When you complete a task**:
1. **Update logs**: Add your actions to the Active Work Log
2. **Update checklists**: Mark completed items, add new ones discovered
3. **Document changes**: Use the standard Code Changes format
4. **Identify next steps**: Suggest what should happen next

#### Response Quality Standards
**Code suggestions must include**:
- Complete, functional code (no placeholders)
- Explanatory comments for complex logic
- Error handling where appropriate
- Consideration of existing patterns in the codebase

**Explanations must include**:
- Why this approach was chosen
- What alternatives were considered
- How this fits with the existing architecture
- What the trade-offs are

**Problem analysis must include**:
- Root cause identification
- Impact assessment using the Dependency Web
- Multiple solution options with pros/cons
- Recommended approach with reasoning

### Escalation Protocols
**When AI agents should ask for human input**:
- Multiple valid approaches exist with significant trade-offs
- Changes would affect high-impact dependencies
- Unclear requirements that could lead to rework
- Potential security or performance implications
- Conflicts with existing architectural decisions

**How to escalate**:
1. **Summarize the situation** clearly
2. **Present options** with pros/cons
3. **Recommend an approach** with reasoning
4. **Specify what decision is needed** from the human
5. **Estimate impact** of delaying the decision

---

### Completion Criteria
- [ ] **Criterion 1**: [How we know we're done]
- [ ] **Criterion 2**: [Measurable outcome]
- [ ] **Criterion 3**: [Quality standard]

### Testing Checklist
- [ ] **Unit Tests**: [Coverage expectations]
- [ ] **Integration Tests**: [What needs testing]
- [ ] **Performance Tests**: [Benchmarks to meet]
- [ ] **User Acceptance**: [How we validate with users]

---

## 📝 NOTES & OBSERVATIONS

### Today's Insights
- [Observation about the code/problem/solution]
- [Learning or realization]
- [Idea for future improvement]

### Questions to Research
- [Question that came up during work]
- [Concept that needs deeper understanding]
- [Alternative approach to investigate]

---

## 🔄 TEMPLATE USAGE INSTRUCTIONS

### For Humans
1. **Start each session** by updating the "Current Task Breakdown"
2. **Ask AI to read** the entire document before starting work
3. **Review changes** made by AI agents before continuing
4. **Update the objective** if the goal evolves
5. **Archive completed sections** to keep the document manageable

### For AI Agents
1. **Always read the full document** before responding
2. **Check the current task** and prioritize accordingly
3. **Update relevant sections** as you work
4. **Add new items** to backlogs and checklists as needed
5. **Cross-reference** with the knowledge base before suggesting solutions

---

*Last Updated: [Timestamp]*  
*Current Status: [Brief status summary]*