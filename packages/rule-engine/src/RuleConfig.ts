import {
  RulePlugin,
  PluginActions,
  PluginOperators,
  PluginTriggerActions,
  PluginConditions,
  PluginPlaceholders,
} from './models/plugin';

class RuleConfig {
  actions?: PluginActions = {};

  operators?: PluginOperators = {};

  triggerActions?: PluginTriggerActions = {};

  conditions?: PluginConditions = {};

  placeholders?: PluginPlaceholders = {};

  reset = (): void => {
    this.actions = {};
    this.operators = {};
    this.triggerActions = {};
    this.conditions = {};
    this.placeholders = {};
  };

  registerPlugins = (plugins: RulePlugin[]): void => {
    for (let i = 0; i < plugins.length; i++) {
      const rulePlugin = plugins[i];

      if (rulePlugin.actions) {
        this.actions = { ...this.actions, ...rulePlugin.actions };
      }

      if (rulePlugin.operators) {
        this.operators = { ...this.operators, ...rulePlugin.operators };
      }

      if (rulePlugin.triggerActions) {
        this.triggerActions = { ...this.triggerActions, ...rulePlugin.triggerActions };
      }

      if (rulePlugin.conditions) {
        this.conditions = { ...this.conditions, ...rulePlugin.conditions };
      }

      if (rulePlugin.placeholders) {
        this.placeholders = { ...this.placeholders, ...rulePlugin.placeholders };
      }
    }
  };
}

const ruleConfig = new RuleConfig();
export default ruleConfig;
