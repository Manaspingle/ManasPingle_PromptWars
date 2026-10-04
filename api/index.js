import app from '../backend/dist/app.js';

export default async function handler(req, res) {
  // If the internal service binding BACKEND_URL is injected by Vercel, forward to the bound service
  if (process.env.BACKEND_URL) {
    try {
      const targetUrl = new URL(req.url, process.env.BACKEND_URL);
      const headers = { ...req.headers };
      delete headers.host;

      const fetchOptions = {
        method: req.method,
        headers,
      };

      if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
        fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, fetchOptions);
      res.status(response.status);
      response.headers.forEach((val, key) => res.setHeader(key, val));
      const data = await response.text();
      return res.send(data);
    } catch (err) {
      console.error('Error forwarding to bound BACKEND_URL service:', err);
    }
  }

  // Fallback direct execution of Express app
  return app(req, res);
}
