const { withEntitlementsPlist } = require('expo/config-plugins');

// re-Genesis uses only *local* notifications, so it does not need Apple Push
// (APNs). expo-notifications' config plugin is applied automatically whenever
// the package is installed, and it unconditionally adds the `aps-environment`
// entitlement (the Push Notifications capability). That entitlement forces the
// provisioning profile to include Push Notifications, which ours does not, so
// signing fails on EAS. This plugin runs after that and removes the entitlement
// again, keeping the app signable on the existing profile with no push setup.
module.exports = function withoutApsEnvironment(config) {
  return withEntitlementsPlist(config, (cfg) => {
    delete cfg.modResults['aps-environment'];
    return cfg;
  });
};
