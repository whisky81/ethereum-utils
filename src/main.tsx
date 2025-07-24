import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Web3 from './providers/Web3.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3>
      <App />
    </Web3>
  </StrictMode>,
)
