export default function Bg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 1080"
      fill="none"
      className="-z-50 absolute left-0 top-0 hidden opacity-80 [mask-image:linear-gradient(to_right,white,transparent,transparent,white)] lg:block"
    >
      <g clipPath="url(#clip0_4_5)">
        <rect width="1920" height="1080" />
        
        {/* Watercolor splash shapes */}
        <path
          d="M120 320 Q 280 180, 450 220 T 680 380 Q 720 480, 650 580 T 480 680 Q 320 720, 220 620 T 120 320"
          fill="currentColor"
          className="fill-blue-200/30"
        />
        
        <path
          d="M1320 180 Q 1480 120, 1620 200 T 1780 400 Q 1820 500, 1720 580 T 1520 640 Q 1380 660, 1280 560 T 1320 180"
          fill="currentColor"
          className="fill-purple-200/30"
        />
        
        <path
          d="M620 620 Q 780 580, 920 640 T 1080 820 Q 1120 900, 1040 960 T 860 1000 Q 720 1020, 640 940 T 620 620"
          fill="currentColor"
          className="fill-pink-200/30"
        />
        
        {/* Minimal line doodles */}
        <path
          d="M1400 700 Q 1420 680, 1450 690 T 1480 720 Q 1490 750, 1470 780 T 1430 800 Q 1400 810, 1380 790 T 1400 700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="stroke-muted-foreground/50"
        />
        
        <path
          d="M280 820 Q 320 800, 360 820 T 400 860 Q 410 890, 390 910 T 350 920 Q 310 915, 290 890 T 280 820"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="stroke-muted-foreground/50"
        />
        
        {/* Soft curves */}
        <path
          d="M50 540 Q 200 520, 350 540 T 650 560"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="stroke-muted-foreground/30"
        />
        
        <path
          d="M1270 540 Q 1420 560, 1570 540 T 1870 520"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="stroke-muted-foreground/30"
        />
        
        {/* Drawing pencil marks */}
        <line
          x1="180"
          y1="150"
          x2="220"
          y2="180"
          stroke="currentColor"
          strokeWidth="1"
          className="stroke-muted-foreground/40"
        />
        
        <line
          x1="1700"
          y1="250"
          x2="1740"
          y2="280"
          stroke="currentColor"
          strokeWidth="1"
          className="stroke-muted-foreground/40"
        />
        
        <line
          x1="900"
          y1="950"
          x2="940"
          y2="980"
          stroke="currentColor"
          strokeWidth="1"
          className="stroke-muted-foreground/40"
        />
        
        {/* Small dots */}
        <circle cx="380" cy="480" r="3" fill="currentColor" className="fill-muted-foreground/40" />
        <circle cx="1520" cy="380" r="3" fill="currentColor" className="fill-muted-foreground/40" />
        <circle cx="880" cy="780" r="3" fill="currentColor" className="fill-muted-foreground/40" />
        <circle cx="1180" cy="180" r="3" fill="currentColor" className="fill-muted-foreground/40" />
      </g>
      
      <defs>
        <clipPath id="clip0_4_5">
          <rect width="1920" height="1080" fill="#000000" />
        </clipPath>
      </defs>
    </svg>
  );
}
