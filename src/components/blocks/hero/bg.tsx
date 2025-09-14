export default function Bg() {
  return (
    <div className="-z-50 absolute left-0 top-0 w-full h-full">
       {/* 从上到下渐变背景 */}
       <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #f1edeb 0%, #f5f0ed 30%, #f8f4f1 60%, transparent 100%)'
        }}
      />

      
      {/* container for background image */}
      <div className="container mx-auto h-full relative p-24">
        <div 
          className="w-full h-full opacity-10"
          style={{
            backgroundImage: 'url(/imgs/bg/bg.webp)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
     
    </div>
  );
}
