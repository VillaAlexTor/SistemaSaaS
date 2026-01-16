import React, { useState, useEffect } from 'react';

function SimpleCaptcha({ onValidate }) {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Generar código aleatorio
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Generar captcha al montar el componente
  useEffect(() => {
    setCaptchaText(generateCaptcha());
  }, []);

  // Validar cuando el usuario escribe
  useEffect(() => {
    const valid = userInput.toUpperCase() === captchaText;
    setIsValid(valid);
    if (onValidate) {
      onValidate(valid);
    }
  }, [userInput, captchaText, onValidate]);

  // Recargar captcha
  const reloadCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setUserInput('');
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        color: '#fff', 
        fontWeight: 'bold',
        fontSize: '14px'
      }}>
        Código de Seguridad *
      </label>
      
      {/* Canvas con el captcha */}
      <div style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '15px 20px',
          borderRadius: '8px',
          border: '2px solid #444',
          fontFamily: 'monospace',
          fontSize: '28px',
          fontWeight: 'bold',
          letterSpacing: '8px',
          color: '#ff9800',
          textDecoration: 'line-through',
          textDecorationColor: '#666',
          userSelect: 'none',
          position: 'relative',
          overflow: 'hidden',
          minWidth: '200px',
          textAlign: 'center'
        }}>
          {captchaText.split('').map((char, i) => (
            <span 
              key={i}
              style={{
                display: 'inline-block',
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
                color: i % 2 === 0 ? '#ff9800' : '#ffb74d'
              }}
            >
              {char}
            </span>
          ))}
          
          {/* Líneas de ruido */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, transparent 48%, #666 49%, #666 51%, transparent 52%)`,
            pointerEvents: 'none'
          }} />
        </div>

        {/* Botón recargar */}
        <button
          type="button"
          onClick={reloadCaptcha}
          style={{
            padding: '10px 15px',
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '20px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#555'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#444'}
          title="Generar nuevo código"
        >
          🔄
        </button>
      </div>

      {/* Input para escribir */}
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value.toUpperCase())}
        placeholder="Escribe el código de arriba"
        maxLength={6}
        style={{
          width: '100%',
          padding: '12px',
          border: `2px solid ${userInput ? (isValid ? '#4caf50' : '#f44336') : '#444'}`,
          borderRadius: '8px',
          fontSize: '16px',
          backgroundColor: '#1a1a1a',
          color: '#fff',
          letterSpacing: '4px',
          textAlign: 'center',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      />

      {/* Indicador visual */}
      {userInput && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          borderRadius: '5px',
          backgroundColor: isValid ? '#1b4d1b' : '#4d1f1f',
          color: isValid ? '#4caf50' : '#ff6b6b',
          fontSize: '13px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {isValid ? '✅ Código correcto' : '❌ Código incorrecto'}
        </div>
      )}
    </div>
  );
}

export default SimpleCaptcha;