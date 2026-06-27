import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createDolphinServer } from 'dolphin-server-modules/server';
import templateRoutes from './routes/templateRoutes.js';

dotenv.config();

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dolphincss-templates';

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB successfully.'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

const app = createDolphinServer({ port: Number(port) });

// Add CORS headers middleware and Request logging
app.use((ctx, next) => {
  console.log(`[${ctx.req.method}] ${ctx.req.url}`);
  
  ctx.setHeader('Access-Control-Allow-Origin', '*');
  ctx.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  ctx.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (ctx.req.method === 'OPTIONS') {
    return ctx.status(204).json({});
  }
  next();
});

// Register template routes under /api/templates
app.use('/api/templates', templateRoutes);

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDir = path.resolve(__dirname, '..');

// Helper to serve file safely
const serveFile = (ctx, fileName, contentType) => {
  try {
    const filePath = path.join(templateDir, fileName);
    const content = fs.readFileSync(filePath, 'utf8');
    if (contentType) {
      ctx.setHeader('Content-Type', contentType);
    }
    return contentType === 'text/html' ? ctx.html(content) : ctx.text(content);
  } catch (err) {
    return ctx.status(500).json({ error: `Failed to read ${fileName}: ${err.message}` });
  }
};

app.get('/', (ctx) => serveFile(ctx, 'index.html', 'text/html'));
app.get('/index', (ctx) => serveFile(ctx, 'index.html', 'text/html'));
app.get('/index.html', (ctx) => serveFile(ctx, 'index.html', 'text/html'));

app.get('/view', (ctx) => serveFile(ctx, 'view.html', 'text/html'));
app.get('/view.html', (ctx) => serveFile(ctx, 'view.html', 'text/html'));

app.get('/push', (ctx) => serveFile(ctx, 'push.html', 'text/html'));
app.get('/push.html', (ctx) => serveFile(ctx, 'push.html', 'text/html'));

app.get('/dashboard', (ctx) => serveFile(ctx, 'dashboard.html', 'text/html'));
app.get('/dashboard.html', (ctx) => serveFile(ctx, 'dashboard.html', 'text/html'));

// Redirect /view/:name to /view?name=:name
app.get('/view/:name', (ctx) => {
  const { name } = ctx.params;
  ctx.setHeader('Location', `/view?name=${encodeURIComponent(name)}`);
  return ctx.status(302).html('');
});

app.get('/dolphin-client.min.js', (ctx) => {
  try {
    const filePath = path.join(templateDir, 'dolphin-client.min.js');
    const js = fs.readFileSync(filePath, 'utf8');
    ctx.setHeader('Content-Type', 'application/javascript');
    ctx.res.setHeader('Content-Type', 'application/javascript');
    ctx.res.end(js);
  } catch (err) {
    return ctx.status(500).json({ error: 'Failed to read dolphin-client.min.js: ' + err.message });
  }
});

app.get('/dolphin-css.min.css', (ctx) => {
  try {
    const filePath = path.join(templateDir, 'dolphin-css.min.css');
    const css = fs.readFileSync(filePath, 'utf8');
    ctx.res.setHeader('Content-Type', 'text/css');
    ctx.res.end(css);
  } catch (err) {
    return ctx.status(500).json({ error: 'Failed to read dolphin-css.min.css: ' + err.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🐬 Dolphin UI Component Bank API running at http://localhost:${port}`);
  console.log('==================================================================');
});
