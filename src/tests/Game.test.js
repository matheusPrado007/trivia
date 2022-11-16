import React from 'react';
import { act } from 'react-dom/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import App from '../App';
import Game from '../pages/Game';
import { questionsResponse } from './helpers/mocks';

describe('Pagina de Login', () => {
  test('1 - Verificar se aparece na tela botao VER RANKING e ele redireciona para /ranking', async () => {
    const { history } = renderWithRouterAndRedux(<App />);

    expect(history.location.pathname).toBe('/');

    const inputPlayerName = screen.getByPlaceholderText('Qual é o seu nome?');
    userEvent.type(inputPlayerName, 'Joaozinho');
    expect(inputPlayerName).toHaveValue('Joaozinho');
    
    const inputEmail = screen.getByPlaceholderText('Qual é o seu e-mail do gravatar?');
    userEvent.type(inputEmail, 'Joaozinho@trybe.com');
    expect(inputEmail).toHaveValue('Joaozinho@trybe.com');

    const btnPlay = screen.getByRole('button', { name: /Play/i });
    expect(btnPlay).toBeInTheDocument();
  
    userEvent.click(btnPlay);

    await waitFor (() => expect(history.location.pathname).toBe('/game'), { timeout: 4000 });

    const namePlayer = screen.getByText('Joaozinho');
    expect(namePlayer).toBeInTheDocument();

    const scorePlayer = screen.getByText('0');
    expect(scorePlayer).toBeInTheDocument();
    
  });
  test('2 - Verificar se aparece na tela os botões das perguntas ao entrar na página de Game', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => questionsResponse
    }));

    const { history } = renderWithRouterAndRedux(<App />);

    act(() => {
      history.push('/game');
    });

    expect(history.location.pathname).toBe('/game');

    await waitFor (()=> expect(screen.getByTestId('correct-answer')).toBeInTheDocument(), { timeout: 1000 });
    
    const correct = screen.getByTestId('correct-answer');
    expect(correct).toHaveTextContent('False');

    const wrongQuestions = screen.getAllByTestId(/wrong-answer/);
    expect(wrongQuestions).toHaveLength(1);
    expect(wrongQuestions[0]).toHaveTextContent('True');
    
    const notBtnNext = screen.queryByRole('button', { name: 'Next' });
    expect(notBtnNext).toBeNull();

    userEvent.click(correct);

    const btnNext = screen.queryByRole('button', { name: 'Next' });
    expect(btnNext).toBeInTheDocument();

  });

});