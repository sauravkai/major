const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
    this.expose = true;
  }
}

/** Reject non-string payloads so operator objects such as `{ $ne: null }` never reach a query. */
export const requireString = (value, field, { min = 1, max = 512 } = {}) => {
  if (typeof value !== 'string') throw new ValidationError(`${field} must be a string`);
  const trimmed = value.trim();
  if (trimmed.length < min) throw new ValidationError(`${field} must be at least ${min} characters`);
  if (trimmed.length > max) throw new ValidationError(`${field} must be at most ${max} characters`);
  return trimmed;
};

export const optionalString = (value, field, options) =>
  value === undefined || value === null || value === '' ? undefined : requireString(value, field, options);

export const requireEmail = (value) => {
  const email = requireString(value, 'email', { max: 254 }).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw new ValidationError('A valid email address is required');
  return email;
};

export const requirePassword = (value, field = 'password') => {
  const password = requireString(value, field, { min: 8, max: 128 });
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    throw new ValidationError(`${field} must contain at least one letter and one number`);
  }
  return password;
};

/** Roles a visitor may pick for themselves. `admin` is granted by an existing admin only. */
export const SELF_ASSIGNABLE_ROLES = ['candidate', 'interviewer'];
export const ALL_ROLES = ['candidate', 'interviewer', 'admin'];

export const requireSelfAssignableRole = (value) => {
  if (value === undefined || value === null || value === '') return 'candidate';
  if (!SELF_ASSIGNABLE_ROLES.includes(value)) {
    throw new ValidationError(`role must be one of: ${SELF_ASSIGNABLE_ROLES.join(', ')}`);
  }
  return value;
};

export const requireRole = (value) => {
  if (!ALL_ROLES.includes(value)) throw new ValidationError(`role must be one of: ${ALL_ROLES.join(', ')}`);
  return value;
};
