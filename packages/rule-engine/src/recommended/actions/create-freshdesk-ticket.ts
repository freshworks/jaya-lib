import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import ruleConfig from '../../RuleConfig';
import { findAndReplacePlaceholders, PlaceholdersMap } from '@freshworks-jaya/utilities';
import { Integrations } from '../../models/rule-engine';
import { Utils } from '../../Utils';
import axios from 'axios';

export default (
  integrations: Integrations,
  productEventData: ProductEventData,
  actionValue: unknown,
): Promise<unknown> => {
  const freshdeskApiUrl = integrations.freshdesk && integrations.freshdesk.url;
  const freshdeskApiToken = integrations.freshdesk && integrations.freshdesk.token;

  let ticketSubject = 'Conversation with {user.first_name|user}';
  let ticketDescription = '{transcript.since_last_resolve}';

  return Utils.setupDynamicPlaceholders(`${ticketSubject}${ticketDescription}`, productEventData, integrations).then(
    () => {
      ticketSubject = findAndReplacePlaceholders(ticketSubject, ruleConfig.placeholders as PlaceholdersMap);
      ticketDescription = findAndReplacePlaceholders(ticketDescription, ruleConfig.placeholders as PlaceholdersMap);

      const { first_name: name, id: userAlias, phone } = productEventData.associations.user;
      let { email } = productEventData.associations.user;

      if (!email) {
        email = `${userAlias}@aa-freshchat.com`;
      }

      const auth = 'Basic ' + new Buffer(`${freshdeskApiToken}:X`).toString('base64');
      const body = {
        description: ticketDescription,
        email,
        name,
        phone,
        priority: 1,
        source: 7,
        status: 2,
        subject: ticketSubject,
      };
      const headers = {
        Authorization: auth,
        'Content-Type': 'application/json',
      };

      return axios
        .post(`${freshdeskApiUrl}/api/channel/v2/tickets`, JSON.stringify(body), { headers })
        .then((response) => {
          const freshdeskTicketId = response.data.id;
          const placeholders = {
            'freshdesk.ticket_id': freshdeskTicketId,
            'freshdesk.ticket_url': `${freshdeskApiUrl}/helpdesk/tickets/${freshdeskTicketId}`,
          };

          ruleConfig.registerPlugins([
            {
              placeholders,
            },
          ]);
          return Promise.resolve();
        });
    },
  );
};
