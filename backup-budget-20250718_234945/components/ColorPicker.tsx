import React, { useState, useEffect } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#a855f7', // purple-500
  '#d946ef', // fuchsia-500
  '#ec4899', // pink-500
  '#f43f5e', // rose-500
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#f59e0b', // amber-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#10b981', // emerald-500
  '#14b8a6', // teal-500
  '#06b6d4', // cyan-500
  '#0ea5e9', // sky-500
  '#64748b', // slate-500
  '#6b7280', // gray-500
  '#78716c', // stone-500
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  color: initialColor = DEFAULT_COLORS[0],
  onChange,
  className = '',
}) => {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [customColor, setCustomColor] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    if (initialColor && !DEFAULT_COLORS.includes(initialColor)) {
      setCustomColor(initialColor);
      setShowCustomInput(true);
    }
    setSelectedColor(initialColor);
  }, [initialColor]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setShowCustomInput(false);
    onChange(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    setSelectedColor(newColor);
    onChange(newColor);
  };

  const toggleCustomInput = () => {
    setShowCustomInput(!showCustomInput);
    if (!showCustomInput && customColor) {
      setSelectedColor(customColor);
      onChange(customColor);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {DEFAULT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
              selectedColor === color ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500' : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
        
        <button
          type="button"
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
            showCustomInput 
              ? 'bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-500' 
              : 'border-dashed border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
          }`}
          onClick={toggleCustomInput}
          aria-label={showCustomInput ? 'Hide custom color' : 'Choose custom color'}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-slate-700 dark:text-slate-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
            />
          </svg>
        </button>
      </div>
      
      {showCustomInput && (
        <div className="mt-3 flex items-center space-x-2">
          <div 
            className="w-8 h-8 rounded border border-slate-300 dark:border-slate-600 flex-shrink-0"
            style={{ backgroundColor: customColor || 'transparent' }}
          />
          <div className="flex-1">
            <label htmlFor="custom-color" className="sr-only">Custom color</label>
            <input
              id="custom-color"
              type="color"
              value={customColor || '#000000'}
              onChange={handleCustomColorChange}
              className="sr-only"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                const value = e.target.value;
                setCustomColor(value);
                // Only update if it's a valid color
                if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
                  setSelectedColor(value);
                  onChange(value);
                }
              }}
              placeholder="#RRGGBB"
              className="block w-full rounded-md border-0 py-1.5 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6 bg-white dark:bg-slate-800"
            />
          </div>
        </div>
      )}
      
      {selectedColor && (
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Selected: <span style={{ color: selectedColor }}>{selectedColor.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
