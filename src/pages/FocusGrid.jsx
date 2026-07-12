import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function FocusGrid() {
  const navigate = useNavigate();
  const [rotationSpeed, setRotationSpeed] = useState(20);
  const [gridSize, setGridSize] = useState(380);
  const [dotDistance, setDotDistance] = useState(150);
  const [centerMode, setCenterMode] = useState('animated');
  const [centerColor, setCenterColor] = useState('#4287f5');
  const [dot1Mode, setDot1Mode] = useState('static');
  const [dot1Color, setDot1Color] = useState('#ffd60a');
  const [dot2Mode, setDot2Mode] = useState('static');
  const [dot2Color, setDot2Color] = useState('#ffd60a');
  const [dot3Mode, setDot3Mode] = useState('static');
  const [dot3Color, setDot3Color] = useState('#ffd60a');

  const sceneSize = 500;
  const centerX = sceneSize / 2;
  const centerY = sceneSize / 2;
  const dotSize = 18;

  const getDotPosition = (angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      left: centerX + dotDistance * Math.cos(rad) - dotSize / 2,
      top: centerY + dotDistance * Math.sin(rad) - dotSize / 2,
    };
  };

  const dot1Pos = getDotPosition(270); // top
  const dot2Pos = getDotPosition(150); // bottom-left
  const dot3Pos = getDotPosition(30);  // bottom-right

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const getDotStyle = (mode, color, pos) => {
    const base = {
      position: 'absolute',
      width: `${dotSize}px`,
      height: `${dotSize}px`,
      borderRadius: '50%',
      zIndex: 10,
      transition: 'top 0.3s ease, left 0.3s ease',
      left: `${pos.left}px`,
      top: `${pos.top}px`,
    };
    if (mode === 'static') {
      return { ...base, background: color, boxShadow: `0 0 12px 4px ${hexToRgba(color, 0.5)}` };
    }
    return { ...base };
  };

  // Generate 15x15 grid cells
  const gridCells = Array.from({ length: 15 * 15 }, (_, i) => i);

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', overflow: 'hidden' }}>
      
      {/* Top Controls */}
      <div style={{
        display: 'flex', gap: '20px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '12px 20px',
        marginBottom: '16px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'rgba(255,255,255,0.5)' }}>Rotation Speed</label>
          <input type="range" min="1" max="60" value={rotationSpeed} onChange={(e) => setRotationSpeed(Number(e.target.value))}
            style={{ width: '100px', accentColor: '#ffd60a' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffd60a' }}>{rotationSpeed}s</span>
        </div>
        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'rgba(255,255,255,0.5)' }}>Grid Size</label>
          <input type="range" min="200" max="480" value={gridSize} onChange={(e) => setGridSize(Number(e.target.value))}
            style={{ width: '100px', accentColor: '#ffd60a' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffd60a' }}>{gridSize}px</span>
        </div>
        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'rgba(255,255,255,0.5)' }}>Dot Distance</label>
          <input type="range" min="20" max="220" value={dotDistance} onChange={(e) => setDotDistance(Number(e.target.value))}
            style={{ width: '100px', accentColor: '#ffd60a' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffd60a' }}>{dotDistance}px</span>
        </div>
      </div>

      {/* Scene */}
      <div style={{ position: 'relative', width: `${sceneSize}px`, height: `${sceneSize}px` }}>
        {/* Rotating Grid */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: `${gridSize}px`, height: `${gridSize}px`,
          overflow: 'hidden',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          animation: `focusGridRotate ${rotationSpeed}s linear infinite`,
          transition: 'width 0.4s ease, height 0.4s ease',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(15, 30px)', gridTemplateRows: 'repeat(15, 30px)', gap: '2px'
          }}>
            {gridCells.map((i) => (
              <div key={i} style={{ width: '30px', height: '30px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', width: '16px', height: '3px', background: '#e63946', borderRadius: '1px', transform: 'rotate(45deg)' }} />
                <div style={{ position: 'absolute', width: '16px', height: '3px', background: '#e63946', borderRadius: '1px', transform: 'rotate(-45deg)' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Center Dot */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', width: '20px', height: '20px',
          borderRadius: '50%', transform: 'translate(-50%, -50%)', zIndex: 10,
          ...(centerMode === 'static'
            ? { background: centerColor, boxShadow: `0 0 14px 4px ${hexToRgba(centerColor, 0.6)}` }
            : {}),
          animation: centerMode === 'animated' ? 'focusDotColorShift 3s ease-in-out infinite' : 'none',
        }} />

        {/* Dot 1 - Top */}
        <div className={dot1Mode === 'animated' ? 'focus-dot-animated' : ''} style={getDotStyle(dot1Mode, dot1Color, dot1Pos)} />
        {/* Dot 2 - Left */}
        <div className={dot2Mode === 'animated' ? 'focus-dot-animated' : ''} style={getDotStyle(dot2Mode, dot2Color, dot2Pos)} />
        {/* Dot 3 - Right */}
        <div className={dot3Mode === 'animated' ? 'focus-dot-animated' : ''} style={getDotStyle(dot3Mode, dot3Color, dot3Pos)} />
      </div>

      {/* Bottom Dot Controls */}
      <div style={{
        display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '12px 18px',
        marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'
      }}>
        {/* Center config */}
        <DotConfig label="Center" mode={centerMode} setMode={setCenterMode} color={centerColor} setColor={setCenterColor} />
        <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.12)' }} />
        <DotConfig label="Top" mode={dot1Mode} setMode={setDot1Mode} color={dot1Color} setColor={setDot1Color} />
        <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.12)' }} />
        <DotConfig label="Left" mode={dot2Mode} setMode={setDot2Mode} color={dot2Color} setColor={setDot2Color} />
        <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.12)' }} />
        <DotConfig label="Right" mode={dot3Mode} setMode={setDot3Mode} color={dot3Color} setColor={setDot3Color} />
      </div>

      {/* Instructions */}
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '14px', textAlign: 'center', maxWidth: '500px' }}>
        💡 Focus your eyes ONLY on the center dot. Use peripheral vision to notice the outer dots and the rotating grid. This trains focus, peripheral awareness, and visual stability.
      </p>

      {/* Back button */}
      <button onClick={() => navigate('/')} style={{
        marginTop: '14px', padding: '10px 28px', borderRadius: '25px',
        border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)',
        color: 'white', fontFamily: 'Montserrat', fontWeight: 600, fontSize: '13px', cursor: 'pointer'
      }}>
        ← Back to Home
      </button>

      {/* Keyframe styles */}
      <style>{`
        @keyframes focusGridRotate {
          from { transform: translate(-50%, -50%) rotate(45deg); }
          to { transform: translate(-50%, -50%) rotate(405deg); }
        }
        @keyframes focusDotColorShift {
          0%   { background: #4287f5; box-shadow: 0 0 14px 4px rgba(66,135,245,0.6); }
          20%  { background: #42f5a7; box-shadow: 0 0 14px 4px rgba(66,245,167,0.6); }
          40%  { background: #f542e6; box-shadow: 0 0 14px 4px rgba(245,66,230,0.6); }
          60%  { background: #f5a442; box-shadow: 0 0 14px 4px rgba(245,164,66,0.6); }
          80%  { background: #42c5f5; box-shadow: 0 0 14px 4px rgba(66,197,245,0.6); }
          100% { background: #4287f5; box-shadow: 0 0 14px 4px rgba(66,135,245,0.6); }
        }
        .focus-dot-animated {
          animation: focusDotColorShift 3s ease-in-out infinite !important;
        }
      `}</style>
    </div>
  );
}

function DotConfig({ label, mode, setMode, color, setColor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '80px' }}>
      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }}>{label}</span>
      <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
        <button onClick={() => setMode('static')} style={{
          background: mode === 'static' ? 'rgba(255,214,10,0.2)' : 'rgba(255,255,255,0.05)',
          color: mode === 'static' ? '#ffd60a' : 'rgba(255,255,255,0.4)',
          border: 'none', padding: '3px 8px', fontSize: '9px', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>Static</button>
        <button onClick={() => setMode('animated')} style={{
          background: mode === 'animated' ? 'rgba(255,214,10,0.2)' : 'rgba(255,255,255,0.05)',
          color: mode === 'animated' ? '#ffd60a' : 'rgba(255,255,255,0.4)',
          border: 'none', padding: '3px 8px', fontSize: '9px', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>Animate</button>
      </div>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        disabled={mode === 'animated'}
        style={{
          width: '28px', height: '28px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)',
          cursor: mode === 'static' ? 'pointer' : 'not-allowed', opacity: mode === 'static' ? 1 : 0.3
        }}
      />
    </div>
  );
}

export default FocusGrid;
