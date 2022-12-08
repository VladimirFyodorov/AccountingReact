import React from 'react';
import { screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../__test-utils__/redux';
import AppHeader from '../components/app-header';

afterEach(() => {
	cleanup();
});

test('render AppHeader', () => {
  const { container } = renderWithProviders(<AppHeader />);

	const links = screen.getAllByRole('link');

	expect(links[0]).toHaveTextContent('Home');
	expect(links[1]).toHaveTextContent('Bills');

	// const addBillBtn = container.getElementsByClassName('header-right-menu-add-bill-box')[0];
	// const showLogoutBtn = container.getElementsByClassName('header-right-menu-user-box')[0];

	// addBillBtn.simulate('click');
	
});
