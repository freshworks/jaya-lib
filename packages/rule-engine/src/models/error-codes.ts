import { JsonMap } from './rule';

export enum ErrorCodes {
  DynamicPlaceholder = 'DYNAMIC_PLACEHOLDER_ERROR',
  EmailTrace = 'EMAIL_TRACE',
  FreshchatAction = 'FRESHCHAT_ACTION_ERROR',
  FreshchatPlaceholder = 'FRESHCHAT_PLACEHOLDER_ERROR',
  FreshdeskTicket = 'FRESHDESK_TICKET_CREATE_ERROR',
  INVALIDATE_TIMER_ERROR = 'INVALIDATE_TIMER_ERROR',
  KairosError = 'KAIROS_ERROR',
  PROCESS_EXTERNAL_EVENT_ERROR = 'PROCESS_EXTERNAL_EVENT_ERROR',
  SendEmail = 'SEND_EMAIL_ERROR',
  TriggerAPIError = 'TRIGGER_API_ERROR',
  TriggerAPITrace = 'TRIGGER_API_TRACE',
}

export enum APITraceCodes {
  CREATE_SCHEDULE_SUCCESS = 'CREATE_SCHEDULE_SUCCESS',
  DELAY_SCHEDULE_CREATION = 'DELAY_SCHEDULE_CREATION',
  EXECUTE_SCHEDULE_SUCCESS = 'EXECUTE_SCHEDULE_SUCCESS',
  INVALIDATE_SCHEDULE_SUCCESS = 'INVALIDATE_SCHEDULE_SUCCESS',
}

export enum ErrorTypes {
  FreshchatAssignAgent = 'FRESHCHAT_ASSIGN_AGENT_ERROR',
  FreshchatAssignGroup = 'FRESHCHAT_ASSIGN_GROUP_ERROR',
  FreshchatReopenConversation = 'FRESHCHAT_REOPEN_CONVERSATION_ERROR',
  FreshchatResolveConversation = 'FRESHCHAT_RESOLVE_CONVERSATION_ERROR',
  FreshchatSendMessage = 'FRESHCHAT_SEND_MESSAGE_ERROR',
  FreshchatSendPrivateNote = 'FRESHCHAT_SEND_PRIVATE_NOTE_ERROR',
  FreshchatSendQuickReply = 'FRESHCHAT_SEND_QUICK_REPLY_ERROR',
  FreshchatUnassignThenReassign = 'FRESHCHAT_UNASSIGN_THEN_REASSIGN_ERROR',
  FreshchatUpdateEmail = 'FRESHCHAT_UPDATE_EMAIL_ERROR',
  FreshchatUpdateFirstName = 'FRESHCHAT_UPDATE_FIRST_NAME_ERROR',
  FreshchatUpdateLastName = 'FRESHCHAT_UPDATE_LAST_NAME_ERROR',
  FreshchatUpdatePhone = 'FRESHCHAT_UPDATE_PHONE_ERROR',
  FreshchatUpdateProperty = 'FRESHCHAT_UPDATE_PROPERTY_ERROR',
  KairosBulkCreateSchedules = 'BULK_CREATE_SCHEDULES_ERROR',
  KairosCreteScheduleToDelayInvalidation = 'CREATE_SCHEDULE_DELAY_INVALIDATION_ERROR',
  KairosDeleteCompletedSchedule = 'DELETE_COMPLETED_SCHEDULE_ERROR',
  KairosDeleteInvalidatedSchedules = 'DELETE_INVALIDATED_SCHEDULES_ERROR',
  KairosFetchExistingSchedule = 'FETCH_EXISTING_SCHEDULE_ERROR',
  TranscriptEntireHtml = 'TRANSCRIPT_ENTIRE_HTML_ERROR',
  TranscriptEntirePrivateSystemHtml = 'TRANSCRIPT_ENTIRE_PRIVATE_SYSTEM_HTML_ERROR',
  TranscriptEntirePrivateSystemText = 'TRANSCRIPT_ENTIRE_PRIVATE_SYSTEM_TEXT_ERROR',
  TranscriptEntireText = 'TRANSCRIPT_ENTIRE_TEXT_ERROR',
  TranscriptLastResolveHtml = 'TRANSCRIPT_LAST_RESOLVE_HTML_ERROR',
  TranscriptLastResolvePrivateSystemHtml = 'TRANSCRIPT_LAST_RESOLVE_PRIVATE_SYSTEM_HTML',
  TranscriptLastResolvePrivateSystemText = 'TRANSCRIPT_LAST_RESOLVE_PRIVATE_SYSTEM_TEXT',
  TranscriptLastResolveText = 'TRANSCRIPT_LAST_RESOLVE_TEXT_ERROR',
}
export interface ErrorObj {
  response: {
    data?: JsonMap;
    headers?: JsonMap;
  };
}

export function getErrorPayload(err: unknown): JsonMap {
  const { response } = err as ErrorObj;
  return {
    data: response?.data,
    responseHeaders: response?.headers,
  } as JsonMap;
}
