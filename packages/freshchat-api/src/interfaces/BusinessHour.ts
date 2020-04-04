export interface BusinessHour {
  timezone: string;
  days?: {
    [key: string]: string;
  },
  working?: {
    [key: string]: boolean;
  },
  enabled: boolean;
  appId: number;
  operatingHoursId: number;
  created: string;
  workingDaily: boolean;
  name: string;
  defaultBhr: boolean;
  isCalendarLinked: boolean;
}