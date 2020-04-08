export enum MatchType {
  All = 'ALL',
  Any = 'ANY',
}
export enum TriggerActor {
  Agent = 'AGENT',
  System = 'SYSTEM',
  User = 'USER',
}
export enum TriggerAction {
  ConversationAgentAssign = 'CONVERSATION_AGENT_ASSIGN',
  ConversationCreate = 'CONVERSATION_CREATE',
  ConversationGroupAssign = 'CONVERSATION_GROUP_ASSIGN',
  ConversationReopen = 'CONVERSATION_REOPEN',
  ConversationResolve = 'CONVERSATION_RESOLVE',
  MessageCreate = 'MESSAGE_CREATE',
  PrivateNoteCreate = 'PRIVATE_NOTE_CREATE',
}
export enum ActionType {
  AssignToAgent = 'ASSIGN_TO_AGENT',
  AssignToGroup = 'ASSIGN_TO_GROUP',
  ReOpen = 'REOPEN',
  Resolve = 'RESOLVE',
  SendMessage = 'SEND_MESSAGE',
  UnassignThenReassignGroup = 'UNASSIGN_THEN_REASSIGN_GROUP',
}
export enum ConditionKey {
  AssignedAgent = 'ASSIGNED_AGENT',
  AssignedGroup = 'ASSIGNED_GROUP',
  Channel = 'CHANNEL',
  MessageText = 'MESSAGE_TEXT',
  ResponseDueType = 'RESPONSE_DUE_TYPE',
  Status = 'STATUS',
  UserProperty = 'USER_PROPERTY',
  BusinessHours = 'BUSINESS_HOURS',
}
export enum ConditionOperator {
  Contains = 'CONTAINS',
  DoesNotContain = 'DOES_NOT_CONTAIN',
  EndsWith = 'ENDS_WITH',
  Equals = 'EQUALS',
  NotEquals = 'NOT_EQUALS',
  NotSet = 'NOT_SET',
  Set = 'SET',
  StartsWith = 'STARTS_WITH',
  WithinBusinessHours = 'WITHIN_BUSINESS_HOURS',
  OutsideBusinessHours = 'OUTSIDE_BUSINESS_HOURS',
}
export enum ResponseDueTypeValue {
  FirstResponseDue = 'FIRST_RESPONSE_DUE',
  NoResponseDue = 'NO_RESPONSE_DUE',
  ResponseDue = 'RESPONSE_DUE',
}

export interface Trigger {
  action: TriggerAction;
  actor: TriggerActor;
}

export interface Action {
  type: ActionType;
  value: string;
}

export interface UserConditionValue {
  propertyKey: string;
  propertyValue: string;
}

export interface Condition {
  key: ConditionKey;
  operator: ConditionOperator;
  value: string | UserConditionValue | ResponseDueTypeValue;
}

export interface Block {
  conditions: Condition[];
  matchType: MatchType;
}

export interface Rule {
  actions: Action[];
  blocks: Block[];
  invalidators: Trigger[];
  isEnabled: boolean;
  isTimer: boolean;
  matchType: MatchType;
  name: string;
  timerValue: number;
  triggers: Trigger[];
}
