export default function Bg() {
  return (
    <div className="-z-50 absolute left-0 top-0 w-full h-full">
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
