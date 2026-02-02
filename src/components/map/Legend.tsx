const Legend = () => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      zIndex: 1000,
      maxWidth: '280px'
    }}>
      <h4 style={{
        margin: '0 0 15px 0',
        fontSize: '16px',
        color: '#333',
        borderBottom: '2px solid #667eea',
        paddingBottom: '8px'
      }}>
         Legend
      </h4>

      {/* Infrastructure */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#555'
        }}>
          Infrastructure
        </div>

        {[
          { name: 'Bridge', color: '#FF6B6B' },
          { name: 'CULVERT', color: '#4ECDC4' },
          { name: 'RUB', color: '#45B7D1' },
          { name: 'ROB', color: '#FFA07A' }
        ].map(item => (
          <div
            key={item.name}
            style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}
          >
            <div style={{
              width: '24px',
              height: '16px',
              backgroundColor: item.color,
              marginRight: '10px',
              border: '1px solid #FFD93D',
              borderRadius: '3px'
            }} />
            <span style={{ fontSize: '13px' }}>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Railway Lines */}
      <div>
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#555'
        }}>
          Railway Lines
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{
            width: '24px',
            height: '4px',
            backgroundColor: '#00FFFF',
            marginRight: '10px',
            borderRadius: '2px'
          }} />
          <span style={{ fontSize: '13px' }}>Mainlines</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{
            width: '24px',
            height: '2px',
            backgroundColor: '#FFFFFF',
            marginRight: '10px',
            borderRadius: '2px'
          }} />
          <span style={{ fontSize: '13px' }}>Other Lines</span>
        </div>

        {/* Poles */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '4px',
            height: '20px',
            backgroundColor: '#8B4513',
            marginRight: '10px',
            marginLeft: '10px',
            borderRadius: '2px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '2px',
              left: '-8px',
              width: '20px',
              height: '2px',
              backgroundColor: '#654321'
            }} />
          </div>
          <span style={{ fontSize: '13px' }}>Poles / Stations</span>
        </div>
      </div>
    </div>
  )
}

export default Legend
