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
