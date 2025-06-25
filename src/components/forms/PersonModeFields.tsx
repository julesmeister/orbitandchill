/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Person } from '../../types/people';

interface PersonModeFieldsProps {
  relationship: Person['relationship'];
  setRelationship: (relationship: Person['relationship']) => void;
  notes: string;
  setNotes: (notes: string) => void;
  isDefault: boolean;
  setIsDefault: (isDefault: boolean) => void;
}

const PersonModeFields = React.memo(({
  relationship,
  setRelationship,
  notes,
  setNotes,
  isDefault,
  setIsDefault
}: PersonModeFieldsProps) => (
  <>
    {/* Relationship Field */}
    <div className="synapsas-input-group">
      <label className="synapsas-label">
        Relationship <span className="text-red-500">*</span>
      </label>
      <select
        value={relationship}
        onChange={(e) => setRelationship(e.target.value as Person['relationship'])}
        className="synapsas-select"
        required
      >
        <option value="self">Self</option>
        <option value="friend">Friend</option>
        <option value="family">Family</option>
        <option value="partner">Partner</option>
        <option value="colleague">Colleague</option>
        <option value="other">Other</option>
      </select>
    </div>

    {/* Notes Field */}
    <div className="synapsas-input-group">
      <label className="synapsas-label">
        Notes (Optional)
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add any notes about this person..."
        className="synapsas-input resize-none"
        rows={3}
      />
    </div>

    {/* Default Person Checkbox */}
    <div className="synapsas-checkbox-group">
      <input
        type="checkbox"
        id="isDefault"
        checked={isDefault}
        onChange={(e) => setIsDefault(e.target.checked)}
        className="synapsas-checkbox"
      />
      <label htmlFor="isDefault" className="synapsas-checkbox-label">
        Set as default person for chart generation
      </label>
    </div>
  </>
));

PersonModeFields.displayName = 'PersonModeFields';

export default PersonModeFields;