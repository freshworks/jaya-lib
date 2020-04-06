import { RuleEngine, Rule } from '../src/index';
import { assert } from 'chai';
import 'mocha';
import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';

describe('RuleEngine test', () => {
  const ruleEngine = new RuleEngine();
  const productEventPayload = {
    "data": {
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
    },
    "iparams": {
      "isRuleDirty": false,
      "isVerifiedKey": true,
      "statusCode": 200,
      "api-token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJpS216TTVkenRIWmprdmdSY3VrVHgxTzJ2SFlTM0U5YmVJME9XbXRNR1ZzIn0.eyJqdGkiOiJjNDBhY2Q1My0zODVhLTQ3OWQtYTg3OC1mYmFlN2Q2ZDBhZTkiLCJleHAiOjE5MDEyNjMxNjMsIm5iZiI6MCwiaWF0IjoxNTg1OTAzMTYzLCJpc3MiOiJodHRwOi8vaW50ZXJuYWwtZmMtdXNlMS0wMC1rZXljbG9hay1vYXV0aC0xMzA3MzU3NDU5LnVzLWVhc3QtMS5lbGIuYW1hem9uYXdzLmNvbS9hdXRoL3JlYWxtcy9wcm9kdWN0aW9uIiwiYXVkIjoiZmI5ODk5MmEtZmY0Mi00MDU4LWJiNjQtMjZjZjNlOTgyYzg0Iiwic3ViIjoiN2IyMTM3MTEtYzgzOS00ZWNjLTllOGMtNTk3YWE2Yjk0ZTRiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZmI5ODk5MmEtZmY0Mi00MDU4LWJiNjQtMjZjZjNlOTgyYzg0IiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiN2U0ZGMzZWYtYzQ3NC00N2Q0LWEwZjMtYjJmMmExMmZkMWJhIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6W10sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJhZ2VudDp1cGRhdGUgbWVzc2FnZTpjcmVhdGUgYWdlbnQ6Y3JlYXRlIGRhc2hib2FyZDpyZWFkIHJlcG9ydHM6ZXh0cmFjdDpyZWFkIHJlcG9ydHM6cmVhZCBhZ2VudDpyZWFkIGNvbnZlcnNhdGlvbjp1cGRhdGUgdXNlcjpkZWxldGUgY29udmVyc2F0aW9uOmNyZWF0ZSBvdXRib3VuZG1lc3NhZ2U6Z2V0IG91dGJvdW5kbWVzc2FnZTpzZW5kIHVzZXI6Y3JlYXRlIHJlcG9ydHM6ZmV0Y2ggdXNlcjp1cGRhdGUgdXNlcjpyZWFkIHJlcG9ydHM6ZXh0cmFjdCBjb252ZXJzYXRpb246cmVhZCIsImNsaWVudEhvc3QiOiIxOTIuMTY4LjEyOC4xNTkiLCJjbGllbnRJZCI6ImZiOTg5OTJhLWZmNDItNDA1OC1iYjY0LTI2Y2YzZTk4MmM4NCIsImNsaWVudEFkZHJlc3MiOiIxOTIuMTY4LjEyOC4xNTkifQ.3-6PfgPL1asTYn6IHXbi08gF-pJJ0jn2sk9nHHXljbhvDru5aqn8EFJpxqx0XBBZbRVi9U5iDa_svdgjqCtFiL10ChOdNGDPionWNBpPdIc5iMtzQIzvXTXMiBahREWM0GoveUcUDYMGHVcY6eAsy-JgobV7GNIKghYnh7ps8czZjfssb70jasytdHAufOx7KuvsmB2_TJ2n-BR8rq1b6U-ZWsxpiaVIPBiopsWCLrnKz0HajTFVE6sqZ2ikQdgMiFdFjR5-77Reuy3AWc30N0GR8cyxLGw3R5gQjegXfWA-gE7T_dQhhYRLSkLBz0taKg_uANwWr03uwgAF0EzGDA",
      "freshchatApiUrl": "https://api.freshchat.com/v2",
      "rules": [
        {
          "blocks": [
            {
              "conditions": [
                {
                  "operator": "NOT_EQUALS",
                  "value": "6ae7cb7a-68cb-4713-9f3d-16db9a177d76",
                  "key": "CHANNEL"
                }
              ],
              "matchType": "ANY"
            }
          ],
          "name": "When agent says hi",
          "isTimer": false,
          "actions": [
            {
              "type": "SEND_MESSAGE",
              "value": "hello"
            }
          ],
          "timerValue": 5,
          "triggers": [
            {
              "action": "MESSAGE_CREATE",
              "actor": "AGENT"
            }
          ],
          "matchType": "ANY",
          "invalidators": null,
          "isEnabled": true
        }
      ],
      "externalEventUrl": "https://hooks.freshworks.com/1D370FmbsTpqkJ3obU7o/MPs8wcALAbkvyEzI5N6tbn5S7kQeDQux+K/xPgA4GKuXA=="
    },
    "region": "US",
    "domain": "web.freshchat.com",
    "event": "onMessageCreate",
    "version": "1.0.0",
    "account_id": "340565781586951",
    "timestamp": 1586149300632
  };

  describe('processProductEvent', () => {
    it('triggers processProductEvent function with params', () => {
      ruleEngine.processProductEvent(
        productEventPayload as any as ProductEventPayload,
        productEventPayload.iparams.rules as any as Rule[],
        {
          isSchedulerEnabled: false
        },
        {
          url: 'something',
          token: 'asdf'
        });
    });
  });
});
