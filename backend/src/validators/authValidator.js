export const validateLoginInput = (data) => {
  const errors = {};

  if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
    errors.email = 'Email wajib diisi';
  }

  if (!data.password || typeof data.password !== 'string' || !data.password.trim()) {
    errors.password = 'Password wajib diisi';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
