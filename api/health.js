export default function handler(_req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'ThinkLens Reasoning Audit Backend (Vercel Serverless)',
    timestamp: new Date().toISOString(),
  });
}
