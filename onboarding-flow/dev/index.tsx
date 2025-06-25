import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { onboardingFlowPlugin, OnboardingFlowPage } from '../src/plugin';

createDevApp()
  .registerPlugin(onboardingFlowPlugin)
  .addPage({
    element: <OnboardingFlowPage />,
    title: 'Root Page',
    path: '/onboarding-flow'
  })
  .render();
