import { validateLoginInput } from '../validators/authValidator.js';
import { loginUser } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const login = async (req, res) => {
  const { isValid, errors } = validateLoginInput(req.body);
  if (!isValid) {
    return sendError(res, 'Validation Error', errors, 400);
  }

  const result = await loginUser(req.body);
  return sendSuccess(res, result, 'Login berhasil', 200);
};

export const logout = async (req, res) => {
  return sendSuccess(res, {}, 'Logout berhasil', 200);
};
