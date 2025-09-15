// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react'
import type { Task, TaskAssignments, ChecklistItem, Label } from "../lib/types"
import type { Owner } from '@/types'
import { PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants'
import { useOwners } from '@/features/owners/hooks/useOwners'
import { useMove } from '@/features/settings/hooks/MoveContext'
// Shared UI components (shadcn wrappers)
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'
// Lightweight Textarea wrapper (not provided in local UI set)
const Textarea = React.forwardRef(({ className, ...props }: any, ref: any) => (
  <textarea 
    className={`w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} 
    ref={ref} 
    {...props} 
  />
))

const MultiSelect = ({ options, selectedOptions, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [selectRef])
  
  const handleOptionToggle = (option) => {
    const isSelected = selectedOptions.some(s => s.name === option.name)
    onChange(isSelected ? selectedOptions.filter(s => s.name !== option.name) : [...selectedOptions, option])
  }
  
  return (
    <div className="relative" ref={selectRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center p-2 rounded-md text-left bg-slate-700 border-slate-600 text-slate-100"
      >
        <span className="truncate">
          {selectedOptions.length > 0 ? `${selectedOptions.length} selected` : (placeholder || "Select...")}
        </span>
        <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg">
          <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
            {options.map(o => {
              const isSelected = selectedOptions.some(s => s.name === o.name)
              return (
                <button 
                  key={o.name} 
                  onClick={() => handleOptionToggle(o)} 
                  className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-slate-600 flex items-center gap-3 ${isSelected ? "bg-slate-600/70" : ""}`}
                >
                  <div className={`w-4 h-4 rounded border-2 ${isSelected ? 'bg-blue-500 border-blue-400' : 'border-slate-400'} flex items-center justify-center`}>
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className={`w-3 h-3 rounded-sm ${o.color}`}></div>
                  <span>{o.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// --- ICONS ---
const Edit2 = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
  </svg>
)

const Settings = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const Trash2 = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const Check = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const X = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const Flag = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-13.2A2 2 0 015.2 6H18a2 2 0 012 2v4a2 2 0 01-2 2H5.2M3 21l4-4" />
  </svg>
)

const Circle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const Clock = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const Plus = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const FaFileCirclePlus = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 512 512">
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 232V160c0-13.3 10.7-24 24-24s24 10.7 24 24v72h72c13.3 0 24 10.7 24 24s-10.7 24-24 24h-72v72c0 13.3-10.7 24-24 24s-24-10.7-24-24v-72h-72c-13.3 0-24-10.7-24-24s10.7-24 24-24h72z"/>
  </svg>
)

const BsCalendar2DateFill = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 16 16">
    <path d="M9.402 10.246c.65 0 1.184-.448 1.184-1.002 0-.554-.534-1.002-1.184-1.002s-1.184.448-1.184 1.002c0 .554.534 1.002 1.184 1.002M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z"/>
  </svg>
)

const FaListOl = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 512 512">
    <path d="M64 128c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM48 256c-17.7 0-32 14.3-32 32s14.3 32 32 32H96c17.7 0 32-14.3 32-32s-14.3-32-32-32H48z"/>
  </svg>
)

const FaUserTag = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 512 512">
    <path d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0 112 64.5 112 144s64.5 144 144 144zm-94.7 32C62.5 320 0 382.5 0 464c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48 0-81.5-62.5-144-161.3-144H161.3z"/>
  </svg>
)

