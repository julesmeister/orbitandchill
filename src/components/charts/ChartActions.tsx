import React from 'react';

interface ChartActionsProps {
  onDownloadSVG: () => void;
  onDownloadPNG: () => void;
  onDownloadPDF?: () => void;
  onShare?: () => void;
  isPDFGenerating?: boolean;
}

const ChartActions: React.FC<ChartActionsProps> = ({
  onDownloadSVG,
  onDownloadPNG,
  onDownloadPDF,
  onShare,
  isPDFGenerating = false
}) => {
  return (
    <div className="bg-white border border-black p-6">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h4 className="font-space-grotesk text-lg font-bold text-black">Export & Share</h4>
          <p className="font-inter text-sm text-black/60">Save your chart or share with others</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-black">
        {/* Download SVG */}
        <button
          onClick={onDownloadSVG}
          className="group relative p-6 hover:bg-black transition-all duration-300 border-black sm:border-r lg:border-r"
          style={{ backgroundColor: '#6bdbff' }}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-space-grotesk font-semibold text-sm text-black group-hover:text-white">SVG Format</div>
              <div className="font-inter text-xs text-black/60 group-hover:text-white/80">Vector graphics</div>
            </div>
          </div>
        </button>

        {/* Download PNG */}
        <button
          onClick={onDownloadPNG}
          className="group relative p-6 hover:bg-black transition-all duration-300 border-black lg:border-r"
          style={{ backgroundColor: '#f2e356' }}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-space-grotesk font-semibold text-sm text-black group-hover:text-white">PNG Format</div>
              <div className="font-inter text-xs text-black/60 group-hover:text-white/80">High quality image</div>
            </div>
          </div>
        </button>

        {/* Download PDF */}
        {onDownloadPDF && (
          <button
            onClick={onDownloadPDF}
            disabled={isPDFGenerating}
            className="group relative p-6 hover:bg-black transition-all duration-300 border-black lg:border-r disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#f0e3ff' }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                {isPDFGenerating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <div className="font-space-grotesk font-semibold text-sm text-black group-hover:text-white">
                  {isPDFGenerating ? 'Generating...' : 'PDF Format'}
                </div>
                <div className="font-inter text-xs text-black/60 group-hover:text-white/80">
                  {isPDFGenerating ? 'Please wait' : 'Print-ready document'}
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Share Button */}
        {onShare && (
          <button
            onClick={onShare}
            className="group relative p-6 hover:bg-black transition-all duration-300 border-black"
            style={{ backgroundColor: '#ff91e9' }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-space-grotesk font-semibold text-sm text-black group-hover:text-white">Share Chart</div>
                <div className="font-inter text-xs text-black/60 group-hover:text-white/80">Send to others</div>
              </div>
            </div>
          </button>
        )}
      </div>

      
    </div>
  );
};

export default ChartActions;