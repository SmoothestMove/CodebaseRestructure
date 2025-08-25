"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CustomFieldCreator } from "./custom-field-creator"
import { Edit2, Calendar, CheckSquare, Users, Plus, Settings } from "lucide-react"
import { FaTag } from "react-icons/fa"
import type { Task, Priority, TaskStatus } from "../lib/types"

interface TaskModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onUpdate: (task: Task) => void
}

const LABEL_OPTIONS = [
  { name: "Packing & Organizing", color: "bg-purple-600" },
  { name: "Logistics & Transportation", color: "bg-blue-600" },
  { name: "Cleaning & Maintenance", color: "bg-green-600" },
  { name: "Utilities & Services", color: "bg-orange-600" },
  { name: "Inventory & Documentation", color: "bg-red-600" },
]

export function TaskModal({ task, isOpen, onClose, onUpdate }: TaskModalProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [localTask, setLocalTask] = useState<Task>(task)
  const [showLabelDropdown, setShowLabelDropdown] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    setLocalTask(task)
  }, [task])

  const handleSave = () => {
    onUpdate(localTask)
    onClose()
  }

  const handleTitleChange = (newTitle: string) => {
    setLocalTask((prev) => ({ ...prev, title: newTitle }))
    setEditingTitle(false)
  }

  const handlePriorityChange = (priority: Priority) => {
    setLocalTask((prev) => ({ ...prev, priority }))
  }

  const handleStatusChange = (status: TaskStatus) => {
    setLocalTask((prev) => ({ ...prev, status }))
  }

  const handleLabelToggle = (labelName: string) => {
    setLocalTask((prev) => {
      const currentLabels = prev.labels || []
      const hasLabel = currentLabels.some((label) => label.name === labelName)

      if (hasLabel) {
        return {
          ...prev,
          labels: currentLabels.filter((label) => label.name !== labelName),
        }
      } else {
        const labelOption = LABEL_OPTIONS.find((option) => option.name === labelName)
        return {
          ...prev,
          labels: [...currentLabels, { name: labelName, color: labelOption?.color || "bg-gray-600" }],
        }
      }
    })
  }

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      critical: "bg-red-500 text-white",
      high: "bg-orange-500 text-white",
      medium: "bg-yellow-500 text-white",
      low: "bg-green-500 text-white",
    }
    return colors[priority]
  }

  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      "not-started": "bg-slate-600 text-white",
      "in-progress": "bg-blue-600 text-white",
      completed: "bg-green-600 text-white",
      cancelled: "bg-red-600 text-white",
    }
    return colors[status]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 text-slate-100 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editingTitle ? (
              <Input
                value={localTask.title}
                onChange={(e) => setLocalTask((prev) => ({ ...prev, title: e.target.value }))}
                onBlur={() => handleTitleChange(localTask.title)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleChange(localTask.title)
                  if (e.key === "Escape") setEditingTitle(false)
                }}
                className="bg-slate-700 border-slate-600 text-slate-100"
                autoFocus
              />
            ) : (
              <>
                <span>{localTask.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingTitle(true)}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-100"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-100"
                  title="Task Settings"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
              <Textarea
                value={localTask.description}
                onChange={(e) => setLocalTask((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Add a description..."
                className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                rows={4}
              />
            </div>

            {localTask.labels && localTask.labels.length > 0 && (
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Labels</label>
                <div className="flex flex-wrap gap-2">
                  {localTask.labels.map((label, index) => (
                    <Badge key={index} className={`${label.color} text-white`}>
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-300">Status & Priority</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                  <Badge className={getPriorityColor(localTask.priority || "low")}>
                    {localTask.priority
                      ? localTask.priority.charAt(0).toUpperCase() + localTask.priority.slice(1)
                      : "Low"}
                  </Badge>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-400 mb-1 block">Status</label>
                  <Badge className={getStatusColor(localTask.status || "not-started")}>
                    {localTask.status
                      ? localTask.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
                      : "Not Started"}
                  </Badge>
                </div>
              </div>
            </div>

            {showSettings && (
              <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Task Settings</h3>
                <div className="space-y-3 text-sm text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Enable notifications</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Auto-assign to timeline</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show in dashboard</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                </div>
              </div>
            )}

            <CustomFieldCreator task={localTask} onUpdate={setLocalTask} buttonText="Add New Field" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-slate-100">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
              <div className="relative">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-slate-100"
                  onClick={() => setShowLabelDropdown(!showLabelDropdown)}
                >
                  <FaTag className="h-4 w-4 mr-2" />
                  Labels
                </Button>
                {showLabelDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg z-10">
                    <div className="p-2 space-y-1">
                      {LABEL_OPTIONS.map((option) => {
                        const isSelected = localTask.labels?.some((label) => label.name === option.name)
                        return (
                          <button
                            key={option.name}
                            onClick={() => handleLabelToggle(option.name)}
                            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-slate-600 flex items-center gap-2 ${
                              isSelected ? "bg-slate-600" : ""
                            }`}
                          >
                            <div className={`w-3 h-3 rounded ${option.color}`}></div>
                            {option.name}
                            {isSelected && <span className="ml-auto text-green-400">✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-slate-100">
                <Calendar className="h-4 w-4 mr-2" />
                Dates
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-slate-100">
                <CheckSquare className="h-4 w-4 mr-2" />
                Checklist
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-slate-100">
                <Users className="h-4 w-4 mr-2" />
                Members
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                <Select value={localTask.priority || "low"} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Status</label>
                <Select value={localTask.status || "not-started"} onValueChange={handleStatusChange}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-slate-300 hover:text-slate-100 bg-transparent"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
