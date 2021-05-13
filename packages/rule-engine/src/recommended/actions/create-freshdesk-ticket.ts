import { ProductEventPayload } from '@freshworks-jaya/marketplace-models';
import { PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Integrations } from '../../models/rule-engine';
import axios from 'axios';
import Freshchat, { User as FreshchatUser } from '@freshworks-jaya/freshchat-api';
import { Utils as FreshchatUtils } from '@freshworks-jaya/freshchat-api/lib/Utils';
import { isUsernameGenerated } from '@freshworks-jaya/utilities';
import { Utils } from '../../Utils';
import { Api } from '../../models/rule';

const getTicketConversationContent = async (
  freshchat: Freshchat,
  conversationId: string,
  appId: string,
  baseUrl: string,
  timezoneOffset: number,
): Promise<{ description: string; privateNote: string }> => {
  let description = '';
  let privateNote = '';

  try {
    // Step 1: Get conversation messages until last resolve
    const allMessages = await freshchat.getConversationMessages(conversationId, {
      isFetchUntilLastResolve: true,
      timezoneOffset,
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
        timezoneOffset,
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
        timezoneOffset,
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
  productEventPayload: ProductEventPayload,
  actionValue: unknown,
  domain: string,
  placeholders: PlaceholdersMap,
  apis: Api[],
): Promise<PlaceholdersMap> => {
  const freshdeskApiUrl = integrations.freshdesk && integrations.freshdesk.url;
  const freshdeskApiToken = integrations.freshdesk && integrations.freshdesk.token;
  const freshchatApiUrl = integrations.freshchatv2.url;
  const freshchatApiToken = integrations.freshchatv2.token;
  const freshchat = new Freshchat(freshchatApiUrl, freshchatApiToken);
  const modelProperties = productEventPayload.data.conversation || productEventPayload.data.message;
  const conversationId = modelProperties.conversation_id;
  let generatedPlaceholders = {} as PlaceholdersMap;

  try {
    let ticketSubject = 'Conversation with {user.first_name|User}';
    const ticketConversationContent = await getTicketConversationContent(
      freshchat,
      conversationId,
      modelProperties.app_id,
      `https://${domain}`,
      integrations.timezoneOffset,
    );

    // Step 1: Replace placeholders
    ticketSubject = Utils.processHandlebarsAndReplacePlaceholders(ticketSubject, placeholders);

    const { email, first_name: name, id: userAlias, phone } = productEventPayload.data.associations.user;
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

    // Step 3: Generate placeholders with ticket_id and ticket_url
    const freshdeskTicketId = ticketCreateResponse.data.id;
    generatedPlaceholders = {
      'freshdesk.ticket_id': `${freshdeskTicketId}`,
      'freshdesk.ticket_url': `${freshdeskApiUrl}/helpdesk/tickets/${freshdeskTicketId}`,
    };

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

  return Promise.resolve(generatedPlaceholders);
};
