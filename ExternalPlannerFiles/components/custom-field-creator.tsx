import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import type { Task, CustomField, CustomFieldType } from "../lib/types"

interface CustomFieldCreatorProps {
  task: Task
  onUpdate: (task: Task) => void
  buttonText?: string
}

export function CustomFieldCreator({ task, onUpdate, buttonText = "Add Custom Field" }: CustomFieldCreatorProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [fieldName, setFieldName] = useState("")
  const [fieldType, setFieldType] = useState<CustomFieldType>("text")

  const handleCreateField = () => {
    if (!fieldName.trim()) return

    const newField: CustomField = {
      id: Date.now().toString(),
      name: fieldName,
      type: fieldType,
      value: fieldType === "checkbox" ? false : "",
    }

    const updatedTask = {
      ...task,
      customFields: [...(task.customFields || []), newField],
    }

    onUpdate(updatedTask)
    setFieldName("")
    setFieldType("text")
    setIsCreating(false)
  }

  const handleCancel = () => {
    setFieldName("")
    setFieldType("text")
    setIsCreating(false)
  }

  if (isCreating) {
    return (
      <div className="space-y-3 p-3 bg-slate-700 rounded-lg">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Field Name</label>
          <Input
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            placeholder="Enter field name..."
            className="bg-slate-600 border-slate-500 text-slate-100"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Field Type</label>
          <Select value={fieldType} onValueChange={(value: CustomFieldType) => setFieldType(value)}>
            <SelectTrigger className="bg-slate-600 border-slate-500 text-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-600 border-slate-500">
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
              <SelectItem value="dropdown">Dropdown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCreateField} size="sm" className="bg-blue-600 hover:bg-blue-700">
            Create
          </Button>
          <Button onClick={handleCancel} variant="outline" size="sm" className="border-slate-500 bg-transparent">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {task.customFields && task.customFields.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300">Custom Fields</h4>
          {task.customFields.map((field) => (
            <div key={field.id} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 min-w-20">{field.name}:</span>
              <span className="text-xs text-slate-100">{String(field.value)}</span>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={() => setIsCreating(true)}
        variant="outline"
        size="sm"
        className="border-slate-600 text-slate-300 hover:text-slate-100 bg-transparent"
      >
        <Plus className="h-3 w-3 mr-2" />
        {buttonText}
      </Button>
    </div>
  )
}
