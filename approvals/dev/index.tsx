import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { approvalsPlugin, ApprovalsPage } from '../src';

createDevApp()
  .registerPlugin(approvalsPlugin)
  .addPage({
    element: <ApprovalsPage />,
    title: 'Approvals',
    path: '/approvals',
  })
  .render(); 