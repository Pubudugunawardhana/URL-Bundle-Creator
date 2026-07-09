export default function Footer() {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--card-border)', 
      marginTop: 'auto', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Grid Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(var(--card-border) 1px, transparent 1px), linear-gradient(90deg, var(--card-border) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        opacity: 0.15,
        zIndex: -1,
        maskImage: 'linear-gradient(to bottom, transparent, black)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)'
      }}></div>
      
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1rem',
        padding: '2rem 1rem'
      }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          &copy; 2026 URL Bundle Creator. All rights reserved.
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Developed by <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Pubudu Gunawardhana</span>
        </div>
      </div>
    </footer>
  );
}
