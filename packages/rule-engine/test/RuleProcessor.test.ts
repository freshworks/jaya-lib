import { assert } from 'chai';
import 'mocha';
import ruleConfig from '../src/RuleConfig';
import recommendedPlugins from '../src/recommended/index';
import { RuleProcessor } from '../src/RuleProcessor';
import { Event, ProductEventData } from '@freshworks-jaya/marketplace-models';
import { Rule, TriggerAction, Block, TriggerActor, Condition } from '../src/models/rule';

describe('RuleProcessor test', () => {
  beforeEach(() => {
    ruleConfig.registerPlugins(recommendedPlugins);
  });

  afterEach(() => {
    ruleConfig.reset();
  });

  const productEventData = {
    "actor": {
      "last_name": "Rajkumar",
      "first_name": "Arun",
      "email": "arun.rajkumar@freshworks.com",
      "type": "agent",
      "avatar": {
        "url": "https://fc-use1-00-pics-bkt-00.s3.amazonaws.com/fcb80e8034a0573c0a7cc62e8bad2320543cc3d25331762d72b601490b1d305f/f_marketingpicFull/u_511f4df397673630823df3cf364152b62cc8159e0232403603c3e81c431178f1/img_1585901259097.png"
      },
      "id": "652ac361-304e-47af-9c8f-598e649570a6",
      "phone": "9003011800"
    },
    "message": {
      "created_time": "2020-04-03T08:26:55.782Z",
      "conversation_id": "0a90e91d-6b83-4c75-bdfb-1f61050ecb2b",
      "response_due_type": "NO_RESPONSE_DUE",
      "user_id": "dad3036a-09b1-4aa7-b072-0c52e6a3bc4b",
      "channel_id": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76",
      "reopened_time": "2020-04-05T16:58:52.806Z",
      "app_id": "f81691a1-825e-44bd-ad26-d811f1d4f7eb",
      "status": "new",
      "messages": [
        {
          "created_time": "2020-04-06T05:01:40.601Z",
          "conversation_id": "0a90e91d-6b83-4c75-bdfb-1f61050ecb2b",
          "id": "8f1939ae-f87f-4b12-80f0-d0f7f38f8540",
          "user_id": "dad3036a-09b1-4aa7-b072-0c52e6a3bc4b",
          "message_source": "web",
          "message_type": "normal",
          "message_parts": [
            {
              "text": {
                "content": "hi"
              }
            }
          ],
          "app_id": "f81691a1-825e-44bd-ad26-d811f1d4f7eb"
        }
      ]
    },
    "associations": {
      "channel": {
        "public": true,
        "name": "Inbox",
        "welcome_message": {
          "message_parts": [
            {
              "text": {
                "content": "Hello there! Need help? Reach out to us right here, and we'll get back to you as soon as we can!"
              }
            }
          ],
          "message_type": "normal",
          "message_source": "system"
        },
        "updated_time": "2020-04-03T08:05:43.028Z",
        "id": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76",
        "tags": [],
        "icon": {},
        "locale": "",
        "enabled": true
      },
      "user": {
        "last_name": "Babu",
        "properties": [
          {
            "name": "fc_user_timezone",
            "value": "Asia/Calcutta"
          }
        ],
        "first_name": "Sudhir",
        "created_time": "2020-04-03T08:26:55.409Z",
        "avatar": {},
        "id": "dad3036a-09b1-4aa7-b072-0c52e6a3bc4b"
      }
    }
  };

  describe('getFirstMatchingRule', () => {
    const notMatchingRules = [
      {
        "name": "When agent says hi in a particular channel",
        "isEnabled": true,
        "actions": [],
        "triggers": [
          {
            "actor": "AGENT",
            "action": "MESSAGE_CREATE"
          }
        ],
        "blocks": [
          {
            "matchType": "ANY",
            "conditions": [
              {
                "key": "CHANNEL",
                "operator": "NOT_EQUALS",
                "value": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76"
              }
            ]
          }
        ],
        "matchType": "ANY",
        "isTimer": false,
        "timerValue": 5,
        "invalidators": null
      }
    ];
    const matchingRules = [
      {
        "name": "When agent says hi in a particular channel",
        "isEnabled": true,
        "actions": [],
        "triggers": [
          {
            "actor": "AGENT",
            "action": "MESSAGE_CREATE"
          }
        ],
        "blocks": [
          {
            "matchType": "ANY",
            "conditions": [
              {
                "key": "CHANNEL",
                "operator": "EQUALS",
                "value": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76"
              }
            ]
          }
        ],
        "matchType": "ANY",
        "isTimer": false,
        "timerValue": 5,
        "invalidators": null
      }
    ];

    it('should not return any rule when no rules are passed', () => {
      assert.notOk(RuleProcessor.getFirstMatchingRule(
        Event.MessageCreate,
        productEventData as any as ProductEventData,
        []));
    });

    it('should not match a rule', () => {
      assert.notOk(
        RuleProcessor.getFirstMatchingRule(
          Event.MessageCreate,
          productEventData as any as ProductEventData,
          notMatchingRules as any as Rule[]
        )
      );
    });

    it('should match a rule', () => {
      assert.ok(
        RuleProcessor.getFirstMatchingRule(
          Event.MessageCreate,
          productEventData as any as ProductEventData,
          matchingRules as any as Rule[]
        )
      );
    });
  });

  describe('isRuleMatching', () => {
    const ruleFailUserTriggerCondition = {
      "name": "When agent says hi in a particular channel",
      "isEnabled": true,
      "actions": [],
      "triggers": [
        {
          "actor": "USER",
          "action": "MESSAGE_CREATE"
        }
      ],
      "blocks": [
        {
          "matchType": "ANY",
          "conditions": [
            {
              "key": "CHANNEL",
              "operator": "EQUALS",
              "value": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76"
            }
          ]
        }
      ],
      "matchType": "ANY",
      "isTimer": false,
      "timerValue": 5,
      "invalidators": null
    };
    const ruleFailActionTriggerCondition = {
      "name": "When agent says hi in a particular channel",
      "isEnabled": true,
      "actions": [],
      "triggers": [
        {
          "actor": "AGENT",
          "action": "CONVERSATION_CREATE"
        }
      ],
      "blocks": [
        {
          "matchType": "ANY",
          "conditions": [
            {
              "key": "CHANNEL",
              "operator": "EQUALS",
              "value": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76"
            }
          ]
        }
      ],
      "matchType": "ANY",
      "isTimer": false,
      "timerValue": 5,
      "invalidators": null
    };

    it('should not match the trigger actor', () => {
      assert.notOk(
        RuleProcessor.isRuleMatching(
          Event.MessageCreate,
          productEventData as any as ProductEventData,
          ruleFailUserTriggerCondition as any as Rule
        )
      );
    });

    it('should not match the trigger action', () => {
      assert.notOk(
        RuleProcessor.isRuleMatching(
          Event.MessageCreate,
          productEventData as any as ProductEventData,
          ruleFailActionTriggerCondition as any as Rule
        )
      );
    });
  });

  describe('isTriggerActionMath', () => {
    const rulesFailActionTriggerCondition = [
      {
        "name": "When agent says hi in a particular channel",
        "isEnabled": true,
        "actions": [],
        "triggers": [
          {
            "actor": "AGENT",
            "action": "INVALID_ACTION"
          }
        ],
        "blocks": [
          {
            "matchType": "ANY",
            "conditions": [
              {
                "key": "CHANNEL",
                "operator": "EQUALS",
                "value": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76"
              }
            ]
          }
        ],
        "matchType": "ANY",
        "isTimer": false,
        "timerValue": 5,
        "invalidators": null
      }
    ];

    it('should throw an exception for invalid actor', () => {
      try {
        RuleProcessor.isTriggerActionMatch(
          {
            "actor": "AGENT",
            "action": "INVALID_ACTION"
          } as any as TriggerAction,
          Event.MessageCreate,
          productEventData as any as ProductEventData,
        );
      } catch(err) {
        assert.ok(err);
      }
    });
  });

  describe('isRuleBlocksMatching', () => {
    const ruleWithoutBlocks = {
      "name": "When agent says hi in a particular channel",
      "isEnabled": true,
      "actions": [],
      "triggers": [
        {
          "actor": "AGENT",
          "action": "INVALID_ACTION"
        }
      ],
      "matchType": "ANY",
      "isTimer": false,
      "timerValue": 5,
      "invalidators": null
    };

    const ruleWithEmptyArrayBlocks = {
      "name": "When agent says hi in a particular channel",
      "isEnabled": true,
      "actions": [],
      "triggers": [
        {
          "actor": "AGENT",
          "action": "INVALID_ACTION"
        }
      ],
      "blocks": [],
      "matchType": "ANY",
      "isTimer": false,
      "timerValue": 5,
      "invalidators": null
    };

    const ruleWithBlockMatchAll = {
      "name": "When agent says hi in a particular channel",
      "isEnabled": true,
      "actions": [],
      "triggers": [
        {
          "actor": "AGENT",
          "action": "INVALID_ACTION"
        }
      ],
      "blocks": [
        {
          "matchType": "ANY",
          "conditions": [
            {
              "key": "CHANNEL",
              "operator": "EQUALS",
              "value": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76"
            }
          ]
        }
      ],
      "matchType": "ALL",
      "isTimer": false,
      "timerValue": 5,
      "invalidators": null
    };

    const ruleWithInvalidMatchType = {
      "name": "When agent says hi in a particular channel",
      "isEnabled": true,
      "actions": [],
      "triggers": [
        {
          "actor": "AGENT",
          "action": "INVALID_ACTION"
        }
      ],
      "blocks": [
        {
          "matchType": "ANY",
          "conditions": [
            {
              "key": "CHANNEL",
              "operator": "EQUALS",
              "value": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76"
            }
          ]
        }
      ],
      "matchType": "INVALID",
      "isTimer": false,
      "timerValue": 5,
      "invalidators": null
    };

    it('should return true when no blocks are there', () => {
      assert.isTrue(RuleProcessor.isRuleBlocksMatching(
        productEventData as any as ProductEventData,
        ruleWithoutBlocks as any as Rule
      ));
    });

    it('should return true when blocks is an empty array', () => {
      assert.isTrue(RuleProcessor.isRuleBlocksMatching(
        productEventData as any as ProductEventData,
        ruleWithEmptyArrayBlocks as any as Rule
      ));
    });

    it('should return true all blocks are matching', () => {
      assert.isTrue(RuleProcessor.isRuleBlocksMatching(
        productEventData as any as ProductEventData,
        ruleWithBlockMatchAll as any as Rule
      ));
    });

    it('should throw an error for invalid matchtype', () => {
      try {
        RuleProcessor.isRuleBlocksMatching(
          productEventData as any as ProductEventData,
          ruleWithInvalidMatchType as any as Rule
        );
      } catch(err) {
        assert.ok(err);
      }
    });
  });

  describe('ruleMatchAll', () => {
    const blocksMatchAllFail = [
      {
        "matchType": "ANY",
        "conditions": [
          {
            "key": "CHANNEL",
            "operator": "NOT_EQUALS",
            "value": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76"
          }
        ]
      }
    ];

    it('should return false even if one block is not matching', () => {
      assert.isFalse(
        RuleProcessor.ruleMatchAll(
          productEventData as any as ProductEventData,
          blocksMatchAllFail as any as Block[]
        )
      );
    });
  });

  describe('isTriggerActorMatch', () => {
    it('should return false if trigger actor is not matching', () => {
      assert.isFalse(
        RuleProcessor.isTriggerActorMatch(
          'SYSTEM' as TriggerActor,
          productEventData as any as ProductEventData
        )
      );
    });
  });

  describe('isBlockMatching', () => {
    it('should return true if no block is there', () => {
      assert.isTrue(
        RuleProcessor.isBlockMatching(
          productEventData as any as ProductEventData,
          null as any as Block,
        )
      );
    });

    it('should return true if all blocks are matching', () => {
      assert.isTrue(
        RuleProcessor.isBlockMatching(
          productEventData as any as ProductEventData,
          {
            "matchType": "ALL",
            "conditions": [
              {
                "key": "CHANNEL",
                "operator": "EQUALS",
                "value": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76"
              }
            ]
          } as any as Block,
        )
      );
    });

    it('should throw an error when match type is invalid', () => {
      try {
        RuleProcessor.isBlockMatching(
          productEventData as any as ProductEventData,
          {
            "matchType": "INVALID",
            "conditions": [
              {
                "key": "CHANNEL",
                "operator": "EQUALS",
                "value": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76"
              }
            ]
          } as any as Block,
        )
      } catch(err) {
        assert.ok(err);
      }
    });
  });

  describe('isConditionMatching', () => {
    it('should throw an error when condition is invalid', () => {
      try {
        RuleProcessor.isConditionMatching(
          productEventData as any as ProductEventData,
          {
            "key": "INVALID_CONDITION",
            "operator": "EQUALS",
            "value": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76"
          } as any as Condition
        )
      } catch(err) {
        assert.ok(err);
      }
    });
  });

  describe('blockMatchAll', () => {
    it('should return false when match all conditions fails in first condition', () => {
      assert.isFalse(
        RuleProcessor.blockMatchAll(
          productEventData as any as ProductEventData,
          [
            {
              "key": "MESSAGE_TEXT",
              "operator": "ENDS_WITH",
              "value": "hi"
            },
            {
              "key": "MESSAGE_TEXT",
              "operator": "STARTS_WITH",
              "value": "hi"
            },
            {
              "key": "MESSAGE_TEXT",
              "operator": "CONTAINS",
              "value": "hi"
            },
            {
              "key": "MESSAGE_TEXT",
              "operator": "SET"
            },
            {
              "key": "MESSAGE_TEXT",
              "operator": "DOES_NOT_CONTAIN",
              "value": "no"
            },
            {
              "key": "ASSIGNED_GROUP",
              "operator": "NOT_SET"
            },
            {
              "key": "ASSIGNED_AGENT",
              "operator": "NOT_SET"
            },
            {
              "key": "RESPONSE_DUE_TYPE",
              "operator": "EQUALS",
              "value": "NO_RESPONSE_DUE"
            },
            {
              "key": "STATUS",
              "operator": "EQUALS",
              "value": "NEW"
            },
            {
              "key": "USER_PROPERTY",
              "operator": "EQUALS",
              "value": {
                "propertyKey": "fc_user_timezone",
                "propertyValue": "Asia/Calcutta"
              }
            },
            {
              "key": "USER_PROPERTY",
              "operator": "NOT_EQUALS",
              "value": {
                "propertyKey": "plan",
                "propertyValue": "garden"
              }
            }
        ] as any as Condition[]
        )
      );
    });
  });
});