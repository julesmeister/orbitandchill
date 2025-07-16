/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { AdminLogEntry } from '@/db/services/adminAuditService';
import LoadingSpinner from '../reusable/LoadingSpinner';

interface AuditLogsTabProps {
  isLoading: boolean;
}

interface AuditLogFilters {
  actions: string[];
  entityTypes: string[];
  severities: string[];
  dateFrom: string;
  dateTo: string;
  search: string;
  adminUserId: string;
}

interface AuditLogStatistics {
  totalLogs: number;
  logsByAction: Record<string, number>;
  logsByEntityType: Record<string, number>;
  logsBySeverity: Record<string, number>;
  recentActivity: AdminLogEntry[];
  topAdmins: Array<{ adminUsername: string; count: number }>;
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
}

export default function AuditLogsTab({ isLoading: parentLoading }: AuditLogsTabProps) {
  const [logs, setLogs] = useState<AdminLogEntry[]>([]);
  const [statistics, setStatistics] = useState<AuditLogStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  const [filters, setFilters] = useState<AuditLogFilters>({
    actions: [],
    entityTypes: [],
    severities: [],
    dateFrom: '',
    dateTo: '',
    search: '',
    adminUserId: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  // Available filter options
  const actionOptions = ['create', 'update', 'delete', 'login', 'logout', 'view', 'export', 'import', 'seed', 'migrate', 'configure'];
  const entityTypeOptions = ['user', 'discussion', 'reply', 'chart', 'event', 'category', 'tag', 'premium_feature', 'admin_setting', 'analytics', 'system'];
  const severityOptions = ['low', 'medium', 'high', 'critical'];

  // Load audit logs
  const loadAuditLogs = async (resetPage = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentPage = resetPage ? 1 : page;
      const params = new URLSearchParams();
      
      if (filters.actions.length > 0) params.set('actions', filters.actions.join(','));
      if (filters.entityTypes.length > 0) params.set('entityTypes', filters.entityTypes.join(','));
      if (filters.severities.length > 0) params.set('severities', filters.severities.join(','));
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.set('dateTo', filters.dateTo);
      if (filters.search) params.set('search', filters.search);
      if (filters.adminUserId) params.set('adminUserId', filters.adminUserId);
      
      params.set('page', currentPage.toString());
      params.set('limit', '50');

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.logs);
        setTotalPages(data.pagination.totalPages);
        setHasMore(data.pagination.hasMore);
        if (resetPage) setPage(1);
      } else {
        setError(data.error || 'Failed to load audit logs');
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
      setError('Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      const response = await fetch('/api/admin/audit-logs/stats?days=30');
      const data = await response.json();

      if (data.success) {
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error loading audit statistics:', error);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    loadAuditLogs(true);
  }, [filters]);

  useEffect(() => {
    loadStatistics();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: keyof AuditLogFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle multi-select filter changes
  const handleMultiSelectChange = (key: keyof AuditLogFilters, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentValues = prev[key] as string[];
      if (checked) {
        return { ...prev, [key]: [...currentValues, value] };
      } else {
        return { ...prev, [key]: currentValues.filter(v => v !== value) };
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      actions: [],
      entityTypes: [],
      severities: [],
      dateFrom: '',
      dateTo: '',
      search: '',
      adminUserId: '',
    });
  };

  // Format date for display
  const formatDate = (date: Date | string | null | undefined) => {
    try {
      // Handle null/undefined
      if (!date) {
        return 'N/A';
      }
      
      // Convert to Date if it's a string
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(dateObj);
    } catch (error) {
      console.error('Date formatting error:', error, 'Date value:', date);
      return 'Invalid Date';
    }
  };

  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get action badge color
  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'login': case 'logout': return 'bg-purple-100 text-purple-800';
      case 'view': return 'bg-gray-100 text-gray-800';
      default: return 'bg-indigo-100 text-indigo-800';
    }
  };

  return (
    <div className="bg-white">
      {/* Header Section with Integrated Statistics */}
      <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="px-6 py-4">
          <div className="max-w-none mx-auto">
            <div className="flex flex-col gap-4">
              {/* Top row: Title + Action buttons */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-space-grotesk text-2xl font-bold text-black">Audit Logs</h1>
                  <p className="font-open-sans text-sm text-black/70 mt-0.5">Track all administrative actions and system changes</p>
                </div>
                
                <div className="flex gap-0 border border-black">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-white text-black font-open-sans font-semibold border-r border-black hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                  </button>
                  
                  <button
                    onClick={() => loadAuditLogs(true)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-black text-white font-open-sans font-semibold hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>

              {/* Bottom row: Statistics (only show if available) */}
              {statistics && (
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black">
                    <div className="w-4 h-4 bg-black flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="font-open-sans text-xs text-black/70">Total</span>
                    <span className="font-space-grotesk text-sm font-bold text-black">{statistics.totalLogs.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black">
                    <div className="w-4 h-4 bg-green-600 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="font-open-sans text-xs text-black/70">Creates</span>
                    <span className="font-space-grotesk text-sm font-bold text-black">{statistics.logsByAction.create || 0}</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black">
                    <div className="w-4 h-4 bg-red-600 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <span className="font-open-sans text-xs text-black/70">Deletes</span>
                    <span className="font-space-grotesk text-sm font-bold text-black">{statistics.logsByAction.delete || 0}</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black">
                    <div className="w-4 h-4 bg-orange-600 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <span className="font-open-sans text-xs text-black/70">Critical</span>
                    <span className="font-space-grotesk text-sm font-bold text-black">
                      {(statistics.logsBySeverity.high || 0) + (statistics.logsBySeverity.critical || 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="px-6 py-8">
            <div className="max-w-none mx-auto">
              <div className="bg-white border border-black p-8">
                <div className="flex justify-between items-center mb-6">
                <h3 className="font-space-grotesk text-xl font-bold text-black">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="font-open-sans text-sm text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Search */}
                <div>
                  <label className="block font-open-sans text-sm font-medium text-black mb-2">Search</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search descriptions..."
                    className="w-full px-3 py-3 border-b-2 border-black bg-transparent focus:outline-none focus:border-gray-600 font-open-sans"
                  />
                </div>

                {/* Date From */}
                <div>
                  <label className="block font-open-sans text-sm font-medium text-black mb-2">From Date</label>
                  <input
                    type="datetime-local"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-3 border-b-2 border-black bg-transparent focus:outline-none focus:border-gray-600 font-open-sans"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block font-open-sans text-sm font-medium text-black mb-2">To Date</label>
                  <input
                    type="datetime-local"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-3 py-3 border-b-2 border-black bg-transparent focus:outline-none focus:border-gray-600 font-open-sans"
                  />
                </div>

                {/* Actions */}
                <div>
                  <label className="block font-open-sans text-sm font-medium text-black mb-2">Actions</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-black p-3">
                    {actionOptions.map((action) => (
                      <label key={action} className="flex items-center cursor-pointer hover:bg-gray-50 p-1">
                        <input
                          type="checkbox"
                          checked={filters.actions.includes(action)}
                          onChange={(e) => handleMultiSelectChange('actions', action, e.target.checked)}
                          className="border-black text-black focus:ring-0"
                        />
                        <span className="ml-2 font-open-sans text-sm text-black capitalize">{action}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Entity Types */}
                <div>
                  <label className="block font-open-sans text-sm font-medium text-black mb-2">Entity Types</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-black p-3">
                    {entityTypeOptions.map((type) => (
                      <label key={type} className="flex items-center cursor-pointer hover:bg-gray-50 p-1">
                        <input
                          type="checkbox"
                          checked={filters.entityTypes.includes(type)}
                          onChange={(e) => handleMultiSelectChange('entityTypes', type, e.target.checked)}
                          className="border-black text-black focus:ring-0"
                        />
                        <span className="ml-2 font-open-sans text-sm text-black capitalize">{type.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Severities */}
                <div>
                  <label className="block font-open-sans text-sm font-medium text-black mb-2">Severity</label>
                  <div className="space-y-2 border border-black p-3">
                    {severityOptions.map((severity) => (
                      <label key={severity} className="flex items-center cursor-pointer hover:bg-gray-50 p-1">
                        <input
                          type="checkbox"
                          checked={filters.severities.includes(severity)}
                          onChange={(e) => handleMultiSelectChange('severities', severity, e.target.checked)}
                          className="border-black text-black focus:ring-0"
                        />
                        <span className="ml-2 font-open-sans text-sm text-black capitalize">{severity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div></div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="px-6 py-4">
            <div className="max-w-none mx-auto">
            <div className="bg-red-100 border-2 border-black p-6">
              <div className="flex">
                <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <p className="font-open-sans text-sm text-black font-medium">{error}</p>
                </div>
              </div>
            </div>
            </div>
            </div>
        </section>
      )}

      {/* Audit Logs Table */}
      <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="px-6 py-8">
          <div className="max-w-none mx-auto">
          <div className="bg-white border border-black overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-black">
                <thead style={{ backgroundColor: '#19181a' }}>
                  <tr>
                    <th className="px-6 py-4 text-left font-space-grotesk text-sm font-bold text-white uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left font-space-grotesk text-sm font-bold text-white uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-4 text-left font-space-grotesk text-sm font-bold text-white uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left font-space-grotesk text-sm font-bold text-white uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-6 py-4 text-left font-space-grotesk text-sm font-bold text-white uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left font-space-grotesk text-sm font-bold text-white uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-4 text-left font-space-grotesk text-sm font-bold text-white uppercase tracking-wider">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-black">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <LoadingSpinner
                          variant="dots"
                          size="sm"
                          centered={true}
                          screenCentered={false}
                        />
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center font-open-sans text-black">
                        No audit logs found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 border-b border-black">
                        <td className="px-6 py-4 whitespace-nowrap font-open-sans text-sm text-black">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-open-sans text-sm text-black font-medium">
                          {log.adminUsername}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 border border-black text-xs font-open-sans font-medium bg-white text-black">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-open-sans text-sm text-black">
                          <div>
                            <div className="text-black capitalize font-medium">{log.entityType.replace('_', ' ')}</div>
                            {log.entityId && (
                              <div className="text-xs text-black/60 font-mono">{log.entityId}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-open-sans text-sm text-black max-w-md">
                          <div className="truncate" title={log.description}>
                            {log.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 border border-black text-xs font-open-sans font-medium bg-white text-black">
                            {log.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-open-sans text-sm text-black/60 font-mono">
                          {log.ipAddress || 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-6 py-4 flex items-center justify-between border-t-2 border-black">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="relative inline-flex items-center px-4 py-2 border border-black font-open-sans text-sm font-medium text-black bg-white hover:bg-black hover:text-white disabled:opacity-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-black font-open-sans text-sm font-medium text-black bg-white hover:bg-black hover:text-white disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="font-open-sans text-sm text-black">
                      Page <span className="font-bold">{page}</span> of{' '}
                      <span className="font-bold">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex border border-black">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                        className="relative inline-flex items-center px-3 py-2 border-r border-black bg-white font-open-sans text-sm font-medium text-black hover:bg-black hover:text-white disabled:opacity-50 transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                        className="relative inline-flex items-center px-3 py-2 bg-white font-open-sans text-sm font-medium text-black hover:bg-black hover:text-white disabled:opacity-50 transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div></div>
      </section>
    </div>
  );
}