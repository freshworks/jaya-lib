import { assert } from 'chai';
import ruleConfig from '../src/RuleConfig';
import recommendedPlugins from '../src/recommended/index';
import 'mocha';

describe('RuleConfig test', () => {
  afterEach(() => {
    ruleConfig.reset();
  });

  it('should store the registered plugins', () => {
    ruleConfig.registerPlugins([...recommendedPlugins]);

    assert.ok(ruleConfig.dynamicPlaceholders && ruleConfig.dynamicPlaceholders['metrics.average_wait_time']);
  });
});
