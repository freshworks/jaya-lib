export type DateInput = Date | number;

export type Holidays = {
  [key: string]: string;
}[];

export interface PlaceholdersMap {
  [key: string]: string | unknown;
}

export interface BusinessHour {
  appId: number;
  days: {
    [key: string]: string;
  };
  defaultBhr: boolean;
  enabled: boolean;
  holidays?: Holidays;
  name: string;
  operatingHoursId: number;
  timezone: string;
  working: {
    [key: string]: string;
  };
  workingDaily: boolean;
}
