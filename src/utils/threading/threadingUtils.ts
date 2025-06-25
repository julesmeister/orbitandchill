// Utility functions for comment threading visualization

export interface ThreadingProps {
  nested: number;
  hasChildren: boolean;
  isLast: boolean;
  isParent?: boolean;
  isLastParent?: boolean;
  parentCommentLength?: number;
  index?: number;
  totalChildren?: number;
}

// Calculate vertical line height based on position
export const getVerticalLineHeight = (props: ThreadingProps): string => {
  const { isLast, isLastParent, nested } = props;
  
  if (isLastParent) return '50%';
  if (!isLast && nested === 1) return '100%';
  if (!isLast) return '100%';
  return '50%';
};

// Calculate horizontal position for lines based on nesting
export const getLineLeftPosition = (props: ThreadingProps): number => {
  const { nested, hasChildren } = props;
  
  if (nested === 0 && !hasChildren) return 0;
  if (hasChildren && nested === 0) return 12;
  if (hasChildren && nested === 1) return 22;
  if (!hasChildren && nested === 1) return 22;
  if (!hasChildren && nested === 2) return 50;
  return 0;
};

// Get container margin based on nesting
export const getContainerMargin = (nested: number): number => {
  return nested === 1 || nested === 2 ? 12 : 22;
};

// Get content margin based on nesting and children
export const getContentMargin = (props: ThreadingProps): number => {
  const { nested, hasChildren } = props;
  
  if (nested === 0 && !hasChildren) return 0;
  if (hasChildren && nested === 0) return 28;
  if (hasChildren && nested === 1) return 66;
  if (!hasChildren && nested === 1) return 68;
  if (!hasChildren && nested === 2) return 94;
  return 0;
};

// Component styles for threading lines
export const threadingStyles = {
  verticalLine: (props: ThreadingProps) => ({
    position: 'absolute' as const,
    left: `${getLineLeftPosition(props)}px`,
    top: 0,
    width: '2px',
    backgroundColor: '#d9d9d9',
    height: getVerticalLineHeight(props),
  }),
  
  horizontalLine: (nested: number) => ({
    position: 'absolute' as const,
    height: nested !== 1 ? '1px' : '2px',
    width: nested === 2 ? '12px' : '10px',
    backgroundColor: '#d9d9d9',
    left: nested === 1 ? '24px' : '50px',
    top: nested !== 1 ? '26px' : '24px',
  }),
  
  connectionDot: {
    position: 'absolute' as const,
    width: '8px',
    height: '8px',
    backgroundColor: '#60a5fa',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  }
};

// Determine if vertical lines should be shown
export const shouldShowVerticalLine = (props: ThreadingProps): {
  inner: boolean;
  outer: boolean;
} => {
  const { nested, hasChildren, isLast, isParent, isLastParent } = props;
  
  const showInner = () => {
    if (nested === 0) return false;
    if (nested === 1 && hasChildren) return true;
    if (nested === 2 && !isLast && !isLastParent) return true;
    return nested > 0;
  };
  
  const showOuter = () => {
    if (nested === 0 && isParent && hasChildren) return true;
    if (nested === 1 && !isLast && !isParent) return true;
    if (nested === 1 && isParent && hasChildren && !isLast) return true;
    if (nested === 2 && !isLastParent) return true;
    return false;
  };
  
  return {
    inner: showInner(),
    outer: showOuter()
  };
};