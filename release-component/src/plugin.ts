import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const releaseComponentPlugin = createPlugin({
  id: 'release-component',
  routes: {
    root: rootRouteRef,
  },
});

export const ReleaseComponentPage = releaseComponentPlugin.provide(
  createRoutableExtension({
    name: 'ReleaseComponentPage',
    component: () =>
      import('./components/BuildSelectorScreen').then(m => m.BuildSelectorScreen),
    mountPoint: rootRouteRef,
  }),
);
