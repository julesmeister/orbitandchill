/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { SeedingStatusSectionProps } from '@/types/seeding';

export default function SeedingStatusSection({
  seedUsersInitialized,
  allPersonasComplete,
  showPersonasCompleteMessage,
  usersNeedingFix,
  totalUsers,
  avatarStatusLoading,
  seedingInProgress,
  onInitializeSeedUsers,
  onCompleteAllPersonas,
  onFixAvatarPaths
}: SeedingStatusSectionProps) {
  return (
    <>
      {/* Seed Users Status */}
      {!seedUsersInitialized && (
        <div className="bg-yellow-50 border border-yellow-200 mb-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-space-grotesk font-semibold text-yellow-800 mb-2">
                Seed Users Required
              </h3>
              <p className="text-yellow-700 font-open-sans">
                You need to initialize the 5 AI personas before you can start seeding discussions.
              </p>
            </div>
            <button
              onClick={onInitializeSeedUsers}
              disabled={seedingInProgress}
              className="px-6 py-3 bg-yellow-600 text-white font-space-grotesk font-semibold hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Initialize Seed Users
            </button>
          </div>
        </div>
      )}

      {/* Complete All Personas */}
      {seedUsersInitialized && !allPersonasComplete && (
        <div className="bg-blue-50 border border-blue-200 mb-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-space-grotesk font-semibold text-blue-800 mb-2">
                Enable All 20 Personas
              </h3>
              <p className="text-blue-700 font-open-sans">
                You currently have basic personas initialized. Create all 20 persona templates to unlock the full variety of reply styles.
              </p>
            </div>
            <button
              onClick={onCompleteAllPersonas}
              className="px-6 py-3 bg-blue-600 text-white font-space-grotesk font-semibold hover:bg-blue-700 transition-colors"
            >
              Create All 20 Personas
            </button>
          </div>
        </div>
      )}

      {/* All Personas Complete Status */}
      {seedUsersInitialized && allPersonasComplete && showPersonasCompleteMessage && (
        <div className="bg-green-50 border border-green-200 mb-8 p-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-space-grotesk font-semibold text-green-800 mb-1">
                All 20 Personas Ready
              </h3>
              <p className="text-green-700 font-open-sans">
                All persona templates are created and available for reply generation. Use the persona selector below to choose which ones are active.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fix Avatar Paths */}
      {seedUsersInitialized && usersNeedingFix > 0 && (
        <div className="bg-orange-50 border border-orange-200 mb-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-space-grotesk font-semibold text-orange-800 mb-2">
                Fix Avatar Paths
              </h3>
              <p className="text-orange-700 font-open-sans">
                Update any existing users with incorrect avatar file names to use the correct Avatar-X.png format from /public/avatars/.
                {!avatarStatusLoading && (
                  <span className="block mt-1 text-sm">
                    {usersNeedingFix > 0 
                      ? `${usersNeedingFix} out of ${totalUsers} users need fixing.`
                      : `All ${totalUsers} users have correct avatar paths.`
                    }
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={onFixAvatarPaths}
              disabled={avatarStatusLoading}
              className="px-6 py-3 bg-orange-600 text-white font-space-grotesk font-semibold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {avatarStatusLoading 
                ? 'Checking...' 
                : usersNeedingFix > 0 
                  ? `Fix ${usersNeedingFix} Avatar Path${usersNeedingFix === 1 ? '' : 's'}`
                  : 'Check Avatar Paths'
              }
            </button>
          </div>
        </div>
      )}
    </>
  );
}