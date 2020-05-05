export enum MatchType {
  All = 'ALL',
  Any = 'ANY',
}
export enum TriggerActorType {
  Agent = 'AGENT',
  System = 'SYSTEM',
  User = 'USER',
}

export enum TriggerActorCause {
  Agent = 'AGENT',
  AgentGroupMapping = 'AGENT_GROUP_MAPPING',
  AssignmentRule = 'ASSIGNMENT_RULE',
  AutoResolve = 'AUTO_RESOLVE',
  Bot = 'BOT',
  IntelliAssign = 'INTELLI_ASSIGN',
  User = 'USER',
}

export enum TriggerActionType {
  ConversationAgentAssign = 'CONVERSATION_AGENT_ASSIGN',
  ConversationCreate = 'CONVERSATION_CREATE',
  ConversationGroupAssign = 'CONVERSATION_GROUP_ASSIGN',
  ConversationStatusUpdate = 'CONVERSATION_STATUS_UPDATE',
  MessageCreate = 'MESSAGE_CREATE',
  PrivateNoteCreate = 'PRIVATE_NOTE_CREATE',
}

export enum ActionType {
  AssignToAgent = 'ASSIGN_TO_AGENT',
  AssignToGroup = 'ASSIGN_TO_GROUP',
  ReOpen = 'REOPEN',
  Resolve = 'RESOLVE',
  SendMessage = 'SEND_MESSAGE',
  SendPrivateNote = 'SEND_PRIVATE_NOTE',
  SetAverageWaitTime = 'SET_AVERAGE_WAIT_TIME_IN_PLACEHOLDERS',
  UnassignThenReassignGroup = 'UNASSIGN_THEN_REASSIGN_GROUP',
}
export enum ConditionKey {
  AssignedAgent = 'ASSIGNED_AGENT',
  AssignedGroup = 'ASSIGNED_GROUP',
  BusinessHours = 'BUSINESS_HOURS',
  Channel = 'CHANNEL',
  MessageText = 'MESSAGE_TEXT',
  ResponseDueType = 'RESPONSE_DUE_TYPE',
  Status = 'STATUS',
  UserProperty = 'USER_PROPERTY',
}
export enum ConditionOperator {
  Contains = 'CONTAINS',
  DoesNotContain = 'DOES_NOT_CONTAIN',
  EndsWith = 'ENDS_WITH',
  Equals = 'EQUALS',
  NotEquals = 'NOT_EQUALS',
  NotSet = 'NOT_SET',
  OutsideBusinessHours = 'OUTSIDE_BUSINESS_HOURS',
  Set = 'SET',
  StartsWith = 'STARTS_WITH',
  WithinBusinessHours = 'WITHIN_BUSINESS_HOURS',
}
export enum ResponseDueTypeValue {
  FirstResponseDue = 'FIRST_RESPONSE_DUE',
  NoResponseDue = 'NO_RESPONSE_DUE',
  ResponseDue = 'RESPONSE_DUE',
}

export enum ConversationStatusChangeValue {
  Any = 'ANY',
  Assigned = 'ASSIGNED',
  New = 'NEW',
  Resolved = 'RESOLVED',
}

export interface ConversationStatusChange {
  from: ConversationStatusChangeValue | null;
  to: ConversationStatusChangeValue | null;
}

export interface TriggerAction {
  change?: {
    from: string | null;
    to: string | null;
  };
  type: TriggerActionType;
}

export interface TriggerActor {
  cause?: TriggerActorCause;
  type: TriggerActorType;
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
