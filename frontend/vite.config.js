import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
})




// export default defineConfig({
//   plugins: [react(),tailwindcss()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://grad-project-hrms-production.up.railway.app', // تحط هنا لينك الباك إند بتاعك على ريلواي
//         changeOrigin: true,
//         secure: false, // السطر ده بيحل أي عقدة ليها علاقة بالـ HTTPS
//       }
//     }
//   }
// })
