/* eslint-disable @typescript-eslint/no-unused-vars */

import LoadingSpinner from '../../reusable/LoadingSpinner';

export default function UsersLoading() {
  return (
    <div className="bg-white border border-black p-8">
      <LoadingSpinner
        variant="dots"
        size="md"
        title="Loading Users"
        subtitle="Fetching user data..."
        centered={true}
      />
    </div>
  );
}