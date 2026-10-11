import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCb);
export const hashToken = (token) => createHash('sha256').update(token).digest('hex');
export const newToken = () => randomBytes(32).toString('base64url');
export async function passwordHash(password, salt = randomBytes(16).toString('hex')) {
 const digest = await scrypt(password, Buffer.from(salt,'hex'), 64);
 return { salt, hash: digest.toString('hex') };
}
export async function verifyPassword(password, salt, hash) {
 const result = await passwordHash(password, salt);
 const a = Buffer.from(result.hash,'hex'), b = Buffer.from(hash,'hex');
 return a.length === b.length && timingSafeEqual(a,b);
}
export function validIdentity(email, password) {
 return typeof email === 'string' && /^[^\s@]{1,64}@[^\s@]{1,200}\.[^\s@]{2,20}$/.test(email) &&
 typeof password === 'string' && password.length >= 12 && Buffer.byteLength(password) <= 256;
}
export function parseCookies(raw = '') {
 return Object.fromEntries(raw.split(';').map(v => v.trim().split(/=(.*)/s).slice(0,2)).filter(([key,val])=>key && val));
}
export function clientAction(action) {
 return ['create','fight','turn','rest','gather','use','equip','claim','bag'].includes(action);
}
