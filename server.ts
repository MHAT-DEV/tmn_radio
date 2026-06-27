import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse json body
  app.use(express.json());

  // API proxy routes to bypass CORS for radio.sotyai.com
  app.all("/api/*all", async (req, res) => {
    try {
      const targetUrl = `https://radio.sotyai.com${req.originalUrl}`;
      
      const headers: Record<string, string> = {};
      
      // Copy over essential headers if present
      if (req.headers['x-api-key']) {
        headers['X-API-Key'] = req.headers['x-api-key'] as string;
      }
      if (req.headers['content-type']) {
        headers['Content-Type'] = req.headers['content-type'] as string;
      }
      
      // Copy over real User-Agent from client or fallback to a standard desktop browser UA
      headers['User-Agent'] = (req.headers['user-agent'] as string) || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      
      // Pass client IP via X-Forwarded-For to avoid being classified as a centralized crawler/bot
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      if (clientIp) {
        headers['X-Forwarded-For'] = Array.isArray(clientIp) ? clientIp.join(', ') : clientIp as string;
      }

      headers['Accept'] = 'application/json';

      const options: RequestInit = {
        method: req.method,
        headers,
      };

      if (req.method !== 'GET' && req.method !== 'HEAD' && req.body && Object.keys(req.body).length > 0) {
        options.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, options);
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { message: "Raw text response or empty" };
      }
      
      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: "Failed to fetch station details through server proxy", details: error?.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
