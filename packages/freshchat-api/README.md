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
