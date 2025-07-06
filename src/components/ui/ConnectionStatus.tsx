/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastHeartbeat?: Date | null;
  showText?: boolean;
  className?: string;
}

/**
 * Component to display real-time connection status
 */
export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  lastHeartbeat,
  showText = false,
  className = ''
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connecting':
        return {
          color: 'bg-yellow-400',
          text: 'Connecting...',
          icon: '🔄',
          pulse: true
        };
      case 'connected':
        return {
          color: 'bg-green-400',
          text: 'Connected',
          icon: '📡',
          pulse: false
        };
      case 'disconnected':
        return {
          color: 'bg-gray-400',
          text: 'Disconnected',
          icon: '📵',
          pulse: false
        };
      case 'error':
        return {
          color: 'bg-red-400',
          text: 'Connection Error',
          icon: '⚠️',
          pulse: true
        };
      default:
        return {
          color: 'bg-gray-400',
          text: 'Unknown',
          icon: '❓',
          pulse: false
        };
    }
  };

  const config = getStatusConfig();
  const timeSinceHeartbeat = lastHeartbeat 
    ? Math.floor((Date.now() - lastHeartbeat.getTime()) / 1000)
    : null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Status indicator dot */}
      <div className="relative">
        <div 
          className={`w-3 h-3 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`}
        />
        {status === 'connected' && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-200 rounded-full animate-ping" />
        )}
      </div>
      
      {/* Status text */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">
            {config.icon} {config.text}
          </span>
          
          {/* Heartbeat info */}
          {status === 'connected' && lastHeartbeat && (
            <span className="text-xs text-gray-500">
              {timeSinceHeartbeat !== null && timeSinceHeartbeat < 60 
                ? `${timeSinceHeartbeat}s ago`
                : lastHeartbeat.toLocaleTimeString()
              }
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Compact connection status for navbar
 */
export const CompactConnectionStatus: React.FC<Omit<ConnectionStatusProps, 'showText'>> = (props) => {
  return <ConnectionStatus {...props} showText={false} className="scale-75" />;
};

/**
 * Detailed connection status for settings/debug
 */
export const DetailedConnectionStatus: React.FC<ConnectionStatusProps> = (props) => {
  return (
    <div className="p-3 bg-gray-50 rounded-lg border">
      <ConnectionStatus {...props} showText={true} />
      
      {props.status === 'connected' && props.lastHeartbeat && (
        <div className="mt-2 text-xs text-gray-600">
          <div>Last heartbeat: {props.lastHeartbeat.toLocaleString()}</div>
          <div className="text-green-600">✓ Real-time notifications active</div>
        </div>
      )}
      
      {props.status === 'error' && (
        <div className="mt-2 text-xs text-red-600">
          ⚠️ Real-time notifications unavailable. Notifications will update on page refresh.
        </div>
      )}
      
      {props.status === 'disconnected' && (
        <div className="mt-2 text-xs text-gray-600">
          📵 Real-time notifications disabled. Enable in settings for instant updates.
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;