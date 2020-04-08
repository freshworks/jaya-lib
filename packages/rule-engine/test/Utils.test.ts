import { assert } from 'chai';
import { Utils } from '../src/Utils';
import 'mocha';
import ruleConfig from '../src/RuleConfig';
import { ConditionOperator } from '../src/models/rule';

describe('Utils test', () => {
  describe('findAndReplacePlaceholders', () => {
    it('should return the string without any changes', () => {
      const message = 'Welcome home!';
      assert.equal(message, Utils.findAndReplacePlaceholders(message, {}));
    });

    it('should replace {user.first_name} with value from placeholders', () => {
      const message = 'Welcome {user.first_name}';
      assert.equal('Welcome Arun', Utils.findAndReplacePlaceholders(message, { 'user.first_name': 'Arun' }));
    });

    it('should replace {user.first_name|there} with value from altText when value is not available in placeholders', () => {
      const message = 'Welcome {user.first_name|there}';
      assert.equal('Welcome there', Utils.findAndReplacePlaceholders(message, { 'user.first_name': '' }));
    });

    it('should replace {user.first_name} with empty string when value is not available in placeholders', () => {
      const message = 'Welcome {user.first_name}';
      assert.equal('Welcome ', Utils.findAndReplacePlaceholders(message, { 'user.first_name': '' }));
    });

    it('should not replace {user.first_name} when the placeholder key is not available in placeholders', () => {
      const message = 'Welcome {user.first_name}';
      assert.equal(message, Utils.findAndReplacePlaceholders(message, {}));
    });
  });

  describe('isUsernameGenerated', () => {
    it('should return false when word count is not 2', () => {
      assert.equal(false, Utils.isUsernameGenerated('Random'), 'length 1');
      assert.equal(false, Utils.isUsernameGenerated(''), 'length 0');
      assert.equal(false, Utils.isUsernameGenerated('Random User Name'), 'length 3');
    });

    it('should return true when it is a generated username', () => {
      assert.equal(true, Utils.isUsernameGenerated('Dancing Horse'), 'generated username');
      assert.equal(true, Utils.isUsernameGenerated('Swimming Horse'), 'generated username');
      assert.equal(true, Utils.isUsernameGenerated('Swimming Banana'), 'generated username');
      assert.equal(true, Utils.isUsernameGenerated('Dancing Banana'), 'generated username');
    });

    it('should return false when it is not a generated username', () => {
      assert.equal(false, Utils.isUsernameGenerated('John Doe'), 'non generated username');
      assert.equal(false, Utils.isUsernameGenerated('Swimming Kumar'), 'non generated username');
      assert.equal(false, Utils.isUsernameGenerated('Thooking Banana'), 'non generated username');
    });
  });

  describe('convertOperand', () => {
    it('should trim the string', () => {
      assert.equal('one', Utils.convertOperand('one '));
      assert.equal('one', Utils.convertOperand(' one'));
      assert.equal('one', Utils.convertOperand(' one '));
      assert.equal('one', Utils.convertOperand('one'));
    });

    it('should lowercase the string', () => {
      assert.equal('one', Utils.convertOperand('One'));
      assert.equal('one', Utils.convertOperand('onE'));
      assert.equal('one', Utils.convertOperand('ONE'));
    });

    it('should return an empty string when param is not string', () => {
      assert.equal('', Utils.convertOperand((undefined as any) as string));
    });
  });

  describe('evaluateCondition', () => {
    beforeEach(() => {
      ruleConfig.registerPlugins([
        {
          operators: {
            EQUALS: (op1: string, op2: string): boolean => {
              return op1 === op2;
            },
          },
        },
      ]);
    });

    afterEach(() => {
      ruleConfig.reset();
    });

    it('should evaluate EQUALS condition', () => {
      assert.equal(true, Utils.evaluateCondition('EQUALS' as ConditionOperator, 'a', 'a'));
      assert.equal(false, Utils.evaluateCondition('EQUALS' as ConditionOperator, 'a', 'b'));
    });

    it('should handle the condition when operator is not available', () => {
      try {
        Utils.evaluateCondition('NOT_EQUALS' as ConditionOperator, 'a', 'b');
      } catch (err) {
        assert('threw an exception when operator was not available');
      }
    });
  });
});
