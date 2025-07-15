import { createRouteRef, createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

const rootRouteRef = createRouteRef({
  id: "approvals"
});

const approvalsPlugin = createPlugin({
  id: "approvals",
  routes: {
    root: rootRouteRef
  }
});
const ApprovalsPage = approvalsPlugin.provide(
  createRoutableExtension({
    name: "ApprovalsPage",
    component: () => import('./esm/index-224c0851.esm.js').then((m) => m.default),
    mountPoint: rootRouteRef
  })
);

export { ApprovalsPage, approvalsPlugin, rootRouteRef };
//# sourceMappingURL=index.esm.js.map
