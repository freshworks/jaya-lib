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
import operatorAfter from './operators/after';
import operatorBefore from './operators/before';
import operatorContainsAllOf from './operators/contains-all-of';
import operatorContainsNoneOf from './operators/contains-none-of';
import operatorIs from './operators/is';
import operatorIsFalse from './operators/is-false';
import operatorIsNot from './operators/is-not';
import operatorIsTrue from './operators/is-true';

// Import all trigger actions
import triggerActionConversationAgentAssign from './trigger-actions/conversation-agent-assign';
import triggerActionConversationCreate from './trigger-actions/conversation-create';
import triggerActionConversationDoNotAutoResolve from './trigger-actions/conversation-do-not-auto-resolve';
import triggerActionConversationGroupAssign from './trigger-actions/conversation-group-assign';
import triggerActionConversationLabelAssign from './trigger-actions/conversation-label-assign';
import triggerActionConversationStatusUpdate from './trigger-actions/conversation-status-update';
import triggerActionMessageCreate from './trigger-actions/message-create';
import triggerActionPrivateNoteCreate from './trigger-actions/private-note-create';
import triggerActionFirstSLABreach from './trigger-actions/first-sla-breach';
import triggerActionNextSLABreach from './trigger-actions/next-sla-breach';
import triggerActionCallEnded from './trigger-actions/call-ended';
import triggerActionUpdateConversationProperty from './trigger-actions/update-conversation-property';

// Import all trigger actors
import triggerActorAgent from './trigger-actors/agent';
import triggerActorUser from './trigger-actors/user';
import triggerActorSystem from './trigger-actors/system';
import triggerActorBot from './trigger-actors/bot';

// Import all actions
import actionReopen from './actions/reopen';
import actionResolve from './actions/resolve';
import actionAssignToGroup from './actions/assign-to-group';
import actionAssignToAgent from './actions/assign-to-agent';
import actionSendMessage from './actions/send-message';
import actionSendPrivateNote from './actions/send-private-note';
import actionUnassignThenReassignGroup from './actions/unassign-then-reassign-group';
import actionSendQuickreply from './actions/send-quickreply';
import actionTriggerApi from './actions/trigger-api';
import actionUpdateUserProperty from './actions/update-user-property';
import actionUpdateUserEmail from './actions/update-user-email';
import actionUpdateUserPhone from './actions/update-user-phone';
import actionUpdateUserFirstName from './actions/update-user-first-name';
import actionUpdateUserLastName from './actions/update-user-last-name';
import actionCreateFreshdeskTicket from './actions/create-freshdesk-ticket';
import actionSendEmailUser from './actions/send-email-user';
import actionSendEmailAnyone from './actions/send-email-anyone';
import actionUpdateStatus from './actions/update-status';
import actionConversationPropertiesUpdate from './actions/update-conversation-property';

// Import all conditions
import conditionMessageText from './conditions/message-text';
import conditionChannel from './conditions/channel';
import conditionStatus from './conditions/status';
import conditionAssignedGroup from './conditions/assigned-group';
import conditionAssignedAgent from './conditions/assigned-agent';
import conditionAutoResolve from './conditions/auto-resolve';
import conditionResponseDueType from './conditions/response-due-type';
import conditionUserProperty from './conditions/user-property';
import conditionBusinessHour from './conditions/business-hour';
import conditionUnassignedCount from './conditions/unassigned-count';
import conditionUserName from './conditions/user-name';
import conditionUserEmail from './conditions/user-email';
import conditionUserPhone from './conditions/user-phone';
import conditionLabelCategoryName from './conditions/label-category-name';
import conditionLabelSubcategoryName from './conditions/label-subcategory-name';
import conditionSLAName from './conditions/sla-name';
import conditionCallStatus from './conditions/call-status';
import conditionCallType from './conditions/call-type';
import conditionConversationProperty from './conditions/conversation-property';
import conditionEmailBody from './conditions/email-body';

