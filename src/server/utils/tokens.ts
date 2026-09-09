import crypto from 'crypto';

/** Used for one-shot links: email verification, password reset, org invites. */
export const generateRandomToken = (): string => crypto.randomBytes(32).toString('hex');
