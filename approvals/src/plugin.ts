import { createPlugin } from '@backstage/core-plugin-api';
import { createRoutableExtension } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

export const approvalsPlugin = createPlugin({
  id: 'approvals',
  routes: {
    root: rootRouteRef,
  },
});

export const ApprovalsPage = approvalsPlugin.provide(
  createRoutableExtension({
    name: 'ApprovalsPage',
    component: () => import('./components/ApprovalsPage').then(m => m.default),
    mountPoint: rootRouteRef,
  }),
); 