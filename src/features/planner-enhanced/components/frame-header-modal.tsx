import React, { useState, useEffect } from 'react'
import type { Frame } from "../lib/types"
import { Button } from './ui/button'

// Simple Dialog wrapper component
interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

interface FrameHeaderModalProps {
  frame?: Frame
  isOpen: boolean
  onClose: () => void
  onSave: (frameData: Partial<Frame>) => void
  isCreating?: boolean
}

export function FrameHeaderModal({ frame, isOpen, onClose, onSave, isCreating = false }: FrameHeaderModalProps) {
  const [title, setTitle] = useState(frame?.title || '')
  const [subtitle, setSubtitle] = useState(frame?.description || '')
  const [color, setColor] = useState(frame?.color || '#64748b')

  useEffect(() => {
    if (frame) {
      setTitle(frame.title)
      setSubtitle(frame.description || '')
      setColor(frame.color)
    } else if (isCreating) {
      setTitle('')
      setSubtitle('')
      setColor('#64748b')
    }
  }, [frame, isCreating])

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: subtitle.trim(),
        color: color,
        ...(isCreating && {
          id: `frame-${Date.now()}`,
          offsetStart: 0,
          offsetEnd: 7
        })
      })
      onClose()
    }
  }

  const predefinedColors = [
    '#64748b', // slate
    '#2563eb', // blue
    '#16a34a', // green
    '#ca8a04', // yellow
    '#ea580c', // orange
    '#dc2626', // red
    '#9333ea', // purple
    '#0d9488', // teal
    '#be185d', // pink
    '#65a30d', // lime
  ]

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="bg-slate-800 text-slate-100 rounded-lg p-6 w-full max-w-md">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            {isCreating ? 'Create New Frame' : 'Edit Frame'}
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Frame Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter frame title..."
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Frame Subtitle/Description
            </label>
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              rows={2}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-blue-500"
              placeholder="Add frame description..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Frame Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {predefinedColors.map(colorOption => (
                <button
                  key={colorOption}
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === colorOption 
                      ? 'border-white scale-110' 
                      : 'border-slate-600 hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  title={colorOption}
                />
              ))}
            </div>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-2 w-full h-8 bg-slate-700 border border-slate-600 rounded cursor-pointer"
            />
          </div>
          
          {/* Preview */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Preview
            </label>
            <div 
              className="p-3 rounded-lg text-white"
              style={{ backgroundColor: color }}
            >
              <h3 className="font-semibold text-sm">
                {title || 'Frame Title'}
              </h3>
              <div className="text-xs opacity-90 mt-1">
                {subtitle || 'Frame description will appear here'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-slate-700">
          <Button 
            onClick={onClose} 
            className="bg-slate-600 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!title.trim()}
          >
            {isCreating ? 'Create Frame' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}