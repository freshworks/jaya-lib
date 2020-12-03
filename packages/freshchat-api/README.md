# SDK for Freshchat API

## Install

```
npm install --save @freshworks-jaya/freshchat-api
```

or

```
yarn add @freshworks-jaya/freshchat-api
```

## Usage

```javascript
import Freshchat from '@freshworks-jaya/freshchat-api';

const freshchat = new Freshchat('https://api.freshchat.com/v2', '<freshchat-api-token>');
```

On Marketplace App server.js

```javascript
const Freshchat = require('@freshworks-jaya/freshchat-api').default;

var freshchat = new Freshchat('https://api.freshchat.com/v2', '<freshchat-api-token>');
```

## Examples

### Resolve a conversation
```javascript
freshchat.conversationStatusUpdate('<conversation-id>', 'resolved');
```

### Reopen a conversation
```javascript
freshchat.conversationStatusUpdate('<conversation-id>', 'new');
```

### Generate chat Transcript
```javascript

var appUrl = 'https://domain.freshchat.com';
var appAlias = '<App ID>'; //Available from Settings--> Mobile SDKs
var conversationId = '<Freshchat Conversation UUID>';

freshchat.getConversationTranscript(appUrl, appAlias, conversationId, {
	//The below value can either be 'text' or 'html'
	output: 'html', 
	//Below is a Flag to include the conversation link in the generated transcript.
	isIncludeFreshchatLink: true, 
	//Below is a Flag to generate transcript for the entire conversation or every interaction. (Create -> Latest message, Reopen -> Latest message)
	isFetchUntilLastResolve: true 
}).then(function (resp) {
	console.log(resp);
}, function (error) {
	console.log(error);
});
```

### Reports API
```javascript

const Freshchat = require('@freshworks-jaya/freshchat-api').default;
var freshchat = new Freshchat('https://api.freshchat.com/v2', '<freshchat-api-token>');

var startTime = '2020-12-03T05:08:36.791Z';
var endTime = '2020-12-04T05:08:35.791Z';
var eventType = 'classic';
var isExcludePii = false;
```

#### Trigger a Raw Report
```javascript
freshchat.triggerRawReports(startTime, endTime, eventType, isExcludePii)
  .then(function (response) {
    { id } = response;
    console.log('Request ID: ', id);
  }, function (error) {
    console.log(error);
  });
```

#### Retrieve a Raw Report
Use the Request ID from the response of the Trigger Raw Report API to retrieve the report.

```javascript
freshchat.retrieveRawReports(requestId)
  .then(function (response) {  
    console.log(response);
  }, function (error) {
    console.log(error);
  });
```
