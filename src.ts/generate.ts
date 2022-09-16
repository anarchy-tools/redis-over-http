import { sign } from 'jsonwebtoken';

export function generate(secret) {
  return sign({
    auth: true
  }, secret);
}

