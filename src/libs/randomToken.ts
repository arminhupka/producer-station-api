import * as crypto from 'crypto';

export const randomToken = (length = 16) => {
  return crypto.randomBytes(length / 2).toString('hex');
};
