export enum ConversationStatus {
  Assigned = 'assigned',
  New = 'new',
  Resolved = 'resolved',
  WaitingOnCustomer = 'waiting on customer',
  WaitingOnInternalTeam = 'waiting on internal team',
}

export interface Conversation {
  app_id: string;
  assigned_agent_id?: string;
  assigned_group_id?: string;
  channel_id: string;
  conversation_id: string;
  status: ConversationStatus;
}
