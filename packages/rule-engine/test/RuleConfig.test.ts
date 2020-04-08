import { assert } from 'chai';
import ruleConfig from '../src/RuleConfig';
import recommendedPlugins from '../src/recommended/index';
import 'mocha';
import { RulePlugin } from '../src';

describe('RuleConfig test', () => {
  afterEach(() => {
    ruleConfig.reset();
  });

  it('should store the registered plugins', () => {
    const placeholderPlugin: RulePlugin = {
      placeholders: {
        'user.first_name': 'Joy',
      },
    };

    ruleConfig.registerPlugins([...recommendedPlugins, placeholderPlugin]);

    assert.ok(ruleConfig.placeholders && ruleConfig.placeholders['user.first_name']);
  });
});
