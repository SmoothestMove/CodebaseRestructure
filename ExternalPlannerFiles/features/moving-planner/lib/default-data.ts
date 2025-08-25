import type { Task, Frame } from "./types"

export const defaultFrames: Frame[] = [
  {
    id: "app-setup",
    title: "App Setup & Initial Planning",
    color: "blue",
    startWeek: -8,
    endWeek: -7,
    description: "Initial setup and planning phase",
  },
  // ... existing frames ...
]

export const defaultTasks: Task[] = [
  {
    id: "task-1",
    title: "Download and set up moving app",
    description: "Get started with the moving application",
    completed: false,
    priority: "high",
    status: "not-started",
    labels: ["App Setup"],
    checklist: [],
    comments: [],
    attachments: [],
    assignees: [],
    customFields: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // ... existing tasks ...
]
