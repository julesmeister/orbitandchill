interface AdminHeaderProps {
  adminName: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function AdminHeader({ adminName, onRefresh, isLoading }: AdminHeaderProps) {

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Simplified system status - no custom analytics needed
  const getSystemStatus = () => {
    return { label: 'System Active', color: 'bg-green-500' };
  };
  
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <header className="w-screen px-4 md:px-6 lg:px-8 py-4 md:py-6 border-b border-black" style={{ backgroundColor: '#6bdbff' }}>
        <div>
          {/* Mobile Header Layout */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-3">
              {/* Mobile Logo + Title */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="font-space-grotesk text-lg font-bold text-black">Admin</h1>
              </div>
              
              {/* Mobile Actions */}
              <div className="flex items-center space-x-2">
                <div className="h-8 px-2 bg-white border border-black flex items-center" title={getSystemStatus().label}>
                  <div className={`w-2.5 h-2.5 ${getSystemStatus().color}`}></div>
                </div>
                
                {onRefresh && (
                  <button 
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="h-8 w-8 bg-black text-white border border-black transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                    title="Refresh"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
                
                <button className="h-8 w-8 bg-white text-black border border-black transition-all duration-300 hover:bg-black hover:text-white flex items-center justify-center" title="Notifications">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Mobile Stats Grid - Simplified */}
            <div className="grid grid-cols-2 gap-0 border border-black">
              <div className="p-3 text-center border-r border-black bg-white">
                <div className="font-space-grotesk text-sm font-bold text-black">Analytics</div>
                <div className="font-open-sans text-xs text-black/60">Google</div>
              </div>
              <div className="p-3 text-center bg-white">
                <div className="font-space-grotesk text-sm font-bold text-black">{currentTime}</div>
                <div className="font-open-sans text-xs text-black/60">Time</div>
              </div>
            </div>
          </div>
          
          {/* Tablet+ Header Layout */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex items-center space-x-3 lg:space-x-6 min-w-0 flex-1">
              {/* Logo */}
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-black flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              
              <div className="min-w-0 flex-1">
                <h1 className="font-space-grotesk text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black tracking-tight">
                  <span className="hidden lg:inline">Admin Dashboard</span>
                  <span className="lg:hidden">Admin</span>
                </h1>
                <p className="font-open-sans text-sm md:text-base lg:text-lg text-black/80 mt-1">
                  <span className="hidden lg:inline">Welcome back, </span>
                  <span className="font-semibold text-black">{adminName}</span>
                  <span className="hidden xl:inline mx-3 text-black/60">•</span>
                  <span className="hidden xl:inline text-black/60">{currentTime}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
              {/* Status Card - Responsive text */}
              <div className="h-12 flex items-center space-x-2 px-3 lg:px-4 bg-white border border-black">
                <div className={`w-3 h-3 ${getSystemStatus().color}`}></div>
                <span className="font-open-sans text-xs md:text-sm font-medium text-black hidden md:inline">{getSystemStatus().label}</span>
              </div>

              {/* Quick Stats - Google Analytics Link */}
              <div className="hidden 2xl:flex items-center space-x-4 h-12 px-4 bg-white border border-black">
                <div className="text-center">
                  <div className="font-space-grotesk text-sm font-bold text-black">Google</div>
                  <div className="font-open-sans text-xs text-black/60">Analytics</div>
                </div>
              </div>

              {/* Essential Action Buttons */}
              <div className="flex items-center space-x-1 md:space-x-2">
                {onRefresh && (
                  <button 
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="h-12 w-12 bg-black text-white border border-black font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 disabled:opacity-50 flex items-center justify-center"
                    title="Refresh Data"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}

                <button className="h-12 w-12 bg-white text-black border border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15 flex items-center justify-center" title="Notifications">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>


                <button className="hidden lg:flex h-12 w-12 bg-white text-black border border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15 items-center justify-center" title="Settings">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}