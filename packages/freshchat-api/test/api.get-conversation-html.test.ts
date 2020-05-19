import Freshchat from '../src/index';
import { User } from '../src/interfaces/User';
import { Agent } from '../src/interfaces/Agent';
import { Message } from '../src/interfaces/Message';
import nock from 'nock';
import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('api.get-conversation-html', () => {
  const freshchat = new Freshchat('https://test.freshchat.com/v2', 'TEST API TOKEN');

  describe('getConversationHtml', () => {
    let user: User;
    let agent: Agent;
    let messages: Message[];
    let res: string;

    beforeEach(() => {
      // SET UP expected request
      user = {
        avatar: {},
        created_time: '2020-05-15T06:20:09.846Z',
        first_name: 'Sudhir',
        id: '90b8218f-0fe7-49ab-889c-5e86b0f6e103',
        properties: [
          {
            name: 'fc_user_timezone',
            value: 'Asia/Calcutta',
          },
          {
            name: 'plan',
            value: 'estate',
          },
        ],
      };

      agent = {
        avatar: {
          url: 'random-url',
        },
        email: 'arun.rajkumar+appathon@freshworks.com',
        first_name: 'Arrun',
        groups: ['e90e2b42-4054-487a-a615-bb29fe216f53'],
        id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
        is_deactivated: false,
        last_name: 'Rajkummar',
        role_id: 'OWNER',
        skill_id: '437cee42-2958-4485-9239-70fdfd2c770a',
        social_profiles: [],
      };

      messages = ([
        {
          actor_id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
          actor_type: 'agent',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-19T00:51:19.189Z',
          id: '40e0d330-6124-4c1b-8305-4de147e5cc6d',
          message_parts: [
            {
              text: {
                content: 'This was sent on 19th May, 6.21AM',
              },
            },
          ],
          message_source: 'web',
          message_type: 'normal',
        },
        {
          actor_id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
          actor_type: 'agent',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-17T14:00:32.287Z',
          id: 'b2013a1f-7a8e-4136-8250-52a2ec79f4e9',
          message_parts: [
            {
              text: {
                content: 'One message here',
              },
            },
            {
              text: {
                content: '\r\n',
              },
            },
            {
              image: {
                url:
                  'https://fc-use1-00-pics-bkt-00.s3.amazonaws.com/c77f9c769eebb1eec12ea8c4370369ea53c4c54c148320debc904d36a1948336/f_marketingpicFull/u_711a45dd1db4d802f5bcf3d821e3ae093739cff445a2077a3072abc7d0a34d75/img_1589724029304.png',
              },
            },
            {
              text: {
                content: 'Another message here',
              },
            },
          ],
          message_source: 'web',
          message_type: 'normal',
        },
        {
          actor_id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
          actor_type: 'agent',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:23:58.851Z',
          id: 'f627a571-a264-4a46-b2fd-2db1d486c2e7',
          message_parts: [
            {
              text: {
                content: 'I will let this conversation autoresolve now.',
              },
            },
          ],
          message_source: 'web',
          message_type: 'normal',
        },
        {
          actor_id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
          actor_type: 'agent',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:23:51.330Z',
          id: '976ed434-c9f2-47fc-a8e8-d7cbc6c1039a',
          message_parts: [
            {
              text: {
                content: 'okay',
              },
            },
          ],
          message_source: 'web',
          message_type: 'normal',
        },
        {
          actor_id: '90b8218f-0fe7-49ab-889c-5e86b0f6e103',
          actor_type: 'user',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:23:49.261Z',
          id: 'fa31d657-4a31-40cc-acee-258d21bba6dd',
          message_parts: [
            {
              text: {
                content: 'now tell me',
              },
            },
          ],
          message_source: 'web',
          message_type: 'normal',
        },
        {
          actor_id: '90b8218f-0fe7-49ab-889c-5e86b0f6e103',
          actor_type: 'user',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:23:46.059Z',
          id: '8f42141f-80aa-44b8-bed4-db4eb434d390',
          message_parts: [
            {
              text: {
                content: 'surely that is possible.',
              },
            },
          ],
          message_source: 'web',
          message_type: 'normal',
        },
        {
          actor_id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
          actor_type: 'agent',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:23:39.898Z',
          id: 'df38924d-904d-4a3f-a4e7-23002cb37dda',
          message_parts: [
            {
              text: {
                content: 'you say we do',
              },
            },
          ],
          message_source: 'web',
          message_type: 'normal',
        },
        {
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:21:35.221Z',
          id: '2833911c-e69e-402e-b8b7-350f1795a800',
          message_parts: [
            {
              text: {
                content: 'Assignment rule assigned the group Support to this conversation.',
              },
            },
          ],
          message_source: 'api',
          message_type: 'system',
        },
        {
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:21:35.217Z',
          id: '570d69b1-31f4-4cca-9cf6-36f3859b0495',
          message_parts: [
            {
              text: {
                content: 'System reopened the conversation due to user message <b>assigngroup</b>',
              },
            },
          ],
          message_source: 'api',
          message_type: 'system',
        },
        {
          actor_id: '90b8218f-0fe7-49ab-889c-5e86b0f6e103',
          actor_type: 'user',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:21:32.803Z',
          id: 'dd230b13-0bc2-44a5-af4f-985e17e22a71',
          message_parts: [
            {
              text: {
                content: 'Conversation was assigned to group Support by Rule: Assign a group to a conversation',
              },
            },
          ],
          message_source: 'system',
          message_type: 'system',
        },
        {
          actor_id: '90b8218f-0fe7-49ab-889c-5e86b0f6e103',
          actor_type: 'user',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:21:32.759Z',
          id: '91c91307-6422-4c58-96be-48551c56483d',
          message_parts: [
            {
              text: {
                content: 'Conversation reopened due to new incoming message',
              },
            },
          ],
          message_source: 'system',
          meta_data: {
            isReopen: true,
          },
        },
        {
          actor_id: '90b8218f-0fe7-49ab-889c-5e86b0f6e103',
          actor_type: 'user',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:21:32.715Z',
          id: '0a26a6b9-a7c3-49d8-8c79-016038f43d54',
          message_parts: [
            {
              text: {
                content: 'assigngroup',
              },
            },
          ],
          message_source: 'web',
          message_type: 'normal',
        },
        {
          actor_id: 'bc26517a-4d92-4c35-a496-f506fe32ba40',
          actor_type: 'agent',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:21:25.092Z',
          id: '45edc9ff-62ee-4fe2-b9ca-b9b67c3b92cf',
          message_parts: [
            {
              text: {
                content: 'Conversation was marked resolved by Arrun Rajkummar',
              },
            },
          ],
          message_source: 'system',
          meta_data: {
            isResolved: true,
          },
        },
        {
          actor_id: '90b8218f-0fe7-49ab-889c-5e86b0f6e103',
          actor_type: 'user',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:20:48.986Z',
          id: '5a911021-e9d5-4ea0-b242-8f70c5825736',
          message_parts: [
            {
              text: {
                content: 'assigngroup',
              },
            },
          ],
          message_source: 'web',
          message_type: 'normal',
        },
        {
          actor_id: '90b8218f-0fe7-49ab-889c-5e86b0f6e103',
          actor_type: 'user',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:20:35.575Z',
          id: 'b8a0f199-cc1f-4c33-a3e3-206de20051a1',
          message_parts: [
            {
              text: {
                content: 'assigngroup',
              },
            },
          ],
          message_source: 'web',
          message_type: 'normal',
        },
        {
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:20:12.678Z',
          id: '78845f08-3d2c-4369-a548-b2d94f0527b1',
          message_parts: [
            {
              text: {
                content: 'Assignment Rule assigned Arun to this conversation.',
              },
            },
          ],
          message_source: 'api',
          message_type: 'system',
        },
        {
          actor_id: '90b8218f-0fe7-49ab-889c-5e86b0f6e103',
          actor_type: 'user',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:20:10.388Z',
          id: '7806c3de-1cd6-419e-a72c-aad521eb3f04',
          message_parts: [
            {
              text: {
                content: 'Conversation was assigned to Arun Rajkumar by Rule: Assign an agent',
              },
            },
          ],
          message_source: 'system',
          message_type: 'system',
        },
        {
          actor_id: '90b8218f-0fe7-49ab-889c-5e86b0f6e103',
          actor_type: 'user',
          app_id: '54e8875f-214b-4574-b345-e226c92ac0ab',
          channel_id: '1200b97d-c1bd-48a6-9394-8069fe40526a',
          conversation_id: '748f2ce8-0813-481c-88f4-3007c384a5a4',
          created_time: '2020-05-15T06:20:10.258Z',
          id: '5c78ce86-ce83-4833-a94b-53838fbdbd01',
          message_parts: [
            {
              text: {
                content: 'assignagent',
              },
            },
          ],
          message_source: 'web',
          message_type: 'normal',
        },
      ] as unknown) as Message[];

      res = `<table style="margin-left: auto;margin-right: auto;">
      <tr>
        <td>
          <table style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;margin:0px auto;background: #f4f8fa;overflow: auto;padding: 0 15px; min-width: 500px; margin: 0px;">
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #333;color: #3f3f46;">
                      <div style="padding:0 5px 0 0;font-size:12px; color: #6f7071;margin-left: 33px;">
                          Sudhir
                      </div>
                      <img 
                        src=
                            https://images.freshchat.com/30x30/fresh-chat-names/anonymous.png
                        style="width: 30px;height: 30px;border-radius: 50% 6px 50% 50%;float:left;margin-right: 3px;">
                      <div style="border-radius: 4px 20px 20px;line-height: 21px;background: #a8ddfd;max-width: 300px;padding: 12px;float: left;">
                          <div>
                              assignagent
                          </div>
                      </div>
                      <div style="color: #999999; font-size: 11px; clear: left;margin-left: 33px;">
                        11:50 AM, 15th May +05:30
                      </div>
                    </td>
                  <tr>
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #3f3f46;">
                      <div style="float:right">
                        <div style="font-size: 12px;font-weight: 500;float: right; color: #6f7071; margin-right: 33px;">
                            Bot
                        </div>
                        <img 
                          src=
                              https://images.freshchat.com/30x30/fresh-chat-names/anonymous.png
                            
                          style="width: 30px;height: 30px;border-radius: 6px 50% 50% 50%;margin-left:5px;float:right;clear:right">
                        <div style="float: right;line-height: 20.4px;border-radius: 20px 4px 20px 20px;background-color: #ffffff;max-width: 300px;padding: 12px;">
                            <div style="font-size: 13.6px">
                                Assignment Rule assigned Arun to this conversation.
                            </div>
                        </div>
                        <div style="color: #999999;font-size: 11px;clear: right;">
                          11:50 AM, 15th May +05:30
                        </div>
                      </div>
                    </td>
                  <tr>
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #333;color: #3f3f46;">
                      <div style="padding:0 5px 0 0;font-size:12px; color: #6f7071;margin-left: 33px;">
                          Sudhir
                      </div>
                      <img 
                        src=
                            https://images.freshchat.com/30x30/fresh-chat-names/anonymous.png
                        style="width: 30px;height: 30px;border-radius: 50% 6px 50% 50%;float:left;margin-right: 3px;">
                      <div style="border-radius: 4px 20px 20px;line-height: 21px;background: #a8ddfd;max-width: 300px;padding: 12px;float: left;">
                          <div>
                              assigngroup
                          </div>
                      </div>
                      <div style="color: #999999; font-size: 11px; clear: left;margin-left: 33px;">
                        11:50 AM, 15th May +05:30
                      </div>
                    </td>
                  <tr>
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #333;color: #3f3f46;">
                      <div style="padding:0 5px 0 0;font-size:12px; color: #6f7071;margin-left: 33px;">
                          Sudhir
                      </div>
                      <img 
                        src=
                            https://images.freshchat.com/30x30/fresh-chat-names/anonymous.png
                        style="width: 30px;height: 30px;border-radius: 50% 6px 50% 50%;float:left;margin-right: 3px;">
                      <div style="border-radius: 4px 20px 20px;line-height: 21px;background: #a8ddfd;max-width: 300px;padding: 12px;float: left;">
                          <div>
                              assigngroup
                          </div>
                      </div>
                      <div style="color: #999999; font-size: 11px; clear: left;margin-left: 33px;">
                        11:50 AM, 15th May +05:30
                      </div>
                    </td>
                  <tr>
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #333;color: #3f3f46;">
                      <div style="padding:0 5px 0 0;font-size:12px; color: #6f7071;margin-left: 33px;">
                          Sudhir
                      </div>
                      <img 
                        src=
                            https://images.freshchat.com/30x30/fresh-chat-names/anonymous.png
                        style="width: 30px;height: 30px;border-radius: 50% 6px 50% 50%;float:left;margin-right: 3px;">
                      <div style="border-radius: 4px 20px 20px;line-height: 21px;background: #a8ddfd;max-width: 300px;padding: 12px;float: left;">
                          <div>
                              assigngroup
                          </div>
                      </div>
                      <div style="color: #999999; font-size: 11px; clear: left;margin-left: 33px;">
                        11:51 AM, 15th May +05:30
                      </div>
                    </td>
                  <tr>
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #3f3f46;">
                      <div style="float:right">
                        <div style="font-size: 12px;font-weight: 500;float: right; color: #6f7071; margin-right: 33px;">
                            Bot
                        </div>
                        <img 
                          src=
                              https://images.freshchat.com/30x30/fresh-chat-names/anonymous.png
                            
                          style="width: 30px;height: 30px;border-radius: 6px 50% 50% 50%;margin-left:5px;float:right;clear:right">
                        <div style="float: right;line-height: 20.4px;border-radius: 20px 4px 20px 20px;background-color: #ffffff;max-width: 300px;padding: 12px;">
                            <div style="font-size: 13.6px">
                                System reopened the conversation due to user message <b>assigngroup</b>
                            </div>
                        </div>
                        <div style="color: #999999;font-size: 11px;clear: right;">
                          11:51 AM, 15th May +05:30
                        </div>
                      </div>
                    </td>
                  <tr>
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #3f3f46;">
                      <div style="float:right">
                        <div style="font-size: 12px;font-weight: 500;float: right; color: #6f7071; margin-right: 33px;">
                            Bot
                        </div>
                        <img 
                          src=
                              https://images.freshchat.com/30x30/fresh-chat-names/anonymous.png
                            
                          style="width: 30px;height: 30px;border-radius: 6px 50% 50% 50%;margin-left:5px;float:right;clear:right">
                        <div style="float: right;line-height: 20.4px;border-radius: 20px 4px 20px 20px;background-color: #ffffff;max-width: 300px;padding: 12px;">
                            <div style="font-size: 13.6px">
                                Assignment rule assigned the group Support to this conversation.
                            </div>
                        </div>
                        <div style="color: #999999;font-size: 11px;clear: right;">
                          11:51 AM, 15th May +05:30
                        </div>
                      </div>
                    </td>
                  <tr>
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #3f3f46;">
                      <div style="float:right">
                        <div style="font-size: 12px;font-weight: 500;float: right; color: #6f7071; margin-right: 33px;">
                              Arrun
                        </div>
                        <img 
                          src=
                                  https://fc-use1-00-pics-bkt-00.s3.amazonaws.com/c77f9c769eebb1eec12ea8c4370369ea53c4c54c148320debc904d36a1948336/f_marketingpicFull/u_711a45dd1db4d802f5bcf3d821e3ae093739cff445a2077a3072abc7d0a34d75/img_1589848722580.png
                            
                          style="width: 30px;height: 30px;border-radius: 6px 50% 50% 50%;margin-left:5px;float:right;clear:right">
                        <div style="float: right;line-height: 20.4px;border-radius: 20px 4px 20px 20px;background-color: #ffffff;max-width: 300px;padding: 12px;">
                            <div style="font-size: 13.6px">
                                you say we do
                            </div>
                        </div>
                        <div style="color: #999999;font-size: 11px;clear: right;">
                          11:53 AM, 15th May +05:30
                        </div>
                      </div>
                    </td>
                  <tr>
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #333;color: #3f3f46;">
                      <div style="padding:0 5px 0 0;font-size:12px; color: #6f7071;margin-left: 33px;">
                          Sudhir
                      </div>
                      <img 
                        src=
                            https://images.freshchat.com/30x30/fresh-chat-names/anonymous.png
                        style="width: 30px;height: 30px;border-radius: 50% 6px 50% 50%;float:left;margin-right: 3px;">
                      <div style="border-radius: 4px 20px 20px;line-height: 21px;background: #a8ddfd;max-width: 300px;padding: 12px;float: left;">
                          <div>
                              surely that's possible.
                          </div>
                      </div>
                      <div style="color: #999999; font-size: 11px; clear: left;margin-left: 33px;">
                        11:53 AM, 15th May +05:30
                      </div>
                    </td>
                  <tr>
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #333;color: #3f3f46;">
                      <div style="padding:0 5px 0 0;font-size:12px; color: #6f7071;margin-left: 33px;">
                          Sudhir
                      </div>
                      <img 
                        src=
                            https://images.freshchat.com/30x30/fresh-chat-names/anonymous.png
                        style="width: 30px;height: 30px;border-radius: 50% 6px 50% 50%;float:left;margin-right: 3px;">
                      <div style="border-radius: 4px 20px 20px;line-height: 21px;background: #a8ddfd;max-width: 300px;padding: 12px;float: left;">
                          <div>
                              now tell me
                          </div>
                      </div>
                      <div style="color: #999999; font-size: 11px; clear: left;margin-left: 33px;">
                        11:53 AM, 15th May +05:30
                      </div>
                    </td>
                  <tr>
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #3f3f46;">
                      <div style="float:right">
                        <div style="font-size: 12px;font-weight: 500;float: right; color: #6f7071; margin-right: 33px;">
                              Arrun
                        </div>
                        <img 
                          src=
                                  https://fc-use1-00-pics-bkt-00.s3.amazonaws.com/c77f9c769eebb1eec12ea8c4370369ea53c4c54c148320debc904d36a1948336/f_marketingpicFull/u_711a45dd1db4d802f5bcf3d821e3ae093739cff445a2077a3072abc7d0a34d75/img_1589848722580.png
                            
                          style="width: 30px;height: 30px;border-radius: 6px 50% 50% 50%;margin-left:5px;float:right;clear:right">
                        <div style="float: right;line-height: 20.4px;border-radius: 20px 4px 20px 20px;background-color: #ffffff;max-width: 300px;padding: 12px;">
                            <div style="font-size: 13.6px">
                                okay
                            </div>
                        </div>
                        <div style="color: #999999;font-size: 11px;clear: right;">
                          11:53 AM, 15th May +05:30
                        </div>
                      </div>
                    </td>
                  <tr>
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #3f3f46;">
                      <div style="float:right">
                        <div style="font-size: 12px;font-weight: 500;float: right; color: #6f7071; margin-right: 33px;">
                              Arrun
                        </div>
                        <img 
                          src=
                                  https://fc-use1-00-pics-bkt-00.s3.amazonaws.com/c77f9c769eebb1eec12ea8c4370369ea53c4c54c148320debc904d36a1948336/f_marketingpicFull/u_711a45dd1db4d802f5bcf3d821e3ae093739cff445a2077a3072abc7d0a34d75/img_1589848722580.png
                            
                          style="width: 30px;height: 30px;border-radius: 6px 50% 50% 50%;margin-left:5px;float:right;clear:right">
                        <div style="float: right;line-height: 20.4px;border-radius: 20px 4px 20px 20px;background-color: #ffffff;max-width: 300px;padding: 12px;">
                            <div style="font-size: 13.6px">
                                I'll let this conversation autoresolve now.
                            </div>
                        </div>
                        <div style="color: #999999;font-size: 11px;clear: right;">
                          11:53 AM, 15th May +05:30
                        </div>
                      </div>
                    </td>
                  <tr>
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #3f3f46;">
                      <div style="float:right">
                        <div style="font-size: 12px;font-weight: 500;float: right; color: #6f7071; margin-right: 33px;">
                              Arrun
                        </div>
                        <img 
                          src=
                                  https://fc-use1-00-pics-bkt-00.s3.amazonaws.com/c77f9c769eebb1eec12ea8c4370369ea53c4c54c148320debc904d36a1948336/f_marketingpicFull/u_711a45dd1db4d802f5bcf3d821e3ae093739cff445a2077a3072abc7d0a34d75/img_1589848722580.png
                            
                          style="width: 30px;height: 30px;border-radius: 6px 50% 50% 50%;margin-left:5px;float:right;clear:right">
                        <div style="float: right;line-height: 20.4px;border-radius: 20px 4px 20px 20px;background-color: #ffffff;max-width: 300px;padding: 12px;">
                            <div style="font-size: 13.6px">
                                One message here
                            </div>
                            <div style="font-size: 13.6px">
                                
    
                            </div>
                            <div style="font-size: 13.6px">
                                <img src=https://fc-use1-00-pics-bkt-00.s3.amazonaws.com/c77f9c769eebb1eec12ea8c4370369ea53c4c54c148320debc904d36a1948336/f_marketingpicFull/u_711a45dd1db4d802f5bcf3d821e3ae093739cff445a2077a3072abc7d0a34d75/img_1589724029304.png></img>
                            </div>
                            <div style="font-size: 13.6px">
                                Another message here
                            </div>
                        </div>
                        <div style="color: #999999;font-size: 11px;clear: right;">
                          07:30 PM, 17th May +05:30
                        </div>
                      </div>
                    </td>
                  <tr>
                  <tr style="border: none;">
                    <td style="padding: 10px 20px;color: #3f3f46;">
                      <div style="float:right">
                        <div style="font-size: 12px;font-weight: 500;float: right; color: #6f7071; margin-right: 33px;">
                              Arrun
                        </div>
                        <img 
                          src=
                                  https://fc-use1-00-pics-bkt-00.s3.amazonaws.com/c77f9c769eebb1eec12ea8c4370369ea53c4c54c148320debc904d36a1948336/f_marketingpicFull/u_711a45dd1db4d802f5bcf3d821e3ae093739cff445a2077a3072abc7d0a34d75/img_1589848722580.png
                            
                          style="width: 30px;height: 30px;border-radius: 6px 50% 50% 50%;margin-left:5px;float:right;clear:right">
                        <div style="float: right;line-height: 20.4px;border-radius: 20px 4px 20px 20px;background-color: #ffffff;max-width: 300px;padding: 12px;">
                            <div style="font-size: 13.6px">
                                This was sent on 19th May, 6.21AM
                            </div>
                        </div>
                        <div style="color: #999999;font-size: 11px;clear: right;">
                          06:21 AM, 19th May +05:30
                        </div>
                      </div>
                    </td>
                  <tr>
          </table>
        </td>
      </tr>
    </table>`;

      nock('https://test.freshchat.com/v2').get('/users/1').reply(200, user);
      nock('https://test.freshchat.com/v2').get('/agents/1').reply(200, agent);
      nock('https://test.freshchat.com/v2')
        .get(/\/conversations\/1\/messages\?page=1.*/)
        .reply(200, { messages: messages });
      nock.activate();
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should get html of entire conversation', () => {
      expect(freshchat.getConversationHtml('1')).to.be.eventually.equal(res);
    });
  });

  describe('getConversationHtml failure', () => {
    beforeEach(() => {
      nock('https://test.freshchat.com/v2')
        .get(/\/conversations\/1\/messages\?page=1.*/)
        .reply(500);
      nock.activate();
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('should get html of entire conversation', () => {
      expect(freshchat.getConversationHtml('1')).to.eventually.throw('Error fetching conversationHtml');
    });
  });
});
