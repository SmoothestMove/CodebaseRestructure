import React, { useState, useEffect, useRef } from 'react';

// --- TYPE DEFINITIONS ---
// Updated to include checklist item details.
interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
  dueDate?: string | null;
  priority?: "critical" | "high" | "medium" | "low" | null;
  status?: "not-started" | "in-progress" | "completed" | "cancelled" | null;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority?: "critical" | "high" | "medium" | "low" | null;
  status?: "not-started" | "in-progress" | "completed" | "cancelled" | null;
  labels?: { name: string; color: string }[];
  customFields?: { [key: string]: string };
  startDate?: string | null;
  dueDate?: string | null;
  dueTime?: string | null;
  reminder?: string | null;
  checklist?: ChecklistItem[];
}


// --- MOCK UI COMPONENTS ---
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => onOpenChange(false)}>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
const DialogContent = ({ children, className }) => <div className={`rounded-lg shadow-lg p-6 ${className}`}>{children}</div>;
const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
const DialogTitle = ({ children, className }) => <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
const Button = ({ children, variant, size, className, ...props }) => {
  const baseClasses = "font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500";
  const sizeClasses = { sm: "px-2 py-1 text-xs", default: "px-4 py-2 text-sm" };
  const variantClasses = { ghost: "hover:bg-slate-700", outline: "border border-slate-600 bg-transparent hover:bg-slate-700", default: "bg-blue-600 text-white hover:bg-blue-700" };
  return <button className={`${baseClasses} ${sizeClasses[size] || sizeClasses.default} ${variantClasses[variant] || variantClasses.default} ${className}`} {...props}>{children}</button>;
};
const Input = React.forwardRef(({ className, ...props }, ref) => <input className={`w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} ref={ref} {...props} />);
const Textarea = React.forwardRef(({ className, ...props }, ref) => <textarea className={`w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} ref={ref} {...props} />);
const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => { if (selectRef.current && !selectRef.current.contains(event.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectRef]);
  const selectedChild = React.Children.toArray(children).find(c => c.type === SelectContent)?.props.children.find(i => i.props.value === value);
  return (
    <div className="relative" ref={selectRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{React.Children.map(children, c => c.type === SelectTrigger ? React.cloneElement(c, { children: selectedChild?.props.children || <SelectValue /> }) : null)}</div>
      {isOpen && React.Children.map(children, c => c.type === SelectContent ? React.cloneElement(c, { onValueChange: (v) => { onValueChange(v); setIsOpen(false); } }) : null)}
    </div>
  );
};
const SelectTrigger = ({ children, className }) => <button className={`w-full flex justify-between items-center p-2 rounded-md text-left ${className}`}>{children}<svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>;
const SelectValue = ({ placeholder }) => <span>{placeholder || "Select..."}</span>;
const SelectContent = ({ children, className, onValueChange }) => <div className={`absolute z-20 w-full mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg ${className}`}>{React.Children.map(children, c => React.cloneElement(c, { onValueChange }))}</div>;
const SelectItem = ({ children, value, onValueChange }) => <div onClick={() => onValueChange(value)} className="p-2 hover:bg-slate-700 cursor-pointer">{children}</div>;
const Badge = ({ children, className }) => <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>{children}</span>;
const MultiSelect = ({ options, selectedOptions, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => { if (selectRef.current && !selectRef.current.contains(event.target)) setIsOpen(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectRef]);
    const handleOptionToggle = (option) => {
        const isSelected = selectedOptions.some(s => s.name === option.name);
        onChange(isSelected ? selectedOptions.filter(s => s.name !== option.name) : [...selectedOptions, option]);
    };
    return (
        <div className="relative" ref={selectRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-2 rounded-md text-left bg-slate-700 border-slate-600 text-slate-100">
                <span className="truncate">{selectedOptions.length > 0 ? `${selectedOptions.length} selected` : (placeholder || "Select...")}</span>
                <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            {isOpen && <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg"><div className="p-2 space-y-1 max-h-48 overflow-y-auto">{options.map(o => { const i = selectedOptions.some(s => s.name === o.name); return <button key={o.name} onClick={() => handleOptionToggle(o)} className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-slate-600 flex items-center gap-3 ${i ? "bg-slate-600/70" : ""}`}><div className={`w-4 h-4 rounded border-2 ${i ? 'bg-blue-500 border-blue-400' : 'border-slate-400'} flex items-center justify-center`}>{i && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}</div><div className={`w-3 h-3 rounded-sm ${o.color}`}></div><span>{o.name}</span></button>})}</div></div>}
        </div>
    );
};
const Edit2 = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>;
const Settings = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const Trash2 = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const Check = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const X = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const Flag = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-13.2A2 2 0 015.2 6H18a2 2 0 012 2v4a2 2 0 01-2 2H5.2M3 21l4-4" /></svg>;
const Circle = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const Clock = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const Plus = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const CheckSquare = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const Users = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 12a4 4 0 110-8 4 4 0 010 8z" /></svg>;
const Calendar = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

// --- NEW ICONS ---
const FaFileCirclePlus = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 232V160c0-13.3 10.7-24 24-24s24 10.7 24 24v72h72c13.3 0 24 10.7 24 24s-10.7 24-24 24h-72v72c0 13.3-10.7 24-24 24s-24-10.7-24-24v-72h-72c-13.3 0-24-10.7-24-24s10.7-24 24-24h72z"/></svg>;
const BsCalendar2DateFill = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 16 16"><path d="M9.402 10.246c.65 0 1.184-.448 1.184-1.002 0-.554-.534-1.002-1.184-1.002s-1.184.448-1.184 1.002c0 .554.534 1.002 1.184 1.002M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z"/><path d="M8.515 12.336a.5.5 0 0 0-.63.023l-2.5 3a.5.5 0 0 0 .63.758l2.5-3a.5.5 0 0 0-.023-.758M6.9 12.336a.5.5 0 0 1 .023.63l-2.5 3a.5.5 0 1 1-.654-.758l2.5-3a.5.5 0 0 1 .631-.023"/></svg>;
const FaListOl = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 512 512"><path d="M64 128c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM48 256c-17.7 0-32 14.3-32 32s14.3 32 32 32H96c17.7 0 32-14.3 32-32s-14.3-32-32-32H48zM96 416c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H96zM224 160c0-17.7-14.3-32-32-32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32zm0 160c0-17.7-14.3-32-32-32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32zm0 128c0-17.7-14.3-32-32-32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32zM448 128c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32zm-32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32h-64zm32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32z"/></svg>;
const FaUserTag = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 512 512"><path d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0 112 64.5 112 144s64.5 144 144 144zm-94.7 32C62.5 320 0 382.5 0 464c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48 0-81.5-62.5-144-161.3-144H161.3z"/></svg>;

// --- DATES MODAL COMPONENT ---
const DatesModal = ({ isOpen, onClose, onSave, taskDates }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [useStartDate, setUseStartDate] = useState(!!taskDates.startDate);
    const [startDate, setStartDate] = useState(taskDates.startDate);
    const [useDueDate, setUseDueDate] = useState(!!taskDates.dueDate);
    const [dueDate, setDueDate] = useState(taskDates.dueDate);
    const [dueTime, setDueTime] = useState(taskDates.dueTime || '5:00 PM');
    const [reminder, setReminder] = useState(taskDates.reminder || 'none');
    const handleDateClick = (day) => { const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString('en-US'); if (useStartDate && (!startDate || (dueDate && new Date(d) > new Date(dueDate)))) { setStartDate(d); if (!useDueDate) setDueDate(null); } else if (useDueDate && (!dueDate || (startDate && new Date(d) < new Date(startDate)))) { setDueDate(d); } else if (useStartDate) { setStartDate(d); } else if (useDueDate) { setDueDate(d); } };
    const handleSave = () => { onSave({ startDate: useStartDate ? startDate : null, dueDate: useDueDate ? dueDate : null, dueTime: useDueDate ? dueTime : null, reminder: useDueDate ? reminder : 'none' }); onClose(); };
    const handleRemove = () => { onSave({ startDate: null, dueDate: null, dueTime: null, reminder: 'none' }); onClose(); };
    const renderCalendar = () => { const y = currentDate.getFullYear(), m = currentDate.getMonth(), f = new Date(y, m, 1).getDay(), d = new Date(y, m + 1, 0).getDate(), a = []; for (let i = 0; i < f; i++) a.push(<div key={`e-${i}`} className="p-1"></div>); for (let i = 1; i <= d; i++) { const s = new Date(y, m, i).toLocaleDateString('en-US'), s1 = s === startDate, s2 = s === dueDate, r = startDate && dueDate && s > startDate && s < dueDate; let c = 'hover:bg-slate-600'; if (s1) c = 'bg-blue-600 text-white rounded-l-full'; if (s2) c = 'bg-blue-600 text-white rounded-r-full'; if (s1 && s2) c = 'bg-blue-600 text-white rounded-full'; if (r) c = 'bg-blue-800/50'; a.push(<button key={i} onClick={() => handleDateClick(i)} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${c}`}>{i}</button>); } return a; };
    if (!isOpen) return null;
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}><div className="bg-slate-800 text-slate-200 rounded-lg shadow-xl p-4 w-full max-w-sm" onClick={e => e.stopPropagation()}><DialogHeader><DialogTitle className="text-center text-slate-200">Dates</DialogTitle></DialogHeader><div className="text-center mb-4"><div className="flex justify-between items-center px-2 mb-2"><button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>&lt;</button><span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span><button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>&gt;</button></div><div className="grid grid-cols-7 gap-1 text-xs text-slate-400 mb-2">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-center font-semibold">{d}</div>)}</div><div className="grid grid-cols-7 gap-1 text-sm">{renderCalendar()}</div></div><div className="space-y-3 text-sm"><div className="flex items-center gap-2"><input type="checkbox" id="sdc" checked={useStartDate} onChange={e => setUseStartDate(e.target.checked)} className="accent-blue-500" /><label htmlFor="sdc" className="w-20">Start Date</label><Input type="text" value={startDate || ''} onChange={e => setStartDate(e.target.value)} disabled={!useStartDate} className="text-sm py-1" /></div><div className="flex items-center gap-2"><input type="checkbox" id="ddc" checked={useDueDate} onChange={e => setUseDueDate(e.target.checked)} className="accent-blue-500" /><label htmlFor="ddc" className="w-20">Due Date</label><Input type="text" value={dueDate || ''} onChange={e => setDueDate(e.target.value)} disabled={!useDueDate} className="text-sm py-1" /><Input type="text" value={dueTime} onChange={e => setDueTime(e.target.value)} disabled={!useDueDate} className="text-sm py-1" /></div>{useDueDate && <div><label className="text-xs text-slate-400 mb-1 block">Set due date reminder</label><Select value={reminder} onValueChange={setReminder}><SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 text-sm py-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="5m">5 minutes before</SelectItem><SelectItem value="1h">1 hour before</SelectItem><SelectItem value="1d">1 day before</SelectItem></SelectContent></Select></div>}</div><div className="mt-6 space-y-2"><Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">Save</Button><Button onClick={handleRemove} variant="ghost" className="w-full hover:bg-red-500/20 hover:text-red-300">Remove</Button></div></div></div>;
};

// --- CUSTOM FIELD COMPONENT ---
const CustomFieldCreator = ({ task, onUpdate, buttonText }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [fieldName, setFieldName] = useState("");
    const [fieldValue, setFieldValue] = useState("");
    const [editingFieldKey, setEditingFieldKey] = useState(null);
    const [editedValue, setEditedValue] = useState("");
    const handleAddField = () => { if (fieldName && fieldValue) { onUpdate({ ...task, customFields: { ...task.customFields, [fieldName]: fieldValue } }); setFieldName(""); setFieldValue(""); setIsCreating(false); } };
    const handleStartEdit = (key, value) => { setEditingFieldKey(key); setEditedValue(value); };
    const handleCancelEdit = () => { setEditingFieldKey(null); setEditedValue(""); };
    const handleSaveEdit = () => { if (editingFieldKey) { onUpdate({ ...task, customFields: { ...task.customFields, [editingFieldKey]: editedValue } }); handleCancelEdit(); } };
    const handleDeleteField = (keyToDelete) => { const { [keyToDelete]: _, ...remaining } = task.customFields; onUpdate({ ...task, customFields: remaining }); };
    return <div className="space-y-2">{task.customFields && Object.keys(task.customFields).length > 0 && <div className="space-y-2"><h3 className="text-sm font-medium text-slate-300 mb-2">Custom Fields</h3>{Object.entries(task.customFields).map(([key, value]) => <div key={key} className="flex items-center justify-between text-sm p-2 bg-slate-700/50 rounded-md group">{editingFieldKey === key ? <><span className="font-semibold text-slate-300 mr-2">{key}:</span><Input value={editedValue} onChange={e => setEditedValue(e.target.value)} className="bg-slate-600 border-slate-500 text-sm py-1" autoFocus onKeyDown={e => e.key === 'Enter' && handleSaveEdit()} /><div className="flex items-center ml-2"><button onClick={handleSaveEdit} className="p-1 text-green-400 hover:text-green-300"><Check className="h-4 w-4" /></button><button onClick={handleCancelEdit} className="p-1 text-red-400 hover:text-red-300"><X className="h-4 w-4" /></button></div></> : <><div><span className="font-semibold text-slate-300">{key}:</span><span className="text-slate-200 ml-2">{value}</span></div><div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => handleStartEdit(key, value)} className="p-1 text-slate-400 hover:text-slate-100"><Edit2 className="h-3 w-3" /></button><button onClick={() => handleDeleteField(key)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 className="h-3 w-3" /></button></div></>}</div>)}</div>}{isCreating ? <div className="p-3 bg-slate-700 rounded-lg space-y-2 mt-4"><Input placeholder="Field Name" value={fieldName} onChange={e => setFieldName(e.target.value)} /><Input placeholder="Field Value" value={fieldValue} onChange={e => setFieldValue(e.target.value)} /><div className="flex gap-2 justify-end"><Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>Cancel</Button><Button size="sm" onClick={handleAddField}>Add</Button></div></div> : <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-slate-100 mt-2" onClick={() => setIsCreating(true)}><Plus className="h-4 w-4 mr-2" />{buttonText}</Button>}</div>;
};

// --- UPDATED CHECKLIST COMPONENT ---
const Checklist = ({ items, onUpdate, onDelete }) => {
    const [newItemText, setNewItemText] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPopover, setEditingPopover] = useState(null);
    const popoverRef = useRef(null);

    const priorityOptions = { critical: "text-red-500", high: "text-orange-500", medium: "text-yellow-500", low: "text-green-500" };
    const statusOptions = { "not-started": "text-slate-500", "in-progress": "text-blue-500", completed: "text-green-500", cancelled: "text-red-500" };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) setEditingPopover(null);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUpdateItem = (itemId, newProps) => onUpdate(items.map(item => item.id === itemId ? { ...item, ...newProps } : item));
    const handleAddItem = () => { if (newItemText.trim()) { onUpdate([...items, { id: `item-${Date.now()}`, text: newItemText.trim(), isCompleted: false }]); setNewItemText(""); setShowAddForm(false); } };
    
    const completedCount = items.filter(item => item.isCompleted).length;
    const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

    const renderPopover = () => {
        if (!editingPopover) return null;
        const { itemId, type } = editingPopover;
        if (type === 'date') {
            const item = items.find(i => i.id === itemId);
            return <div ref={popoverRef} className="absolute z-10 right-0 mt-1"><DatesModal isOpen={true} onClose={() => setEditingPopover(null)} onSave={({ dueDate }) => { handleUpdateItem(itemId, { dueDate }); setEditingPopover(null); }} taskDates={{ dueDate: item.dueDate }} /></div>;
        }
        const options = type === 'priority' ? priorityOptions : statusOptions;
        const title = type.charAt(0).toUpperCase() + type.slice(1);
        return (
            <div ref={popoverRef} className="absolute z-10 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg p-2 w-40">
                <h4 className="text-xs font-bold text-slate-300 px-2 py-1">{title}</h4>
                <button onClick={() => { handleUpdateItem(itemId, { [type]: null }); setEditingPopover(null); }} className="w-full text-left px-2 py-1 text-sm rounded hover:bg-slate-600">None</button>
                {Object.entries(options).map(([key, className]) => <button key={key} onClick={() => { handleUpdateItem(itemId, { [type]: key }); setEditingPopover(null); }} className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-slate-600 flex items-center gap-2 ${className}`}>{type === 'priority' ? <Flag className="h-3 w-3" /> : <Circle className="h-3 w-3" />}{key.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</button>)}
            </div>
        );
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center"><h3 className="text-sm font-medium text-slate-300 flex items-center"><FaListOl className="h-4 w-4 mr-2" /> Checklist</h3><Button variant="ghost" size="sm" onClick={onDelete} className="text-slate-400 hover:text-red-400">Delete</Button></div>
            <div className="w-full bg-slate-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div></div>
            <div className="space-y-1">
                {items.map(item => <div key={item.id} className="flex items-start gap-2 group relative"><input type="checkbox" checked={item.isCompleted} onChange={() => handleUpdateItem(item.id, { isCompleted: !item.isCompleted })} className="accent-blue-500 mt-1" /><div className="flex-grow"><span className={`text-sm ${item.isCompleted ? 'line-through text-slate-400' : ''}`}>{item.text}</span><div className="flex items-center gap-3 text-xs text-slate-400 mt-1">{item.dueDate && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(item.dueDate)}</span>}{item.priority && <span className={`${priorityOptions[item.priority]} flex items-center gap-1`}><Flag className="h-3 w-3" /> {item.priority}</span>}{item.status && <span className={`${statusOptions[item.status]} flex items-center gap-1`}><Circle className="h-3 w-3" /> {item.status.replace('-', ' ')}</span>}</div></div><div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity"><button className="p-1 text-slate-400 hover:text-slate-100"><FaUserTag className="h-3 w-3" /></button><button onClick={() => setEditingPopover({ itemId: item.id, type: 'date' })} className="p-1 text-slate-400 hover:text-slate-100"><BsCalendar2DateFill className="h-3 w-3" /></button><button onClick={() => setEditingPopover({ itemId: item.id, type: 'priority' })} className="p-1 text-slate-400 hover:text-slate-100"><Flag className="h-3 w-3" /></button><button onClick={() => setEditingPopover({ itemId: item.id, type: 'status' })} className="p-1 text-slate-400 hover:text-slate-100"><Circle className="h-3 w-3" /></button><button onClick={() => onUpdate(items.filter(i => i.id !== item.id))} className="p-1 text-slate-400 hover:text-red-400"><Trash2 className="h-3 w-3" /></button></div>{editingPopover?.itemId === item.id && renderPopover()}</div>)}
            </div>
            {showAddForm ? <div><Textarea value={newItemText} onChange={e => setNewItemText(e.target.value)} placeholder="Add an item" className="bg-slate-700 text-sm" rows={2} /><div className="flex gap-2 mt-2"><Button onClick={handleAddItem} size="sm">Add</Button><Button onClick={() => setShowAddForm(false)} variant="ghost" size="sm">Cancel</Button></div></div> : <Button onClick={() => setShowAddForm(true)} variant="ghost" size="sm" className="text-slate-300">Add an item</Button>}
        </div>
    );
};

// --- MAIN TASK MODAL COMPONENT ---
const LABEL_OPTIONS = [{ name: "Packing & Organizing", color: "bg-purple-600" }, { name: "Logistics & Transportation", color: "bg-blue-600" }, { name: "Cleaning & Maintenance", color: "bg-green-600" }, { name: "Utilities & Services", color: "bg-orange-600" }, { name: "Inventory & Documentation", color: "bg-red-600" }];

function TaskModal({ task, isOpen, onClose, onUpdate }) {
    const [editingTitle, setEditingTitle] = useState(false);
    const [localTask, setLocalTask] = useState(task);
    const [showSettings, setShowSettings] = useState(false);
    const [isDatesModalOpen, setIsDatesModalOpen] = useState(false);
    const [showChecklist, setShowChecklist] = useState(!!task.checklist);

    useEffect(() => { setLocalTask(task); setShowChecklist(!!task.checklist); }, [task]);
    const handleSave = () => { onUpdate(localTask); onClose(); };
    const handleTitleChange = (newTitle) => { setLocalTask(p => ({ ...p, title: newTitle })); setEditingTitle(false); };
    const handlePriorityChange = (priority) => setLocalTask(p => ({ ...p, priority: priority === 'none' ? null : priority }));
    const handleStatusChange = (status) => setLocalTask(p => ({ ...p, status: status === 'none' ? null : status }));
    const handleLabelsChange = (newLabels) => setLocalTask(p => ({ ...p, labels: newLabels }));
    const handleDatesSave = (dates) => setLocalTask(p => ({ ...p, ...dates }));
    const handleChecklistUpdate = (checklist) => setLocalTask(p => ({ ...p, checklist }));
    const handleAddChecklist = () => { if (!localTask.checklist) handleChecklistUpdate([]); setShowChecklist(true); };
    const handleDeleteChecklist = () => { const { checklist, ...rest } = localTask; setLocalTask(rest); setShowChecklist(false); };
    const getPriorityColor = (p) => ({ critical: "bg-red-500 text-white", high: "bg-orange-500 text-white", medium: "bg-yellow-500 text-black", low: "bg-green-500 text-white" }[p]);
    const getStatusColor = (s) => ({ "not-started": "bg-slate-600 text-white", "in-progress": "bg-blue-600 text-white", completed: "bg-green-600 text-white", cancelled: "bg-red-600 text-white" }[s]);
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 text-slate-100 border-slate-700">
                    <DialogHeader><DialogTitle className="flex items-center gap-2 text-2xl">{editingTitle ? <Input value={localTask.title} onChange={e => setLocalTask(p => ({ ...p, title: e.target.value }))} onBlur={() => handleTitleChange(localTask.title)} onKeyDown={e => { if (e.key === 'Enter') handleTitleChange(localTask.title); if (e.key === 'Escape') setEditingTitle(false); }} className="bg-slate-700 text-2xl" autoFocus /> : <>{localTask.title}<Button variant="ghost" size="sm" onClick={() => setEditingTitle(true)} className="h-6 w-6 p-0 text-slate-400 hover:text-slate-100"><Edit2 className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className="h-6 w-6 p-0" title="Settings"><Settings className="h-4 w-4" /></Button></>}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div><label className="text-sm font-medium text-slate-300 mb-2 block">Description</label><Textarea value={localTask.description} onChange={e => setLocalTask(p => ({ ...p, description: e.target.value }))} placeholder="Add a description..." className="bg-slate-700" rows={4} /></div>
                            {(localTask.labels?.length > 0 || localTask.dueDate) && <div className="flex flex-wrap gap-4 items-start">{localTask.labels?.length > 0 && <div><label className="text-sm font-medium text-slate-300 mb-2 block">Labels</label><div className="flex flex-wrap gap-2">{localTask.labels.map((l, i) => <Badge key={i} className={`${l.color} text-white`}>{l.name}</Badge>)}</div></div>}{localTask.dueDate && <div><label className="text-sm font-medium text-slate-300 mb-2 block">Due Date</label><Badge className="bg-slate-600 text-slate-200">{formatDate(localTask.dueDate)} at {localTask.dueTime}</Badge></div>}</div>}
                            {showChecklist && <Checklist items={localTask.checklist || []} onUpdate={handleChecklistUpdate} onDelete={handleDeleteChecklist} />}
                            <div className="space-y-4"><h3 className="text-sm font-medium text-slate-300">Status & Priority</h3><div className="flex gap-4"><div className="flex-1"><label className="text-xs text-slate-400 mb-1 block">Priority</label>{localTask.priority ? <Badge className={getPriorityColor(localTask.priority)}>{localTask.priority.charAt(0).toUpperCase() + localTask.priority.slice(1)}</Badge> : <span className="text-sm text-slate-400">None</span>}</div><div className="flex-1"><label className="text-xs text-slate-400 mb-1 block">Status</label>{localTask.status ? <Badge className={getStatusColor(localTask.status)}>{localTask.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</Badge> : <span className="text-sm text-slate-400">None</span>}</div></div></div>
                            {showSettings && <div className="bg-slate-700/50 p-4 rounded-lg border"><h3 className="text-sm font-medium mb-3">Task Settings</h3><div className="space-y-3 text-sm"><div className="flex items-center justify-between"><label htmlFor="n-cb">Enable notifications</label><input id="n-cb" type="checkbox" className="rounded accent-blue-500" /></div><div className="flex items-center justify-between"><label htmlFor="t-cb">Auto-assign to timeline</label><input id="t-cb" type="checkbox" className="rounded" /></div><div className="flex items-center justify-between"><label htmlFor="d-cb">Show in dashboard</label><input id="d-cb" type="checkbox" className="rounded" defaultChecked /></div></div></div>}
                            <CustomFieldCreator task={localTask} onUpdate={setLocalTask} buttonText="Add Custom Field" />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2 bg-slate-700/50 p-2 rounded-md"><Button variant="ghost" className="w-full justify-start"><FaFileCirclePlus className="h-4 w-4 mr-2" />Add Attachment</Button><Button onClick={() => setIsDatesModalOpen(true)} variant="ghost" className="w-full justify-start"><BsCalendar2DateFill className="h-4 w-4 mr-2" />Dates</Button><Button onClick={handleAddChecklist} variant="ghost" className="w-full justify-start"><FaListOl className="h-4 w-4 mr-2" />Checklist</Button><Button variant="ghost" className="w-full justify-start"><FaUserTag className="h-4 w-4 mr-2" />Assignments</Button></div>
                            <div className="space-y-3">
                                <div><label className="text-xs text-slate-400 mb-1 block">Labels</label><MultiSelect options={LABEL_OPTIONS} selectedOptions={localTask.labels || []} onChange={handleLabelsChange} placeholder="Select labels..." /></div>
                                <div><label className="text-xs text-slate-400 mb-1 block">Priority</label><Select value={localTask.priority || "none"} onValueChange={handlePriorityChange}><SelectTrigger className="bg-slate-700"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="critical"><span className="text-red-500 font-semibold">Critical</span></SelectItem><SelectItem value="high"><span className="text-orange-500 font-semibold">High</span></SelectItem><SelectItem value="medium"><span className="text-yellow-500 font-semibold">Medium</span></SelectItem><SelectItem value="low"><span className="text-green-500 font-semibold">Low</span></SelectItem></SelectContent></Select></div>
                                <div><label className="text-xs text-slate-400 mb-1 block">Status</label><Select value={localTask.status || "none"} onValueChange={handleStatusChange}><SelectTrigger className="bg-slate-700"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="not-started"><span className="text-slate-400">Not Started</span></SelectItem><SelectItem value="in-progress"><span className="text-blue-400">In Progress</span></SelectItem><SelectItem value="completed"><span className="text-green-400">Completed</span></SelectItem><SelectItem value="cancelled"><span className="text-red-400">Cancelled</span></SelectItem></SelectContent></Select></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-slate-700"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Save Changes</Button></div>
                </DialogContent>
            </Dialog>
            <DatesModal isOpen={isDatesModalOpen} onClose={() => setIsDatesModalOpen(false)} onSave={handleDatesSave} taskDates={{ startDate: localTask.startDate, dueDate: localTask.dueDate, dueTime: localTask.dueTime, reminder: localTask.reminder }} />
        </>
    );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentTask, setCurrentTask] = useState({
    id: 'task-1',
    title: 'Task Title',
    description: '',
    priority: null,
    status: null,
    labels: [],
    customFields: {},
    startDate: null,
    dueDate: null,
    dueTime: null,
    reminder: null,
    checklist: undefined,
  });

  const handleUpdateTask = (updatedTask) => {
    console.log("Task updated:", updatedTask);
    setCurrentTask(updatedTask);
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl text-center"><h1 className="text-4xl font-bold mb-4">Task Management Demo</h1><p className="text-slate-400 mb-8">This is a preview of the TaskModal component. Click the button below to open it and interact with its features.</p><Button onClick={() => setIsModalOpen(true)} size="lg" className="bg-blue-600 hover:bg-blue-700">Create New Task</Button></div>
        {isModalOpen && <TaskModal task={currentTask} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUpdate={handleUpdateTask} />}
    </div>
  );
}
