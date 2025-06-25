import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { releaseComponentPlugin, ReleaseComponentPage } from '../src/plugin';

createDevApp()
  .registerPlugin(releaseComponentPlugin)
  .addPage({
    element: <ReleaseComponentPage />,
    title: 'Root Page',
    path: '/release-component'
  })
  .render();
