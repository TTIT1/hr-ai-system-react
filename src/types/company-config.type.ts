export interface CompanyWorkPolicy {
  workingDays: number[];
  workingTime: {
    checkIn: string;
    checkOut: string;
    allowedEarlyCheckInMinutes: number;
  };
  lunchBreak: {
    start: string;
    end: string;
    durationMinutes: number;
  };
  halfDayCoefficient: {
    morning: number;
    afternoon: number;
  };
  overtimeCoefficient: {
    workingDay: number;
    dayOff: number;
    officialHoliday: number;
    compensatoryHoliday: number;
  };
  monthlyAttendanceClosingDay: number;
  standardWorkingDaysPerMonth: number;
  updatedBy?: string;
  updatedAt?: string;
}

export type CompanyWorkPolicyRequest = Omit<CompanyWorkPolicy, 'updatedBy' | 'updatedAt'>;
