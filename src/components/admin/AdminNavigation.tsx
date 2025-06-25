interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  alert?: boolean;
}

interface AdminNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: Tab[];
}

import { useState, useRef, useEffect } from 'react';

export default function AdminNavigation({ activeTab, onTabChange, tabs }: AdminNavigationProps) {
  const colors = ['#f2e356', '#51bd94', '#ff91e9', '#6bdbff'];
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  // Check scroll position and update navigation buttons
  const checkScrollPosition = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      setScrollPosition(scrollLeft);
    }
  };
  
  // Scroll tabs left/right
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200; // Adjust scroll distance
      const newScrollLeft = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      tabsContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };
  
  // Check scroll position on mount and resize
  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <nav className="w-screen px-4 md:px-6 lg:px-8 py-4 border-b border-black bg-white">
          {/* Mobile Navigation */}
          <div className="md:hidden">
            {/* Mobile Tab Scroll with Navigation */}
            <div className="relative mb-3">
              {/* Left Navigation Button */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollTabs('left')}
                  className="absolute left-0 top-0 z-10 h-12 w-8 bg-white border border-black border-r-0 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* Tabs Container */}
              <div 
                ref={tabsContainerRef}
                className="flex gap-0 border border-black overflow-x-hidden"
                style={{ paddingLeft: canScrollLeft ? '32px' : '0', paddingRight: canScrollRight ? '32px' : '0' }}
                onScroll={checkScrollPosition}
              >
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                      flex-shrink-0 relative flex items-center justify-center h-12 px-4 font-space-grotesk font-semibold text-sm transition-all duration-300 border-r border-black last:border-r-0
                      ${activeTab === tab.id
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-black hover:text-white'
                      }
                    `}
                    style={activeTab !== tab.id ? { backgroundColor: colors[index % colors.length] } : {}}
                    title={tab.label}
                  >
                    <div className="flex items-center justify-center">
                      {tab.icon}
                    </div>
                    
                    {/* Mobile Count Badge */}
                    {(tab.count !== undefined && tab.count > 0) && (
                      <div className={`
                        absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold border border-black
                        ${activeTab === tab.id 
                          ? 'bg-white text-black' 
                          : 'bg-black text-white'
                        }
                      `}>
                        {tab.count > 99 ? '99+' : tab.count}
                      </div>
                    )}
                    
                    {/* Mobile Alert Indicator */}
                    {tab.alert && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border border-white"></div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Right Navigation Button */}
              {canScrollRight && (
                <button
                  onClick={() => scrollTabs('right')}
                  className="absolute right-0 top-0 z-10 h-12 w-8 bg-white border border-black border-l-0 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search admin..."
                className="w-full h-12 pl-12 pr-4 text-sm bg-white border border-black focus:outline-none focus:border-black transition-colors font-inter"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Tablet+ Navigation */}
          <div className="hidden md:flex items-center justify-between gap-2 lg:gap-4">
            {/* Tab Navigation with Scroll Controls */}
            <div className="relative flex-shrink min-w-0">
              {/* Left Navigation Button */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollTabs('left')}
                  className="absolute left-0 top-0 z-10 h-12 w-8 bg-white border border-black border-r-0 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* Tabs Container */}
              <div 
                ref={tabsContainerRef}
                className="flex gap-0 border border-black overflow-x-hidden"
                style={{ paddingLeft: canScrollLeft ? '32px' : '0', paddingRight: canScrollRight ? '32px' : '0' }}
                onScroll={checkScrollPosition}
              >
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                      flex-shrink-0 flex items-center relative whitespace-nowrap h-12 font-space-grotesk font-semibold text-sm transition-all duration-300 border-r border-black last:border-r-0
                      px-2 md:px-3 lg:px-4 xl:px-6
                      ${activeTab === tab.id
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-black hover:text-white'
                      }
                    `}
                    style={activeTab !== tab.id ? { backgroundColor: colors[index % colors.length] } : {}}
                    title={tab.label}
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-center">
                      {tab.icon}
                    </div>

                    {/* Label - Progressive reveal */}
                    <span className="hidden lg:block lg:ml-3">{tab.label}</span>
                    
                    {/* Count Badge */}
                    {(tab.count !== undefined && tab.count > 0) && (
                      <div className={`
                        ml-2 lg:ml-3 flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-xs font-bold border border-black
                        ${activeTab === tab.id 
                          ? 'bg-white text-black' 
                          : 'bg-black text-white'
                        }
                      `}>
                        {tab.count > 99 ? '99+' : tab.count}
                      </div>
                    )}
                    
                    {/* Alert Indicator */}
                    {tab.alert && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border border-white"></div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Right Navigation Button */}
              {canScrollRight && (
                <button
                  onClick={() => scrollTabs('right')}
                  className="absolute right-0 top-0 z-10 h-12 w-8 bg-white border border-black border-l-0 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Action Controls */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Search - Responsive width */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-12 pl-10 pr-3 text-sm bg-white border border-black focus:outline-none focus:border-black transition-colors w-32 md:w-40 lg:w-48 xl:w-64 font-inter"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* View Toggle - Show on larger tablets */}
              <div className="hidden lg:flex items-center bg-white border border-black">
                <button className="h-12 px-3 text-black hover:bg-black hover:text-white transition-all duration-200 border-r border-black" title="Grid View">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button className="h-12 px-3 text-black hover:bg-black hover:text-white transition-all duration-200" title="List View">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* More Options Button - Always show on tablet */}
              <button className="h-12 px-3 text-black border border-black hover:bg-black hover:text-white transition-all duration-200" title="More Options">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>

              {/* Help - Show on large screens */}
              <button className="hidden xl:block h-12 px-3 text-black border border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15" title="Help">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
      </nav>
    </div>
  );
}