/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { SEED_PERSONA_TEMPLATES } from '@/data/seedPersonas';

interface UserPersonaManagerProps {
  selectedUsers: string[];
  personasExpanded: boolean;
  editingUser: string | null;
  onToggleUserSelection: (userId: string) => void;
  onToggleExpanded: () => void;
  onEditUser: (userId: string) => void;
}

const UserPersonaManager: React.FC<UserPersonaManagerProps> = ({
  selectedUsers,
  personasExpanded,
  editingUser,
  onToggleUserSelection,
  onToggleExpanded,
  onEditUser,
}) => {
  return (
    <div className="bg-white border border-black mb-8">
      <div className="p-4 border-b border-black bg-yellow-200">
        <div className="flex items-center justify-between">
          <h2 className="font-space-grotesk font-semibold text-black">
            User Personas ({selectedUsers.length}/{SEED_PERSONA_TEMPLATES.length})
          </h2>
          <button
            onClick={onToggleExpanded}
            className="flex items-center gap-2 px-3 py-1 bg-yellow-600 text-white rounded text-sm font-semibold hover:bg-yellow-700 transition-colors"
          >
            {personasExpanded ? (
              <>
                <span>Hide Personas</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                <span>Show Personas</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
        {!personasExpanded && (
          <div className="mt-2 text-sm text-gray-700">
            <div className="flex items-center gap-4">
              <span>Selected: {selectedUsers.length} users</span>
              <span>•</span>
              <span>3 Experts, 5 Intermediate, 12 Beginners</span>
            </div>
          </div>
        )}
      </div>
      {personasExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEED_PERSONA_TEMPLATES.map(user => (
              <div key={user.id} className="border border-gray-300 p-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => onToggleUserSelection(user.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-space-grotesk font-semibold">{user.username}</span>
                      <span className={`px-2 py-1 text-xs font-open-sans font-semibold ${
                        user.subscriptionTier === 'premium' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.subscriptionTier}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-open-sans mb-2">{user.description}</p>
                    <div className="text-xs text-gray-500 font-open-sans space-y-1">
                      <div>Style: {user.writingStyle}</div>
                      <div>Reply Rate: {(user.replyProbability * 100).toFixed(0)}%</div>
                      <div>Expertise: {user.expertiseAreas.join(', ')}</div>
                    </div>
                    <button
                      onClick={() => onEditUser(user.id)}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-open-sans"
                    >
                      Edit Persona
                    </button>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPersonaManager;