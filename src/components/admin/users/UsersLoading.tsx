/* eslint-disable @typescript-eslint/no-unused-vars */

import LoadingSpinner from '../../reusable/LoadingSpinner';

export default function UsersLoading() {
  return (
    <LoadingSpinner
      variant="dots"
      size="lg"
      title="Loading Users"
      subtitle="Fetching user data and administrative controls..."
      screenCentered={true}
    />
  );
}