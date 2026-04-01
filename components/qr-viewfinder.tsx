export function QrViewfinder() {
  return (
    <div className="relative w-[260px] h-[260px]">
      {/* Dark overlay corners */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        {/* Camera background */}
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          {/* Simulated camera feed - gray static */}
          <div className="w-full h-full opacity-30 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900" />
        </div>
      </div>

      {/* Scanning line */}
      <div className="absolute left-4 right-4 top-4 pointer-events-none scan-line">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80" />
      </div>

      {/* Corner brackets */}
      {/* Top-left */}
      <svg className="absolute top-0 left-0 corner-pulse" width="32" height="32" viewBox="0 0 32 32">
        <path d="M2 16 L2 2 L16 2" stroke="#3B82F6" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {/* Top-right */}
      <svg className="absolute top-0 right-0 corner-pulse" width="32" height="32" viewBox="0 0 32 32">
        <path d="M16 2 L30 2 L30 16" stroke="#3B82F6" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {/* Bottom-left */}
      <svg className="absolute bottom-0 left-0 corner-pulse" width="32" height="32" viewBox="0 0 32 32">
        <path d="M2 16 L2 30 L16 30" stroke="#3B82F6" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {/* Bottom-right */}
      <svg className="absolute bottom-0 right-0 corner-pulse" width="32" height="32" viewBox="0 0 32 32">
        <path d="M16 30 L30 30 L30 16" stroke="#3B82F6" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      {/* Center QR icon placeholder */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-20">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="2"/>
          <rect x="8" y="8" width="8" height="8" fill="white"/>
          <rect x="28" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="2"/>
          <rect x="32" y="8" width="8" height="8" fill="white"/>
          <rect x="4" y="28" width="16" height="16" rx="2" stroke="white" strokeWidth="2"/>
          <rect x="8" y="32" width="8" height="8" fill="white"/>
          <rect x="28" y="28" width="4" height="4" fill="white"/>
          <rect x="36" y="28" width="4" height="4" fill="white"/>
          <rect x="28" y="36" width="4" height="4" fill="white"/>
          <rect x="36" y="36" width="4" height="4" fill="white"/>
          <rect x="32" y="32" width="4" height="4" fill="white"/>
        </svg>
      </div>
    </div>
  );
}
