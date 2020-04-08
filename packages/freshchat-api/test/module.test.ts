import { expect } from 'chai';
import Freshchat from '../src/index';
import 'mocha';

describe('module test', () => {
  it('should export Freshchat constructor', () => {
    expect(Freshchat).to.be.a('function');
  });
});
