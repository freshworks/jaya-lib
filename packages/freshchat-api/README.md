# SDK for Freshchat API

## Install

```
npm install --save @freshworks-jaya/freshchat-api
```

or

```
yarn add freshdesk-api
```

## Usage

```javascript
import Freshchat from '@freshworks-jaya/freshchat-api';

const freshchat = new Freshchat('https://api.freshchat.com/v2', '<freshchat-api-token>');
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




