import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

// Simula __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega .env
dotenv.config({ path: `.env.${process.env.NODE_ENV||'development'}` });

const app = express();
const PORT = process.env.PORT||8080;
const isProd = process.env.NODE_ENV==='production';

console.log('[Express] CAMERAKIT_API_TOKEN:', !!process.env.CAMERAKIT_API_TOKEN);

// CORS/Helmet
if (isProd) {
  app.use(helmet({
    contentSecurityPolicy:{ directives:{
      defaultSrc:["'self'"],
      connectSrc:["'self'",'https://camera-kit-api.snapar.com','https://cf-st.sc-cdn.net','https://*.snapchat.com','https://bolt-gcdn.sc-cdn.net',`http://localhost:${PORT}`],
      scriptSrc:["'self'","'unsafe-eval'",'blob:','https://cf-st.sc-cdn.net'],
      styleSrc:["'self'","'unsafe-inline'",'https://cdnjs.cloudflare.com','https://fonts.googleapis.com'],
      imgSrc:["'self'",'data:','blob:','https://*.sc-cdn.net'],
      fontSrc:["'self'",'data:','https://fonts.gstatic.com','https://cdnjs.cloudflare.com','https://bolt-gcdn.sc-cdn.net'],
      workerSrc:["'self'",'blob:'],
      objectSrc:["'none'"]
    }}
  }));
  app.use(cors({ origin:true, credentials:true }));
} else {
  app.use(cors());
}

// Proxy para Snap API
app.use('/api/camera-kit', createProxyMiddleware({
  target:'https://camera-kit-api.snapar.com',
  changeOrigin:true,
  pathRewrite:{ '^/api/camera-kit':'' },
  onProxyReq(proxyReq, req){
    console.log('[Express] proxy', req.method, req.url);
    proxyReq.setHeader('Authorization', `Bearer ${process.env.CAMERAKIT_API_TOKEN}`);
  }
}));

// Serve front-end (build output)
app.use(express.static(path.join(__dirname,'../dist')));

// Rotas HTML
app.get(['/', '/index.html'], (_,res)=>{
  res.sendFile(path.join(__dirname,'../dist/views/index.html'));
});
app.get('/snap-lens.html', (_,res)=>{
  res.sendFile(path.join(__dirname,'../dist/views/snap-lens.html'));
});

// Start
app.listen(PORT,'0.0.0.0',()=>{
  console.log(`[Express] Listening at http://localhost:${PORT}`);
  const ip = Object.values(os.networkInterfaces()).flat()
    .find(i=>i.family==='IPv4'&&!i.internal)?.address||'localhost';
  console.log(`[Express] Network at http://${ip}:${PORT}`);
});
