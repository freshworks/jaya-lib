import { RulePlugin, PluginActions, PluginOperators, PluginTriggerActions, PluginConditions } from "./models/plugin";

class RuleConfig {
  actions?: PluginActions = {};
  operators?: PluginOperators = {};
  triggerActions?: PluginTriggerActions = {};
  conditions?: PluginConditions = {};

  registerPlugins(plugins: RulePlugin[]): void {
    for (let i = 0; i < plugins.length; i++ ) {
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
    }
  };
}

const ruleConfig = new RuleConfig();
export default ruleConfig;