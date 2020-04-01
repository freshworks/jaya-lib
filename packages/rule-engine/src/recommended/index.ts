import { RulePlugin } from "../models/plugin";
import { ConditionOperator, TriggerAction, ActionType, ConditionKey } from "../models/rule";

// Import all operators
import startsWith from './operators/starts-with';
import endsWith from './operators/ends-with';
import contains from './operators/contains';
import doesNotContain from './operators/starts-with';
import equals from './operators/ends-with';
import notEquals from './operators/contains';
import set from './operators/starts-with';
import notSet from './operators/ends-with';

// Import all trigger actions
import conversationAgentAssign from './trigger-actions/conversation-agent-assign';
import conversationCreate from './trigger-actions/conversation-create';
import conversationGroupAssign from './trigger-actions/conversation-group-assign';
import conversationReopen from './trigger-actions/conversation-reopen';
import conversationResolve from './trigger-actions/conversation-resolve';
import messageCreate from './trigger-actions/message-create';
import privateNoteCreate from './trigger-actions/private-note-create';

// Import all actions
import reopen from './actions/reopen';
import resolve from './actions/resolve';
import assignToGroup from './actions/assign-to-group';
import assignToAgent from './actions/assign-to-agent';
import sendMessage from './actions/send-message';

// Import all conditions
import messageText from './conditions/message-text';
import channel from './conditions/channel';
import status from './conditions/status';
import assignedGroup from './conditions/assigned-group';
import assignedAgent from './conditions/assigned-agent';
import responseDueType from './conditions/response-due-type';
import userProperty from './conditions/user-property';

const recommendedPlugins: RulePlugin[] = [
  {
    conditions: {
      [ConditionKey.MessageText]: messageText,
      [ConditionKey.Channel]: channel,
      [ConditionKey.Status]: status,
      [ConditionKey.AssignedAgent]: assignedAgent,
      [ConditionKey.AssignedGroup]: assignedGroup,
      [ConditionKey.ResponseDueType]: responseDueType,
      [ConditionKey.UserProperty]: userProperty
    },
    operators: {
      [ConditionOperator.StartsWith]: startsWith,
      [ConditionOperator.EndsWith]: endsWith,
      [ConditionOperator.Contains]: contains,
      [ConditionOperator.DoesNotContain]: doesNotContain,
      [ConditionOperator.Equals]: equals,
      [ConditionOperator.NotEquals]: notEquals,
      [ConditionOperator.Set]: set,
      [ConditionOperator.NotSet]: notSet
    },
    triggerActions: {
      [TriggerAction.ConversationCreate]: conversationCreate,
      [TriggerAction.ConversationReopen]: conversationReopen,
      [TriggerAction.ConversationResolve]: conversationResolve,
      [TriggerAction.ConversationGroupAssign]: conversationGroupAssign,
      [TriggerAction.ConversationAgentAssign]: conversationAgentAssign,
      [TriggerAction.MessageCreate]: messageCreate,
      [TriggerAction.PrivateNoteCreate]: privateNoteCreate
    },
    actions: {
      [ActionType.ReOpen]: reopen,
      [ActionType.Resolve]: resolve,
      [ActionType.AssignToGroup]: assignToGroup,
      [ActionType.AssignToAgent]: assignToAgent,
      [ActionType.SendMessage]: sendMessage
    }
  }
];

export default recommendedPlugins;