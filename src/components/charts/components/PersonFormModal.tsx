/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { memo } from 'react';
import { PersonFormModalProps } from '../types';
import PeopleSelector from '../../people/PeopleSelector';
import CompactNatalChartForm from '../../forms/CompactNatalChartForm';

const PersonFormModal = memo(function PersonFormModal({
  isVisible,
  type,
  editingPerson,
  onPersonSaved,
  onCancel,
  onDropdownToggle,
  onPersonSelect,
  onSharedChartSelect
}: PersonFormModalProps) {
  if (!isVisible) return null;

  const isEdit = type === 'edit';
  const headerColor = isEdit ? '#f0e3ff' : '#6bdbff';
  const formHeaderColor = isEdit ? '#f0e3ff' : '#f2e356';
  
  const headerIcon = isEdit ? (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const formIcon = isEdit ? (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );

  return (
    <div className="border-r border-b border-black bg-white">
      {/* Header Section */}
      {!isEdit && (
        <div className="p-6 border-b border-black overflow-visible" style={{ backgroundColor: headerColor }}>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-black flex items-center justify-center mr-4">
              {headerIcon}
            </div>
            <div>
              <h4 className="font-space-grotesk text-xl font-bold text-black">Generate Chart For</h4>
              <p className="font-open-sans text-sm text-black/70 mt-1">Select or add a new person</p>
            </div>
          </div>
          {onPersonSelect && onSharedChartSelect && (
            <PeopleSelector
              onPersonSelect={onPersonSelect}
              onSharedChartSelect={onSharedChartSelect}
              onAddNew={() => {}} // Handled by parent
              onDropdownToggle={onDropdownToggle}
              className="w-full"
            />
          )}
        </div>
      )}

      {/* Form Header */}
      <div className="flex items-center justify-between p-6 border-b border-black" style={{ backgroundColor: formHeaderColor }}>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-black flex items-center justify-center mr-4">
            {formIcon}
          </div>
          <div>
            <h4 className="font-space-grotesk text-xl font-bold text-black">
              {isEdit ? 'Edit Person Data' : 'Add New Person'}
            </h4>
            <p className="font-open-sans text-sm text-black/70 mt-1">
              {isEdit ? 'Update details' : 'Enter birth details and information'}
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="group p-3 text-black hover:bg-black hover:text-white transition-all duration-300 border border-black"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form Content */}
      <CompactNatalChartForm
        editingPerson={editingPerson}
        onPersonSaved={onPersonSaved}
        onCancel={onCancel}
      />
    </div>
  );
});

PersonFormModal.displayName = 'PersonFormModal';

export default PersonFormModal;