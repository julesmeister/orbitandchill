/* eslint-disable @typescript-eslint/no-unused-vars */
import AdminDropdown from '@/components/reusable/AdminDropdown';

interface UsersFiltersProps {
  itemsPerPage: number;
  userFilter: string;
  timeFilter: string;
  searchQuery: string;
  onItemsPerPageChange: (value: number) => void;
  onUserFilterChange: (value: string) => void;
  onTimeFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onPageReset: () => void;
}

export default function UsersFilters({
  itemsPerPage,
  userFilter,
  timeFilter,
  searchQuery,
  onItemsPerPageChange,
  onUserFilterChange,
  onTimeFilterChange,
  onSearchChange,
  onPageReset
}: UsersFiltersProps) {
  return (
    <div className="px-8 py-4 border-b border-black" style={{ backgroundColor: '#f2e356' }}>
      <div className="flex items-center space-x-4">
        <AdminDropdown
          options={['5', '10', '15', '25', '50']}
          value={itemsPerPage.toString()}
          onChange={(value) => {
            onItemsPerPageChange(parseInt(value));
            onPageReset();
          }}
          label="Show"
        />
        <AdminDropdown
          options={['Named Users', 'All Users', 'Anonymous Users', 'Active Users']}
          value={userFilter}
          onChange={onUserFilterChange}
        />
        <AdminDropdown
          options={['Last 30 days', 'Last 7 days', 'Last 24 hours']}
          value={timeFilter}
          onChange={onTimeFilterChange}
        />
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 font-open-sans text-sm bg-white border-2 border-black focus:outline-none focus:border-black"
          />
        </div>
      </div>
    </div>
  );
}