/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

interface PersonFormFieldsProps {
  name: string;
  notes: string;
  onNameChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  required?: boolean;
}

export const PersonFormFields: React.FC<PersonFormFieldsProps> = ({
  name,
  notes,
  onNameChange,
  onNotesChange,
  required = false
}) => {
  return (
    <>
      {/* Name Section */}
      <div className="p-4 md:border-r border-black">
        <label className="synapsas-label mb-2 block">
          Name {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Person's name"
          className="synapsas-input"
          required={required}
        />
      </div>

      {/* Notes Section */}
      <div className="p-4 border-b border-black">
        <label className="synapsas-label mb-2 block">
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add any notes about this person..."
          className="synapsas-input resize-none"
          rows={3}
        />
      </div>
    </>
  );
};

export default PersonFormFields;