/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

const HoraryTimeHeader = React.memo(() => (
  <div className="p-6 border-b border-black" style={{ backgroundColor: '#f2e356' }}>
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-black flex items-center justify-center">
        <span className="text-white text-lg">⏰</span>
      </div>
      <div>
        <h3 className="font-space-grotesk text-xl font-bold text-black">Custom Chart Time</h3>
        <div className="w-16 h-0.5 bg-black mt-1"></div>
      </div>
    </div>
  </div>
));

HoraryTimeHeader.displayName = 'HoraryTimeHeader';

export default HoraryTimeHeader;
