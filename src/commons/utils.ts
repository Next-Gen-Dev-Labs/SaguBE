import { isValidAddress } from 'ethereumjs-util';
import { Response } from 'express';

export function parseWalletAddress(val: string) {
  if (!val) return false;
  const valid = isValidAddress(val);

  if (!valid) return false;
  return true;
}

export function parseUsername(val: string) {
  if (!val) return false;
  return /^[a-z][a-z0-9]+$/.test(val);
}

export function apiResponse(params: {
  res: Response;
  status: number;
  message: string;
  data: any;
}) {
  const { res, status, message, data } = params;

  res.status(status).send({
    status: 'success',
    message,
    data: Array.isArray(data) ? data : [data],
  });
}

export function parseUrl(val: string) {
  if (!val) return false;
  try {
    new URL(val);
    return true;
  } catch (error) {
    return false;
  }
}

export function parseFacebook(val: string) {
  if (!val) return false;

  const hostname = new URL(val).hostname;

  return hostname.toLowerCase() === 'facebook.com' ||
    hostname.toLowerCase() === 'www.facebook.com'
    ? true
    : false;
}

export function parseTwitter(val: string) {
  if (!val) return false;

  const hostname = new URL(val).hostname;

  return hostname.toLowerCase() === 'twitter.com' ||
    hostname.toLowerCase() === 'www.twitter.com'
    ? true
    : false;
}

export function parseInstagram(val: string) {
  if (!val) return false;

  const hostname = new URL(val).hostname;

  return hostname.toLowerCase() === 'instagram.com' ||
    hostname.toLowerCase() === 'www.instagram.com'
    ? true
    : false;
}

export function parseLinkedin(val: string) {
  if (!val) return false;

  const hostname = new URL(val).hostname;

  return hostname.toLowerCase() === 'linkedin.com' ||
    hostname.toLowerCase() === 'www.linkedin.com'
    ? true
    : false;
}
