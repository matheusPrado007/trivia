import React from 'react';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import App from '../App';

describe('Pagina de Login', () => {
  test('1- Verificar se ao carregar a pagina Login, contêm dois inputs e o button', async () => {
    const { history } = renderWithRouterAndRedux(<App />);

    act(() => {
      history.push('/');
    });

    expect(history.location.pathname).toBe('/');

    const button = screen.getByRole('button', { name: 'Play' });
    expect(button).toBeInTheDocument();

    expect(button).toHaveProperty('disabled', true);

    const inputPlayerName = screen.getByTestId('input-player-name');
    expect(inputPlayerName).toBeInTheDocument();
    userEvent.type(inputPlayerName, 'Joaozinho');
    expect(inputPlayerName.value).toBe('Joaozinho');

    const inputEmail = screen.getByTestId('input-gravatar-email');
    expect(inputEmail).toBeInTheDocument();
    userEvent.type(inputEmail, 'Joaozinho@trybe.com');
    expect(inputEmail.value).toBe('Joaozinho@trybe.com');

    expect(button).toHaveProperty('disabled', false);

    expect(button).toBeInTheDocument();
    userEvent.click(button);
    
    const name = screen.findByText('Joaozinho');
    expect(await name).toBeInTheDocument();
    expect(history.location.pathname).toBe('/game');
  });
});
