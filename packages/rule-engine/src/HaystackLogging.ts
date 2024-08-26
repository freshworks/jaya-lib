/*
* This logger is responsible for pushing the app level logs to the HayStack
* Read more on the same here : https://confluence.freshworks.com/display/MAR/Implementation+of+Haystack+Logger+API+for+App+Level+Logs
*/

export default class LoggerAPI {

  haystackConfig = {
    endPoint: '',
    authToken: ''
  };

  constructor(config : { url: string, apiKey: string }) {
    this.haystackConfig = {
      endPoint: config.url,
      authToken: config.apiKey,
    };
  }

  async logRequest(options: { requestType: any; url: any; headers: any; data: any; }) {
    try {
      const { requestType, url, headers, data: body } = options;

      await fetch(url, {
        method: requestType,
        headers: headers,
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error('Error while pushing logs to Haystack', error);    
    }
    
  }

  getPayload(payload:any) {
    return [{
      e_ts: new Date().getTime(),
      event_epoch: payload.event_epoch,
      msg: `[Advanced_automation] [${payload.appAlias}] [${payload.conversation_id}] ${payload.error_code}`,
      appAlias: payload.appAlias,
      conversation_id: payload.conversationId,
      message_id: payload.message_id,
      actor_subentity: payload.actor_subentity,
      actor_type: payload.actor_type,
      err_type: payload.info?.errorType,
      err_code: payload.error_code,
      info: JSON.stringify(payload.info),
      region: payload.region,
      severity: payload.severity,
      acc_region: payload.region,
      acc_id: payload.appAlias,
    }];
  }

  async sendHaystackLogs(payload:any) {

    if (!payload || !this.haystackConfig) {
      throw new Error('Nothing to push or Haystack config is not yet set');
    }

    let logObj = this.getPayload(payload);

    return this.logRequest({
      requestType: 'POST',
      url: this.haystackConfig.endPoint,
      headers: {
        'Content-type': 'application/json',
        'x-auth-token': this.haystackConfig.authToken
      },
      data: {
        meta: {
          /* Combined Product Details in Event Payload from this.context */
        },
        events: logObj
      }
    });
  }

}