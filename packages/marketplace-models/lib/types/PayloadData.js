"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConversationStatus;
(function (ConversationStatus) {
    ConversationStatus["Assigned"] = "assigned";
    ConversationStatus["New"] = "new";
    ConversationStatus["Resolved"] = "resolved";
})(ConversationStatus = exports.ConversationStatus || (exports.ConversationStatus = {}));
var ChangedStatus;
(function (ChangedStatus) {
    ChangedStatus["Assign"] = "ASSIGN";
    ChangedStatus["New"] = "NEW";
    ChangedStatus["Resolve"] = "RESOLVE";
})(ChangedStatus = exports.ChangedStatus || (exports.ChangedStatus = {}));
var MessageType;
(function (MessageType) {
    MessageType["Normal"] = "normal";
    MessageType["Private"] = "private";
    MessageType["System"] = "system";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var ActorType;
(function (ActorType) {
    ActorType["Agent"] = "agent";
    ActorType["System"] = "system";
    ActorType["User"] = "user";
})(ActorType = exports.ActorType || (exports.ActorType = {}));
var ResponseDueType;
(function (ResponseDueType) {
    ResponseDueType["FirstResponseDue"] = "FIRST_RESPONSE_DUE";
    ResponseDueType["NoResponseDue"] = "NO_RESPONSE_DUE";
    ResponseDueType["ResponseDue"] = "RESPONSE_DUE";
})(ResponseDueType = exports.ResponseDueType || (exports.ResponseDueType = {}));
