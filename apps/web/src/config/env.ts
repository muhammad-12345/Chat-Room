interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_STUN_SERVERS?: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_VERSION?: string
  readonly VITE_NODE_ENV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  wsUrl: import.meta.env.VITE_WS_URL || 'http://localhost:3001',
  
  // WebRTC Configuration
  stunServers: (import.meta.env.VITE_STUN_SERVERS || 'stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302')
    .split(',')
    .map(url => ({ urls: url.trim() })),
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Chat Room',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
}

export default config
