import { OAuth2Client } from 'google-auth-library';
import { config } from '../config/env.js';
import { ValidationError } from '../utils/validation.js';

let client;

const getClient = () => {
  if (!client) client = new OAuth2Client(config.googleClientId);
  return client;
};

/**
 * Validate a Google Identity Services ID token against this deployment's client id
 * and return the verified profile claims.
 */
export const verifyGoogleIdToken = async (idToken) => {
  let ticket;
  try {
    ticket = await getClient().verifyIdToken({ idToken, audience: config.googleClientId });
  } catch {
    throw new ValidationError('Google sign-in token could not be verified');
  }

  const payload = ticket.getPayload();
  if (!payload?.email) throw new ValidationError('Google account did not provide an email address');
  if (payload.email_verified === false) throw new ValidationError('Google account email is not verified');

  return {
    email: payload.email.toLowerCase(),
    name: payload.name,
    picture: payload.picture,
    subject: payload.sub,
  };
};
