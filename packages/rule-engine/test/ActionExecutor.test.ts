import 'mocha';
import { assert } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import ruleConfig from '../src/RuleConfig';
import recommendedPlugins from '../src/recommended/index';
import { ActionExecutor } from '../src/ActionExecutor';

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
        (productEventDataForGeneratedUsername as any) as ProductEventData,
      );

      if (placeholders) {
        assert.ok(placeholders['user.first_name'] === '');
      }
    });
  });
});
