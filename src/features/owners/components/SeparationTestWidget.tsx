import React from 'react';
import { useOwnersSpacesSeparation } from '../hooks/useOwnersSpacesSeparation';
import { FaUser, FaBuilding, FaCheck } from 'react-icons/fa';

/**
 * Test widget to verify the owners/spaces separation is working correctly
 */
export const SeparationTestWidget: React.FC = () => {
  const { personalOwners, communalSpaces, stats, isLoading } = useOwnersSpacesSeparation();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-blue-200">
        <p className="text-sm text-slate-600">Loading separation test...</p>
      </div>
    );
  }

  const hasData = personalOwners.length > 0 || communalSpaces.length > 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-green-200">
      <div className="flex items-center space-x-2 mb-3">
        <FaCheck className="w-4 h-4 text-green-500" />
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          Owners/Spaces Separation Test
        </h3>
      </div>

      {hasData ? (
        <div className="space-y-3">
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <FaUser className="w-3 h-3 text-blue-500" />
              <span className="text-slate-700 dark:text-slate-300">
                {stats.personalOwners} Personal Owners
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaBuilding className="w-3 h-3 text-green-500" />
              <span className="text-slate-700 dark:text-slate-300">
                {stats.communalSpaces} Communal Spaces
              </span>
            </div>
          </div>

          {/* Personal Owners List */}
          {personalOwners.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                Personal Owners
              </h4>
              <div className="space-y-1">
                {personalOwners.map(owner => (
                  <div key={owner.uid} className="flex items-center space-x-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: owner.color }}
                    />
                    <span className="text-slate-600 dark:text-slate-400">
                      {owner.firstName} {owner.lastName} ({owner.uid})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communal Spaces List */}
          {communalSpaces.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">
                Communal Spaces
              </h4>
              <div className="space-y-1">
                {communalSpaces.map(space => (
                  <div key={space.uid} className="flex items-center space-x-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: space.color }}
                    />
                    <span className="text-slate-600 dark:text-slate-400">
                      {space.name} ({space.uid})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-500">No owners or spaces found.</p>
      )}
    </div>
  );
};