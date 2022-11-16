import React from 'react';
import { act } from 'react-dom/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import App from '../App';
import { tokenResponse } from './helpers/mocks';

describe('Pagina de Login', () => {
  test('1- Verificar se ao carregar a pagina Login, contêm dois inputs e dois buttons', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    expect(history.location.pathname).toBe('/');

    const btnPlay = screen.getByRole('button', { name: 'Play' });
    expect(btnPlay).toBeInTheDocument();

    expect(btnPlay).toHaveProperty('disabled', true);

    const inputPlayerName = screen.getByTestId('input-player-name');
    expect(inputPlayerName).toBeInTheDocument();
    userEvent.type(inputPlayerName, 'Joaozinho');
    expect(inputPlayerName.value).toBe('Joaozinho');
    expect(btnPlay).toHaveProperty('disabled', true);

    const inputEmail = screen.getByTestId('input-gravatar-email');
    expect(inputEmail).toBeInTheDocument();
    userEvent.type(inputEmail, 'Joaozinho@trybe.com');
    expect(inputEmail.value).toBe('Joaozinho@trybe.com');
    expect(btnPlay).toHaveProperty('disabled', false);

    expect(history.location.pathname).toBe('/');
  });

  test('1.1 - Verificar se ao clicar no button configuracoes redireciona para pagina /settings', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    act(() => {
      history.push('/');
    });

    const btnConfig = screen.getByRole('button', { name: 'Configurações' });
    expect(btnConfig).toBeInTheDocument();

    userEvent.click(btnConfig);
    expect(history.location.pathname).toBe('/settings');
  });

  test('1.2 - Verificar se ao clicar no button configuracoes redireciona para pagina /settings', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => btnPlay
    }));
    
    const { history } = renderWithRouterAndRedux(<App />);

    expect(history.location.pathname).toBe('/');

    const inputPlayerName = screen.getByPlaceholderText('Qual é o seu nome?');
    userEvent.type(inputPlayerName, 'Joaozinho');
    expect(inputPlayerName).toHaveValue('Joaozinho')
    
    const inputEmail = screen.getByPlaceholderText('Qual é o seu e-mail do gravatar?');
    userEvent.type(inputEmail, 'Joaozinho@trybe.com');
    expect(inputEmail).toHaveValue('Joaozinho@trybe.com')

    const btnPlay = screen.getByRole('button', { name: /Play/i });
    expect(btnPlay).toBeInTheDocument();
  
    userEvent.click(btnPlay);

    await waitFor (() => expect(history.location.pathname).toBe('/game'), { timeout: 5000 });
  });
});
