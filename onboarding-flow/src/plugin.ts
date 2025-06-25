import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const onboardingFlowPlugin = createPlugin({
  id: 'onboarding-flow',
  routes: {
    root: rootRouteRef,
  },
});

export const OnboardingFlowPage = onboardingFlowPlugin.provide(
  createRoutableExtension({
    name: 'OnboardingFlowPage',
    component: () =>
      import('./components/OnboardingFlow').then(m => m.OnboardingFlow),
    mountPoint: rootRouteRef,
  }),
);
