# Claude Code Session Brief Template

## Project Context
**Project Name**: [e.g., Moving App Budget Feature]
**Repository Path**: [Full path to working directory]
**Current Branch**: [Branch name you're working on]
**Tech Stack**: [Main technologies - React, TypeScript, etc.]

## Session Goal
**Primary Objective**: [One clear sentence - what you want to accomplish]
**Success Criteria**: [How you'll know the task is complete]
**Scope Boundaries**: [What's IN scope vs OUT of scope for this session]

## Current State
**What's Working**: [Features/components that function correctly]
**What's Broken**: [Specific issues that need fixing]
**Recent Changes**: [What was done in last session/commit]

## Key Files & Locations
**Main Files to Focus On**:
- `[file path]` - [what this file does]
- `[file path]` - [what this file does]
- `[file path]` - [what this file does]

**Reference Files**:
- `[file path]` - [design mockups, specs, etc.]
- `[file path]` - [configuration, constants, etc.]

**Don't Touch Files**: [Files to avoid modifying]

## Known Context
**Previous Attempts**: [What's been tried before that didn't work]
**Dependencies**: [External libraries, APIs, services being used]
**Constraints**: [Time limits, architectural requirements, etc.]
**Environment Setup**: [How to build/run/test the project]

## Specific Issues (if debugging)
**Error Messages**: 
```
[Paste exact error messages here]
```

**Steps to Reproduce**:
1. [Step by step instructions]
2. [To reproduce the issue]
3. [So Claude can understand the problem]

**Expected vs Actual Behavior**:
- **Expected**: [What should happen]
- **Actual**: [What's happening instead]

## Quick Start Instructions
**To get oriented, Claude should**:
1. [First thing to read/analyze]
2. [Second priority task]
3. [Third step to understand context]

**Tools to use**:
- [ ] Read specific files
- [ ] Grep for patterns
- [ ] Task for analysis  
- [ ] Glob for file discovery
- [ ] Build/test commands

## Planning Approach
**Preferred Method**: 
- [ ] Break into phases with TodoWrite
- [ ] Create detailed planning document
- [ ] Work incrementally with frequent check-ins
- [ ] Focus on single issue deeply

**Documentation Needed**:
- [ ] Update existing planning docs
- [ ] Create new technical documentation
- [ ] Generate testing checklist
- [ ] Write handoff for next session

---

## Template Usage Instructions

### Before Starting Your Session:
1. **Copy this template** to a new file like `session-brief-YYYY-MM-DD.md`
2. **Fill out each section** with specific details for your task
3. **Reference the file** in your first message to Claude
4. **Update as needed** during the session

### Example Opening Message:
```
I need help with [brief description]. I've filled out a session brief with all the context. Please read session-brief-2024-01-15.md and let me know when you're ready to start.
```

### Tips for Better Briefs:
- **Be specific** - "Fix login bug" vs "Authentication doesn't work"
- **Include file paths** - Saves Claude time finding relevant code
- **Mention what you've tried** - Prevents repeating failed approaches
- **Set clear scope** - Prevents feature creep during session
- **Reference line numbers** - `file.tsx:42-58` for specific code sections