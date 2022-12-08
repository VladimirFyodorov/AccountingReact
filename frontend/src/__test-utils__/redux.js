import React from 'react'
import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import reducer from '../reducers';
import { mockStoreState } from './mockStoreState';

export function renderWithProviders(
  ui,
  {
    preloadedState = mockStoreState,
    // Automatically create a store instance if no store was passed in
    store = configureStore({ reducer, preloadedState }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}