// --- DATES MODAL ---
const DatesModal = ({ isOpen, onClose, onSave, taskDates }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [useStartDate, setUseStartDate] = useState(!!taskDates.startDate)
  const [startDate, setStartDate] = useState(taskDates.startDate)
  const [useDueDate, setUseDueDate] = useState(!!taskDates.dueDate)
  const [dueDate, setDueDate] = useState(taskDates.dueDate)
  const [dueTime, setDueTime] = useState(taskDates.dueTime || '5:00 PM')
  const [reminder, setReminder] = useState(taskDates.reminder || 'none')
  
  const handleDateClick = (day) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString('en-US')
    if (useStartDate && (!startDate || (dueDate && new Date(d) > new Date(dueDate)))) {
      setStartDate(d)
      if (!useDueDate) setDueDate(null)
    } else if (useDueDate && (!dueDate || (startDate && new Date(d) < new Date(startDate)))) {
      setDueDate(d)
    } else if (useStartDate) {
      setStartDate(d)
    } else if (useDueDate) {
      setDueDate(d)
    }
  }
  
  const handleSave = () => {
    onSave({
      startDate: useStartDate ? startDate : null,
      dueDate: useDueDate ? dueDate : null,
      dueTime: useDueDate ? dueTime : null,
      reminder: useDueDate ? reminder : 'none'
    })
    onClose()
  }
  
  const handleRemove = () => {
    onSave({ startDate: null, dueDate: null, dueTime: null, reminder: 'none' })
    onClose()
  }
  
  const renderCalendar = () => {
    const y = currentDate.getFullYear()
    const m = currentDate.getMonth()
    const firstDay = new Date(y, m, 1).getDay()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const cells = []
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-1"></div>)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(y, m, day).toLocaleDateString('en-US')
      const isStart = dateStr === startDate
      const isEnd = dateStr === dueDate
      const isInRange = startDate && dueDate && dateStr > startDate && dateStr < dueDate
      
      let className = 'hover:bg-slate-600'
      if (isStart) className = 'bg-blue-600 text-white rounded-l-full'
      if (isEnd) className = 'bg-blue-600 text-white rounded-r-full'
      if (isStart && isEnd) className = 'bg-blue-600 text-white rounded-full'
      if (isInRange) className = 'bg-blue-800/50'
      
      cells.push(
        <button 
          key={day} 
          onClick={() => handleDateClick(day)} 
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${className}`}
        >
          {day}
        </button>
      )
    }
    
    return cells
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-slate-800 text-slate-200 rounded-lg shadow-xl p-4 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-center text-slate-200">Dates</DialogTitle>
        </DialogHeader>
        
        {/* Calendar */}
        <div className="text-center mb-4">
          <div className="flex justify-between items-center px-2 mb-2">
            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>&lt;</button>
            <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>&gt;</button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-xs text-slate-400 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center font-semibold">{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-sm">
            {renderCalendar()}
          </div>
        </div>
        
        {/* Date inputs */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="start-date-checkbox" 
              checked={useStartDate} 
              onChange={e => setUseStartDate(e.target.checked)} 
              className="accent-blue-500" 
            />
            <label htmlFor="start-date-checkbox" className="w-20">Start Date</label>
            <Input 
              type="text" 
              value={startDate || ''} 
              onChange={e => setStartDate(e.target.value)} 
              disabled={!useStartDate} 
              className="text-sm py-1" 
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="due-date-checkbox" 
              checked={useDueDate} 
              onChange={e => setUseDueDate(e.target.checked)} 
              className="accent-blue-500" 
            />
            <label htmlFor="due-date-checkbox" className="w-20">Due Date</label>
            <Input 
              type="text" 
              value={dueDate || ''} 
              onChange={e => setDueDate(e.target.value)} 
              disabled={!useDueDate} 
              className="text-sm py-1" 
            />
            <Input 
              type="text" 
              value={dueTime} 
              onChange={e => setDueTime(e.target.value)} 
              disabled={!useDueDate} 
              className="text-sm py-1" 
            />
          </div>
          
          {useDueDate && (
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Set due date reminder</label>
              <Select value={reminder} onValueChange={setReminder}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 text-sm py-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="5m">5 minutes before</SelectItem>
                  <SelectItem value="1h">1 hour before</SelectItem>
                  <SelectItem value="1d">1 day before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="mt-6 space-y-2">
          <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">Save</Button>
          <Button onClick={handleRemove} variant="ghost" className="w-full hover:bg-red-500/20 hover:text-red-300">Remove</Button>
        </div>
      </div>
    </div>
  )
}

// --- CUSTOM FIELD CREATOR ---
const CustomFieldCreator = ({ task, onUpdate, buttonText }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [fieldName, setFieldName] = useState("")
  const [fieldValue, setFieldValue] = useState("")
  const [editingFieldKey, setEditingFieldKey] = useState(null)
  const [editedValue, setEditedValue] = useState("")
  
  const handleAddField = () => {
    if (fieldName && fieldValue) {
      const newCustomFields = task.customFields || []
      newCustomFields.push({ id: `field-${Date.now()}`, name: fieldName, type: 'text', value: fieldValue })
      onUpdate({ ...task, customFields: newCustomFields })
      setFieldName("")
      setFieldValue("")
      setIsCreating(false)
    }
  }
  
  const handleStartEdit = (key, value) => {
    setEditingFieldKey(key)
    setEditedValue(value)
  }
  
  const handleCancelEdit = () => {
    setEditingFieldKey(null)
    setEditedValue("")
  }
  
  const handleSaveEdit = () => {
    if (editingFieldKey) {
      const updatedFields = (task.customFields || []).map(field => 
        field.name === editingFieldKey ? { ...field, value: editedValue } : field
      )
      onUpdate({ ...task, customFields: updatedFields })
      handleCancelEdit()
    }
  }
  
  const handleDeleteField = (nameToDelete) => {
    const updatedFields = (task.customFields || []).filter(field => field.name !== nameToDelete)
    onUpdate({ ...task, customFields: updatedFields })
  }
  
  return (
    <div className="space-y-2">
      {task.customFields && task.customFields.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Custom Fields</h3>
          {task.customFields.map((field) => (
            <div key={field.id} className="flex items-center justify-between text-sm p-2 bg-slate-700/50 rounded-md group">
              {editingFieldKey === field.name ? (
                <>
                  <span className="font-semibold text-slate-300 mr-2">{field.name}:</span>
                  <Input 
                    value={editedValue} 
                    onChange={e => setEditedValue(e.target.value)} 
                    className="bg-slate-600 border-slate-500 text-sm py-1" 
                    autoFocus 
                    onKeyDown={e => e.key === 'Enter' && handleSaveEdit()} 
                  />
                  <div className="flex items-center ml-2">
                    <button onClick={handleSaveEdit} className="p-1 text-green-400 hover:text-green-300">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={handleCancelEdit} className="p-1 text-red-400 hover:text-red-300">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="font-semibold text-slate-300">{field.name}:</span>
                    <span className="text-slate-200 ml-2">{field.value}</span>
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleStartEdit(field.name, field.value)} className="p-1 text-slate-400 hover:text-slate-100">
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button onClick={() => handleDeleteField(field.name)} className="p-1 text-slate-400 hover:text-red-400">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      
      {isCreating ? (
        <div className="p-3 bg-slate-700 rounded-lg space-y-2 mt-4">
          <Input placeholder="Field Name" value={fieldName} onChange={e => setFieldName(e.target.value)} />
          <Input placeholder="Field Value" value={fieldValue} onChange={e => setFieldValue(e.target.value)} />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAddField}>Add</Button>
          </div>
        </div>
      ) : (
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-300 hover:text-slate-100 mt-2" 
          onClick={() => setIsCreating(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      )}
    </div>
  )
}

// --- Checklist Component ---
const Checklist = ({ items, onUpdate, onDelete }) => {
  const [newItemText, setNewItemText] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPopover, setEditingPopover] = useState(null)
  const popoverRef = useRef(null)

  const priorityOptions = { critical: "text-red-500", high: "text-orange-500", medium: "text-yellow-500", low: "text-green-500" }
  const statusOptions = { "not-started": "text-slate-500", "in-progress": "text-blue-500", completed: "text-green-500", cancelled: "text-red-500" }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) setEditingPopover(null)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleUpdateItem = (itemId, newProps) => {
    onUpdate(items.map(item => item.id === itemId ? { ...item, ...newProps } : item))
  }
  
  const handleAddItem = () => {
    if (newItemText.trim()) {
      onUpdate([...items, { 
        id: `item-${Date.now()}`, 
        text: newItemText.trim(), 
        completed: false 
      }])
      setNewItemText("")
      setShowAddForm(false)
    }
  }
  
  const completedCount = items.filter(item => item.completed).length
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''

  const renderPopover = () => {
    if (!editingPopover) return null
    const { itemId, type } = editingPopover
    
    if (type === 'date') {
      const item = items.find(i => i.id === itemId)
      return (
        <div ref={popoverRef} className="absolute z-10 right-0 mt-1">
          <DatesModal 
            isOpen={true} 
            onClose={() => setEditingPopover(null)} 
            onSave={({ dueDate }) => { 
              handleUpdateItem(itemId, { dueDate }); 
              setEditingPopover(null); 
            }} 
            taskDates={{ dueDate: item.dueDate }} 
          />
        </div>
      )
    }
    
    const options = type === 'priority' ? priorityOptions : statusOptions
    const title = type.charAt(0).toUpperCase() + type.slice(1)
    
    return (
      <div ref={popoverRef} className="absolute z-10 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg p-2 w-40">
        <h4 className="text-xs font-bold text-slate-300 px-2 py-1">{title}</h4>
        <button 
          onClick={() => { 
            handleUpdateItem(itemId, { [type]: null }); 
            setEditingPopover(null); 
          }} 
          className="w-full text-left px-2 py-1 text-sm rounded hover:bg-slate-600"
        >
          None
        </button>
        {Object.entries(options).map(([key, className]) => (
          <button 
            key={key} 
            onClick={() => { 
              handleUpdateItem(itemId, { [type]: key }); 
              setEditingPopover(null); 
            }} 
            className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-slate-600 flex items-center gap-2 ${className}`}
          >
            {type === 'priority' ? <Flag className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
            {key.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-slate-300 flex items-center">
          <FaListOl className="h-4 w-4 mr-2" />
         checklist
        </h3>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-slate-400 hover:text-red-400">
          Delete
        </Button>
      </div>
      
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="space-y-1">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-2 group relative">
            <input 
              type="checkbox" 
              checked={item.completed} 
              onChange={() => handleUpdateItem(item.id, { completed: !item.completed })} 
              className="accent-blue-500 mt-1" 
            />
            <div className="flex-grow">
              <span className={`text-sm ${item.completed ? 'line-through text-slate-400' : ''}`}>
                {item.text}
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                {item.dueDate && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(item.dueDate)}
                  </span>
                )}
                {item.priority && (
                  <span className={`${priorityOptions[item.priority]} flex items-center gap-1`}>
                    <Flag className="h-3 w-3" />
                    {item.priority}
                  </span>
                )}
                {item.status && (
                  <span className={`${statusOptions[item.status]} flex items-center gap-1`}>
                    <Circle className="h-3 w-3" />
                    {item.status.replace('-', ' ')}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 text-slate-400 hover:text-slate-100">
                <FaUserTag className="h-3 w-3" />
              </button>
              <button 
                onClick={() => setEditingPopover({ itemId: item.id, type: 'date' })} 
                className="p-1 text-slate-400 hover:text-slate-100"
              >
                <BsCalendar2DateFill className="h-3 w-3" />
              </button>
              <button 
                onClick={() => setEditingPopover({ itemId: item.id, type: 'priority' })} 
                className="p-1 text-slate-400 hover:text-slate-100"
              >
                <Flag className="h-3 w-3" />
              </button>
              <button 
                onClick={() => setEditingPopover({ itemId: item.id, type: 'status' })} 
                className="p-1 text-slate-400 hover:text-slate-100"
              >
                <Circle className="h-3 w-3" />
              </button>
              <button 
                onClick={() => onUpdate(items.filter(i => i.id !== item.id))} 
                className="p-1 text-slate-400 hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            
            {editingPopover?.itemId === item.id && renderPopover()}
          </div>
        ))}
      </div>
      
      {showAddForm ? (
        <div>
          <Textarea 
            value={newItemText} 
            onChange={e => setNewItemText(e.target.value)} 
            placeholder="Add an item" 
            className="bg-slate-700 text-sm" 
            rows={2} 
          />
          <div className="flex gap-2 mt-2">
            <Button onClick={handleAddItem} size="sm">Add</Button>
            <Button onClick={() => setShowAddForm(false)} variant="ghost" size="sm">Cancel</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowAddForm(true)} variant="ghost" size="sm" className="text-slate-300">
          Add an item
        </Button>
      )}
    </div>
  )
}

