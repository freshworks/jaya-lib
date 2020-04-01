export enum ConversationStatus {
  Assigned = 'assigned',
  New = 'new',
  Resolved = 'resolved',
}

export interface Conversation {
  conversation_id: string;
  app_id: string;
  status: ConversationStatus;
  channel_id: string;
  assigned_agent_id?: string;
  assigned_group_id?: string;
}
