import { RulePlugin } from "../models/plugin";
import { ConditionOperator, TriggerAction, ActionType, ConditionKey } from "../models/rule";

// Import all operators
import operatorStartsWith from './operators/starts-with';
import operatorEndsWith from './operators/ends-with';
import operatorContains from './operators/contains';
import operatorDoesNotContain from './operators/does-not-contain';
import operatorEquals from './operators/equals';
import operatorNotAtAllEquals from './operators/not-equals';
import operatorSet from './operators/set';
import operatorNotSet from './operators/not-set';

// Import all trigger actions
import triggerActionConversationAgentAssign from './trigger-actions/conversation-agent-assign';
import triggerActionConversationCreate from './trigger-actions/conversation-create';
import triggerActionConversationGroupAssign from './trigger-actions/conversation-group-assign';
import triggerActionConversationReopen from './trigger-actions/conversation-reopen';
import triggerActionConversationResolve from './trigger-actions/conversation-resolve';
import triggerActionMessageCreate from './trigger-actions/message-create';
import triggerActionPrivateNoteCreate from './trigger-actions/private-note-create';

// Import all actions
import actionReopen from './actions/reopen';
import actionResolve from './actions/resolve';
import actionAssignToGroup from './actions/assign-to-group';
import actionAssignToAgent from './actions/assign-to-agent';
import actionSendMessage from './actions/send-message';
import actionUnassignThenReassignGroup from "./actions/unassign-then-reassign-group";

// Import all conditions
import conditionMessageText from './conditions/message-text';
import conditionChannel from './conditions/channel';
import conditionStatus from './conditions/status';
import conditionAssignedGroup from './conditions/assigned-group';
import conditionAssignedAgent from './conditions/assigned-agent';
import conditionResponseDueType from './conditions/response-due-type';
import conditionUserProperty from './conditions/user-property';

const recommendedPlugins: RulePlugin[] = [
  {
    conditions: {
      [ConditionKey.MessageText]: conditionMessageText,
      [ConditionKey.Channel]: conditionChannel,
      [ConditionKey.Status]: conditionStatus,
      [ConditionKey.AssignedAgent]: conditionAssignedAgent,
      [ConditionKey.AssignedGroup]: conditionAssignedGroup,
      [ConditionKey.ResponseDueType]: conditionResponseDueType,
      [ConditionKey.UserProperty]: conditionUserProperty
    },
    operators: {
      [ConditionOperator.StartsWith]: operatorStartsWith,
      [ConditionOperator.EndsWith]: operatorEndsWith,
      [ConditionOperator.Contains]: operatorContains,
      [ConditionOperator.DoesNotContain]: operatorDoesNotContain,
      [ConditionOperator.Equals]: operatorEquals,
      [ConditionOperator.NotEquals]: operatorNotAtAllEquals,
      [ConditionOperator.Set]: operatorSet,
      [ConditionOperator.NotSet]: operatorNotSet
    },
    triggerActions: {
      [TriggerAction.ConversationCreate]: triggerActionConversationCreate,
      [TriggerAction.ConversationReopen]: triggerActionConversationReopen,
      [TriggerAction.ConversationResolve]: triggerActionConversationResolve,
      [TriggerAction.ConversationGroupAssign]: triggerActionConversationGroupAssign,
      [TriggerAction.ConversationAgentAssign]: triggerActionConversationAgentAssign,
      [TriggerAction.MessageCreate]: triggerActionMessageCreate,
      [TriggerAction.PrivateNoteCreate]: triggerActionPrivateNoteCreate
    },
    actions: {
      [ActionType.ReOpen]: actionReopen,
      [ActionType.Resolve]: actionResolve,
      [ActionType.AssignToGroup]: actionAssignToGroup,
      [ActionType.AssignToAgent]: actionAssignToAgent,
      [ActionType.SendMessage]: actionSendMessage,
      [ActionType.UnassignThenReassignGroup]: actionUnassignThenReassignGroup
    }
  }
];

export default recommendedPlugins;