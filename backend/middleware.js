import { getCurrentLoggingDate } from './util.js';

export function loggingMiddleware(req, res, next) {
  if (process.env.LOGGING === 'true') {
    const formattedDate = getCurrentLoggingDate();
    console.log(`${formattedDate}: ${req.method} ${req.url} ${res.statusCode}`);
  }
  next();
}

export function configurationMiddleware(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
}