// --- ASSIGNMENT PICKER ---
interface AssignmentPickerProps {
  assignments: TaskAssignments
  onAssignmentsChange: (assignments: TaskAssignments) => void
  moveParticipants: Record<string, boolean>
  owners: Owner[]
  presence?: Record<string, any> | null
  moveId?: string
}

function AssignmentPicker({ assignments, onAssignmentsChange, moveParticipants, owners, presence, moveId }: AssignmentPickerProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'owners' | 'spaces'>('members')
  
  const participantIds = Object.keys(moveParticipants || {})
  
  // Helper function to get participant display name
  const getParticipantDisplayName = (userId: string) => {
    if (!moveId || !presence) return userId
    
    // Presence data is keyed as `${moveId}_${userId}`
    const presenceKey = `${moveId}_${userId}`
    const displayName = presence[presenceKey]?.displayName
    return displayName && displayName.trim() !== '' ? displayName : userId
  }
  const communalRooms = PREDEFINED_COMMUNAL_ROOMS
  const personalOwners = owners.filter(owner => !communalRooms.some(room => room.uid === owner.uid))
  
  const toggleMember = (memberId: string) => {
    const currentMembers = assignments.members || []
    const newMembers = currentMembers.includes(memberId)
      ? currentMembers.filter(id => id !== memberId)
      : [...currentMembers, memberId]
    onAssignmentsChange({ ...assignments, members: newMembers })
  }
  
  const toggleOwner = (ownerUid: string) => {
    const currentOwners = assignments.owners || []
    const newOwners = currentOwners.includes(ownerUid)
      ? currentOwners.filter(uid => uid !== ownerUid)
      : [...currentOwners, ownerUid]
    onAssignmentsChange({ ...assignments, owners: newOwners })
  }
  
  const toggleSpace = (spaceUid: string) => {
    const currentSpaces = assignments.spaces || []
    const newSpaces = currentSpaces.includes(spaceUid)
      ? currentSpaces.filter(uid => uid !== spaceUid)
      : [...currentSpaces, spaceUid]
    onAssignmentsChange({ ...assignments, spaces: newSpaces })
  }
  
  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-700 p-1 rounded-lg">
        <button
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'members' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
          }`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'owners' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
          }`}
          onClick={() => setActiveTab('owners')}
        >
          Owners
        </button>
        <button
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'spaces' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
          }`}
          onClick={() => setActiveTab('spaces')}
        >
          Spaces
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="min-h-[200px] bg-slate-700/50 rounded-lg p-4">
        {activeTab === 'members' && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Move Participants</h3>
            {participantIds.length === 0 ? (
              <p className="text-slate-400 text-sm">No participants in this move</p>
            ) : (
              <div className="space-y-2">
                {participantIds.map(memberId => {
                  const displayName = getParticipantDisplayName(memberId)
                  return (
                    <label key={memberId} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(assignments.members || []).includes(memberId)}
                        onChange={() => toggleMember(memberId)}
                        className="rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {displayName.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-200">{displayName}</span>
                      </div>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'owners' && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Personal Owners</h3>
            {personalOwners.length === 0 ? (
              <p className="text-slate-400 text-sm">No personal owners available</p>
            ) : (
              <div className="space-y-2">
                {personalOwners.map(owner => (
                  <label key={owner.uid} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(assignments.owners || []).includes(owner.uid)}
                      onChange={() => toggleOwner(owner.uid)}
                      className="rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: owner.color }}
                      >
                        {owner.firstName.substring(0, 1)}{owner.lastName.substring(0, 1)}
                      </div>
                      <span className="text-sm text-slate-200">
                        {owner.firstName} {owner.lastName}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'spaces' && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Communal Spaces</h3>
            <div className="space-y-2">
              {communalRooms.map(room => (
                <label key={room.uid} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(assignments.spaces || []).includes(room.uid)}
                    onChange={() => toggleSpace(room.uid)}
                    className="rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: room.color }}
                    >
                      {room.uid}
                    </div>
                    <span className="text-sm text-slate-200">
                      {room.firstName}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Assignment Summary */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-300">Current Assignments:</h4>
        <div className="flex flex-wrap gap-2">
          {(assignments.members || []).map(memberId => {
            const displayName = getParticipantDisplayName(memberId)
            return (
              <Badge key={`member-${memberId}`} className="bg-blue-600 text-white">
                👤 {displayName}
              </Badge>
            )
          })}
          {(assignments.owners || []).map(ownerUid => {
            const owner = personalOwners.find(o => o.uid === ownerUid)
            return (
              <Badge key={`owner-${ownerUid}`} className="text-white" style={{ backgroundColor: owner?.color || '#6B7280' }}>
                🏠 {owner?.firstName} {owner?.lastName}
              </Badge>
            )
          })}
          {(assignments.spaces || []).map(spaceUid => {
            const space = communalRooms.find(r => r.uid === spaceUid)
            return (
              <Badge key={`space-${spaceUid}`} className="text-white" style={{ backgroundColor: space?.color || '#6B7280' }}>
                🏢 {space?.firstName || spaceUid}
              </Badge>
            )
          })}
        </div>
        {!assignments.members?.length && !assignments.owners?.length && !assignments.spaces?.length && (
          <p className="text-slate-400 text-sm">No assignments</p>
        )}
      </div>
    </div>
  )
}

// --- MAIN TASK MODAL ---
const LABEL_OPTIONS = [
  { name: "Packing & Organizing", color: "bg-purple-600" },
  { name: "Logistics & Transportation", color: "bg-blue-600" },
  { name: "Cleaning & Maintenance", color: "bg-green-600" },
  { name: "Utilities & Services", color: "bg-orange-600" },
  { name: "Inventory & Documentation", color: "bg-red-600" }
]

interface TaskModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (task: Task) => void
  isCreating?: boolean
}

export function TaskModal({ task, isOpen, onClose, onUpdate, isCreating = false }: TaskModalProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [localTask, setLocalTask] = useState<Task>(task || {
    id: '',
    title: 'New Task',
    description: '',
    priority: 'medium',
    status: 'not-started',
    labels: [],
    customFields: [],
    assignments: { members: [], owners: [], spaces: [] },
   checklist: [],
    createdAt: new Date(),
    updatedAt: new Date()
  })
  const [showSettings, setShowSettings] = useState(false)
  const [isDatesModalOpen, setIsDatesModalOpen] = useState(false)
  const [showChecklist, setShowChecklist] = useState(!!localTask.checklist?.length)
  const [showAssignments, setShowAssignments] = useState(false)
  const [showAttachments, setShowAttachments] = useState(!!localTask.attachments?.length)
  
  const { move, presence } = useMove()
  const { owners } = useOwners()

  useEffect(() => {
    if (task) {
      setLocalTask(task)
      setShowChecklist(!!task.checklist?.length)
      setShowAttachments(!!task.attachments?.length)
    } else if (isCreating) {
      setLocalTask({
        id: `task-${Date.now()}`,
        title: 'New Task',
        description: '',
        priority: 'medium',
        status: 'not-started',
        labels: [],
        customFields: [],
        assignments: { members: [], owners: [], spaces: [] },
       checklist: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  }, [task, isCreating])

  const handleSave = () => {
    onUpdate({ ...localTask, updatedAt: new Date() })
    onClose()
  }
  
  const handleTitleChange = (newTitle: string) => {
    setLocalTask(prev => ({ ...prev, title: newTitle }))
    setEditingTitle(false)
  }
  
  const handlePriorityChange = (priority: string) => {
    setLocalTask(prev => ({ ...prev, priority: priority === 'none' ? undefined : priority as any }))
  }
  
  const handleStatusChange = (status: string) => {
    setLocalTask(prev => ({ ...prev, status: status === 'none' ? undefined : status as any }))
  }
  
  const handleLabelsChange = (newLabels: Label[]) => {
    setLocalTask(prev => ({ ...prev, labels: newLabels }))
  }
  
  const handleDatesSave = (dates: any) => {
    setLocalTask(prev => ({ ...prev, ...dates }))
  }
  
  const handleChecklistUpdate = (checklist:ChecklistItem[]) => {
    setLocalTask(prev => ({ ...prev,checklist }))
  }
  
  const handleAddChecklist = () => {
    if (!localTask.checklist?.length) handleChecklistUpdate([])
    setShowChecklist(true)
  }
  
  const handleDeleteChecklist = () => {
    setLocalTask(prev => ({ ...prev,checklist: [] }))
    setShowChecklist(false)
  }
  
  const handleAssignmentsChange = (assignments: TaskAssignments) => {
    setLocalTask(prev => ({ ...prev, assignments }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newAttachments = Array.from(files).map(file => ({
      id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      url: URL.createObjectURL(file) // In a real app, you'd upload to a server/storage
    }))

    setLocalTask(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newAttachments]
    }))
    
    setShowAttachments(true)
    
    // Clear the input
    event.target.value = ''
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    setLocalTask(prev => ({
      ...prev,
      attachments: prev.attachments?.filter(a => a.id !== attachmentId) || []
    }))
  }

  const handleAddAttachments = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.multiple = true
    fileInput.accept = '*/*' // Accept all file types
    fileInput.onchange = handleFileUpload
    fileInput.click()
  }

  const getPriorityColor = (p: string) => ({
    critical: "bg-red-500 text-white",
    high: "bg-orange-500 text-white",
    medium: "bg-yellow-500 text-black",
    low: "bg-green-500 text-white"
  }[p])

  const getStatusColor = (s: string) => ({
    "not-started": "bg-slate-600 text-white",
    "in-progress": "bg-blue-600 text-white",
    completed: "bg-green-600 text-white",
    cancelled: "bg-red-600 text-white"
  }[s])

  const formatDate = (d?: Date | string) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (!isOpen) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 text-slate-100 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              {editingTitle ? (
                <Input 
                  value={localTask.title} 
                  onChange={e => setLocalTask(prev => ({ ...prev, title: e.target.value }))} 
                  onBlur={() => handleTitleChange(localTask.title)} 
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleTitleChange(localTask.title)
                    if (e.key === 'Escape') setEditingTitle(false)
                  }} 
                  className="bg-slate-700 text-2xl" 
                  autoFocus 
                />
              ) : (
                <>
                  {localTask.title}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditingTitle(true)} 
                    className="h-6 w-6 p-0 text-slate-400 hover:text-slate-100"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowSettings(!showSettings)} 
                    className="h-6 w-6 p-0" 
                    title="Settings"
                  >
                    ⚙️
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
                  value={localTask.description || ''} 
                  onChange={e => setLocalTask(prev => ({ ...prev, description: e.target.value }))} 
                  placeholder="Add a description..." 
                  className="bg-slate-700" 
                  rows={4} 
                />
              </div>
              
              {((localTask.labels?.length || 0) > 0 || localTask.dueDate) && (
                <div className="flex flex-wrap gap-4 items-start">
                  {(localTask.labels?.length || 0) > 0 && (
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Labels</label>
                      <div className="flex flex-wrap gap-2">
                        {localTask.labels?.map((l, i) => (
                          <Badge key={i} className={`${l.color} text-white`}>
                            {l.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {localTask.dueDate && (
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Due Date</label>
                      <Badge className="bg-slate-600 text-slate-200">
                        {formatDate(localTask.dueDate)} at {(localTask as any).dueTime}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              
              {showChecklist && (
                <Checklist 
                  items={localTask.checklist || []} 
                  onUpdate={handleChecklistUpdate} 
                  onDelete={handleDeleteChecklist} 
                />
              )}
              
              {showAssignments && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-200">Assignments</h3>
                    <Button
                      onClick={() => setShowAssignments(false)}
                      variant="ghost"
                      size="sm"
                    >
                      Hide
                    </Button>
                  </div>
                  
                  <AssignmentPicker
                    assignments={localTask.assignments || { members: [], owners: [], spaces: [] }}
                    onAssignmentsChange={handleAssignmentsChange}
                    moveParticipants={move?.participants || {}}
                    owners={owners}
                    presence={presence}
                    moveId={move?.id}
                  />
                </div>
              )}
              
              {showAttachments && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-200">Attachments</h3>
                    <Button
                      onClick={() => setShowAttachments(false)}
                      variant="ghost"
                      size="sm"
                    >
                      Hide
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {localTask.attachments?.length === 0 || !localTask.attachments ? (
                      <p className="text-slate-400 text-sm">No attachments yet</p>
                    ) : (
                      localTask.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                              📎
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-200">{attachment.name}</p>
                              <p className="text-xs text-slate-400">Click to download</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = attachment.url
                                link.download = attachment.name
                                link.click()
                              }}
                              variant="ghost"
                              size="sm"
                              title="Download"
                            >
                              ⬇️
                            </Button>
                            <Button
                              onClick={() => handleRemoveAttachment(attachment.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                              title="Remove"
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <Button
                    onClick={handleAddAttachments}
                    variant="outline"
                    className="w-full mt-3"
                  >
                    📎 Add More Attachments
                  </Button>
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300">Status & Priority</h3>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                    {localTask.priority ? (
                      <Badge className={getPriorityColor(localTask.priority)}>
                        {localTask.priority.charAt(0).toUpperCase() + localTask.priority.slice(1)}
                      </Badge>
                    ) : (
                      <span className="text-sm text-slate-400">None</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 mb-1 block">Status</label>
                    {localTask.status ? (
                      <Badge className={getStatusColor(localTask.status)}>
                        {localTask.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ) : (
                      <span className="text-sm text-slate-400">None</span>
                    )}
                  </div>
                </div>
              </div>
              
              {showSettings && (
                <div className="bg-slate-700/50 p-4 rounded-lg border">
                  <h3 className="text-sm font-medium mb-3">Task Settings</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <label htmlFor="notifications-checkbox">Enable notifications</label>
                      <input id="notifications-checkbox" type="checkbox" className="rounded accent-blue-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="timeline-checkbox">Auto-assign to timeline</label>
                      <input id="timeline-checkbox" type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="dashboard-checkbox">Show in dashboard</label>
                      <input id="dashboard-checkbox" type="checkbox" className="rounded" defaultChecked />
                    </div>
                  </div>
                </div>
              )}
              
              <CustomFieldCreator task={localTask} onUpdate={setLocalTask} buttonText="Add Custom Field" />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2 bg-slate-700/50 p-2 rounded-md">
                <Button onClick={handleAddAttachments} variant="ghost" className="w-full justify-start">
                  📎 Add Attachment
                </Button>
                <Button onClick={() => setIsDatesModalOpen(true)} variant="ghost" className="w-full justify-start">
                  📅 Dates
                </Button>
                <Button onClick={handleAddChecklist} variant="ghost" className="w-full justify-start">
                  checklist
                </Button>
                <Button 
                  onClick={() => setShowAssignments(!showAssignments)} 
                  variant="ghost" 
                  className="w-full justify-start"
                >
                  👥 Assignments
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Labels</label>
                  <MultiSelect 
                    options={LABEL_OPTIONS} 
                    selectedOptions={localTask.labels || []} 
                    onChange={handleLabelsChange} 
                    placeholder="Select labels..." 
                  />
                </div>
                
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                  <Select value={localTask.priority || "none"} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="bg-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="critical">
                        <span className="text-red-500 font-semibold">Critical</span>
                      </SelectItem>
                      <SelectItem value="high">
                        <span className="text-orange-500 font-semibold">High</span>
                      </SelectItem>
                      <SelectItem value="medium">
                        <span className="text-yellow-500 font-semibold">Medium</span>
                      </SelectItem>
                      <SelectItem value="low">
                        <span className="text-green-500 font-semibold">Low</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Status</label>
                  <Select value={localTask.status || "none"} onValueChange={handleStatusChange}>
                    <SelectTrigger className="bg-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="not-started">
                        <span className="text-slate-400">Not Started</span>
                      </SelectItem>
                      <SelectItem value="in-progress">
                        <span className="text-blue-400">In Progress</span>
                      </SelectItem>
                      <SelectItem value="completed">
                        <span className="text-green-400">Completed</span>
                      </SelectItem>
                      <SelectItem value="cancelled">
                        <span className="text-red-400">Cancelled</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-slate-700">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>
              {isCreating ? 'Create Task' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <DatesModal 
        isOpen={isDatesModalOpen} 
        onClose={() => setIsDatesModalOpen(false)} 
        onSave={handleDatesSave} 
        taskDates={{
          startDate: localTask.startDate,
          dueDate: localTask.dueDate,
          dueTime: (localTask as any).dueTime,
          reminder: (localTask as any).reminder
        }} 
      />
    </>
  )
}







