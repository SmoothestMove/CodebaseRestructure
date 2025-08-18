import React, { useState } from 'react';
import { X, User, Users, Search } from 'lucide-react';
import { PlannerTask } from '../types';
import { Owner } from '@/types';
import Button from '@/components/common/Button';

interface MemberAssignmentPickerProps {
  isOpen: boolean;
  onClose: () => void;
  task: PlannerTask | null;
  availableMembers: Owner[];
  onAssignMember: (taskId: string, memberUid: string | null) => void;
}

const MemberAssignmentPicker: React.FC<MemberAssignmentPickerProps> = ({
  isOpen,
  onClose,
  task,
  availableMembers,
  onAssignMember
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(
    task?.assignedMember || null
  );

  const handleSave = () => {
    if (!task) return;
    onAssignMember(task.id, selectedMember);
    onClose();
  };

  const handleCancel = () => {
    setSelectedMember(task?.assignedMember || null);
    setSearchTerm('');
    onClose();
  };

  const handleUnassign = () => {
    setSelectedMember(null);
  };

  if (!isOpen || !task) return null;

  // Filter members based on search term
  const filteredMembers = availableMembers.filter(member =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate personal owners from communal spaces
  const personalMembers = filteredMembers.filter(member => 
    !member.lastName.includes('(Communal)') && !member.lastName.includes('Communal')
  );
  const communalSpaces = filteredMembers.filter(member => 
    member.lastName.includes('(Communal)') || member.lastName.includes('Communal')
  );

  const getSelectedMember = () => {
    return availableMembers.find(member => member.uid === selectedMember);
  };

  const MemberCard: React.FC<{ member: Owner; isSelected: boolean }> = ({ member, isSelected }) => (
    <button
      onClick={() => setSelectedMember(member.uid)}
      className={`
        w-full p-3 rounded-lg border-2 transition-all text-left
        ${isSelected 
          ? 'border-brand-primary bg-brand-primary/10 dark:border-brand-accent dark:bg-brand-accent/10' 
          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
          style={{ backgroundColor: member.color }}
        >
          {member.uid}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
            {member.firstName} {member.lastName}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {member.uid}
          </p>
        </div>
        {isSelected && (
          <div className="text-brand-primary dark:text-brand-accent">
            <User className="w-5 h-5" />
          </div>
        )}
      </div>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-brand-primary dark:text-brand-accent" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Assign Member
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {/* Task Info */}
          <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {task.description}
              </p>
            )}
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search members..."
                className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 
                         focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary 
                         dark:focus:border-brand-accent"
              />
            </div>
          </div>

          {/* Current Assignment */}
          {selectedMember && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Currently Assigned:
                  </span>
                  <span className="text-sm text-green-700 dark:text-green-300">
                    {getSelectedMember()?.firstName} {getSelectedMember()?.lastName}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUnassign}
                  className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Unassign
                </Button>
              </div>
            </div>
          )}

          {/* Personal Members */}
          {personalMembers.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                People ({personalMembers.length})
              </h4>
              <div className="space-y-2">
                {personalMembers.map(member => (
                  <MemberCard
                    key={member.uid}
                    member={member}
                    isSelected={selectedMember === member.uid}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Communal Spaces */}
          {communalSpaces.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Spaces ({communalSpaces.length})
              </h4>
              <div className="space-y-2">
                {communalSpaces.map(member => (
                  <MemberCard
                    key={member.uid}
                    member={member}
                    isSelected={selectedMember === member.uid}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No members found</p>
              {searchTerm && (
                <p className="text-xs mt-1">Try a different search term</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedMember ? 'Assign Member' : 'Leave Unassigned'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberAssignmentPicker;