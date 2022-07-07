import { isValidAddress } from 'ethereumjs-util';
import { Response } from 'express';

export function parseWalletAddress(val: string) {
  if (!val) return false;
  const valid = isValidAddress(val);

  if (!valid) return false;
  return true;
}

export function parsePassword(val: string) {
  if (!val) return false;
  const valid =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/.test(
      val
    );

  if (!valid) return false;
  return true;
}

export function parseUsername(val: string) {
  if (!val) return false;
  const valid = val.split('').includes(' ');

  if (valid) return false;
  return true;
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
