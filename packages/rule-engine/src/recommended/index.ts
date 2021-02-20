import { RulePlugin } from '../models/plugin';
import { ConditionOperator, ActionType, ConditionKey, TriggerActionType, TriggerActorType } from '../models/rule';

// Import all operators
import operatorStartsWith from './operators/starts-with';
import operatorEndsWith from './operators/ends-with';
import operatorContains from './operators/contains';
import operatorDoesNotContain from './operators/does-not-contain';
import operatorEquals from './operators/equals';
import operatorNotAtAllEquals from './operators/not-equals';
import operatorSet from './operators/set';
import operatorNotSet from './operators/not-set';
import operatorWithinBusinessHrs from './operators/within-business-hours';
import operatorOutsideBusinessHrs from './operators/outside-business-hours';
import operatorLessThan from './operators/less-than';
import operatorGreaterThan from './operators/greater-than';
import operatorMatchRegex from './operators/match-regex';

// Import all trigger actions
import triggerActionConversationAgentAssign from './trigger-actions/conversation-agent-assign';
import triggerActionConversationCreate from './trigger-actions/conversation-create';
import triggerActionConversationGroupAssign from './trigger-actions/conversation-group-assign';
import triggerActionConversationStatusUpdate from './trigger-actions/conversation-status-update';
import triggerActionMessageCreate from './trigger-actions/message-create';
import triggerActionPrivateNoteCreate from './trigger-actions/private-note-create';

// Import all trigger actors
import triggerActorAgent from './trigger-actors/agent';
import triggerActorUser from './trigger-actors/user';
import triggerActorSystem from './trigger-actors/system';

// Import all actions
import actionReopen from './actions/reopen';
import actionResolve from './actions/resolve';
import actionAssignToGroup from './actions/assign-to-group';
import actionAssignToAgent from './actions/assign-to-agent';
import actionSendMessage from './actions/send-message';
import actionSendPrivateNote from './actions/send-private-note';
import actionUnassignThenReassignGroup from './actions/unassign-then-reassign-group';
import actionSendQuickreply from './actions/send-quickreply';
import actionUpdateUserProperty from './actions/update-user-property';
import actionUpdateUserEmail from './actions/update-user-email';
import actionUpdateUserPhone from './actions/update-user-phone';
import actionUpdateUserFirstName from './actions/update-user-first-name';
import actionUpdateUserLastName from './actions/update-user-last-name';
import actionCreateFreshdeskTicket from './actions/create-freshdesk-ticket';
import actionSendEmailUser from './actions/send-email-user';
import actionSendEmailAnyone from './actions/send-email-anyone';

// Import all conditions
import conditionMessageText from './conditions/message-text';
import conditionChannel from './conditions/channel';
import conditionStatus from './conditions/status';
import conditionAssignedGroup from './conditions/assigned-group';
import conditionAssignedAgent from './conditions/assigned-agent';
import conditionResponseDueType from './conditions/response-due-type';
import conditionUserProperty from './conditions/user-property';
import conditionBusinessHour from './conditions/business-hour';
import conditionUnassignedCount from './conditions/unassigned-count';
import conditionUserName from './conditions/user-name';
import conditionUserEmail from './conditions/user-email';
import conditionUserPhone from './conditions/user-phone';

// Import all dynamic placeholders
import dynamicPlaceholderAverageWaitTime from './dynamic-placeholders/average-wait-time';
import dynamicPlaceholderTranscriptConvEntireHtml from './dynamic-placeholders/transcript-conv-entire-html';
import dynamicPlaceholderTranscriptConvEntireIncludesPrivateSystemHtml from './dynamic-placeholders/transcript-conv-entire-includes-private-system-html';
import dynamicPlaceholderTranscriptConvSinceLastResolveHtml from './dynamic-placeholders/transcript-conv-since-last-resolve-html';
import dynamicPlaceholderTranscriptConvSinceLastResolveIncludesPrivateSystemHtml from './dynamic-placeholders/transcript-conv-since-last-resolve-includes-private-system-html';

