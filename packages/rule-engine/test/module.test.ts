import { expect } from 'chai';
import { RuleEngine } from '../src/index';
import 'mocha';

describe('module test', () => {
  it('should export RuleEngine constructor', () => {
    expect(RuleEngine).to.be.a('function');
  });
});
