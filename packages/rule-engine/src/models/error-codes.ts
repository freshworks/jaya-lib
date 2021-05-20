export enum ErrorCodes {
  DynamicPlaceholder = 'DYNAMIC_PLACEHOLDER_ERROR',
  FreshdeskTicket = 'FRESHDESK_TICKET_CREATE_ERROR',
  KairosError = 'KAIROS_ERROR',
  SendEmail = 'SEND_EMAIL_ERROR',
  TriggerAPI = 'TRIGGER_API_ERROR',
}

export enum ErrorTypes {
  KairosBulkCreateSchedules = 'BULK_CREATE_SCHEDULES_ERROR',
  KairosCreteScheduleToInvalidateIntelliAssign = 'CREATE_SCHEDULE_INVALIDATE_INTELLIASSIGN',
  KairosDeleteCompletedSchedule = 'DELETE_COMPLETED_SCHEDULE_ERROR',
  KairosDeleteInvalidatedSchedules = 'DELETE_INVALIDATED_SCHEDULES_ERROR',
  KairosFetchExistingSchedule = 'FETCH_EXISTING_SCHEDULE_ERROR',
}
