import { sendError } from '../utils/response.js';

const errorHandler = (err, req, res) => {
  console.error('[Error Handler]', err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || {};

  return sendError(res, message, errors, statusCode);
};

export default errorHandler;
