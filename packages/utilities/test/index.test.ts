import { assert } from 'chai';
import 'mocha';
import { findAndReplacePlaceholders } from '../src/index';

describe('Utils test', () => {
  describe('findAndReplacePlaceholders', () => {
    it('should return the string without any changes', () => {
      const message = 'Welcome home!';
      assert.equal(message, findAndReplacePlaceholders(message, {}));
    });

    it('should replace {user.first_name} with value from placeholders', () => {
      const message = 'Welcome {user.first_name}';
      assert.equal('Welcome Arun', findAndReplacePlaceholders(message, { 'user.first_name': 'Arun' }));
    });

    it('should replace {user.first_name|there} with value from altText when value is not available in placeholders', () => {
      const message = 'Welcome {user.first_name|there}';
      assert.equal('Welcome there', findAndReplacePlaceholders(message, { 'user.first_name': '' }));
    });

    it('should preserve white spaces in altText', () => {
      const message = 'Welcome {user.first_name| wonder full userrrr }';
      assert.equal('Welcome  wonder full userrrr ', findAndReplacePlaceholders(message, { 'user.first_name': '' }));
    });

    it('should replace {user.first_name} with empty string when value is not available in placeholders', () => {
      const message = 'Welcome {user.first_name}';
      assert.equal('Welcome ', findAndReplacePlaceholders(message, { 'user.first_name': '' }));
    });

    it('should not replace {user.first_name} when the placeholder key is not available in placeholders', () => {
      const message = 'Welcome {user.first_name}';
      assert.equal(message, findAndReplacePlaceholders(message, {}));
    });
  });
});
