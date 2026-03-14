import { useEffect, useState } from 'react'

function App() {
  const [appPath, setAppPath] = useState<string>('')
  const [version, setVersion] = useState<string>('')

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getAppPath().then(setAppPath)
      window.electronAPI.getVersion().then(setVersion)
    }
  }, [])

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000', 
      color: '#fff',
      padding: '40px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>NOITN</h1>
      <p style={{ color: '#888', marginBottom: '24px' }}>
        Local-first block-based workspace with AI-generated widgets
      </p>
      
      <div style={{ 
        background: '#09090b', 
        border: '1px solid #1A1A1A', 
        borderRadius: '8px', 
        padding: '16px',
        maxWidth: '400px'
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>App Info</h2>
        {appPath && <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Data Path:</strong> {appPath}</p>}
        {version && <p style={{ fontSize: '13px' }}><strong>Version:</strong> {version}</p>}
      </div>

      <div style={{ marginTop: '24px', color: '#555', fontSize: '13px' }}>
        Electron + React + Vite setup complete!
      </div>
    </div>
  )
}

export default App