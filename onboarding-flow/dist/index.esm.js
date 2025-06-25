import { createRouteRef, createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

const rootRouteRef = createRouteRef({
  id: "onboarding-flow"
});

const onboardingFlowPlugin = createPlugin({
  id: "onboarding-flow",
  routes: {
    root: rootRouteRef
  }
});
const OnboardingFlowPage = onboardingFlowPlugin.provide(
  createRoutableExtension({
    name: "OnboardingFlowPage",
    component: () => import('./esm/index-a22e6568.esm.js').then((m) => m.OnboardingFlow),
    mountPoint: rootRouteRef
  })
);

export { OnboardingFlowPage, onboardingFlowPlugin };
//# sourceMappingURL=index.esm.js.map
