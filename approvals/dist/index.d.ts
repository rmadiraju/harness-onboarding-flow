/// <reference types="react" />
import * as react from 'react';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

declare const approvalsPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}, {}>;
declare const ApprovalsPage: react.FC<{}>;

declare const rootRouteRef: _backstage_core_plugin_api.RouteRef<undefined>;

export { ApprovalsPage, approvalsPlugin, rootRouteRef };
