# rule-engine
## Overview
Evaluates the incoming Product Event Payload against the configured rules to find a match and executes the configured actions.

## The Rule Object
```json
{
  "name": "Sample Rule",
  "triggers": [
    {
      "actor": {
        "type": "SYSTEM",
        "cause": "FREDDY_BOT",
      },
      "action": {
        "type": "CONVERSATION_STATUS",
        "change": {
          "from": "NEW",
          "to": "ASSIGNED",
        },
      },
    }
  ],
}
```
