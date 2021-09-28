import 'mocha';
import { assert } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import ruleConfig from '../src/RuleConfig';
import recommendedPlugins from '../src/recommended/index';
import { ActionExecutor } from '../src/ActionExecutor';
import RequestProxy from '../src/services/RequestProxy';

describe('ActionExecutor test', () => {
  const productEventDataForGeneratedUsername = {
    actor: {
      type: 'user',
    },
    message: {},
    associations: {
      channel: {},
      user: {
        first_name: 'Dancing Horse',
      },
    },
  };

  describe('setupPlaceholders', () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      ruleConfig.registerPlugins(recommendedPlugins);
    });

    afterEach(() => {
      sandbox.restore();
      ruleConfig.reset();
    });

    it('check for generated username', () => {
      const placeholders = ActionExecutor.getPlaceholders(
        productEventDataForGeneratedUsername as any as ProductEventData,
        {
          freshchatv1: {
            token: 'tokenv1',
            url: 'urlv1',
          },
          freshchatv2: {
            token: 'tokenv2',
            url: 'urlv2',
          },
          googleCloudLoggingConfig: {
            project_id: 'projectid',
            private_key: 'privatekey',
            client_email: 'emailaddresshere',
            logName: 'jaya-lib',
          },
          marketplaceServices: {
            requestProxy: {} as unknown as RequestProxy,
          },
          timezoneOffset: -330,
        },
      );

      if (placeholders) {
        assert.ok(placeholders['user.first_name'] === '');
      }
    });
  });
});
