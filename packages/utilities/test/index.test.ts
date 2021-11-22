import { assert } from 'chai';
import 'mocha';
import {
  isUsernameGenerated,
  findAndReplacePlaceholders,
  findMatchingKeys,
  capitalizeAll,
  capitalize,
} from '../src/index';

describe('Utils test', () => {
  describe('capitalize', () => {
    it('should return empty string when the type does not match', () => {
      assert.equal('', capitalize(123 as unknown as string));
      assert.equal('', capitalize(null as unknown as string));
      assert.equal('', capitalize(undefined));
    });

    it('should capitalize the first letter of a word or a sentence', () => {
      assert.equal('Arun', capitalize('arun'));
      assert.equal('Arun rajkumar', capitalize('arun rajkumar'));
      assert.equal('Arun  rajkumar', capitalize('arun  rajkumar'));
    });
  });

  describe('capitalizeAll', () => {
    it('should return empty string when the type does not match', () => {
      assert.equal('', capitalizeAll(123 as unknown as string));
      assert.equal('', capitalizeAll(null as unknown as string));
      assert.equal('', capitalizeAll(undefined));
    });

    it('should capitalizeAll the first letter of every word in a sentence', () => {
      assert.equal('Arun', capitalizeAll('arun'));
      assert.equal('Arun Rajkumar', capitalizeAll('arun rajkumar'));
      assert.equal('Arun Rajkumar', capitalizeAll('arun  rajkumar'));
      assert.equal('Arun Rajkumar Here', capitalizeAll('arun rajkumar here'));
    });
  });

  describe('isUsernameGenerated', () => {
    it('should return false when word count is not 2', () => {
      assert.equal(false, isUsernameGenerated('Random'), 'length 1');
      assert.equal(false, isUsernameGenerated(''), 'length 0');
      assert.equal(false, isUsernameGenerated('Random User Name'), 'length 3');
    });

    it('should return true when it is a generated username', () => {
      assert.equal(true, isUsernameGenerated('Dancing Horse'), 'generated username');
      assert.equal(true, isUsernameGenerated('Swimming Horse'), 'generated username');
      assert.equal(true, isUsernameGenerated('Swimming Banana'), 'generated username');
      assert.equal(true, isUsernameGenerated('Dancing Banana'), 'generated username');
    });

    it('should return false when it is not a generated username', () => {
      assert.equal(false, isUsernameGenerated('John Doe'), 'non generated username');
      assert.equal(false, isUsernameGenerated('Swimming Kumar'), 'non generated username');
      assert.equal(false, isUsernameGenerated('Thooking Banana'), 'non generated username');
    });
  });

  describe('findAndReplacePlaceholders', () => {
    it('should return the string without any changes', () => {
      const message = 'Welcome home!';
      assert.equal(message, findAndReplacePlaceholders(message, {}));
    });

    it('should replace {user.first_name} with value from placeholders', () => {
      const message = 'Welcome {user.first_name}';
      assert.equal('Welcome Arun', findAndReplacePlaceholders(message, { 'user.first_name': 'Arun' }));
    });

    it('should not replace placeholders which do not have a string value', () => {
      const message = 'Welcome {user.first_name}';
      assert.equal('Welcome {user.first_name}', findAndReplacePlaceholders(message, { 'user.first_name': { a: 'b' } }));
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

    it('should find matching keys', () => {
      const message = '{user.first_name}, your wait time is {metrics.average_wait_time|nothing}';
      const result = findMatchingKeys(message, { 'metrics.average_wait_time': true });
      assert.equal(result && result[0], 'metrics.average_wait_time');
    });
  });
});
