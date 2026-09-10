import crypto from 'crypto';


export const generateRandomToken = (): string => crypto.randomBytes(32).toString('hex');
