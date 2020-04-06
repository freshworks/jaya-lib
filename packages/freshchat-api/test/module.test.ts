import Freshchat from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('module test', () => {
  it('should export Freshchat constructor', () => {
    expect(Freshchat).to.be.a('function');
  });
});
