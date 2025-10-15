export default function Bg() {
  return (
    <div className="-z-50 absolute left-0 top-0 w-full h-full">
       {/* 从上到下渐变背景 */}
       <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom,rgba(241, 235, 235, 0.57) 0%,rgba(245, 240, 237, 0.51) 30%,rgba(248, 244, 241, 0.43) 60%, transparent 100%)'
        }}
      />

     
    </div>
  );
}
