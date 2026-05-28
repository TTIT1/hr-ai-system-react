export interface Holiday {
  id: number | string;
  name: string;
  holidayDate?: string;
  description?: string;
  paid?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HolidayRequest {
  name: string;
  holidayDate: string;
  description?: string;
  paid?: boolean;
}
