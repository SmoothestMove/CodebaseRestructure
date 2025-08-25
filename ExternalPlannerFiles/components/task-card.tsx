import { Badge } from "@/components/ui/badge"
import { Clock, FileText, CheckSquare } from "lucide-react"
import type { Task } from "../lib/types"

interface TaskCardProps {
  task: Task
  onClick: () => void
  isInTimeline: boolean
}

export function TaskCard({ task, onClick, isInTimeline }: TaskCardProps) {
  const completedChecklist = task.checklist?.filter((item) => item.completed).length || 0
  const totalChecklist = task.checklist?.length || 0

  return (
    <div
      onClick={onClick}
      className="bg-slate-700 rounded-lg p-3 cursor-pointer hover:bg-slate-600 transition-colors border border-slate-600"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-slate-100 flex-1">{task.title}</h4>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        {task.description && (
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
          </div>
        )}

        {totalChecklist > 0 && (
          <div className="flex items-center gap-1">
            <CheckSquare className="h-3 w-3" />
            <span>
              {completedChecklist}/{totalChecklist}
            </span>
          </div>
        )}
      </div>

      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.labels.map((label, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

// Re-export for backward compatibility
export { TaskCard as TimelineTaskCard }
