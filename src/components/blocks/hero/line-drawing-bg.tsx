export default function LineDrawingBg() {
  return (
    <div className="absolute left-0 top-0 w-full h-full -z-10">
      {/* Simple gradient background */}
      <div 
        className="w-full h-full bg-gradient-to-b from-gray-100 via-gray-50 to-indigo-0"
      />
      
      {/* Simple line drawing patterns */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(71, 85, 105, 0.2) 1px, transparent 1px),
            linear-gradient(0deg, rgba(71, 85, 105, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Subtle diagonal lines */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 30px,
              rgba(71, 85, 105, 0.15) 30px,
              rgba(71, 85, 105, 0.15) 32px
            )
          `,
        }}
      />
      
      {/* Minimal geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-slate-300/40 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-2 border-slate-300/30 rotate-45"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border-2 border-slate-300/35"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 border-2 border-slate-300/30 rounded-full"></div>
        
        {/* Additional line elements */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sketch-lines" patternUnits="userSpaceOnUse" width="200" height="200">
              <path d="M20,20 Q50,10 80,20 T140,20" stroke="rgba(71, 85, 105, 0.1)" strokeWidth="1" fill="none"/>
              <path d="M20,60 L180,60" stroke="rgba(71, 85, 105, 0.08)" strokeWidth="1" fill="none"/>
              <path d="M20,100 Q100,80 180,100" stroke="rgba(71, 85, 105, 0.1)" strokeWidth="1" fill="none"/>
              <circle cx="50" cy="150" r="15" stroke="rgba(71, 85, 105, 0.08)" strokeWidth="1" fill="none"/>
              <rect x="120" y="140" width="20" height="20" stroke="rgba(71, 85, 105, 0.08)" strokeWidth="1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sketch-lines)" opacity="0.6"/>
        </svg>
      </div>
    </div>
  );
}
