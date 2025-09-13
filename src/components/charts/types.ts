/* eslint-disable @typescript-eslint/no-unused-vars */
import { Person } from '../../types/people';

export interface ChartQuickActionsProps {
  onRegenerateChart: () => void;
  isGenerating: boolean;
  onPersonChange?: (person: Person | null) => void;
  onAddPersonClick?: () => void;
  onDropdownToggle?: (isOpen: boolean) => void;
  chartId?: string;
}

export interface ChartActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
  gradientDirection?: 'left' | 'right';
}

export interface PersonFormModalProps {
  isVisible: boolean;
  type: 'add' | 'edit';
  editingPerson?: Person | null;
  onPersonSaved: (person: Person) => void;
  onCancel: () => void;
  onDropdownToggle?: (isOpen: boolean) => void;
  onPersonSelect?: (person: Person | null) => void;
  onSharedChartSelect?: (chart: any) => void;
}

export interface RegenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
}

export interface ShareChartData {
  shareUrl: string;
  shareToken: string;
}

export interface ChartSkeletonProps {
  showPeopleSelector?: boolean;
  showActionButtons?: boolean;
}

export interface ChartErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface PerformanceMetrics {
  componentName: string;
  renderTime?: number;
  mountTime?: number;
}