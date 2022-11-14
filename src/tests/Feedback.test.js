import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import App from '../App';
import store from '../redux/store';

describe('Pagina de Login', () => {
  test('1 - Verificar se aparece na tela botao VER RANKING e ele redireciona para /ranking', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    act(() => {
      history.push('/feedback');
    });

    const btnRanking= screen.getByRole('button', { name: /Ver Ranking/i });
    expect(btnRanking).toBeInTheDocument();

    userEvent.click(btnRanking);
    expect(history.location.pathname).toBe('/ranking')

  });
  test('1.1 - Verificar se aparece na tela botao PLAY AGAIN e ele redireciona para /', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    act(() => {
      history.push('/feedback');
    });

    const btnPlayAgain= screen.getByRole('button', { name: 'Play Again' });
    expect(btnPlayAgain).toBeInTheDocument();

    userEvent.click(btnPlayAgain);
    expect(history.location.pathname).toBe('/')

  });
  test('1.2 - Verificar se aparece na tela Could be better...', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    act(() => {
      history.push('/feedback');
    });

    const couldBeBetter = screen.getByText('Could be better...')
    expect(couldBeBetter).toBeInTheDocument();

    const feedbackTotal = screen.getByTestId('feedback-total-question')
    expect(feedbackTotal).toBeInTheDocument();

    const feedbackScore = screen.getByTestId('feedback-total-score')
    expect(feedbackScore).toBeInTheDocument();
  });

  test('1.3 - Verificar se aparece na tela Well done!', async () => {
    const { history } = renderWithRouterAndRedux(<App />);

    act(() => { history.push('/game') })
    
    expect(history.location.pathname).toBe('/game');

    store.getState().player.assertions = 5

    act(() => { history.push('/feedback') })

    const wellDone = screen.getByText('Well Done!')
    expect(wellDone).toBeInTheDocument();
  });
});