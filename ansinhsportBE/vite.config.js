import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      BASE_PATH: process.env.VITE_BASE_PATH,
      NEXT_PUBLIC_BASE_URL: process.env.VITE_NEXT_PUBLIC_BASE_URL,
      ERP_API_URL: process.env.VITE_ERP_API_URL,
      HOST_API: process.env.VITE_HOST_API,
      HRM_API: process.env.VITE_HRM_API,
      CRM_API: process.env.VITE_CRM_API,
      IDENTITY_API: process.env.VITE_IDENTITY_API,
      CRM_API_IMAGE: process.env.VITE_CRM_API_IMAGE,
    },
  },
})
