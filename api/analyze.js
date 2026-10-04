import app from '../backend/dist/app.js';

export default function handler(req, res) {
  // If internal service binding is active in Vercel Services, forward to it
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

      return fetch(targetUrl, fetchOptions)
        .then(async (response) => {
          res.status(response.status);
          response.headers.forEach((val, key) => res.setHeader(key, val));
          const data = await response.text();
          return res.send(data);
        })
        .catch((err) => {
          console.warn('BACKEND_URL unreachable, executing local app handler:', err.message);
          return app(req, res);
        });
    } catch {
      // Fall through to local app handler
    }
  }

  // Execute Express app in-memory
  return app(req, res);
}
