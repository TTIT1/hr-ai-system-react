import type { UserInfoResponse } from '../types/auth.type';

type TokenPayload = Record<string, unknown>;

const TOKEN_EMPLOYEE_ID_KEYS = ['employeeid', 'idemployee', 'employee_id', 'employeeId', 'empId'] as const;
const USER_EMPLOYEE_ID_KEYS = ['employeeid', 'idemployee', 'employee_id', 'employeeId', 'empId'] as const;

function toEmployeeId(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
}

function decodeTokenPayload(accessToken: string | null | undefined): TokenPayload | null {
  if (!accessToken) return null;

  const payloadPart = accessToken.split('.')[1];
  if (!payloadPart) return null;

  try {
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(atob(padded)) as TokenPayload;
  } catch {
    return null;
  }
}

export function getEmployeeCodeFromAuth(
  user: Partial<UserInfoResponse> | null | undefined,
  accessToken: string | null | undefined,
): string | null {
  const userRecord = user as TokenPayload | null | undefined;
  const payload = decodeTokenPayload(accessToken);

  for (const key of TOKEN_EMPLOYEE_ID_KEYS) {
    const employeeId = toEmployeeId(payload?.[key]);
    if (employeeId) return employeeId;
  }

  for (const key of USER_EMPLOYEE_ID_KEYS) {
    const employeeId = toEmployeeId(userRecord?.[key]);
    if (employeeId) return employeeId;
  }

  return null;
}

export function getEmployeeRecordIdFromAuth(
  user: Partial<UserInfoResponse> | null | undefined,
  accessToken: string | null | undefined,
): string | null {
  const payload = decodeTokenPayload(accessToken);
  const subject = toEmployeeId(payload?.sub);
  if (subject) return subject;

  return toEmployeeId(user?.employeeId);
}
