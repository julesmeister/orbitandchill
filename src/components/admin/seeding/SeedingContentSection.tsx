/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import AIConfigurationForm from './AIConfigurationForm';
import ContentInputForm from './ContentInputForm';
import GenerationSettings from './GenerationSettings';
import UserPersonaManager from './UserPersonaManager';
import { GenerationSettings as GenerationSettingsType } from '@/types/seeding';

export interface SeedingContentSectionProps {
  // Content Input
  pastedContent: string;
  onContentChange: (content: string) => void;
  onProcessComments: (commentsText: string) => void;
  
  // AI Configuration
  aiProvider: string;
  aiModel: string;
  aiApiKey: string;
  temperature: number;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  onApiKeyChange: (apiKey: string) => void;
  onTemperatureChange: (temperature: number) => void;
  
  // Generation Settings
  generationSettings: GenerationSettingsType;
  onUpdateGenerationSetting: <K extends keyof GenerationSettingsType>(key: K, value: GenerationSettingsType[K]) => void;
  
  // User Persona Management
  selectedUsers: string[];
  personasExpanded: boolean;
  editingUser: string | null;
  onToggleUserSelection: (userId: string) => void;
  onTogglePersonasExpanded: () => void;
  onEditUser: (userId: string | null) => void;
  
  // UI State
  areConfigSectionsHidden: boolean;
}

export default function SeedingContentSection({
  pastedContent,
  onContentChange,
  onProcessComments,
  aiProvider,
  aiModel,
  aiApiKey,
  temperature,
  onProviderChange,
  onModelChange,
  onApiKeyChange,
  onTemperatureChange,
  generationSettings,
  onUpdateGenerationSetting,
  selectedUsers,
  personasExpanded,
  editingUser,
  onToggleUserSelection,
  onTogglePersonasExpanded,
  onEditUser,
  areConfigSectionsHidden
}: SeedingContentSectionProps) {
  const { discussionsToGenerate, repliesPerDiscussion, maxNestingDepth, contentVariation } = generationSettings;

  return (
    <>
      {/* Content Input & AI Configuration */}
      <div className={`grid grid-cols-1 ${!areConfigSectionsHidden ? 'lg:grid-cols-2' : ''} gap-8 mb-8`}>
        <ContentInputForm
          pastedContent={pastedContent}
          onContentChange={onContentChange}
          onProcessComments={onProcessComments}
        />
        
        {/* AI Configuration - Can be hidden/shown */}
        {!areConfigSectionsHidden && (
          <AIConfigurationForm
            aiProvider={aiProvider}
            aiModel={aiModel}
            aiApiKey={aiApiKey}
            temperature={temperature}
            onProviderChange={onProviderChange}
            onModelChange={onModelChange}
            onApiKeyChange={onApiKeyChange}
            onTemperatureChange={onTemperatureChange}
          />
        )}
      </div>

      {/* Configuration Sections - Can be hidden/shown */}
      {!areConfigSectionsHidden && (
        <>
          <GenerationSettings
            discussionsToGenerate={discussionsToGenerate}
            repliesPerDiscussion={repliesPerDiscussion}
            maxNestingDepth={maxNestingDepth}
            contentVariation={contentVariation}
            onDiscussionsChange={(value) => onUpdateGenerationSetting('discussionsToGenerate', value)}
            onMinRepliesChange={(value) => onUpdateGenerationSetting('repliesPerDiscussion', {...repliesPerDiscussion, min: value})}
            onMaxRepliesChange={(value) => onUpdateGenerationSetting('repliesPerDiscussion', {...repliesPerDiscussion, max: value})}
            onMaxNestingChange={(value) => onUpdateGenerationSetting('maxNestingDepth', value)}
            onContentVariationChange={(value) => onUpdateGenerationSetting('contentVariation', value)}
          />

          <UserPersonaManager
            selectedUsers={selectedUsers}
            personasExpanded={personasExpanded}
            editingUser={editingUser}
            onToggleUserSelection={onToggleUserSelection}
            onToggleExpanded={onTogglePersonasExpanded}
            onEditUser={onEditUser}
          />
        </>
      )}
    </>
  );
}