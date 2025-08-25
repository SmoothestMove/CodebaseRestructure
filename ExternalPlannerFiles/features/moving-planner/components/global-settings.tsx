import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, Edit2 } from "lucide-react"

interface GlobalSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSettings({ isOpen, onClose }: GlobalSettingsProps) {
  // Default task options that can be customized
  const [priorities, setPriorities] = useState([
    { id: "critical", name: "Critical", color: "#EF4444" },
    { id: "high", name: "High", color: "#F97316" },
    { id: "medium", name: "Medium", color: "#EAB308" },
    { id: "low", name: "Low", color: "#10B981" },
  ])

  const [labels, setLabels] = useState([
    { id: "packing", name: "Packing & Organizing", color: "#8B5CF6" },
    { id: "logistics", name: "Logistics & Transportation", color: "#06B6D4" },
    { id: "cleaning", name: "Cleaning & Maintenance", color: "#10B981" },
    { id: "utilities", name: "Utilities & Services", color: "#F59E0B" },
    { id: "inventory", name: "Inventory & Documentation", color: "#EF4444" },
  ])

  const [statuses, setStatuses] = useState([
    { id: "not-started", name: "Not Started", color: "#64748B" },
    { id: "in-progress", name: "In Progress", color: "#3B82F6" },
    { id: "completed", name: "Completed", color: "#10B981" },
    { id: "cancelled", name: "Cancelled", color: "#EF4444" },
  ])

  const [newItemName, setNewItemName] = useState("")
  const [newItemColor, setNewItemColor] = useState("#3B82F6")

  const [editingItem, setEditingItem] = useState<{ type: string; id: string } | null>(null)
  const [editName, setEditName] = useState("")
  const [editColor, setEditColor] = useState("")

  const [dateTimeFormats, setDateTimeFormats] = useState([
    { id: "us", name: "MM/DD/YYYY", example: "12/31/2024", active: true },
    { id: "iso", name: "YYYY-MM-DD", example: "2024-12-31", active: false },
    { id: "eu", name: "DD/MM/YYYY", example: "31/12/2024", active: false },
    { id: "long", name: "Month DD, YYYY", example: "December 31, 2024", active: false },
  ])

  const [timeFormats, setTimeFormats] = useState([
    { id: "12h", name: "12-hour", example: "2:30 PM", active: true },
    { id: "24h", name: "24-hour", example: "14:30", active: false },
  ])

  const addPriority = () => {
    if (newItemName.trim()) {
      setPriorities([
        ...priorities,
        {
          id: newItemName.toLowerCase().replace(/\s+/g, "-"),
          name: newItemName,
          color: newItemColor,
        },
      ])
      setNewItemName("")
    }
  }

  const addLabel = () => {
    if (newItemName.trim()) {
      setLabels([
        ...labels,
        {
          id: newItemName.toLowerCase().replace(/\s+/g, "-"),
          name: newItemName,
          color: newItemColor,
        },
      ])
      setNewItemName("")
    }
  }

  const addStatus = () => {
    if (newItemName.trim()) {
      setStatuses([
        ...statuses,
        {
          id: newItemName.toLowerCase().replace(/\s+/g, "-"),
          name: newItemName,
          color: newItemColor,
        },
      ])
      setNewItemName("")
    }
  }

  const startEditing = (type: string, id: string, name: string, color: string) => {
    setEditingItem({ type, id })
    setEditName(name)
    setEditColor(color)
  }

  const saveEdit = () => {
    if (!editingItem) return

    const { type, id } = editingItem
    const updatedItem = { id, name: editName, color: editColor }

    if (type === "priority") {
      setPriorities(priorities.map((p) => (p.id === id ? updatedItem : p)))
    } else if (type === "label") {
      setLabels(labels.map((l) => (l.id === id ? updatedItem : l)))
    } else if (type === "status") {
      setStatuses(statuses.map((s) => (s.id === id ? updatedItem : s)))
    }

    setEditingItem(null)
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditName("")
    setEditColor("")
  }

  const removePriority = (id: string) => {
    setPriorities(priorities.filter((p) => p.id !== id))
  }

  const removeLabel = (id: string) => {
    setLabels(labels.filter((l) => l.id !== id))
  }

  const removeStatus = (id: string) => {
    setStatuses(statuses.filter((s) => s.id !== id))
  }

  const selectDateFormat = (id: string) => {
    setDateTimeFormats(dateTimeFormats.map((f) => ({ ...f, active: f.id === id })))
  }