const recommendedPlugins: RulePlugin[] = [
  {
    actions: {
      [ActionType.ReOpen]: actionReopen,
      [ActionType.Resolve]: actionResolve,
      [ActionType.AssignToGroup]: actionAssignToGroup,
      [ActionType.AssignToAgent]: actionAssignToAgent,
      [ActionType.CreateFreshdeskTicket]: actionCreateFreshdeskTicket,
      [ActionType.SendMessage]: actionSendMessage,
      [ActionType.SendPrivateNote]: actionSendPrivateNote,
      [ActionType.SendQuickreply]: actionSendQuickreply,
      [ActionType.SendEmailAnyone]: actionSendEmailAnyone,
      [ActionType.SendEmailUser]: actionSendEmailUser,
      [ActionType.UnassignThenReassignGroup]: actionUnassignThenReassignGroup,
      [ActionType.UpdateUserProperty]: actionUpdateUserProperty,
      [ActionType.UpdateUserEmail]: actionUpdateUserEmail,
      [ActionType.UpdateUserName]: actionUpdateUserFirstName,
      [ActionType.UpdateUserLastName]: actionUpdateUserLastName,
      [ActionType.UpdateUserPhone]: actionUpdateUserPhone,
    },
    conditions: {
      [ConditionKey.MessageText]: conditionMessageText,
      [ConditionKey.Channel]: conditionChannel,
      [ConditionKey.Status]: conditionStatus,
      [ConditionKey.AssignedAgent]: conditionAssignedAgent,
      [ConditionKey.AssignedGroup]: conditionAssignedGroup,
      [ConditionKey.ResponseDueType]: conditionResponseDueType,
      [ConditionKey.UserProperty]: conditionUserProperty,
      [ConditionKey.UnassignedCount]: conditionUnassignedCount,
      [ConditionKey.BusinessHours]: conditionBusinessHour,
      [ConditionKey.UserName]: conditionUserName,
      [ConditionKey.UserEmail]: conditionUserEmail,
      [ConditionKey.UserPhone]: conditionUserPhone,
    },
    dynamicPlaceholders: {
      'metrics.average_wait_time': dynamicPlaceholderAverageWaitTime,
      'transcript.conv_entire.html': dynamicPlaceholderTranscriptConvEntireHtml,
      'transcript.conv_entire.includes_private_system.html': dynamicPlaceholderTranscriptConvEntireIncludesPrivateSystemHtml,
      'transcript.conv_since_last_resolve.html': dynamicPlaceholderTranscriptConvSinceLastResolveHtml,
      'transcript.conv_since_last_resolve.includes_private_system.html': dynamicPlaceholderTranscriptConvSinceLastResolveIncludesPrivateSystemHtml,
    },
    operators: {
      [ConditionOperator.StartsWith]: operatorStartsWith,
      [ConditionOperator.EndsWith]: operatorEndsWith,
      [ConditionOperator.Contains]: operatorContains,
      [ConditionOperator.DoesNotContain]: operatorDoesNotContain,
      [ConditionOperator.Equals]: operatorEquals,
      [ConditionOperator.GreaterThan]: operatorGreaterThan,
      [ConditionOperator.LessThan]: operatorLessThan,
      [ConditionOperator.NotEquals]: operatorNotAtAllEquals,
      [ConditionOperator.Set]: operatorSet,
      [ConditionOperator.NotSet]: operatorNotSet,
      [ConditionOperator.WithinBusinessHours]: operatorWithinBusinessHrs,
      [ConditionOperator.OutsideBusinessHours]: operatorOutsideBusinessHrs,
      [ConditionOperator.MatchRegex]: operatorMatchRegex,
    },
    triggerActions: {
      [TriggerActionType.ConversationAgentAssign]: triggerActionConversationAgentAssign,
      [TriggerActionType.ConversationCreate]: triggerActionConversationCreate,
      [TriggerActionType.ConversationGroupAssign]: triggerActionConversationGroupAssign,
      [TriggerActionType.ConversationStatusUpdate]: triggerActionConversationStatusUpdate,
      [TriggerActionType.MessageCreate]: triggerActionMessageCreate,
      [TriggerActionType.PrivateNoteCreate]: triggerActionPrivateNoteCreate,
    },
    triggerActors: {
      [TriggerActorType.Agent]: triggerActorAgent,
      [TriggerActorType.System]: triggerActorSystem,
      [TriggerActorType.User]: triggerActorUser,
    },
  },
];

export default recommendedPlugins;
