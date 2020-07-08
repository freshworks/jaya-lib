import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import ruleConfig from '../../RuleConfig';
import { findAndReplacePlaceholders, PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Integrations } from '../../models/rule-engine';
import axios from 'axios';
import Freshchat, { User as FreshchatUser } from '@freshworks-jaya/freshchat-api';
import { Utils as FreshchatUtils } from '@freshworks-jaya/freshchat-api/lib/Utils';
import { isUsernameGenerated } from '@freshworks-jaya/utilities';

const getTicketConversationContent = async (
  freshchat: Freshchat,
  conversationId: string,
  appId: string,
  baseUrl: string,
): Promise<{ description: string; privateNote: string }> => {
  let description = '';
  let privateNote = '';

  try {
    // Step 1: Get conversation messages until last resolve
    const allMessages = await freshchat.getConversationMessages(conversationId, {
      isFetchUntilLastResolve: true,
    });

    // Step 2: Get filtered messages
    const descriptionMessages = FreshchatUtils.filterMessages(allMessages, {
      isExcludePrivate: true,
      isExcludeSystem: true,
    });

    // Step 2: Extract list of agentIds
    const agentIds = FreshchatUtils.extractAgentIds(allMessages);

    // Step 3: Get agents by id
    const agents = await freshchat.getAgentsById(agentIds);

    // Step 4: Extract userId
    const userId = FreshchatUtils.extractUserId(allMessages);

    // Step 5: Get user by id
    let user: FreshchatUser | null = null;
    if (userId) {
      user = await freshchat.getUserById(userId);

      // Check if user name is generated
      if (isUsernameGenerated(user.first_name || '')) {
        user.first_name = '';
      }
    }

    // Step 6: Get messages html
    description = FreshchatUtils.generateConversationTranscript(
      baseUrl,
      appId,
      conversationId,
      descriptionMessages,
      agents,
      user as FreshchatUser,
      {
        isIncludeFreshchatLink: false,
      },
    );
    privateNote = FreshchatUtils.generateConversationTranscript(
      baseUrl,
      appId,
      conversationId,
      allMessages,
      agents,
      user as FreshchatUser,
      {
        isIncludeFreshchatLink: true,
      },
    );
  } catch (err) {
    return Promise.reject('Error converting conversation to html');
  }

  return Promise.resolve({
    description,
    privateNote,
  });
};

export default async (
  integrations: Integrations,
  productEventData: ProductEventData,
  actionValue: unknown,
  domain: string,
): Promise<unknown> => {
  const freshdeskApiUrl = integrations.freshdesk && integrations.freshdesk.url;
  const freshdeskApiToken = integrations.freshdesk && integrations.freshdesk.token;
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties = productEventData.conversation || productEventData.message;
  const conversationId = modelProperties.conversation_id;

  try {
    let ticketSubject = 'Conversation with {user.first_name|User}';
    const ticketConversationContent = await getTicketConversationContent(
      freshchat,
      conversationId,
      modelProperties.app_id,
      `https://${domain}`,
    );

    // Step 1: Replace placeholders
    ticketSubject = findAndReplacePlaceholders(ticketSubject, ruleConfig.placeholders as PlaceholdersMap);

    const { email, first_name: name, id: userAlias, phone } = productEventData.associations.user;
    const headers = {
      Authorization: 'Basic ' + new Buffer(`${freshdeskApiToken}:X`).toString('base64'),
      'Content-Type': 'application/json',
    };

    // Step 2: Create Freshdesk Ticket
    const ticketCreateResponse = await axios.post(
      `${freshdeskApiUrl}/api/channel/v2/tickets`,
      JSON.stringify({
        description: ticketConversationContent.description,
        email: email ? email : `${userAlias}@aa-freshchat.com`,
        name: isUsernameGenerated(name || '') ? undefined : name,
        phone,
        priority: 1,
        source: 7,
        status: 2,
        subject: ticketSubject,
      }),
      {
        headers,
      },
    );

    // Step 3: Update placeholders with ticket_id and ticket_url
    const freshdeskTicketId = ticketCreateResponse.data.id;
    const placeholders = {
      'freshdesk.ticket_id': freshdeskTicketId,
      'freshdesk.ticket_url': `${freshdeskApiUrl}/helpdesk/tickets/${freshdeskTicketId}`,
    };

    ruleConfig.registerPlugins([
      {
        placeholders,
      },
    ]);

    // Step 4: Create Private Note for Freshdesk Ticket
    await axios.post(
      `${freshdeskApiUrl}/api/v2/tickets/${freshdeskTicketId}/notes`,
      JSON.stringify({
        body: ticketConversationContent.privateNote,
        incoming: true,
        private: true,
      }),
      {
        headers,
      },
    );
  } catch (err) {
    return Promise.reject('Error creating freshdesk ticket');
  }

  return Promise.resolve();
};
