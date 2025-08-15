export default function Bg() {
  return (
    <div className="-z-50 absolute left-0 top-0 w-full h-full">
      {/* 主渐变背景 */}
      <div 
        className="w-full h-full"
        style={{
          background: 'linear-gradient(90deg, #f3e8ff 0%, #fef3c7 50%, #fed7aa 100%)',
          filter: 'blur(0.5px)',
        }}
      />
      
      {/* 纹理叠加层 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 90% 90%, rgba(255, 219, 120, 0.3) 0%, transparent 50%)
          `,
          filter: 'blur(1px)',
        }}
      />
      
      {/* 额外的晕染效果 */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 800px 400px at 30% 40%, rgba(147, 51, 234, 0.1) 0%, transparent 70%),
            radial-gradient(ellipse 600px 300px at 70% 60%, rgba(251, 146, 60, 0.1) 0%, transparent 70%),
            radial-gradient(ellipse 500px 250px at 20% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 70%)
          `,
          filter: 'blur(2px)',
        }}
      />
      
      {/* 细微的噪点纹理 */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            repeating-radial-gradient(circle at 0 0, transparent 0, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
    </div>
  );
}
