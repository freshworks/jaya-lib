import 'mocha';
import { assert } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import { ProductEventData } from '@freshworks-jaya/marketplace-models';
import ruleConfig from '../src/RuleConfig';
import recommendedPlugins from '../src/recommended/index';
import { ActionExecutor } from '../src/ActionExecutor';
import { PluginPlaceholders } from '../src';

describe('ActionExecutor test', () => {
  const productEventDataWihoutAssociations = {
    actor: {
      type: 'agent',
    },
    message: {},
    associations: {
      channel: {},
    },
  };

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

    it('should have empty strings for all the placeholders', () => {
      ActionExecutor.setupPlaceholders((productEventDataWihoutAssociations as any) as ProductEventData);

      Object.keys(ruleConfig.placeholders as PluginPlaceholders).forEach((placeholder) => {
        if (ruleConfig.placeholders) {
          assert.ok(ruleConfig.placeholders[placeholder] === '');
        }
      });
    });

    it('check for generated username', () => {
      ActionExecutor.setupPlaceholders((productEventDataForGeneratedUsername as any) as ProductEventData);

      if (ruleConfig.placeholders) {
        assert.ok(ruleConfig.placeholders['user.first_name'] === '');
      }
    });
  });
});
