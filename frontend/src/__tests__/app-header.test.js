import React from 'react'
import { renderWithProviders } from '../__test-utils__/redux';

import AppHeader from '../components/app-header';

test('render AppHeader', () => {
  renderWithProviders(<AppHeader />)
})
