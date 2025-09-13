/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { toast } from 'sonner';
import { Person } from '@/types/people';
import { useUserStore } from '@/store/userStore';

interface DuplicateManagerProps {
  duplicateGroups: Map<string, Person[]>;
  onCleanupComplete: () => void;
}

const DuplicateManager: React.FC<DuplicateManagerProps> = ({
  duplicateGroups,
  onCleanupComplete
}) => {
  const { user } = useUserStore();

  const handleCleanupDuplicates = async (name: string, persons: Person[]) => {
    console.log('🧹 Starting duplicate cleanup for:', name);
    console.log('👥 All persons in group:', persons.map((p: any) => ({ id: p.id, name: p.name, isDefault: p.isDefault, userId: p.userId })));

    // Keep the default person, or the first one if none is default
    const defaultPerson = persons.find((p: any) => p.isDefault);
    const keep = defaultPerson || persons[0];
    const toDelete = persons.filter((p: any) => p.id !== keep.id);

    console.log('✅ Keeping person:', { id: keep.id, name: keep.name, isDefault: keep.isDefault });
    console.log('🗑️ Will delete persons:', toDelete.map((p: any) => ({ id: p.id, name: p.name, isDefault: p.isDefault })));

    try {
      console.log('🔍 PHANTOM CHECK: Verifying people exist in database before cleanup...');

      // First, check what's actually in the database
      const dbResponse = await fetch(`/api/people?userId=${user?.id}`);
      const dbResult = await dbResponse.json();
      const realPeople = dbResult.success ? (dbResult.people || []) : [];
      const realPeopleIds = new Set(realPeople.map((p: any) => p.id));

      console.log(`📊 Database has ${realPeople.length} real people`);

      // Filter out phantom entries (exist in UI but not in database)
      const phantomEntries = toDelete.filter((p: any) => !realPeopleIds.has(p.id));
      const realEntries = toDelete.filter((p: any) => realPeopleIds.has(p.id));

      if (phantomEntries.length > 0) {
        console.log(`👻 Found ${phantomEntries.length} phantom entries that don't exist in database`);
        toast.warning(`Found ${phantomEntries.length} phantom entries. Forcing cache refresh...`);
      }

      let deletedCount = 0;

      // Only attempt to delete entries that actually exist in the database
      for (const person of realEntries) {
        console.log(`🔥 Deleting real person: ${person.id} (${person.name})`);
        try {
          const response = await fetch(`/api/people/${person.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user?.id }),
          });

          if (response.ok) {
            console.log(`✅ Successfully deleted person: ${person.id}`);
            deletedCount++;
          } else {
            console.error(`❌ Failed to delete person ${person.id}:`, response.statusText);
          }
        } catch (personError) {
          console.error(`❌ Failed to delete person ${person.id}:`, personError);
        }
      }

      const totalPhantoms = phantomEntries.length;
      if (deletedCount > 0 || totalPhantoms > 0) {
        const message = deletedCount > 0
          ? `Cleaned up ${deletedCount} real duplicate${deletedCount > 1 ? 's' : ''}${totalPhantoms > 0 ? ` and cleared ${totalPhantoms} phantom entries` : ''}`
          : `Cleared ${totalPhantoms} phantom entries`;
        toast.success(message);
      } else {
        toast.info('No cleanup needed - all entries are valid');
      }

      // Trigger parent refresh
      onCleanupComplete();

    } catch (error) {
      console.error('❌ Failed to clean duplicates:', error);
      toast.error('Failed to clean up duplicates');
    }
  };

  if (duplicateGroups.size === 0) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 bg-yellow-50 p-3">
      <div className="flex items-center mb-2">
        <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span className="text-sm font-medium text-yellow-800">Duplicates Found</span>
      </div>
      {Array.from(duplicateGroups.entries()).map(([name, persons]) => (
        <div key={name} className="mb-2 last:mb-0">
          <div className="text-xs text-yellow-700 mb-1">
            {persons.length} entries for "{persons[0].name}"
          </div>
          <button
            onClick={() => handleCleanupDuplicates(name, persons)}
            className="text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-2 py-1 rounded transition-colors"
          >
            Clean up duplicates
          </button>
        </div>
      ))}
    </div>
  );
};

export default DuplicateManager;