  const selectTimeFormat = (id: string) => {
    setTimeFormats(timeFormats.map((f) => ({ ...f, active: f.id === id })))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Global Task Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="priorities" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-700">
            <TabsTrigger
              value="priorities"
              className="text-slate-300 data-[state=active]:text-slate-100 data-[state=active]:bg-slate-600"
            >
              Priorities
            </TabsTrigger>
            <TabsTrigger
              value="labels"
              className="text-slate-300 data-[state=active]:text-slate-100 data-[state=active]:bg-slate-600"
            >
              Labels
            </TabsTrigger>
            <TabsTrigger
              value="statuses"
              className="text-slate-300 data-[state=active]:text-slate-100 data-[state=active]:bg-slate-600"
            >
              Statuses
            </TabsTrigger>
            <TabsTrigger
              value="datetime"
              className="text-slate-300 data-[state=active]:text-slate-100 data-[state=active]:bg-slate-600"
            >
              Date & Time
            </TabsTrigger>
          </TabsList>

          <TabsContent value="priorities" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-slate-100">Priority Levels</h3>
              <p className="text-sm text-slate-400">
                Click any priority card to edit. Manage available priority options for tasks
              </p>
            </div>

            <div className="space-y-2">
              {priorities.map((priority) => (
                <div key={priority.id}>
                  {editingItem?.type === "priority" && editingItem?.id === priority.id ? (
                    <div className="flex items-center gap-2 p-3 bg-slate-600 rounded-lg border-2 border-blue-500">
                      <input
                        type="color"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-500"
                      />
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-slate-700 border-slate-500 text-slate-100"
                        autoFocus
                      />
                      <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={cancelEdit}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div
                      key={priority.id}
                      className="flex items-center justify-between p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => startEditing("priority", priority.id, priority.name, priority.color)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border border-slate-500"
                          style={{ backgroundColor: priority.color }}
                        />
                        <span className="text-slate-100">{priority.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Edit2 className="h-4 w-4 text-slate-400" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removePriority(priority.id)
                          }}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="New priority name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-100"
              />
              <input
                type="color"
                value={newItemColor}
                onChange={(e) => setNewItemColor(e.target.value)}
                className="w-12 h-10 rounded border border-slate-600"
              />
              <Button onClick={addPriority} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="labels" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-slate-100">Task Labels</h3>
              <p className="text-sm text-slate-400">
                Click any label card to edit. Manage available label categories for tasks
              </p>
            </div>

            <div className="space-y-2">
              {labels.map((label) => (
                <div key={label.id}>
                  {editingItem?.type === "label" && editingItem?.id === label.id ? (
                    <div className="flex items-center gap-2 p-3 bg-slate-600 rounded-lg border-2 border-blue-500">
                      <input
                        type="color"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-500"
                      />
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-slate-700 border-slate-500 text-slate-100"
                        autoFocus
                      />
                      <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={cancelEdit}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-between p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => startEditing("label", label.id, label.name, label.color)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border border-slate-500"
                          style={{ backgroundColor: label.color }}
                        />
                        <span className="text-slate-100">{label.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Edit2 className="h-4 w-4 text-slate-400" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeLabel(label.id)
                          }}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="New label name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-100"
              />
              <input
                type="color"
                value={newItemColor}
                onChange={(e) => setNewItemColor(e.target.value)}
                className="w-12 h-10 rounded border border-slate-600"
              />
              <Button onClick={addLabel} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="statuses" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-slate-100">Task Statuses</h3>
              <p className="text-sm text-slate-400">
                Click any status card to edit. Manage available status options for tasks
              </p>
            </div>

            <div className="space-y-2">
              {statuses.map((status) => (
                <div key={status.id}>
                  {editingItem?.type === "status" && editingItem?.id === status.id ? (
                    <div className="flex items-center gap-2 p-3 bg-slate-600 rounded-lg border-2 border-blue-500">
                      <input
                        type="color"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-500"
                      />
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-slate-700 border-slate-500 text-slate-100"
                        autoFocus
                      />
                      <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={cancelEdit}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-between p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => startEditing("status", status.id, status.name, status.color)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border border-slate-500"
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-slate-100">{status.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Edit2 className="h-4 w-4 text-slate-400" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeStatus(status.id)
                          }}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="New status name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-100"
              />
              <input
                type="color"
                value={newItemColor}
                onChange={(e) => setNewItemColor(e.target.value)}
                className="w-12 h-10 rounded border border-slate-600"
              />
              <Button onClick={addStatus} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="datetime" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-slate-100">Date Format</h3>
                <p className="text-sm text-slate-400">Choose your preferred date display format</p>
              </div>

              <div className="space-y-2">
                {dateTimeFormats.map((format) => (
                  <div
                    key={format.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      format.active
                        ? "bg-blue-600 border-2 border-blue-400"
                        : "bg-slate-700 hover:bg-slate-600 border-2 border-transparent"
                    }`}
                    onClick={() => selectDateFormat(format.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          format.active ? "bg-white border-white" : "border-slate-400"
                        }`}
                      />
                      <span className="text-slate-100 font-medium">{format.name}</span>
                    </div>
                    <span className="text-slate-300 text-sm">{format.example}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-slate-100">Time Format</h3>
                <p className="text-sm text-slate-400">Choose your preferred time display format</p>
              </div>

              <div className="space-y-2">
                {timeFormats.map((format) => (
                  <div
                    key={format.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      format.active
                        ? "bg-blue-600 border-2 border-blue-400"
                        : "bg-slate-700 hover:bg-slate-600 border-2 border-transparent"
                    }`}
                    onClick={() => selectTimeFormat(format.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          format.active ? "bg-white border-white" : "border-slate-400"
                        }`}
                      />
                      <span className="text-slate-100 font-medium">{format.name}</span>
                    </div>
                    <span className="text-slate-300 text-sm">{format.example}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
          <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 bg-transparent">
            Cancel
          </Button>
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