// Import all dynamic placeholders
import dynamicPlaceholderAverageWaitTime from './dynamic-placeholders/average-wait-time';
import dynamicPlaceholderConversationUrl from './dynamic-placeholders/conversation-url';
import dynamicPlaceholderTranscriptConvEntireHtml from './dynamic-placeholders/transcript-conv-entire-html';
import dynamicPlaceholderTranscriptPaytmConvEntireHtml from './dynamic-placeholders/transcript-paytm-conv-entire-html';
import dynamicPlaceholderTranscriptConvEntireIncludesPrivateSystemHtml from './dynamic-placeholders/transcript-conv-entire-includes-private-system-html';
import dynamicPlaceholderTranscriptConvSinceLastResolveHtml from './dynamic-placeholders/transcript-conv-since-last-resolve-html';
import dynamicPlaceholderTranscriptConvSinceLastResolveIncludesPrivateSystemHtml from './dynamic-placeholders/transcript-conv-since-last-resolve-includes-private-system-html';
import dynamicPlaceholderTranscriptConvEntireText from './dynamic-placeholders/transcript-conv-entire-text';
import dynamicPlaceholderTranscriptConvEntireIncludesPrivateSystemText from './dynamic-placeholders/transcript-conv-entire-includes-private-system-text';
import dynamicPlaceholderTranscriptConvSinceLastResolveText from './dynamic-placeholders/transcript-conv-since-last-resolve-text';
import dynamicPlaceholderTranscriptConvSinceLastResolveIncludesPrivateSystemText from './dynamic-placeholders/transcript-conv-since-last-resolve-includes-private-system-text';
import dynamicPlaceholderTranscriptPaytmConvSinceLastResolveHtml from './dynamic-placeholders/transcript-paytm-conv-since-last-resolve-html';

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
      [ActionType.TriggerApi]: actionTriggerApi,
      [ActionType.UnassignThenReassignGroup]: actionUnassignThenReassignGroup,
      [ActionType.UpdateUserProperty]: actionUpdateUserProperty,
      [ActionType.UpdateUserEmail]: actionUpdateUserEmail,
      [ActionType.UpdateUserName]: actionUpdateUserFirstName,
      [ActionType.UpdateUserLastName]: actionUpdateUserLastName,
      [ActionType.UpdateUserPhone]: actionUpdateUserPhone,
      [ActionType.UpdateStatus]: actionUpdateStatus,
      [ActionType.UpdateConversationProperty]: actionConversationPropertiesUpdate,
    },
    conditions: {
      [ConditionKey.AutoResolve]: conditionAutoResolve,
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
      [ConditionKey.LabelCategoryName]: conditionLabelCategoryName,
      [ConditionKey.LabelSubcategoryName]: conditionLabelSubcategoryName,
      [ConditionKey.SLAName]: conditionSLAName,
      [ConditionKey.ConversationProperty]: conditionConversationProperty,
      [ConditionKey.CallStatus]: conditionCallStatus,
      [ConditionKey.CallType]: conditionCallType,
      [ConditionKey.EmailBody]: conditionEmailBody,
    },
    dynamicPlaceholders: {
      'conversation.url': dynamicPlaceholderConversationUrl,
      'metrics.average_wait_time': dynamicPlaceholderAverageWaitTime,
      'transcript.conv_entire.html': dynamicPlaceholderTranscriptConvEntireHtml,
      'transcript.conv_entire.includes_private_system.html':
        dynamicPlaceholderTranscriptConvEntireIncludesPrivateSystemHtml,
      'transcript.conv_entire.includes_private_system.text':
        dynamicPlaceholderTranscriptConvEntireIncludesPrivateSystemText,
      'transcript.conv_entire.text': dynamicPlaceholderTranscriptConvEntireText,
      'transcript.conv_since_last_resolve.html': dynamicPlaceholderTranscriptConvSinceLastResolveHtml,
      'transcript.conv_since_last_resolve.includes_private_system.html':
        dynamicPlaceholderTranscriptConvSinceLastResolveIncludesPrivateSystemHtml,
      'transcript.conv_since_last_resolve.includes_private_system.text':
        dynamicPlaceholderTranscriptConvSinceLastResolveIncludesPrivateSystemText,
      'transcript.conv_since_last_resolve.text': dynamicPlaceholderTranscriptConvSinceLastResolveText,
      'transcript.paytm_conv_entire.html': dynamicPlaceholderTranscriptPaytmConvEntireHtml,
      'transcript.paytm_conv_since_last_resolve.html': dynamicPlaceholderTranscriptPaytmConvSinceLastResolveHtml,
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
      [ConditionOperator.After]: operatorAfter,
      [ConditionOperator.Before]: operatorBefore,
      [ConditionOperator.ContainsAllOf]: operatorContainsAllOf,
      [ConditionOperator.ContainsNoneOf]: operatorContainsNoneOf,
      [ConditionOperator.Is]: operatorIs,
      [ConditionOperator.IsFalse]: operatorIsFalse,
      [ConditionOperator.IsNot]: operatorIsNot,
      [ConditionOperator.IsTrue]: operatorIsTrue,
    },
    triggerActions: {
      [TriggerActionType.ConversationAgentAssign]: triggerActionConversationAgentAssign,
      [TriggerActionType.ConversationCreate]: triggerActionConversationCreate,
      [TriggerActionType.ConversationDoNotAutoResolve]: triggerActionConversationDoNotAutoResolve,
      [TriggerActionType.ConversationGroupAssign]: triggerActionConversationGroupAssign,
      [TriggerActionType.ConversationLabelAssign]: triggerActionConversationLabelAssign,
      [TriggerActionType.ConversationStatusUpdate]: triggerActionConversationStatusUpdate,
      [TriggerActionType.MessageCreate]: triggerActionMessageCreate,
      [TriggerActionType.PrivateNoteCreate]: triggerActionPrivateNoteCreate,
      [TriggerActionType.FirstSlaBreach]: triggerActionFirstSLABreach,
      [TriggerActionType.NextSlaBreach]: triggerActionNextSLABreach,
      [TriggerActionType.CallEnded]: triggerActionCallEnded,
      [TriggerActionType.UpdateConversationProperty]: triggerActionUpdateConversationProperty,
    },
    triggerActors: {
      [TriggerActorType.Agent]: triggerActorAgent,
      [TriggerActorType.Bot]: triggerActorBot,
      [TriggerActorType.System]: triggerActorSystem,
      [TriggerActorType.User]: triggerActorUser,
    },
  },
];

export default recommendedPlugins;
