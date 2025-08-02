import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n.js' // Import i18n initialization
import { StyleSheetManager } from 'styled-components'

createRoot(document.getElementById("root")!).render(
  <StyleSheetManager shouldForwardProp={(prop) => prop !== 'theme'}>
    <App />
  </StyleSheetManager>
);
